import copy
from enum import Enum
import shutil
import time
import json
from datetime import datetime, timezone, timedelta
import os
import threading

import numpy as np

from handler_chat import ChatHandler
from handler_keys import controlKey, generate_key
from handler_mask import FogType, apply_mask, calc_visible_areas
from handler_event import EventHandler
from consts import *
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
        self.summonables : dict   = self.getGameFile("summonables.json")
        
        self.defaults : dict = {
            "char" : self.getGameFile("char.json", DatabaseWhere.FROM_DEFAULTS)
        }
        
        active_session = self.server_info["active_session"]
        
        self.activeAreas: dict = {}
                
        for key in self.session_info["locations"]:
            currentScene = self.session_info["locations"][key]["currentScene"]
            
            scene_name = currentScene["name"]
            layer = currentScene["layer"]
            
            self.init_activeArea(scene_name, layer)
        
        self.userDisconnectTimeout = USER_SYNC_DICONNECT_TIMEOUT
        self.syncTimerCounter = 0
        
        self.sync_thread = threading.Thread(target=self.sync_loop, daemon=True)
        self.sync_thread.start()
        
        ## Chat 
        self.chat = ChatHandler(os.path.join(DBHandeler.DB_GAMES_PATH, active_session, "chat.csv"))
        
        ## Event handler
        self.event_handler = EventHandler(self.session_info["current_turn"], os.path.join(DBHandeler.DB_GAMES_PATH, active_session, "events.csv"),
                                          {
                                            "action" : self.handle_action,  
                                          })
        
        if self.session_info["chat_idx"] != self.chat.last_idx:
            self.session_info["chat_idx"] = self.chat.last_idx
            self.sync(session_info=True)
        
    def sync_loop(self):
        while True:
            self.updateServerTime()
            self.syncTimerCounter += 1
            if self.syncTimerCounter >= self.userDisconnectTimeout:
                self.updateUsersStatus()
                self.syncTimerCounter = 0

            time.sleep(1)

            
    def get_currentTime(self) -> str:
        return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S %Z")
    
    def updateServerTime(self):
        self.server_info["time"] = self.get_currentTime()
        self.server_info["status"] = "online"
        self.sync(server_info=True)
        
    def updateUsersStatus(self):
        for username, user in self.users.items():
            if user["status"] == "online":
                timestamp = datetime.strptime(user["last_seen"], "%Y-%m-%d %H:%M:%S %Z")

                # Attach UTC timezone because %Z doesn't actually parse it into tz-aware datetime
                timestamp = timestamp.replace(tzinfo=timezone.utc)

                # Current time in UTC
                now = datetime.now(timezone.utc)

                # Calculate time differenc
                time_difference = now - timestamp
                if time_difference.seconds > self.userDisconnectTimeout * self.userDisconnectTimeout:
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
    def sync(self, server_info = False, users = False, session_info = False, rules = False, spells = False, chars = False, scenes = False, summonables = False):
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
        if summonables:
            self.saveGameFile(self.summonables, "summonables.json")
            
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
        
    def calc_visibleAreas_scene(self, scene_name, layer):
        return calc_visible_areas(self.scenes[scene_name]["layers"][layer]["locations"],
                                                                       self.rules["fogType"], self.chars)
    def init_activeArea(self, scene_name, layer, visible_areas= True, events= True):
        
        sceneFullName = scene_name + "-" + layer
        
        if not (sceneFullName in self.activeAreas):
            

            for npcId, npcData in self.scenes[scene_name]["layers"][layer]["locations"]["npcs"].keys():
                movement = npcData.get("movement")
                continue
                # Future add events to event handlers
                if movement is not None:
                    self.event_handler.addEvent("scene", -1, {"type": "env", "payload": {"action": "move", "id": npcId, "info": movement}})
                        
            self.activeAreas[sceneFullName] = {
                "visibleAreas" : self.calc_visibleAreas_scene(scene_name, layer) if visible_areas else self.activeAreas[sceneFullName]["visibleAreas"],
                "events" : {} if events else self.activeAreas[sceneFullName]["events"]
            }
        
        return self.activeAreas[sceneFullName]
        
    def get_scene(self, charId: str, force_visible_area_calc = False):
        current_scene = self.session_info["locations"][charId]["currentScene"]
        scene_name = current_scene["name"]
        layer = current_scene["layer"]
        
        currentSceneName = scene_name + "-" + layer
              
        masked_scene = {
            'discovered': self.scenes[scene_name]['discovered'], 
            'width'     : self.scenes[scene_name]['width'     ], 
            'height'    : self.scenes[scene_name]['height'    ], 
            'grid_size' : self.scenes[scene_name]['grid_size' ],
            "layer"     : copy.deepcopy(self.scenes[scene_name]["layers"][layer])
        }
        
        for location_key in self.scenes[scene_name]["layers"][layer]["locations"].keys():
            masked_scene["layer"]["locations"][location_key] = apply_mask(self.scenes[scene_name]["layers"][layer]["locations"][location_key],
                                                                                            self.activeAreas[currentSceneName]["visibleAreas"])

        masked_scene["visibleAreas"] = self.activeAreas[currentSceneName]["visibleAreas"]
        
        return masked_scene
    
    def check_collision(self, target1, target2):
        if not (target1["x"] in self.activeAreas[f"{target1['scene']}-{target1['layer']}"]["visibleAreas"] and 
                            target2["x"] in self.activeAreas[f"{target2['scene']}-{target2['layer']}"]["visibleAreas"]):
            return False
        
        if (target1["x"] - target2["x"]) % self.scenes[target1["scene"]]["grid_size"]!= 0 or \
            (target1["y"] - target2["y"]) % self.scenes[target1["scene"]]["grid_size"]!= 0:
            return False
        
        return True
    
    def check_distance(self, target1, target2, distance):
        
        distance_x = target1["x"] - target2["x"]
        distance_y = target1["y"] - target2["y"]
         
        return np.sqrt(distance_x**2 + distance_y**2) < distance
        
    def action_portal(self, charId, data, portalId):
        
        destinationSceneName, destinationLayer = data.split('-')
        
        if not destinationSceneName and not destinationLayer: 
            return {"success": False, "error": TypeError.INSUFFİCENT_DATA.value+ " (action_portal)"}
        
        # Remove char from current scene
        currentSceneName = self.session_info["locations"][charId]["currentScene"]["name"]
        currentLayerName = self.session_info["locations"][charId]["currentScene"]["layer"]
         
        if not self.check_distance(
            self.scenes[currentSceneName]["layers"][currentLayerName]["locations"]["chars"][charId],
            self.scenes[currentSceneName]["layers"][currentLayerName]["locations"]["portals"][portalId],
            PORTAL_PASS_DISTANCE
        ):
            return {"success": False, "error": "It's too far away. (action_portal)"}
        
        self.scenes[currentSceneName]["layers"][currentLayerName]["locations"]["chars"].pop(charId) 
        
        if destinationLayer:
            self.session_info["locations"][charId]["currentScene"]["layer"] = destinationLayer
        if destinationSceneName:
            self.session_info["locations"][charId]["currentScene"]["name"] = destinationSceneName
            
        # Add char to new scene
        currentSceneName = self.session_info["locations"][charId]["currentScene"]["name"]
        currentLayerName = self.session_info["locations"][charId]["currentScene"]["layer"]

        self.scenes[currentSceneName]["layers"][currentLayerName]["locations"]["chars"][charId] = {"x": 200, "y": 200} # FUTURE char start location belirlenmeli
        
        if not (currentSceneName in self.activeAreas):
            self.activeAreas[currentSceneName]["visibleAreas"] = self.calc_visibleAreas_scene(self.session_info["locations"][charId]["currentScene"]["name"], 
                                                                                                self.session_info["locations"][charId]["currentScene"]["layer"])
        
        self.sync(session_info=True, scenes=True)
        
        return {"success": True}
            
    def move_char(self, charId: str, x , y):
        
        x = int(x)
        y = int(y)
    
        currentScene: dict = self.session_info["locations"].get(charId).get("currentScene")

        sceneInfo: dict = self.scenes.get(currentScene["name"])
        
        layerInfo: dict = sceneInfo.get("layers").get(currentScene["layer"])
        
        movableAreas = layerInfo["movableAreas"]
        
        searched: dict
        socket_reply = {}
        socket_update = None
        moved = False
        
        def update():
            charInfo = self.scenes[currentScene["name"]]["layers"][currentScene["layer"]]["locations"]["chars"][charId]
            charInfo["x"] = x
            charInfo["y"] = y
            self.sync(scenes=True)
        
        if movableAreas["type"] == "limitless":
            update()
            moved = True
            
        else: 
            searched: dict = apply_mask({"x": x, "y": y}, movableAreas["shapes"])
            
            if len(searched.keys()) != 0: 
                update()
                moved = True
            else:
                socket_reply, socket_update = {"success": False, "error": f"Cant move to the x:{x}, y:{y}"}, None
            
        if moved:    
            self.init_activeArea(currentScene["name"], currentScene["layer"], events=False)
            
            new_scene_data = self.get_scene(charId)
            socket_reply, socket_update = {"success": True}, [{"type": "change_scene_layer_locations", 
                                                                "data": new_scene_data["layer"]["locations"], 
                                                                "prior": SocketUpdatePrior.IMMEDIATELY.value, "all_users": False},
                                                                {"type": "change_scene_visibleAreas", 
                                                                 "data" : new_scene_data["visibleAreas"],
                                                                "prior": SocketUpdatePrior.IMMEDIATELY.value, 
                                                                "all_users": False}
                                                                ]
                 
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
                socket_update = [{
                    "type": "reinit_scene",
                    "prior": SocketUpdatePrior.IMMEDIATELY.value,
                    "all_users": False
                }]
        
        elif "portal" in action:
            data = actionInfo.get("data")
            portalId = actionInfo.get("id")
            socket_reply = self.action_portal(charId, data, portalId)

            if socket_reply["success"] == True:
                socket_update = [{"type": "reinit_scene", "prior": SocketUpdatePrior.IMMEDIATELY.value, "all_users": False}]
                
        return socket_reply, socket_update
    
        
    def handle_get(self, payload, userID, userInfo):
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
            
        elif payload["type"] == "spell":
            spellId = payload["id"]
            spellData = self.spells.get(spellId)
            
            if spellData: 
                socket_reply = {'success': True, "data" : spellData}
            else:
                socket_reply = {'success': False, "error": "Spell not found"}
                
        elif payload["type"] == "summonables_id":
            try:
                summonables : dict = {}
                for summonableId, summonableData in self.summonables.items():
                    summonables[summonableId] = summonableData["name"]
                
                socket_reply = {'success': True, "data" : summonables}
            except json.JSONDecodeError as e :
                socket_reply = {'success': False, "error": "Error decoding JSON" + str(e)}
            
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
        
        
    def handle_turn(self, payload, userID, userInfo):
        
        type = payload["type"]
        
        socket_reply = {}
        socket_update = None
        
        if type == "statusUpdate":
            status = payload["status"]
            charId = userInfo.get("character")
            self.session_info["locations"][charId]["turnStatus"] = status
            
            socket_reply = {
                "success": True
            }
            
            for char in self.session_info["locations"].values():
                print(char["turnStatus"])
            
            if self.session_info["turnType"] != "free" and all([char["turnStatus"] == "continue" for char in self.session_info["locations"].values()]):
                self.event_handler.run()
                socket_update = [{"type": "turn_change", "data": self.event_handler.current_turn, "prior": SocketUpdatePrior.IMMEDIATELY.value, "all_users": True}]
                for char in self.session_info["locations"].values():
                    char["turnStatus"] == "paused"
                    
            self.sync(session_info=True)
                
        elif (type == "getStatuses"):
            socket_reply = {
                "success": True,
                "data": {charId: char["turnStatus"] for charId, char in self.session_info["locations"].items()}
            }

        return socket_reply, socket_update
    
    def socket_handler(self, socketMessage: dict, userID = None, userInfo = None):
        try:
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
                
            elif type == "get":
                socket_reply, socket_update = self.handle_get(payload, userID, userInfo)
                        
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
                        socket_update = [{"type":"chat", "prior": SocketUpdatePrior.WHEN_AVALIABLE.value, "all_users": True}]
                    else:
                        socket_reply = {'success': False, 'error': state}
                        
                elif "get" in type:
                    start = payload.get("start")
                    length = payload.get("length")
                    socket_reply = self.chat.getMessages(start, length)
            
            elif type == "turn":
                socket_reply, socket_update = self.handle_turn(payload, userID, userInfo)
            elif type == "status":
                socket_reply = {
                    "success": self.handle_user_status(userID, payload)
                }
                    
            else:
                socket_reply = {
                    "success": False,
                    "error": TypeError.UNKNOWN_REQUEST_TYPE.value + "Input: " + type + " (socket_handler)"
                }
                
            return socket_reply, socket_update
        
        except Exception as e:
            print(f"Error in socket_handler: {str(e)}")
            return {"success": False, "error": str(e)}, None
            
            
    def on_exit(self):      
        self.server_info["status"] = "offline"
        self.sync(server_info=True)
    
        self.user_set_offline()

    def fileManagement_saveCharacter(self, data: dict):
        root = os.path.join(self.DB_MAIN_PATH, "static", "images", "character")
        
        if data["type"] == "local":
            char_name = data["name"]  # Get character name

            if not char_name:
                print("Character name is empty")
                return

            # Create main directory if it doesn't exist
            os.makedirs(root, exist_ok=True)

            # Create character subdirectory
            char_dir = os.path.join(root, char_name)
            os.makedirs(char_dir, exist_ok=True)

            # Get image path from QLabel
            char_image_path = data["image_path"]

            if not char_image_path or not os.path.exists(char_image_path):
                print("No valid image selected")
                return

            # Extract file extension
            file_ext = os.path.splitext(char_image_path)[-1].lower()  # e.g., ".png"

            # Define new file path
            save_path = os.path.join(char_dir, f"char{file_ext}")

            # Copy image to new location
            shutil.copy(char_image_path, save_path)

            print(f"Image saved to: {save_path}")