import secrets

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