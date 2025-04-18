
import copy
from enum import Enum

import numpy as np

import _1_database_handler as dbt
from __socket_event import SocketUpdate, SocketReply, checkDistance

PORTAL_PASS_DISTANCE = 75

class FogType(Enum):
    NONE = 0,
    FACTION_BASED = 1,
    PLAYER_BASED = 2,
    SIMPLE_GROUP_FOG = 3
    
class SceneHandler():
    def __init__(self, scene):
        self.db : dbt.DatabaseHandeler = None  # Assigned with game manager
        self.fog_type = None
        self.visibleAreas = {}
        
    def _setDatabaseReference(self, db):
        self.db = db
        self.fog_type = self.db.data.rules["fog_type"]
        
    def getCharSceneNameLayer(self, charId: str) -> dict:
        try: 
            currentScene =  self.db.data.session_info["locations"][charId]["currentScene"]
            return self.db.data.scenes[currentScene["name"]]["layers"][currentScene["layer"]]
        except KeyError:
            print(f"ERROR: Character {charId} not found in session info.")
            
    def getSceneLocations(self, sceneName, sceneLayer) -> dict:
        try:
            return self.db.data.scenes[sceneName]["layers"][sceneLayer]["locations"]
        except KeyError:
            print(f"ERROR: Scene {sceneName} not found in session info.")
            
    def  getSceneMovableArea(self, sceneName, sceneLayer) -> dict:
        try:
            return self.db.data.scenes[sceneName]["layers"][sceneLayer]["movableAreas"]
        except KeyError:
            print(f"ERROR: Scene {sceneName} not found in session info.")
            
    def calcVisibleArea(self, calculateForCharId) -> dict:
        
        try: 
            scene = self.getCharSceneNameLayer(calculateForCharId)
            
            visible_areas = []
            
            if self.fog_type == FogType.SIMPLE_GROUP_FOG.name:
                visionSources : dict = scene["locations"]["chars"]

                for id in visionSources.keys():
                    pos: dict = visionSources.get(id, None)
                    loc_x  = pos.get("x")
                    loc_y = pos.get("y")
                    
                    if self.fog_type == FogType.FACTION_BASED.name:
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
                
            self.visibleAreas[scene["name"]] = {scene["layer"]: visible_areas}
        except KeyError as e:
            print(f"ERROR: Cannot calculate visible areas. -> ", e)
                   
    def applyMask(self, calculateForCharId) -> dict:
        """
        Applies fog to given locations
        
        locations dict items must contain x and y values.
        """ 
        
        scene = self.getCharSceneNameLayer(calculateForCharId)
        
        locations = self.getSceneLocations(scene["name"], scene["layer"])
        
        try: 
            visableAreas = self.visibleAreas[scene["name"]][scene["layer"]]
        except KeyError:
            self.calcVisibleArea(calculateForCharId)
            visableAreas = self.visibleAreas[scene["name"]][scene["layer"]]
        
        visable_items = {}
        
        for area in visableAreas:
            x = area.get("x")
            y = area.get("y")
            shape = area.get("shape")
            
            if shape == "circle":
                radius = area.get("radius")
                
                if x is None or y is None or radius is None:
                    raise ValueError(f"Invalid area values: {area}")
                
                for key in locations:
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
            currentScene =  self.getCharSceneNameLayer(charId)
            maskedScene = {
                'discovered': self.scenes[currentScene["name"]]['discovered'], 
                'width'     : self.scenes[currentScene["name"]]['width'     ], 
                'height'    : self.scenes[currentScene["name"]]['height'    ], 
                'grid_size' : self.scenes[currentScene["name"]]['grid_size' ],
                "layer"     : copy.deepcopy(self.scenes[currentScene["name"]]["layers"][currentScene["layer"]])
            }
            
            for key in maskedScene["layer"]["locations"].keys():
                maskedScene["layer"]["locations"][key] = self.applyMask(charId)
                
            maskedScene["visibleArea"] = self.visibleAreas[currentScene["name"]][currentScene["layer"]]

            return maskedScene                    
        except KeyError:
            print(f"ERROR: Character {charId} not found in session info.")
            
    # ALL scene action methods    
    def actionPortal(self, charId, portalId):
        """
        Moves character to new scene
        """
        try:
            currentScene = self.getCharSceneNameLayer(charId)

            portal = self.db.data.scenes[currentScene["name"]]["layers"][currentScene["layer"]]["locations"]["portals"][portalId]
            
            if portal["status"] != "open":
                return SocketReply(False, "Portal is closed.")
            
            if not checkDistance(
                self.db.data.scenes[currentScene["name"]]["layers"][currentScene["layer"]]["locations"]["chars"][charId],
                self.db.data.scenes[currentScene["name"]]["layers"][currentScene["layer"]]["locations"]["portals"][portalId],
                PORTAL_PASS_DISTANCE
            ):
                return SocketReply(False, "You are too far away from the portal.")

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
            
            return SocketReply(True, "You have entered a new scene.")
            
        except KeyError:
            return SocketReply(False, "Portal not found.")
    
    def actionMove(self, charId, x, y):
        """
        Moves character to new location
        """
        try:
            currentScene = self.getCharSceneNameLayer(charId)
            
            movableAreas = self.getSceneMovableArea(currentScene["name"], currentScene["layer"])
            
            if movableAreas["type"] == "limitless":
                return SocketReply(True, "You have moved to a new location.")
            
            elif movableAreas["type"] == "limited":
                masked = self.applyMask(charId) ## FUTURE Need to be opitmized to use here
            
            self.db.syncFile(scenes=True, session_info=True)
            
            return SocketReply(True, "You have moved to a new location.")
            
        except KeyError:
            return SocketReply(False, "Character not found.")