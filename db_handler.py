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

from db_types import *
DEBUG_PRINT = True
        
class DBHandeler():
    DB_MAIN_PATH = os.path.dirname(os.path.abspath(__file__))
    DB_GAMES_PATH = os.path.join(DB_MAIN_PATH, 'database', 'games')
    
    def __init__(self):  
        self.server_info : dict   = self.getGameFile("server_info.json", DatabaseWhere.FROM_ROOT)
        self.users       : dict   = self.getGameFile("users.json", DatabaseWhere.FROM_ROOT)

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
        
        
        self.defaults : dict = {
            "char" : self.getGameFile("char.json", DatabaseWhere.FROM_DEFAULTS)
        }
        
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
        self.chat = ChatHandler(os.path.join(DBHandeler.DB_GAMES_PATH, active_session, "chat.csv"))
        
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
        
        # if userId and userInfo:
        #     self.updateUser(userId)
            
        return userId, userInfo
    
    def handle_user_status(self, userId, type):
        if type == "sync":
            if userId in self.users:
                self.users[userId]["last_seen"] = self.get_currentTime()
                self.sync(users=True)
                return True
            else:
                return False
        elif type == "logout":
            self.user_set_offline(userId)
            
        
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
            self.saveGameFile(self.server_info, "server_info.json", DatabaseWhere.FROM_ROOT)
        if users:
            self.saveGameFile(self.users, "users.json", DatabaseWhere.FROM_ROOT)
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
            
    def getGameFile(self, name, where = DatabaseWhere.FROM_SESSION):
        path = ""
        if where == DatabaseWhere.FROM_SESSION:
            active_session = self.server_info["active_session"]       
            path = os.path.join(DBHandeler.DB_GAMES_PATH, active_session, name)
        elif where == DatabaseWhere.FROM_DEFAULTS:
            path = os.path.join(DBHandeler.DB_MAIN_PATH,"database", "defaults", name)
        else:
            path = os.path.join(DBHandeler.DB_MAIN_PATH,"database", name)

        with open(path, 'r', encoding="utf-8") as file:
            return json.load(file)
    
    def saveGameFile(self, data, name, where = DatabaseWhere.FROM_SESSION):
        path = ""
        if where == DatabaseWhere.FROM_SESSION:
            active_session = self.server_info["active_session"]       
            path = os.path.join(DBHandeler.DB_GAMES_PATH, active_session, name)
        elif where == DatabaseWhere.FROM_DEFAULTS:
            path = os.path.join(DBHandeler.DB_MAIN_PATH,"database", "defaults", name)
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
            
        self.fogged_areas["visible_areas"] = self.visable_areas[currentSceneName]
        
        return self.fogged_areas
        
    def action_portal(self, charId, data):
        
        sceneName, layer = data.split('-')
        
        if not sceneName and not layer:
            return {"success": False}
        
        # Remove char from current scene
        currentSceneName = self.session_info["locations"][charId]["currentScene"]["name"]
        currentLayerName = self.session_info["locations"][charId]["currentScene"]["layer"]
        
        self.scenes[currentSceneName]["layers"][currentLayerName]["locations"]["chars"].pop(charId) 
        
        if layer:
            self.session_info["locations"][charId]["currentScene"]["layer"] = layer
        if sceneName:
            self.session_info["locations"][charId]["currentScene"]["name"] = sceneName
            
        # Add char to new scene
        currentSceneName = self.session_info["locations"][charId]["currentScene"]["name"]
        currentLayerName = self.session_info["locations"][charId]["currentScene"]["layer"]

        self.scenes[currentSceneName]["layers"][currentLayerName]["locations"]["chars"][charId] = {"x": 200, "y": 200} # FUTURE char start location belirlenmeli
            
        self.scenes
        
        self.calc_visible_areas_scene(self.session_info["locations"][charId]["currentScene"]["name"], 
                                      self.session_info["locations"][charId]["currentScene"]["layer"])
        
        self.sync(session_info=True, scenes=True)
        
        return {"success": True}
            
    def move_char(self, charId: str, x , y):
    
        currentScene: dict = self.session_info["locations"].get(charId).get("currentScene")

        sceneInfo: dict = self.scenes.get(currentScene["name"])
        
        layerInfo: dict = sceneInfo.get("layers").get(currentScene["layer"])
        
        movableAreas = layerInfo["movableAreas"]
        
        searched: dict
        socket_reply = {}
        socket_update = None
        
        if movableAreas["type"] == "limitless":
            charInfo = self.scenes[currentScene["name"]]["layers"][currentScene["layer"]]["locations"]["chars"][charId]
            charInfo["x"] = x
            charInfo["y"] = y
            self.sync(scenes=True)
            socket_reply, socket_update = {"success": True}, {"type": "reinit_scene", "prior": SocketUpdatePrior.IMMEDIATELY.value, "all_users": False}
        else: 
            searched: dict = fogger.apply_mask({"x": x, "y": y}, movableAreas)
            
            if len(searched.keys()) != 0: 
                if DEBUG_PRINT:
                    print(f"Char {charId} moved to {x}, {y}.")
                charInfo = self.session_info["locations"][charId]
                charInfo["x"] = x
                charInfo["y"] = y
                self.sync(session_info=True)
                socket_reply, socket_update = {"success": True}, {"type": "reinit_scene", "prior": SocketUpdatePrior.IMMEDIATELY.value, "all_users": False}
            else:
                socket_reply, socket_update = {"success": False, "error": f"Cant move to the x:{x}, y:{y}"}, None
                 
        self.visable_areas[currentScene["name"] +"-"+ currentScene["layer"]] =  self.calc_visible_areas_scene(currentScene["name"], currentScene["layer"])
        
        return socket_reply, socket_update
            
    def handle_action(self, actionInfo: dict, userID: str, userInfo: dict):
        charId = userInfo.get("character")
        action = actionInfo.get("action")
        
        socket_reply = {}
        socket_update = None
                    
        if action == "move":
            id = actionInfo.get("id")
            x = actionInfo.get("x")
            y = actionInfo.get("y")
            
            if charId == id or userInfo.get("type") == "dungeon_master":
                socket_reply, socket_update = self.move_char(charId, x, y)
            else:
                socket_reply = {
                    "success": False,
                    "error": "U cant move this character."
                },
                socket_update = {
                    "type": "reinit_scene",
                    "prior": SocketUpdatePrior.IMMEDIATELY.value,
                    "all_users": False
                }
        
        elif "portal" in action:
            data = actionInfo.get("data")
            socket_reply = self.action_portal(charId, data)

            if socket_reply["success"] == True:
                socket_update = {"type": "reinit_scene", "prior": SocketUpdatePrior.IMMEDIATELY.value, "all_users": False}
                
        return socket_reply, socket_update
    
        
    def handle_item(self, payload, userID, userInfo):
        socket_reply = None
        socket_update = None
        
        if payload["type"] == "char":
            charId = payload["id"]
            if charId in self.chars:
                charInfo = self.chars[charId]
                
                if self.rules["visableInventories"] == False:
                    charInfo["char"]["inventory"] = None
                    
                socket_reply =  {'success': True, "data" : charInfo}
                
        elif payload["type"] == "npc":
            
            npcId = payload["id"]
            
            npcData = self.npcs[npcId]
            
            quests = {}
            
            if npcData["quests"]:
                for quest_key in self.quests[npcId]["quests"].keys():
                    questFullId = npcId+ "-" + quest_key
                    if self.check_quest_requirements(npcId, quest_key, userInfo["character"]):
                        reply, _ = self.handle_quest({"type": "get", "id": questFullId}, userID, userInfo)
                        if reply["success"]:
                            quests[questFullId] = reply["data"]
                
                
            npcData["quests"] = quests
            npcData["dialogs"] = {}
             
            if npcData["char"] == "default":
                npcData["char"] = self.defaults["char"]
                npcData["char"]["id"] = npcId
                
            socket_reply = {'success': True, "data" : npcData}
                
        return socket_reply, socket_update
        
    def check_requirement(self, rquirement, charId):
        type = rquirement["type"]
        if type == "scene":
            return self.session_info["locations"][charId]["currentScene"]["name"] == rquirement["target"]
        elif "quest" in type:
            questFullId = rquirement["target"]
            questGiver, questId = questFullId.split("-")
            
            if "completed" in type:
                return self.quests[questGiver]["quests"][questId]["status"] == TypeQuestStatus.COMPLETED.value
            elif "ok" in type:
                return self.quests[questGiver]["quests"][questId]["status"] == TypeQuestStatus.OK.value
            else:
                return False
        else:
            return False
            
    def get_quest_objective(self, objective, character):
        if "has" in objective["type"]:
            if "item" in objective["type"]:
                pass
            if "currency" in objective["type"]:
                pass
    def check_quest_requirements(self, questGiver, questId, forChar):
        questRequirements = self.quests[questGiver]["quests"][questId]["requires"]
        
        if len(questRequirements) == 0:
            return True
        
        return all(self.check_requirement(requirement, forChar) for requirement in questRequirements)
        
    def handle_quest(self, payload, userId, userInfo):
        charId = userInfo.get("character")
        requestType = payload.get("type")
        questFullId = payload.get("id")
        
        socket_reply = None
        socket_update = None
        
        if requestType == "get":
            questGiver = questFullId.split("-")[0]
            questId = questFullId.split("-")[1]
            
            if self.quests[questGiver]["status"] != TypeQuestStatus.OK.value:
                socket_reply = {"success": False, "error": self.quests[questGiver]}
                socket_update = None
            else:
                if self.quests[questGiver]["quests"][questId]["status"] !=  TypeQuestStatus.OK.value:
                    socket_reply = {"success": False, "data": self.quests[questGiver]["quests"][questId]["status"]}
                    socket_update = None
                else:
                    quest_data = self.quests[questGiver]["quests"][questId]
                    data = {}
                    data["title"] = quest_data["title"]
                    data["description"] = quest_data["description"]
                    data["objectives"] = quest_data["objectives"]
                    data["rewards"] = quest_data["rewards"]
                    data["id"] = questFullId
                    data["status"] = quest_data["status"]
                    
                    socket_reply = {
                        "success": True,
                        "data": data
                    }
                    
        return socket_reply, socket_update
        
        
        
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
            socket_reply, socket_update = self.handle_item(payload, userID, userInfo)
                    
                    
        elif type == "action":
            socket_reply, socket_update =  self.handle_action(payload, userID, userInfo)
            
        elif type == "quest": 
            socket_reply, socket_update = self.handle_quest(payload, userID, userInfo)
            
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
        elif type == "status":
            socket_reply = {
                "success": self.handle_user_status(userID, payload)
            }
                
        else:
            socket_reply = {
                "success": False,
                "error": TypeError.UNKNOWN_REQUEST_TYPE.value + "Input: " + type
            }
            
        
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