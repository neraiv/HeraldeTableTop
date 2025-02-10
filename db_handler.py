import copy
import time
import json
from datetime import datetime, timezone, timedelta
import os
import threading

from key_handeler import controlKey, generate_key

import db_fog_handeler as fogger

## Types
from db_fog_handeler import FogType

DEBUG_PRINT = True

class TypeRules():
    def __init__(self, rules_file: dict):
        self.fogType: FogType = fogger.get_fog_type(rules_file.get('fogType'))
        self.visableInventories: bool = rules_file["visableInventories"]
        self.includeAllClassicSpells: bool = rules_file["includeAllClassicSpells"]
    
    def toDict(self):
        return {
            "fogType": self.fogType.name,
            "visibleInventories" : self.visableInventories,
            "includaAllClassicSpells": self.includeAllClassicSpells
        }
        
class DBHandeler():
    DB_MAIN_PATH = os.path.dirname(os.path.abspath(__file__))
    GAMES_PATH = os.path.join(DB_MAIN_PATH, 'database', 'games')
    
    def __init__(self):  
        self.server_info : dict   = self.getGameFile("server_info.json", False)
        self.users       : dict   = self.getGameFile("users.json", False)

        self.session_info: dict   = self.getGameFile("session_info.json")
        self.rules       : TypeRules   = TypeRules(self.getGameFile("rules.json"))
        self.spells      : dict   = self.getGameFile("spells.json")
        self.chars       : dict   = self.getGameFile("chars.json")
        self.scenes      : dict   = self.getGameFile("scenes.json")
        self.objects     : dict   = self.getGameFile("objects.json")
        self.quests      : dict   = self.getGameFile("quests.json")
        self.npcs        : dict   = self.getGameFile("npcs.json")
        
        active_session = self.server_info["active_session"]
        self.event_handeler = f"games/{active_session}/events.csv"
        
        self.visable_areas: dict = {}
        self.fogged_areas: dict = {}
        
        self.sync_timeout = 5
        self.userSyncTimeout = 10
        self.syncTimerCounter = 0
        self.syncTimer = threading.Timer(self.sync_timeout, self.syncing)
        
    def syncing(self):
        if DEBUG_PRINT:
            print("Syncing...")
        self.updateServerTime()
        self.syncTimerCounter += 1
        if self.syncTimerCounter >= 10:
            self.updateUsersStatus()
            self.syncTimerCounter = 0
            
    def updateServerTime(self):
        if DEBUG_PRINT:
            print("Updating server time...")
        self.server_info["time"] = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S %Z")
        self.server_info["status"] = "online"
        self.sync(server_info=True)
        
    def updateUsersStatus(self):
        if  DEBUG_PRINT:
            print("Updating user statuses...")
        for username, user in self.users.items():
            if user["status"] == "offline":
                if user["last_seen"] - timedelta(seconds=self.userSyncTimeout * self.sync_timeout):
                    self.users[username]["status"] = "online"
                else:
                    self.users[username]["status"] = "offline"
        self.sync(users=True)
         
    ########################################################################
    #########################  USER RELATED ################################
    ########################################################################    
    def userLogin(self, username, password):
        if username in self.users and self.users[username]["password"] == password:
            if self.users[username]["status"] == "offline":
                self.users[username]["last_seen"] = datetime.now(timezone.utc)
                self.users[username]["status"] = "online"
                self.users[username]["key"] = generate_key(self.users)
                self.sync(users=True)
                return self.users[username]["key"], self.users[username]["character"]
            else: 
                return None, None ## User is alerady online
        return None, None ## Invalid username and password
    
    def controlKey(self, key):
        return controlKey(self.users, key)
    
    def updateUser(self, key):
        if key in self.users:
            self.users[key]["last_seen"] = datetime.now(timezone.utc)
            self.sync(users=True)
            return True
        else:
            return False
    #########################^^^^^^^^^^^^^^^^^^#############################
    #########################   USER RELATED   #############################
    ########################################################################  
    def sync(self, server_info = False, users = False, session_info = False, rules = False, spells = False, chars = False, scenes = False):
        if server_info:
            self.saveGameFile(self.server_info, "server_info.json", False)
        if users:
            self.saveGameFile(self.users, "users.json", False)
        if session_info:
            self.saveGameFile(self.session_info, "session_info.json")
        if rules:
            self.saveGameFile(self.rules.toDict(), "rules.json")
        if spells:
            self.saveGameFile(self.spells, "spells.json")
        if chars:
            self.saveGameFile(self.chars, "chars.json")
        if scenes:
            self.saveGameFile(self.scenes, "scenes.json")
            
    def getGameFile(self, name, from_session = True):
        path = ""
        if from_session:
            active_session = self.server_info["active_session"]       
            path = os.path.join(DBHandeler.GAMES_PATH, active_session, name)
        else:
            path = os.path.join(DBHandeler.DB_MAIN_PATH,"database", name)

        with open(path, 'r', encoding="utf-8") as file:
            return json.load(file)
    
    def saveGameFile(self, data, name, from_session = True, ):
        path = ""
        if from_session:
            active_session = self.server_info["active_session"]       
            path = os.path.join(DBHandeler.GAMES_PATH, active_session, name)
        else:
            path = os.path.join(DBHandeler.DB_MAIN_PATH,"database", name)
        
        with open(path, 'w', encoding="utf-8") as file:
            json.dump(data, file)
            
    def reInit(self):
        self.__init__()
        
    def calc_visible_areas_scene(self, scene_name, layer):
        return fogger.calc_fog(self.scenes[scene_name]["layers"][layer]["locations"]["chars"],
                                                                       self.rules.fogType, self.chars)
    def calc_visible_areas_all(self):
        for key in self.session_info["locations"]:
            currentScene = self.session_info["locations"][key]["currentScene"]
            
            scene_name = currentScene["name"]
            layer = currentScene["layer"]
            
            currentSceneName = scene_name + "-" + layer
            
            if not (currentSceneName in self.visable_areas):
                self.visable_areas[currentSceneName] = self.calc_visible_areas_scene(scene_name, layer)
        
        return self.visable_areas
        
    def get_scene(self, charId: str):
        current_scene = self.session_info["locations"][charId]["currentScene"]
        scene_name = current_scene["name"]
        layer = current_scene["layer"]
        
        currentSceneName = scene_name + "-" + layer
        
        if not (currentSceneName in self.visable_areas):
            self.visable_areas[currentSceneName] = self.calc_visible_areas_scene(scene_name, layer)
            
        self.fogged_areas = copy.deepcopy(self.scenes[scene_name])
        
        for layer_key in self.scenes[scene_name]["layers"].keys():
            if  layer_key != layer:
                self.fogged_areas["layers"].pop(layer_key)
            else:
                for location_key in self.fogged_areas["layers"][layer_key]["locations"].keys():
                    self.fogged_areas["layers"][layer_key]["locations"][location_key] = fogger.apply_mask(self.fogged_areas["layers"][layer_key]["locations"][location_key],
                                                                                                   self.visable_areas[currentSceneName])
            
        return self.fogged_areas
        
        
    def move_char(self, charId: str, x , y):
    
        currentScene: dict = self.session_info["locations"].get(charId).get("currentScene")

        sceneInfo: dict = self.scenes.get(currentScene["name"])
        
        layerInfo: dict = sceneInfo.get("layers").get(currentScene["layer"])
        
        movableAreas = layerInfo["movableAreas"]
        
        searched: dict
        
        if movableAreas[0]["width"] == -1 and movableAreas[0]["height"] == -1:
            charInfo = self.session_info["locations"][charId]
            charInfo["x"] = x
            charInfo["y"] = y
            self.sync(session_info=True)
        else: 
            searched: dict = fogger.apply_mask({"x": x, "y": y}, movableAreas)
            
            if len(searched.keys()) != 0: 
                if DEBUG_PRINT:
                    print(f"Char {charId} moved to {x}, {y}.")
                charInfo = self.session_info["locations"][charId]
                charInfo["x"] = x
                charInfo["y"] = y
                self.sync(session_info=True)
            else:
                raise ValueError(f"Char cant move to {x}, {y}")
            
    def handle_action(self, actionInfo: dict, userName: str, userInfo: dict):
        charId = userInfo.get("character")
        action = actionInfo.get("action")
        
        if action == "move":
            x = actionInfo.get("x")
            y = actionInfo.get("y")
            self.move_char(charId, x, y)
    
    def getCroppedSession(self, userInfo):
        player_scene: dict = self.session_info["locations"][userInfo["character"]]["currentScene"]
        cropped_by_layer_locations : dict = {}
        for char_id in self.session_info["locations"].keys():
            char_info = self.session_info["locations"].get(char_id)
            if char_info["currentScene"] == player_scene:
                cropped_by_layer_locations[char_id] = char_info
        
        cropped_session = {
            "locations" : fogger.apply_mask(cropped_by_layer_locations, self.visable_areas)
        }
        
        return cropped_session
    
    def getCroppedPortals(self, userInfo):
        player_scene: dict = self.session_info["locations"][userInfo["character"]]["currentScene"]
        return fogger.apply_mask([player_scene["layer"]]["portals"], self.visable_areas)
        
    def getCroppedScene(self, userInfo):
        player_scene: dict = self.session_info["locations"][userInfo["character"]]["currentScene"]

        scene_data:dict = self.scenes[player_scene["scene"]]
        
        for key in scene_data["layers"].keys():
            if key != player_scene["layer"]:
                scene_data.pop(key)
                
        scene_data["layers"][player_scene["layer"]]["portals"] = self.getCroppedPortals(userInfo) ## Future iki kere bakıyor
              
        return scene_data
        
        
    def getSession(self, key):
        try: 
            username, userInfo = db.controlKey(key)       
            if username and userInfo:   
                data = {
                    "scene": None,
                    "session" : None
                }
                ## Gettin cropped session

                data["session"] = self.getCroppedSession(userInfo)
                data["scene"] = self.getCroppedScene()
                return 
        except json.JSONDecodeError:
            return None
        
            
    def handle_request(self, requestInfo: dict, userName: str, userInfo: dict):
        type  = requestInfo.get("type")
        scene = requestInfo.get("scene")
        layer = requestInfo.get("layer")
        
        visable_areas = None
        if self.rules.fogType == FogType.PLAYER_BASED:
            visable_areas = self.calc_visible_areas_all(userInfo["char"])
        else:
            visable_areas = self.visable_areas
            
        if type == "scene":
            print(fogger.apply_mask(self.scenes[scene]["layers"][layer]["portals"], visable_areas))
        elif requestInfo.get("type") == "request":
            pass
        else:
            raise ValueError(f"Unknown request type: {requestInfo.get('type')}")
        
    def socket_handler(self, socketMessage: dict):
        key = socketMessage.get("key")
        username, user = controlKey(self.users, key)
        
        if username is None:
            raise ValueError(f"User not found for key: {key}")
        
        type = socketMessage.get("type")
        payload = socketMessage.get("payload")
        
        if type == "request":
            self.handle_request(payload, username, user)
        elif type == "action":
            self.handle_action(payload, username, user)
            
    def on_exit(self):
        self.syncTimer.cancel()
        user :dict
        for user in self.users.keys():
            user["status"] = "offline"
        self.sync(users=True)

            
        
        
        
        
if __name__ == "__main__":   
    db = DBHandeler()
        
    #db.socket_handler({"key": "_Rhvb0NxPahENXGbO1rJGw","type": "action", "payload" : {"action" : "move", "x": 500, "y" : 500}})

    db.visable_areas = db.calc_visible_areas_all()

    print("Before getting close")

    scene = db.get_scene("faramir")
    
    print(scene)
    # print(fogger.apply_mask(db.session_info["locations"], db.visable_areas))

    # print("----------------------------------------------------------")

    # print("After getting close")

    # db.socket_handler({"key": "_Rhvb0NxPahENXGbO1rJGw","type": "action", "payload" : {"action" : "move", "x": 100, "y" : 100}})

    # print(fogger.apply_mask(db.session_info["locations"], db.visable_areas))

    # print("----------------------------------------------------------")
    # print(db.scenes["Alchemy Shop"]["layers"]["1"]["portals"])

    # print("----------------------------------------------------------")

    # print(db.socket_handler({"key": "_Rhvb0NxPahENXGbO1rJGw","type": "request", "payload" : {"type" : "scene", "scene": "Alchemy Shop", "layer": "1"}}))
        
    # while True:
    #     print(db.server_info["status"])
    #     time.sleep(1)