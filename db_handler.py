import copy
from enum import Enum
import shutil
import time
import json
from datetime import datetime, timezone, timedelta
import os
import threading

import numpy as np

from db_chat_handler import ChatHandler
from db_key_handeler import controlKey, generate_key
from db_fog_handeler import FogType, applyMask, calcVisibleAreas
from db_event_handler import EventHandler
from db_consts import *
from db_types import *

DEBUG_PRINT = True
        
class DBHandeler():
    """Handler for database operations.

    Returns:
        _type_: _description_
    """
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
        
        self.activeAreas: dict = {}
                
        for key in self.session_info["locations"]:
            currentScene = self.session_info["locations"][key]["currentScene"]
            
            scene_name = currentScene["name"]
            layer = currentScene["layer"]
            
            self.init_activeArea(scene_name, layer)
        
        self.sync_timeout = 5
        self.userSyncTimeout = 2
        self.syncTimerCounter = 0
        
        self.sync_thread = threading.Thread(target=self.serverPeriodicLoop, daemon=True)
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
            self.syncFile(session_info=True)
            
            
    def init_server_info(self):
        """
        Initialize the server information.

        This method sets the server status to "online" and updates the server time
        to the current time.

        The server information is stored in the self.server_info dictionary.
        """
        self.server_info["status"] = "online"
        self.server_info["time"] = self.get_currentTime()

    
    def init_users(self):
        """
        Initialize all users by setting their online status to offline.

        This function iterates through all user IDs in the self.users dictionary
        and sets each user's online status to offline using the userSetOnlineStatus method.

        Parameters:
        None

        Returns:
        None
        """
        for userId in self.users.keys():
            self.userSetOnlineStatus(TypeOnlineStatus.OFFLINE, 
                                     userId)

        
    def get_currentTime(self) -> str:
        """
        Returns the current time in UTC format.

        Parameters:
        None

        Returns:
        str: The current time in the format "YYYY-MM-DD HH:MM:SS Z".
        """
        return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S %Z")


    def checkDistance(self, target1: dict, target2: dict, distance: float) -> bool:
        """
        Checks if the distance between two points is less than a given distance.

        Parameters:
        target1 (dict): A dictionary containing 'x' and 'y' coordinates of the first point.
        target2 (dict): A dictionary containing 'x' and 'y' coordinates of the second point.
        distance (float): The maximum distance between the two points.

        Returns:
        bool: True if the distance between the two points is less than the given distance, False otherwise.
        """
        distance_x = target1["x"] - target2["x"]
        distance_y = target1["y"] - target2["y"]

        return np.sqrt(distance_x**2 + distance_y**2) < distance

    
    def checkReqirement(self, rquirement, charId):
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
    #%% 
    ########################################################################
    ######################## Periodic Checks ###############################
    ########################################################################         
    def serverPeriodicLoop(self):
        """
        This function is responsible for the periodic server operations.
        It updates the server time, checks for user status, and syncs the server.

        Parameters:
        None

        Returns:
        None
        """
        while True:
            self.updateServerTime()
            self.syncTimerCounter += 1
            if self.syncTimerCounter >= self.userSyncTimeout:
                self.updateUsersStatus()
                self.syncTimerCounter = 0

            time.sleep(self.sync_timeout)


            
    def updateServerTime(self):
        """Updates the server time to current time and sets the server status to online.

        Parameters:
        None

        Returns:
        None
        """
        self.server_info["time"] = self.get_currentTime()
        self.server_info["status"] = "online"
        self.syncFile(server_info=True)

        
    def updateUsersStatus(self):
        """
        Updates the status of users in the game.

        Iterates through each user in the `self.users` dictionary. If a user's status is "online", it calculates the time difference between the current time and the user's last seen time. If the time difference exceeds the product of `self.userSyncTimeout` and `self.sync_timeout`, the user's status is set to "offline" and the updated user data is saved to the file.

        Parameters:
        None

        Returns:
        None
        """
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
                    self.syncFile(users=True)

    
    #%%
    ########################################################################
    #########################  USER RELATED ################################
    ########################################################################    
    def userLogin(self, username, password):
        """Logs in the user. Creates a key and updates last_seen time.

        Args:
            username (str): username to login
            password (password): password to login

        Returns:
            response: login resposne, key, character of user
        """
        if username in self.users and self.users[username]["password"] == password:
            if self.users[username]["status"] == "offline":
                self.users[username]["last_seen"] = self.get_currentTime()
                self.users[username]["status"] = "online"
                self.users[username]["key"] = generate_key(self.users)
                self.syncFile(users=True)
                return "ok", self.users[username]["key"], self.users[username]["character"]
            else: 
                return "user online", None, None ## User is alerady online
        return "invalid username password", None, None ## Invalid username and password
    
    def controlKey(self, key):
        """Tries to find user with the provided key and returns user data.

        Args:
            key (str): Key of the user. Provided with userLogin()

        Returns:
            tuple: (id_of_user, userInfo)
        """
        userId, userInfo = controlKey(self.users, key)

        return userId, userInfo
    
    def handleUser(self, userId, type):
        """handles user profile related actions.

        Args:
            userId (str): id of the user
            type (str): type of the

        Returns:
            dict: socketReply, status of action
            dict: socketUpdate, changes after the action
        """
        
        socketReply = None
        socketUpdate = None
        
        if type == "sync":
            if userId in self.users:
                self.users[userId]["last_seen"] = self.get_currentTime()
                self.syncFile(users=True)
                socketReply = {
                    "success" : True
                }
            else:
                socketReply = {
                    "success" : False
                }
        elif type == "logout":
            self.userSetOnlineStatus(TypeOnlineStatus.OFFLINE,
                                     userId)
            socketReply = {
                "success" : True
            }
        return socketReply, socketUpdate
            
        
    def userSetOnlineStatus(self, status: TypeOnlineStatus, id: str):
        """Sets a user or all users to offline

        Args:
            id (str, optional): Give id to set an user online. None to set all users offline. Defaults to None.
        """
        if id in self.users:
            self.users[id]["status"] = status.value
            self.syncFile(users=True)
            return
    #%%
    ########################################################################
    #########################  FILES RELATED ###############################
    ########################################################################  
    def syncFile(self, server_info = False, users = False, session_info = False, rules = False, spells = False, chars = False, scenes = False):
        """Saves the current server status to active session files. Only the values with True.

        Args:
            server_info (bool, optional):  Defaults to False.
            users (bool, optional):  Defaults to False.
            session_info (bool, optional):  Defaults to False.
            rules (bool, optional):  Defaults to False.
            spells (bool, optional):  Defaults to False.
            chars (bool, optional):  Defaults to False.
            scenes (bool, optional):  Defaults to False.
        """
        
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
        """Gets the file from specified where. Returns

        Args:
            name (str): name of the file to retrie
            where (str, optional): Where to retrieve file. Defaults to DatabaseWhere.FROM_SESSION.

        Returns:
            dict: Data collected as json
        """
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
        """_summary_

        Args:
            data (dict): data to be saved
            name (str): name of the file
            where (DatabaseWhere, optional): Where to find file. Defaults to DatabaseWhere.FROM_SESSION.
        """
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
            
    #%%
    ########################################################################  
    #########################  SCENE RELATED ###############################
    ########################################################################  
    def sceneCalcVisibleAreas(self, scene_name, layer):
        """Calculates visible areas in a scene in self.scenes.

        Args:
            scene_name (str): name of the scene
            layer (str): name of the layer in scene

        Returns:
            dict: VisibleAreas
        """
        return calcVisibleAreas(self.scenes[scene_name]["layers"][layer]["locations"],
                                self.rules["fogType"], self.chars)
        
    def init_activeArea(self, scene_name, layer, visible_areas= True, events= True):
        """
        Initialize active area for a given scene and layer.

        Parameters:
        - scene_name (str): The name of the scene.
        - layer (str): The name of the layer within the scene.
        - visible_areas (bool, optional): Whether to calculate visible areas. Defaults to True.
        - events (bool, optional): Whether to handle events. Defaults to True.

        Returns:
        - dict: The initialized active area for the given scene and layer.
        """
        sceneFullName = scene_name + "-" + layer

        if not (sceneFullName in self.activeAreas):

            # Iterate through NPCs in the scene layer
            for npcId, npcData in self.scenes[scene_name]["layers"][layer]["locations"]["npcs"].items():
                movement = npcData.get("movement")
                continue
                # Future add events to event handlers
                if movement is not None:
                    self.event_handler.addEvent("scene", -1, {"type": "env", "payload": {"action": "move", "id": npcId, "info": movement}})

            self.activeAreas[sceneFullName] = {
                "visibleAreas" : self.sceneCalcVisibleAreas(scene_name, layer) if visible_areas else self.activeAreas[sceneFullName]["visibleAreas"],
                "events" : {} if events else self.activeAreas[sceneFullName]["events"]
            }

        return self.activeAreas[sceneFullName]

        
    def sceneGetCharScene(self, charId: str):
        """Finds the current scene of the char and returns it scene data with visible areas

        Args:
            charId (str): Id of the char

        Returns:
            dict: maskedScene. The visible part of the game to user.
        """
        
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
            masked_scene["layer"]["locations"][location_key] = applyMask(self.scenes[scene_name]["layers"][layer]["locations"][location_key],
                                                                        self.activeAreas[currentSceneName]["visibleAreas"])

        masked_scene["visibleAreas"] = self.activeAreas[currentSceneName]["visibleAreas"]
        
        return masked_scene
    
    #%%
    ########################################################################  
    ######################  CHAR ACTIONS RELATED ###########################
    ########################################################################  
    def actionPortal(self, charId: str, payload: dict):
        """Handles portal reletad actions

        Args:
            charId (_type_): _description_
            data (_type_): _description_
            portalId (_type_): _description_

        Returns:
            _type_: _description_
        """
        charId
        
        data = payload.get("data")
        portalId = payload.get("id")
        
        if not portalId or not data:
            return {"success": False, "error": TypeError.INSUFFİCENT_DATA.value+ " in paylaod (action_portal)"}, None
        
        destinationSceneName, destinationLayer = data.split('-')
        
        if not destinationSceneName and not destinationLayer: 
            return {"success": False, "error": TypeError.INSUFFİCENT_DATA.value+ " in data (action_portal)"}, None
        
        # Remove char from current scene
        currentSceneName = self.session_info["locations"][charId]["currentScene"]["name"]
        currentLayerName = self.session_info["locations"][charId]["currentScene"]["layer"]
         
        if not self.checkDistance(
            self.scenes[currentSceneName]["layers"][currentLayerName]["locations"]["chars"][charId],
            self.scenes[currentSceneName]["layers"][currentLayerName]["locations"]["portals"][portalId],
            PORTAL_PASS_DISTANCE
        ):
            return {"success": False, "error": "It's too far away. (action_portal)"}, None
        
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
            self.activeAreas[currentSceneName]["visibleAreas"] = self.sceneCalcVisibleAreas(self.session_info["locations"][charId]["currentScene"]["name"], 
                                                                                                self.session_info["locations"][charId]["currentScene"]["layer"])
        
        self.syncFile(session_info=True, scenes=True)
        
        return {"success": True}, [{"type": "update_scene", "prior": SocketUpdatePrior.IMMEDIATELY}]
            
    def actionCharMove(self, charId: str, payload: dict):
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
        
        currentScene: dict = self.session_info["locations"].get(charId).get("currentScene")

        sceneInfo: dict = self.scenes.get(currentScene["name"])
        
        layerInfo: dict = sceneInfo.get("layers").get(currentScene["layer"])
        
        movableAreas = layerInfo["movableAreas"]
    
        socketReply = {}
        socketUpdate = None
        moved = False
        
        def update():
            charInfo = self.scenes[currentScene["name"]]["layers"][currentScene["layer"]]["locations"]["chars"][charId]
            charInfo["x"] = x
            charInfo["y"] = y
            self.syncFile(scenes=True)
        
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
            self.init_activeArea(currentScene["name"], currentScene["layer"], events=False)
            
            new_scene_data = self.sceneGetCharScene(charId)
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
            
    def handle_action(self, payload: dict, userID: str, userInfo: dict):
        """
        Handles character actions such as moving, using portals, etc.

        Parameters:
        payload (dict): Contains the action type and any additional data required for the action.
        userID (str): The ID of the user making the action.
        userInfo (dict): Contains information about the user making the action.

        Returns:
        tuple: A tuple containing the response and any updates to be sent to the client.
        """
        charId = userInfo.get("character")
        action = payload.get("action")

        socketReply = {}
        socketUpdate = None

        if action == "move":
            id = payload.get("id")      
            if charId == id or userInfo.get("type") == "dungeon_master":
                socketReply, socketUpdate = self.actionCharMove(charId, payload)
            else:
                socketReply = {
                    "success": False,
                    "error": "U cant move this character."
                },
                socketUpdate = [{
                    "type": "reinit_scene",
                    "prior": SocketUpdatePrior.IMMEDIATELY.value,
                    "all_users": False
                }]

        elif "portal" in action:
            socketReply, socketUpdate = self.actionPortal(charId, payload)

        return socketReply, socketUpdate

    
    #%%
    ########################################################################  
    ######################  GET METHODS RELATED  ###########################
    ########################################################################  
    def getChar(self, payload: dict, userId: str, userInfo: dict):
        """Get a character

        Args:
            payload (dict): Payload must contain id of character
            userId (str): id of the user who wants to get character
            userInfo (dict): information about user who wants to get character

        Returns:
            tuple: Response
        """
        
        socketReply = {}
        socketUpdate = None
        
        charId = payload["id"]
        
        if charId in self.chars:
            charInfo = self.chars[charId]
            
            if self.rules["visableInventories"] == False:
                charInfo["char"]["inventory"] = None
                
            socketReply =  {'success': True, "data" : charInfo}
        else:
            socketReply = {"success": False, "error": f"Character with id {charId} not found."}, None
            
        return socketReply, socketUpdate
    
    def getNpc(self, payload: dict, userId: str, userInfo: dict):
        """Get a npc

        Args:
            payload (dict): Payload must contain id of npc
            userId (str): id of the user who wants to get npc
            userInfo (dict): information about user who wants to get npc

        Returns:
            tuple: Response
        """
        
        npcId = payload["id"]
        
        npcData = self.npcs[npcId]
        
        quests = {}
        
        if npcData["quests"]:
            for quest_key in self.quests[npcId]["quests"].keys():
                questFullId = npcId+ "-" + quest_key
                if self.questsCheckRequirements(npcId, quest_key, userInfo["character"]):
                    reply, _ = self.handle_quest({"type": "get", "id": questFullId}, userId, userInfo)
                    if reply["success"]:
                        quests[questFullId] = reply["data"]
            
            
        npcData["quests"] = quests
        npcData["dialogs"] = {}
            
        if npcData["char"] == "default":
            npcData["char"] = self.defaults["char"]
            npcData["char"]["id"] = npcId
            
        socketReply = {'success': True, "data" : npcData}
        
    def getSpell(self, payload: dict, userId: str, userInfo: dict):
        """Get a spell

        Args:
            payload (dict): Payload must contain id
            userId (str): id of the user who wants to get spell
            userInfo (dict): information about user who wants to get spell

        Returns:
            tuple: Response
        """
        
        spellId = payload["id"]
        spellData = self.spells.get(spellId)
        
        if spellData: 
            socketReply, socketUpdate = {'success': True, "data" : spellData}, None
        else:
            socketReply, socketUpdate = {'success': False, "error": "Spell not found"}, None
            
        return socketReply, socketUpdate
        
    def getQuest(self, payload: dict, userId: str, userInfo: dict):
        """Get a quest

        Args:
            payload (dict): Payload must contain id
            userId (str): id of the user who wants to get spell
            userInfo (dict): information about user who wants to get spell

        Returns:
            tuple: Response
        """
    
        questFullId = payload.get("id")
        
        socketReply = None
        socketUpdate = None
        
        questGiver = questFullId.split("-")[0]
        questId = questFullId.split("-")[1]
        
        if self.quests[questGiver]["status"] != TypeQuestStatus.OK.value:
            socketReply = {"success": False, "error": self.quests[questGiver]}
            socketUpdate = None
        else:
            if self.quests[questGiver]["quests"][questId]["status"] !=  TypeQuestStatus.OK.value:
                socketReply = {"success": False, "data": self.quests[questGiver]["quests"][questId]["status"]}
                socketUpdate = None
            else:
                quest_data = self.quests[questGiver]["quests"][questId]
                data = {}
                data["title"] = quest_data["title"]
                data["description"] = quest_data["description"]
                data["objectives"] = quest_data["objectives"]
                data["rewards"] = quest_data["rewards"]
                data["id"] = questFullId
                data["status"] = quest_data["status"]
                
                socketReply = {
                    "success": True,
                    "data": data
                }
                
        return socketReply, socketUpdate
        
        
    def handle_get(self, payload, userID, userInfo):
        """
        This function handles the retrieval of character, NPC, spell, and quest data.

        Parameters:
        payload (dict): Contains the type of data to retrieve and any additional data required.
        userID (str): The ID of the user making the request.
        userInfo (dict): Contains information about the user making the request.

        Returns:
        tuple: A tuple containing the response and any updates to be sent to the client.
        """
        socketReply = None
        socketUpdate = None

        if payload["type"] == "char":
            socketReply, socketUpdate = self.getChar(payload, userID, userInfo)         
        elif payload["type"] == "npc":
            socketReply, socketUpdate = self.getNpc(payload, userID, userInfo) 
        elif payload["type"] == "spell":
            socketReply, socketUpdate = self.getSpell(payload, userID, userInfo)   
        elif payload["type"] == "quest":
            socketReply, socketUpdate = self.getQuest(payload, userID, userInfo)      
        return socketReply, socketUpdate

        
    #%%
    ########################################################################  
    ######################  QUEST RELATED METHODS ###########################
    ########################################################################  
    def questsCheckRequirements(self, questGiver, questId, forChar):
        """
        This function checks if a character meets the requirements for a specific quest.

        Parameters:
        questGiver (str): The ID of the NPC or character giving the quest.
        questId (str): The ID of the quest.
        forChar (str): The ID of the character to check the requirements for.

        Returns:
        bool: True if the character meets all the requirements for the quest, False otherwise.
        """
        questRequirements = self.quests[questGiver]["quests"][questId]["requires"]

        if len(questRequirements) == 0:
            return True

        return all(self.checkReqirement(requirement, forChar) for requirement in questRequirements)

        
    
    def handle_quest(self, payload, userId, userInfo):
        """Does nothing

        Args:
            payload (_type_): _description_
            userId (_type_): _description_
            userInfo (_type_): _description_
        """
        pass
        
        
    def handle_turn(self, payload, userID, userInfo):
        """
        This function handles the status updates and turn changes during a game session.

        Parameters:
        payload (dict): Contains the type of action to be performed and any additional data required.
        userID (str): The ID of the user making the action.
        userInfo (dict): Contains information about the user making the action.

        Returns:
        tuple: A tuple containing the response and any updates to be sent to the client.
        """
        type = payload["type"]

        socketReply = {}
        socketUpdate = None

        if type == "statusUpdate":
            status = payload["status"]
            charId = userInfo.get("character")
            self.session_info["locations"][charId]["turnStatus"] = status

            socketReply = {
                "success": True
            }

            for char in self.session_info["locations"].values():
                print(char["turnStatus"])

            if self.session_info["turnType"] != "free" and all([char["turnStatus"] == "continue" for char in self.session_info["locations"].values()]):
                self.event_handler.run()
                socketUpdate = [{"type": "turn_change", "data": self.event_handler.current_turn, "prior": SocketUpdatePrior.IMMEDIATELY.value, "all_users": True}]
                for char in self.session_info["locations"].values():
                    char["turnStatus"] == "paused"

            self.syncFile(session_info=True)

        elif (type == "getStatuses"):
            socketReply = {
                "success": True,
                "data": {charId: char["turnStatus"] for charId, char in self.session_info["locations"].items()}
            }

        return socketReply, socketUpdate

    
    def websocketHandler(self, socketMessage: dict, userID = None, userInfo = None):
        """
        Handles incoming socket messages and performs appropriate actions based on the message type.

        Parameters:
        socketMessage (dict): Contains the type of action and any additional data required for the action.
        userID (str, optional): The ID of the user making the request. Defaults to None.
        userInfo (dict, optional): Contains information about the user making the request. Defaults to None.

        Returns:
        tuple: A tuple containing the response and any updates to be sent to the client. If an error occurs,
        the tuple will contain a success flag set to False and an error message.
        """
        try:
            type = socketMessage.get("type")
            payload = socketMessage.get("payload")

            socketReply = None
            socketUpdate = None

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
                    data =  self.sceneGetCharScene(userInfo["character"])
                else:
                    success = False

                socketReply = {
                    "data" : data,
                    "success" : success 
                }

            elif type == "get":
                socketReply, socketUpdate = self.handle_get(payload, userID, userInfo)

            elif type == "action":
                socketReply, socketUpdate =  self.handle_action(payload, userID, userInfo)

            elif type == "quest": 
                socketReply, socketUpdate = self.handle_quest(payload, userID, userInfo)

            elif "chat" in type:
                if "send" in type:
                    state = self.chat.addMessage(userID, payload["message"], self.get_currentTime())
                    if state == "success":
                        self.session_info["chat_idx"] = self.chat.last_idx
                        self.syncFile(session_info=True)
                        socketReply = {'success': True}
                        socketUpdate = [{"type":"chat", "prior": SocketUpdatePrior.WHEN_AVALIABLE.value, "all_users": True}]
                    else:
                        socketReply = {'success': False, 'error': state}

                elif "get" in type:
                    start = payload.get("start")
                    length = payload.get("length")
                    socketReply = self.chat.getMessages(start, length)

            elif type == "turn":
                socketReply, socketUpdate = self.handle_turn(payload, userID, userInfo)
            elif type == "status":
                socketReply, socketUpdate = self.handleUser(userID, payload)         
            else:
                socketReply = {
                    "success": False,
                    "error": TypeError.UNKNOWN_REQUEST_TYPE.value + "Input: " + type + " (socket_handler)"
                }

            return socketReply, socketUpdate

        except Exception as e:
            print(f"Error in socket_handler: {str(e)}")
            return {"success": False, "error": str(e)}, None

            
            
    def onExit(self):
        """
        This function handles the server shutdown process. It updates the server status to 'offline',
        syncs the server information to the database, and sets the online status of all users to 'offline'.

        Parameters:
        None

        Returns:
        None
        """
        self.server_info["status"] = "offline"
        self.syncFile(server_info=True)

        self.userSetOnlineStatus()


    def fileManagement_saveCharacter(self, data: dict):
        """
        This function saves a character's image to the database.

        Parameters:
        data (dict): Contains the character's name and image path.

        Returns:
        None

        The function performs the following steps:
        1. Checks if the character's type is 'local'.
        2. Retrieves the character's name from the data dictionary.
        3. Checks if the character's name is empty. If it is, prints an error message and returns.
        4. Creates the main directory if it doesn't exist.
        5. Creates a subdirectory for the character.
        6. Retrieves the image path from the data dictionary.
        7. Checks if the image path is valid. If it's not, prints an error message and returns.
        8. Extracts the file extension from the image path.
        9. Defines the new file path.
        10. Copies the image to the new location.
        11. Prints a success message with the new file path.
        """
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

            
         
if __name__ == "__main__":   
    pass