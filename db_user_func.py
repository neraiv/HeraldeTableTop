from db_types import TypeOnlineStatus
from _db_main import DBHandler

import secrets

db = DBHandler()
def userSetOnlineStatus(status: TypeOnlineStatus, id: str):
    """Sets a user or all users to offline

    Args:
        id (str, optional): Give id to set an user online. None to set all users offline. Defaults to None.
    """
    if id in db.users:
        db.users[id]["status"] = status.value
        db.syncFile(users=True)
        return
    
def userLogin(username, password):
        """Logs in the user. Creates a key and updates last_seen time.

        Args:
            username (str): username to login
            password (password): password to login

        Returns:
            response: login resposne, key, character of user
        """
        if username in db.users and db.users[username]["password"] == password:
            if db.users[username]["status"] == "offline":
                db.users[username]["last_seen"] = db.get_currentTime()
                db.users[username]["status"] = "online"
                db.users[username]["key"] = generate_key(db.users)
                db.syncFile(users=True)
                return "ok", db.users[username]["key"], db.users[username]["character"]
            else: 
                return "user online", None, None ## User is alerady online
        return "invalid username password", None, None ## Invalid username and password
    
def generate_key(users: dict):     
    """Genertes a unique key. Searches for current users keys to generate key

    Args:
        users (dict): Dict of users to control

    Returns:
        _type_: _description_
    """
    res = secrets.token_urlsafe(16)  # 16 bytes, which is 128 bits long
    while any(user['key'] == res and user['status'] == 'online' for user in users.values()):
        res = secrets.token_urlsafe(16)  # Regenerate the key if it already exists

    return res

def controlKey(users: dict, key: str) -> tuple[str, dict]: 
    """
    Controls the given key in users dict and returns user data if avaliable.
    
    Args:
        users (dict): Dict of users to control
        key (str): Key to control
        
    Returns:
        tuple[str, dict]: userId and userInformation
    """      
    # Check if the provided key exists for an online user
    for username in users.keys():
        user = users[username]
        if user['key'] == key and user['status'] == 'online':
            return username, user
    return None, None