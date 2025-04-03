import secrets

def generate_key(users: dict):     
    # Generate a secure random key using secrets
    res = secrets.token_urlsafe(16)  # 16 bytes, which is 128 bits long
    while any(user['key'] == res and user['status'] == 'online' for user in users.values()):
        res = secrets.token_urlsafe(16)  # Regenerate the key if it already exists

    return res

def controlKey(users: dict, key: str) -> tuple[str, dict]:       
    # Check if the provided key exists for an online user
    for username in users.keys():
        user = users[username]
        if user['key'] == key and user['status'] == 'online':
            return username, user
    return None, None