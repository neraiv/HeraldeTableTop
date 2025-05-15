import copy
from enum import Enum

import numpy as np

import _1_database_handler as dbt
from _0_common import checkDistance

PORTAL_PASS_DISTANCE = 75

class FogType(Enum):
    NONE = 0,
    FACTION_BASED = 1,
    PLAYER_BASED = 2,
    SIMPLE_GROUP_FOG = 3
    
class SceneHandler():
    def __init__(self):
        self.db : dbt.DatabaseHandeler = None  # Assigned with game manager
        self.fogType = None
        self.visibleAreas = {}
        
    def _setDatabaseReference(self, db):
        self.db = db
        self.fogType = self.db.data.rules["fogType"]
        
    def getCharSceneNameLayer(self, charId: str) -> dict:       
        try: 
            return self.db.data.session_info["locations"][charId]["currentScene"] 
        except KeyError:
            return {"error": f"ERROR: Character {charId} not found in session info."}
            
    def getSceneLocations(self, sceneName, sceneLayer) -> dict:
        try:
            return self.db.data.scenes[sceneName]["layers"][sceneLayer]["locations"]
        except KeyError:
            return {"error": f"ERROR: Scene {sceneName} not found in session info."}
            
    def  getSceneMovableArea(self, sceneName, sceneLayer) -> dict:
        try:
            return self.db.data.scenes[sceneName]["layers"][sceneLayer]["movableAreas"]
        except KeyError:
            return {"error": f"ERROR: Scene {sceneName} not found in session info."}
        
    def getScene(self, sceneName) -> dict:
        try:
            return self.db.data.scenes[sceneName]
        except KeyError:
            return {"error": f"ERROR: Scene {sceneName} not found in session info."}
    
    def getLayer(self, sceneName, sceneLayer) -> dict:
        try:
            return self.db.data.scenes[sceneName]["layers"][sceneLayer]
        except KeyError:
            return {"error": f"ERROR: Scene {sceneName} not found in session info."}
            
    def calcVisibleArea(self, charId) -> dict:
        
        try: 
            currentScene = self.getCharSceneNameLayer(charId)
            scene = self.getLayer(currentScene["name"], currentScene["layer"])
            
            visible_areas = []

            visionSources : dict = scene["locations"]["chars"]

            for id in visionSources.keys():
                pos: dict = visionSources.get(id, None)
                loc_x  = pos.get("x")
                loc_y = pos.get("y")
                
                if self.fogType == FogType.FACTION_BASED.name:
                    charInfo: dict = self.db.data.chars.get(id, None)
                
                    vision: str = charInfo["char"]["vision"]
                    
                    visible_areas.append({
                        "x": loc_x,
                        "y": loc_y,
                        "shape": "circle",
                        "radius": vision
                    })
                    
                else:
                    visible_areas.append({
                        "x": loc_x,
                        "y": loc_y,
                        "shape": "circle",
                        "radius": 250
                    })
                
            self.visibleAreas[currentScene["name"]] = {currentScene["layer"]: visible_areas}
        except KeyError as e:
            print(f"ERROR: Cannot calculate visible areas. -> ", e)
                   
    def applyMaskLocations(self, locations, visibleAreas) -> dict:
        """
        Applies fog to given locations
        
        locations dict items must contain x and y values.
        """ 
        visable_items = {}
        
        for area in visibleAreas:
            x = area.get("x")
            y = area.get("y")
            shape = area.get("shape")
            
            if shape == "circle":
                radius = area.get("radius")
                
                if x is None or y is None or radius is None:
                    raise ValueError(f"Invalid area values: {area}")
                
                for key in locations.keys():
                    item = locations[key]
                    loc_x = item.get("x")
                    loc_y = item.get("y")
                    
                    if loc_x is None or loc_y is None:
                        raise ValueError(f"Item {key} missing x or y coordinates.")
                    
                    distance = np.sqrt((loc_x - x)**2 + (loc_y - y)**2)
                    
                    if distance <= radius:
                        visable_items[key] = item
        
        return visable_items  
    
    def getCharScene(self, charId: str) -> dict:
        try: 
            charScene =  self.getCharSceneNameLayer(charId)
            scene = self.getScene(charScene["name"])
            layer = self.getLayer(charScene["name"], charScene["layer"])
            maskedScene = {
                'discovered': scene['discovered'], 
                'width'     : scene['width'     ], 
                'height'    : scene['height'    ], 
                'grid_size' : scene['grid_size' ],
                "layer"     : copy.deepcopy(layer)  
            }
            
            try:
                visibleAreas = self.visibleAreas[charScene["name"]][charScene["layer"]]
            except KeyError:
                self.calcVisibleArea(charId)
                visibleAreas = self.visibleAreas[charScene["name"]][charScene["layer"]]
                
            for key in maskedScene["layer"]["locations"].keys():
                maskedScene["layer"]["locations"][key] = self.applyMaskLocations(
                    maskedScene["layer"]["locations"][key], 
                    visibleAreas)
                
            maskedScene["visibleArea"] = self.visibleAreas[charScene["name"]][charScene["layer"]]

            return maskedScene                    
        except Exception as e:
            return {"error": f"{e}"}
            
    # ALL scene action methods    
    def actionPortal(self, charId, portalId):
        """
        Moves character to new scene
        """
        try:
            currentScene = self.getCharSceneNameLayer(charId)

            portal = self.db.data.scenes[currentScene["name"]]["layers"][currentScene["layer"]]["locations"]["portals"][portalId]
            
            if portal["status"] != "open":
                return {'status': False, 'message': 'Portal is closed.', 'data': None}
            
            if not checkDistance(
                self.db.data.scenes[currentScene["name"]]["layers"][currentScene["layer"]]["locations"]["chars"][charId],
                self.db.data.scenes[currentScene["name"]]["layers"][currentScene["layer"]]["locations"]["portals"][portalId],
                PORTAL_PASS_DISTANCE
            ):
                return {'status': False, 'message': 'You are too far away from the portal.', 'data': None}

            # Assign new scene and layer to character
            self.db.data.session_info["locations"][charId]["currentScene"]["name"] = portal["scene"]
            self.db.data.session_info["locations"][charId]["currentScene"]["layer"] = portal["layer"]
            
            self.db.data.scenes[portal["scene"]]["layers"][portal["layer"]]["locations"]["chars"][charId] = {
                "x": portal["x"],
                "y": portal["y"]
            }
            
            # Remove character from old scene
            self.db.data.scenes[currentScene["name"]]["layers"][currentScene["layer"]]["locations"]["chars"].pop(charId, None)
            
            self.db.syncFile(scenes=True, session_info=True)
            
            return {'status': True, 'message': 'You have entered a new scene.', 'data': None}
            
        except KeyError:
            return {'status': False, 'message': 'Portal not found.', 'data': None}
    
    def actionMove(self, charId, x, y):
        """
        Moves character to new location
        """
        try:
            currentScene = self.getCharSceneNameLayer(charId)
            
            movableAreas = self.getSceneMovableArea(currentScene["name"], currentScene["layer"])
            
            if movableAreas["type"] == "limitless":
                return {'status': True, 'message': 'You have moved to a new location.', 'data': None}
            
            elif movableAreas["type"] == "limited":
                masked = self.applyMaskLocations(charId) ## FUTURE Need to be opitmized to use here
            
            self.db.syncFile(scenes=True, session_info=True)
            
            return {'status': True, 'message': 'You have moved to a new location.', 'data': None}
            
        except KeyError:
            return {'status': False, 'message': 'Character not found.', 'data': None}