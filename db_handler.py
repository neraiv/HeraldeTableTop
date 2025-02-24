import copy
from enum import Enum
import time
import json
from datetime import datetime, timezone, timedelta
import os
import threading

from chat_handler import ChatHandler
from key_handeler import controlKey, generate_key

import db_fog_handeler as fogger

## Types
from db_fog_handeler import FogType

DEBUG_PRINT = True

class SocketUpdatePrior(Enum):
    IMMEDIATELY = 0
    WHEN_AVALIABLE = 1
    
    
class TypeError(Enum):
    FILE_NOT_FOUND = {"error": "File not found"}
    JSON_PARSE_ERROR = {"error": "Json parse error"}
    WRONG_TYPE = {"error": "Wrong type"}
    
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

        self.init_server_info()
        self.init_users()
        
        self.session_info: dict   = self.getGameFile("session_info.json")
        self.rules       : dict   = self.getGameFile("rules.json")
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
        self.userSyncTimeout = 2
        self.syncTimerCounter = 0
        
        self.sync_thread = threading.Thread(target=self.sync_loop, daemon=True)
        self.sync_thread.start()
        
        ## Chat 
        self.chat = ChatHandler(os.path.join(DBHandeler.GAMES_PATH, active_session, "chat.csv"))
        
        if self.session_info["chat_idx"] != self.chat.last_idx:
            self.session_info["chat_idx"] = self.chat.last_idx
            self.sync(session_info=True)
        
    def sync_loop(self):
        while True:
            if DEBUG_PRINT:
                print("Syncing...")
            self.updateServerTime()
            self.syncTimerCounter += 1
            if self.syncTimerCounter >= self.userSyncTimeout:
                self.updateUsersStatus()
                self.syncTimerCounter = 0

            time.sleep(self.sync_timeout)

            
    def get_currentTime(self) -> str:
        return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S %Z")
    
    def updateServerTime(self):
        if DEBUG_PRINT:
            print("Updating server time...")
        self.server_info["time"] = self.get_currentTime()
        self.server_info["status"] = "online"
        self.sync(server_info=True)
        
    def updateUsersStatus(self):
        if  DEBUG_PRINT:
            print("Updating user statuses...")
        for username, user in self.users.items():
            if user["status"] == "online":
                timestamp = datetime.strptime(user["last_seen"], "%Y-%m-%d %H:%M:%S %Z")

                # Attach UTC timezone because %Z doesn't actually parse it into tz-aware datetime
                timestamp = timestamp.replace(tzinfo=timezone.utc)

                # Current time in UTC
                now = datetime.now(timezone.utc)

                # Calculate time differenc
                time_difference = now - timestamp
                if time_difference.seconds > self.userSyncTimeout * self.sync_timeout:
                    self.users[username]["status"] = "offline"
                    self.sync(users=True)
    
    
    def init_server_info(self):
        self.server_info["status"] = "online"
        self.server_info["time"] = self.get_currentTime()
    ########################################################################
    #########################  USER RELATED ################################
    ########################################################################    
    def userLogin(self, username, password):
        if username in self.users and self.users[username]["password"] == password:
            if self.users[username]["status"] == "offline":
                self.users[username]["last_seen"] = self.get_currentTime()
                self.users[username]["status"] = "online"
                self.users[username]["key"] = generate_key(self.users)
                self.sync(users=True)
                return "ok", self.users[username]["key"], self.users[username]["character"]
            else: 
                return "user online", None, None ## User is alerady online
        return "invalid username password", None, None ## Invalid username and password
    
    def controlKey(self, key):
        userId, userInfo = controlKey(self.users, key)
        
        if userId and userInfo:
            self.updateUser(userId)
            
        return userId, userInfo
    
    def updateUser(self, userId):
        if userId in self.users:
            self.users[userId]["last_seen"] = self.get_currentTime()
            self.sync(users=True)
            return True
        else:
            return False
        
    def user_set_offline(self, id = None):
        """Sets a user or all users to offline

        Args:
            id (str, optional): Give id to set an user online. None to set all users offline. Defaults to None.
        """
        if id is None:
            for user_id in self.users.keys():
                self.users[user_id]["status"] = "offline"
        else:
            if id in self.users:
                self.users[id]["status"] = "offline"
        self.sync(users=True)
        
    def init_users(self):
        self.user_set_offline()
        
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
            self.saveGameFile(self.rules, "rules.json")
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
        return fogger.calc_visible_areas(self.scenes[scene_name]["layers"][layer]["locations"],
                                                                       self.rules["fogType"], self.chars)
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
        
    def action_portal(self, charId, sceneName=None, layer=None):
        
        if not sceneName and not layer:
            return {"success": False}
        
        # Remove char from current scene
        currentSceneName = self.session_info["locations"][charId]["currentScene"]["name"]
        currentLayerName = self.session_info["locations"][charId]["currentScene"]["layer"]
        
        self.scenes[currentSceneName]["layers"][currentLayerName]["locations"]["chars"].pop(charId) 
        
        if layer:
            self.session_info["locations"][charId]["currentScene"]["layer"] = layer
        else:
            self.session_info["locations"][charId]["currentScene"]["name"] = sceneName
            
        # Add char to new scene
        currentSceneName = self.session_info["locations"][charId]["currentScene"]["name"]
        currentLayerName = self.session_info["locations"][charId]["currentScene"]["layer"]

        self.scenes[currentSceneName]["layers"][currentLayerName]["locations"]["chars"][charId] = {"x": 200, "y": 200} # FUTURE char start location belirlenmeli
            
        self.scenes
        
        
        self.calc_visible_areas_scene(self.session_info["locations"][charId]["currentScene"]["name"], 
                                      self.session_info["locations"][charId]["currentScene"]["layer"])
        
        self.sync(session_info=True)
        
        return {"success": True}
            
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
            
    def handle_action(self, actionInfo: dict, userID: str, userInfo: dict):
        charId = userInfo.get("character")
        action = actionInfo.get("action")
        
        socket_reply = {}
        socket_update = None
                    
        if action == "move":
            x = actionInfo.get("x")
            y = actionInfo.get("y")
            self.move_char(charId, x, y)
        
        elif "portal" in action:
            data = actionInfo.get("data")
            if "layer" in action:
                socket_reply = self.action_portal(charId, None, data)
            elif "scene" in action:
                socket_reply = self.action_portal(charId, data, 1)
            
            if socket_reply["success"] == True:
                socket_update = {"type": "reinit_scene", "prior": SocketUpdatePrior.IMMEDIATELY.value, "all_users": False}
                
            return socket_reply, socket_update
    
    # def getCroppedSession(self, userInfo):
    #     player_scene: dict = self.session_info["locations"][userInfo["character"]]["currentScene"]
    #     cropped_by_layer_locations : dict = {}
    #     for char_id in self.session_info["locations"].keys():
    #         char_info = self.session_info["locations"].get(char_id)
    #         if char_info["currentScene"] == player_scene:
    #             cropped_by_layer_locations[char_id] = char_info
        
    #     cropped_session = {
    #         "locations" : fogger.apply_mask(cropped_by_layer_locations, self.visable_areas)
    #     }
        
    #     return cropped_session
    
    # def getCroppedPortals(self, userInfo):
    #     player_scene: dict = self.session_info["locations"][userInfo["character"]]["currentScene"]
    #     return fogger.apply_mask(player_scene["layer"]["portals"], self.visable_areas)
        
    # def getCroppedScene(self, userInfo):
    #     player_scene: dict = self.session_info["locations"][userInfo["character"]]["currentScene"]

    #     scene_data:dict = self.scenes[player_scene["scene"]]
        
    #     for key in scene_data["layers"].keys():
    #         if key != player_scene["layer"]:
    #             scene_data.pop(key)
                
    #     scene_data["layers"][player_scene["layer"]]["portals"] = self.getCroppedPortals(userInfo) ## Future iki kere bakıyor
              
    #     return scene_data
        
        
    # def getSession(self, key):
    #     try: 
    #         username, userInfo = db.controlKey(key)       
    #         if username and userInfo:   
    #             data = {
    #                 "scene": None,
    #                 "session" : None
    #             }
    #             ## Gettin cropped session

    #             data["session"] = self.getCroppedSession(userInfo)
    #             data["scene"] = self.getCroppedScene()
    #             return 
    #     except json.JSONDecodeError:
    #         return None
        
            
    def handle_request(self, requestInfo: dict, userName: str, userInfo: dict):
        type  = requestInfo.get("type")
        scene = requestInfo.get("scene")
        layer = requestInfo.get("layer")
        
        visable_areas = None
        if self.rules["fogType"] == FogType.FACTION_BASED.name:
            visable_areas = self.calc_visible_areas_all(userInfo["char"])
        else:
            visable_areas = self.visable_areas
            
        if type == "scene":
            print(fogger.apply_mask(self.scenes[scene]["layers"][layer]["portals"], visable_areas))
        elif requestInfo.get("type") == "request":
            pass
        else:
            raise ValueError(f"Unknown request type: {requestInfo.get('type')}")
        
    def socket_handler(self, socketMessage: dict, userID = None, userInfo = None):
        type = socketMessage.get("type")
        payload = socketMessage.get("payload")
        
        socket_reply = None
        socket_update = None
        
        if type == "update":
            data = None
            success = True
            
            if payload == "server_info":
                data =  self.server_info
            elif payload == "session_info":
                data =  self.session_info
            elif payload == "rules":
                data =  self.rules
            elif payload == "spells":
                data =  self.spells
            elif payload == "scene":
                data =  self.get_scene(userInfo["character"])
            else:
                success = False
            
            socket_reply = {
                "data" : data,
                "success" : success 
            }
            
        elif type == "item":
            if payload["type"] == "char":
                charId = payload["id"]
                if charId in self.chars:
                    charInfo = self.chars[charId]
                    
                    if self.rules["visableInventories"] == False:
                        charInfo["char"]["inventory"] = None
                        
                    socket_reply =  {'success': True, "data" : charInfo}
                    
                    
        elif type == "action":
            socket_reply, socket_update =  self.handle_action(payload, userID, userInfo)
        
        elif "chat" in type:
            if "send" in type:
                state = self.chat.addMessage(userID, payload["message"], self.get_currentTime())
                if state == "success":
                    self.session_info["chat_idx"] = self.chat.last_idx
                    self.sync(session_info=True)
                    socket_reply = {'success': True}
                    socket_update = {"type":"chat", "prior": SocketUpdatePrior.WHEN_AVALIABLE.value, "all_users": True}
                else:
                    socket_reply = {'success': False, 'error': state}
                    
            elif "get" in type:
                start = payload.get("start")
                length = payload.get("length")
                socket_reply = self.chat.getMessages(start, length)
        else:
            return TypeError.WRONG_TYPE.value
        
        return socket_reply, socket_update
            
            
    def on_exit(self):
        self.syncTimer.cancel()
        
        self.server_info["status"] = "offline"
        self.sync(server_info=True)
    
        self.user_set_offline()

            
        
        
        
        
if __name__ == "__main__":   
    db = DBHandeler()
        
    #db.socket_handler({"key": "_Rhvb0NxPahENXGbO1rJGw","type": "action", "payload" : {"action" : "move", "x": 500, "y" : 500}})

    db.calc_visible_areas_all()
    
    print(db.visable_areas)

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