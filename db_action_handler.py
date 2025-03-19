from db_types import *
from db_consts import *
from db_handler import DBHandler
from db_mask_functions import applyMask, calcAcceptedAreas
from db_shared_func import checkDistance, checkReqirement

#%%
db = DBHandler()
def actionPortal(charId: str, payload: dict):
    """Handles portal reletad actions

    Args:
        charId (_type_): _description_
        data (_type_): _description_
        portalId (_type_): _description_

    Returns:
        _type_: _description_
    """
    
    data = payload.get("data")
    portalId = payload.get("id")
    
    if not portalId or not data:
        return {"success": False, "error": TypeError.INSUFFİCENT_DATA.value+ " in paylaod (action_portal)"}, None
    
    destinationSceneName, destinationLayer = data.split('-')
    
    if not destinationSceneName and not destinationLayer: 
        return {"success": False, "error": TypeError.INSUFFİCENT_DATA.value+ " in data (action_portal)"}, None
    
    # Remove char from current scene
    currentSceneName = db.session_info["locations"][charId]["currentScene"]["name"]
    currentLayerName = db.session_info["locations"][charId]["currentScene"]["layer"]
    
    if not db.checkDistance(
        db.scenes[currentSceneName]["layers"][currentLayerName]["locations"]["chars"][charId],
        db.scenes[currentSceneName]["layers"][currentLayerName]["locations"]["portals"][portalId],
        PORTAL_PASS_DISTANCE
    ):
        return {"success": False, "error": "It's too far away. (action_portal)"}, None
    
    db.scenes[currentSceneName]["layers"][currentLayerName]["locations"]["chars"].pop(charId) 
    
    if destinationLayer:
        db.session_info["locations"][charId]["currentScene"]["layer"] = destinationLayer
    if destinationSceneName:
        db.session_info["locations"][charId]["currentScene"]["name"] = destinationSceneName
        
    # Add char to new scene
    currentSceneName = db.session_info["locations"][charId]["currentScene"]["name"]
    currentLayerName = db.session_info["locations"][charId]["currentScene"]["layer"]

    db.scenes[currentSceneName]["layers"][currentLayerName]["locations"]["chars"][charId] = {"x": 200, "y": 200} # FUTURE char start location belirlenmeli
    
    if not (currentSceneName in db.activeAreas):
        db.activeAreas[currentSceneName]["visibleAreas"] = db.sceneCalcVisibleArea(db.session_info["locations"][charId]["currentScene"]["name"], 
                                                                                            db.session_info["locations"][charId]["currentScene"]["layer"])
    
    db.syncFile(session_info=True, scenes=True)
    
    return {"success": True}, [{"type": "update_scene", "prior": SocketUpdatePrior.IMMEDIATELY}]

def actionCharMove(charId: str, payload: dict):
        """Moves character to specifed location

        Args:
            charId (str): _description_
            x (_type_): _description_
            y (_type_): _description_

        Returns:
            _type_: _description_
        """
        
        x = payload.get("x")
        y = payload.get("y")
        
        if not x or not y:
            return {"success": False, "error": TypeError.INSUFFİCENT_DATA.value+ " in paylaod (action_char_move)"}, None
        
        currentScene: dict = db.session_info["locations"].get(charId).get("currentScene")

        sceneInfo: dict = db.scenes.get(currentScene["name"])
        
        layerInfo: dict = sceneInfo.get("layers").get(currentScene["layer"])
        
        movableAreas = layerInfo["movableAreas"]
    
        socketReply = {}
        socketUpdate = None
        moved = False
        
        def update():
            charInfo = db.scenes[currentScene["name"]]["layers"][currentScene["layer"]]["locations"]["chars"][charId]
            charInfo["x"] = x
            charInfo["y"] = y
            db.syncFile(scenes=True)
        
        if movableAreas["type"] == "limitless":
            update()
            moved = True
            
        else: 
            maskedMove: dict = applyMask({"x": x, "y": y}, movableAreas["shapes"])
            
            if len(maskedMove.keys()) != 0:  #If its not masked it means movable.
                update()
                moved = True
            else:
                socketReply, socketUpdate = {"success": False, "error": f"Cant move to the x:{x}, y:{y}"}, None
            
        if moved:    
            db.init_activeArea(currentScene["name"], currentScene["layer"], events=False)
            
            new_scene_data = db.sceneGetCharScene(charId)
            socketReply, socketUpdate = {"success": True}, [{"type": "change_scene_layer_locations", 
                                                                "data": new_scene_data["layer"]["locations"], 
                                                                "prior": SocketUpdatePrior.IMMEDIATELY.value, "all_users": False},
                                                                {"type": "change_scene_visibleAreas", 
                                                                 "data" : new_scene_data["visibleAreas"],
                                                                "prior": SocketUpdatePrior.IMMEDIATELY.value, 
                                                                "all_users": False}
                                                                ]
        else:
            socketReply, socketUpdate = {"success": False, "error": "Invalid move."}, None
                 
        return socketReply, socketUpdate