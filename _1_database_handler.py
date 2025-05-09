
import json
import os
from datetime import datetime, timezone

import db_types as dbt

class DatabaseHandeler():
    DB_MAIN_PATH = os.path.dirname(os.path.abspath(__file__))
    DB_GAMES_PATH = os.path.join(DB_MAIN_PATH, 'database', 'games')
    
    def __init__(self):
        
        self.server_info = dbt.ServerInfoHolder()
        
        self.server_info.status = self.loadGameFile("status.json", dbt.Where.FROM_ROOT)
        self.server_info.users  = self.loadGameFile("users.json", dbt.Where.FROM_ROOT)
        
        self.data = dbt.DataHolder()
        
        self.data.session_info = self.loadGameFile("session_info.json")
        self.data.rules        = self.loadGameFile("rules.json")
        self.data.spells       = self.loadGameFile("spells.json")
        self.data.chars        = self.loadGameFile("chars.json")
        self.data.scenes       = self.loadGameFile("scenes.json")
        self.data.objects      = self.loadGameFile("objects.json")
        self.data.quests       = self.loadGameFile("quests.json")
        self.data.npcs         = self.loadGameFile("npcs.json")
        self.data.summonables  = self.loadGameFile("summonables.json")
        
        self.data_core = dbt.DataHolder()
        
        self.data_core.session_info = self.loadGameFile("session_info.json", dbt.Where.FROM_DEFAULTS)
        self.data_core.rules        = self.loadGameFile("rules.json", dbt.Where.FROM_DEFAULTS)
        self.data_core.spells       = self.loadGameFile("spells.json", dbt.Where.FROM_DEFAULTS)
        self.data_core.chars        = self.loadGameFile("chars.json", dbt.Where.FROM_DEFAULTS)
        self.data_core.scenes       = self.loadGameFile("scenes.json", dbt.Where.FROM_DEFAULTS)
        self.data_core.objects      = self.loadGameFile("objects.json", dbt.Where.FROM_DEFAULTS)
        self.data_core.quests       = self.loadGameFile("quests.json", dbt.Where.FROM_DEFAULTS)
        self.data_core.npcs         = self.loadGameFile("npcs.json", dbt.Where.FROM_DEFAULTS)
        self.data_core.summonables  = self.loadGameFile("summonables.json", dbt.Where.FROM_DEFAULTS)
        
    def checkFiles(self):
        pass
        
    def updateServerTime(self):
        """
        Updates the server time in the database.
        """
        self.server_info.status["server_time"] = self.getCurrentTime()
        self.syncFile(server_status=True)
        
    def getCurrentTime(self):
        return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    
    def getTimeDifference(self, time1, time2 = None):
        if time2 is None:
            time2 = self.getCurrentTime()
        
        time1 = datetime.strptime(time1, "%Y-%m-%d %H:%M:%S UTC")
        time2 = datetime.strptime(time2, "%Y-%m-%d %H:%M:%S UTC")
        
        return (time2 - time1).total_seconds()
    
    def loadGameFile(self, name, where = dbt.Where.FROM_SESSION):
        try: 
            path = ""
            if where == dbt.Where.FROM_SESSION:
                path = os.path.join(DatabaseHandeler.DB_GAMES_PATH, self.server_info.status["active_session"]   , name)
            elif where == dbt.Where.FROM_DEFAULTS:
                path = os.path.join(DatabaseHandeler.DB_MAIN_PATH,"database", "defaults", name)
            else:
                path = os.path.join(DatabaseHandeler.DB_MAIN_PATH,"database", name)

            with open(path, 'r', encoding="utf-8") as file:
                return json.load(file)
        except FileNotFoundError:
            print(f"File not found: {path}")
            return None
        
    def saveGameFile(self, data, name, where = dbt.Where.FROM_SESSION):
        path = ""
        if where == dbt.Where.FROM_SESSION:
            path = os.path.join(DatabaseHandeler.DB_GAMES_PATH, self.server_info.status["active_session"]    , name)
        elif where == dbt.Where.FROM_DEFAULTS:
            path = os.path.join(DatabaseHandeler.DB_MAIN_PATH,"database", "defaults", name)
        else:
            path = os.path.join(DatabaseHandeler.DB_MAIN_PATH,"database", name)
        
        with open(path, 'w', encoding="utf-8") as file:
            json.dump(data, file)
            
    def reInit(self):
        self.__init__()
        
    def syncFile(self, isCore = False, 
                 server_status = False, 
                 server_users = False, 
                 session_info = False, 
                 rules = False, 
                 spells = False, 
                 chars = False, 
                 scenes = False, 
                 summonables = False,
                 quests = False,
                 npcs = False,
                 objects = False):
        """
        Saves the game files to the database.
        """
        
        selected : dbt.DataHolder = None 
        if isCore:
            selected = self.data_core
        else:
            selected = self.data
            
        if server_status:
            self.saveGameFile(self.server_info.status, "status.json", dbt.Where.FROM_ROOT)
        if server_users:
            self.saveGameFile(self.server_info.users,  "users.json",  dbt.Where.FROM_ROOT) 
        if session_info:
            self.saveGameFile(selected.session_info, "session_info.json")
        if rules:
            self.saveGameFile(selected.rules,        "rules.json")
        if spells:
            self.saveGameFile(selected.spells,       "spells.json")
        if chars:
            self.saveGameFile(selected.chars,        "chars.json")
        if scenes:
            self.saveGameFile(selected.scenes,       "scenes.json")
        if summonables:
            self.saveGameFile(selected.summonables,  "summonables.json")
        if quests:
            self.saveGameFile(selected.quests,       "quests.json")
        if npcs:
            self.saveGameFile(selected.npcs,         "npcs.json")
        if objects:
            self.saveGameFile(selected.objects,      "objects.json")
            
    def on_exit(self):
        self.server_info["status"] = "offline"    