from _1_database_handler import DatabaseHandeler
from consts import USER_SYNC_DICONNECT_TIMEOUT

import secrets
from enum import Enum
import threading

class UserStatus(Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    
class UserHandlerError(Enum):
    USER_NOT_FOUND = "User not found"
    USER_ALREADY_EXISTS = "User already exists"
    INVALID_CREDENTIALS = "Invalid credentials"
    INVALID_KEY = "Invalid key"
    USER_OFFLINE = "User is offline"
    USER_ONLINE = "User is online"
    USER_STATUS_UPDATED = "User status updated"
    USER_REGISTERED = "User registered successfully"
    USER_UNREGISTERED = "User unregistered successfully"
    USER_PASSWORD_CHANGED = "User password changed successfully"
    

class UserHandler():
    def __init__(self, user):
        self.user = user
        self.db : DatabaseHandeler = None # Assigned with game manager
    
    def _setDatabaseReference(self, db : DatabaseHandeler):
        self.db = db
        
    def checkUserStatus(self):
        # Check if the user is online or offline
        for username, user in self.db.server_info.users.items():
            if user['status'] == UserStatus.ONLINE.value:
                # Perform periodic checks for online users
                if abs(self.db.getTimeDifference(user['last_seen'])) > USER_SYNC_DICONNECT_TIMEOUT:
                    # If the user has been offline for too long, set them to offline
                    self.db.server_info.users[username]['status'] = UserStatus.OFFLINE.value
                    self.db.syncFile(server_users=True)
                    print(f"User {username} is now offline.")

    def generate_key(self):     
        # Generate a secure random key using secrets
        res = secrets.token_urlsafe(16)  # 16 bytes, which is 128 bits long
        while any(user['key'] == res and user['status'] == 'online' for user in self.db.server_info.users.values()):
            res = secrets.token_urlsafe(16)  # Regenerate the key if it already exists

        return res

    def controlKey(self, key: str) -> tuple[str, dict]:
        # Check if the key is valid and return the corresponding user
        for username, user in self.db.server_info.users.items():
            if user['key'] == key:
                return username, user
        return None, None
    
    def setUserStatus(self, username: str, status: UserStatus) -> bool:
        # Check if the user exists in the database
        if username not in self.db.server_info.users:
            return False, UserHandlerError.USER_NOT_FOUND.value
        # Update the user's status
        self.db.server_info.users[username]['status'] = status.value
        self.db.syncFile(server_users=True)
        return True, None
        
    def registerUser(self, username: str, password: str) -> tuple[bool, str]:
        # Check if the username already exists
        if username in self.db.server_info.users:
            return False, UserHandlerError.USER_ALREADY_EXISTS.value
        # Generate a secure random key for the user
        key = self.generate_key()
        # Create a new user entry
        self.db.server_info.users[username] = {
            'password': password,
            'key': key,
            'status': 'offline',
            'type': 'adventurer',
            "character": None,
            "last_seen": "2025-04-16 10:04:39 UTC"
        }
        self.db.syncFile(server_users=True)
        return True, None
    
    def loginUser(self, username: str, password: str) -> tuple[bool, str]:
        # Check if the user exists and the password is correct
        if username not in self.db.server_info.users:
            return False, UserHandlerError.USER_NOT_FOUND.value
        if self.db.server_info.users[username]['password'] != password:
            return False, UserHandlerError.INVALID_CREDENTIALS.value
        
        # Update the user's status to online
        self.db.server_info.users[username]['status'] = 'online'
        self.db.syncFile(server_users=True)
        return True, None

    