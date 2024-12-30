import threading
import time
import json
from datetime import datetime, timezone
from import_db_files import *  # Ensure this has the USERS path or constants
import secrets
from chat_handeler import ChatHandler
from images_handler import ImagesHandeler
from permission_handeler import PermissonHandeler

class DBHandeler(ChatHandler, ImagesHandeler, PermissonHandeler):
    def __init__(self, file_path):
        """
        Initialize the DBHandeler with the path to the CSV file.
        :param file_path: Path to the CSV file.
        """
        super().__init__(file_path)
        self.last_update_time = None


        self.server_info : dict   = self.getGameFile("server_info.json", False)
        self.users       : dict   = self.getGameFile("users.json", False)

        self.session_info: dict   = self.getGameFile("session_info.json")
        self.rules       : dict   = self.getGameFile("rules.json")
        self.spells      : dict   = self.getGameFile("spells.json")
        self.chars       : dict   = self.getGameFile("chars.json")
        self.scenes      : dict   = self.getGameFile("scenes.json")
     
    DEBUG_MODE = True
    TEST_MODE = True

    SETTING_USER_SYNC_TIME_IN_SECONDS = 100000
    SETTING_SERVER_SYNC_TIME_IN_SECONDS = 1

    default_server_info = {"server_time": "", "server_status": "online", "last_session": "session-1", "chat_idx": 0}

    def generate_key(self):     
        # Generate a secure random key using secrets
        res = secrets.token_urlsafe(16)  # 16 bytes, which is 128 bits long
        while any(user['key'] == res and user['status'] == 'online' for user in self.users.values()):
            res = secrets.token_urlsafe(16)  # Regenerate the key if it already exists

        return res

    # Define the on_exit function
    def controlKey(self, key) -> tuple[str, dict]:       
        char = {}
        # Check if the provided key exists for an online user
        for username in self.users.keys():
            user = self.users[username]
            if user['key'] == key and user['status'] == 'online':
                return username, user
        return None, None
    
    def wait_until_file_is_closed(self, file_path):
        while True:
            try:
                # Try opening the file in read mode
                with open(file_path, 'r'):
                    # If we can open it without an error, it means the file is not open by another process
                    break
            except IOError:
                # If the file is being used by another process, IOError will be raised
                print(f"File {file_path} is in use. Waiting for it to be closed...")
                time.sleep(0.1)  # Wait for 0.1 second before trying again
    
    def getGameFile(self, name, from_session = True):
        path = ""
        if from_session:
            last_session = self.server_info["last_session"]       
            path = os.path.join(GAMES_PATH, last_session, name)
        else:
            path = os.path.join(DB_MAIN_PATH,"database", name)

        with open(path, 'r', encoding="utf-8") as file:
            return json.load(file)
        
    def getDbData(self, info):
        if info == "session_info":
            db_data = self.session_info
        elif info == "scenes":
            db_data = self.scenes
        elif info == "chars":
            db_data = self.chars
        elif info == "rules":
            db_data = self.rules
        elif info == "spells":
            db_data = self.spells
        elif info == "server_info":
            db_data = self.server_info
        elif info == "users":
            db_data = self.users
        else:
            db_data = None

        return db_data
    
    # Function to check and set users offline if their last sync exceeds 5 seconds
    def check_users_sync(self):
        try:
            # Check each user's last sync time and update status if necessary
            for user_id, user_data in self.users.items():
                if  user_data["status"]  == "online":
                    if "last_sync" in user_data:
                        # Get the current time in UTC
                        current_time = datetime.now(timezone.utc)
                        last_sync_time = datetime.strptime(user_data["last_sync"], "%Y-%m-%d %H:%M:%S %Z")
                        last_sync_time = last_sync_time.replace(tzinfo=timezone.utc)  # Ensure it's UTC-aware
                        time_diff = (current_time - last_sync_time).total_seconds()

                        # If the time difference exceeds 5 seconds, set the status to "offline"
                        if not self.TEST_MODE and time_diff > self.SETTING_USER_SYNC_TIME_IN_SECONDS:
                            user_data["status"] = "offline"
                            if self.DEBUG_MODE:
                                print(f"User {user_id} set to offline due to timeout.")

            # Save the updated data back to the file
            with open(USERS, 'w') as file:
                json.dump(self.users, file, indent=4)

        except json.JSONDecodeError:
            print(f"Error decoding JSON. check_users_sync()")
        except Exception as e:
            print(f"Error: {str(e)}")

    def update_server_time(self):
        try:       
            # Update the server time in the server data
            self.server_info["server_time"] = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S %Z")
            self.server_info["server_status"] = "online"
            if str(self.last_idx) != self.server_info["chat_idx"]:
                self.server_info["chat_idx"] = self.last_idx
            
            # Save the updated server data back to the file
            self.wait_until_file_is_closed(SERVER_INFO)
            with open(SERVER_INFO, 'w') as file:
                json.dump(self.server_info, file, indent=4)
            
        except json.JSONDecodeError:
            print(f"Error decoding JSON. update_server_time")
            self.wait_until_file_is_closed(SERVER_INFO)
            with open(SERVER_INFO, 'w') as file:
                json.dump(self.default_server_info, file)
        except Exception as e:
            print(f"Error: {str(e)}")
    # Function to periodically check user sync status every 5 seconds
    def start_sync_timer(self):
        lastUserSyncTime = time.time()  # Initial time for the first check
        lastServerSyncTime = time.time()  # Initial time for the first check

        while True:       
            currentTime = time.time()
            if currentTime - lastUserSyncTime >= self.SETTING_USER_SYNC_TIME_IN_SECONDS:
                self.check_users_sync()
                lastUserSyncTime = currentTime  # Update the last time for the next check
            if currentTime - lastServerSyncTime >= self.SETTING_SERVER_SYNC_TIME_IN_SECONDS:
                self.update_server_time()
                lastServerSyncTime = currentTime  # Update the last time for the next check

    def on_exit(self):
        """
        This function is called when the server shuts down.
        It sets all users to 'offline' in the USERS file.
        """
        print("Shutting down the server...")
        
        if os.path.exists(SERVER_INFO):
            self.wait_until_file_is_closed(SERVER_INFO)
            with open(SERVER_INFO, 'r') as file:
                server_data = json.load(file)
            server_data["server_status"] = "Offline"
            self.wait_until_file_is_closed(SERVER_INFO)
            with open(SERVER_INFO, 'w') as file:
                json.dump(server_data, file)
        else:
            print("Server data file not found.")
            return
        
        # Load the user data from the USERS file
        if os.path.exists(USERS):
            with open(USERS, 'r') as file:
                users_data = json.load(file)
        else:
            print("Users file not found.")
            return

        # Set the status of all users to 'offline'
        for user_id in users_data:
            users_data[user_id]["status"] = "offline"
            users_data[user_id]["key"] = self.generate_key() # randomize before exit

        # Save the updated user data back to the file
        with open(USERS, 'w') as file:
            json.dump(users_data, file, indent=4)

        print("All users set to offline.")