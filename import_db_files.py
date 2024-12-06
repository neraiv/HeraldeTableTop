import os
import json

DB_MAIN_PATH = "C:\\Work\\SVN\\trunk\\Programs\\Git\\MyRepos\\HeraldeTableTop"

#DB_MAIN_PATH = "C:\\Users\\hakan\\OneDrive\\Belgeler\\GitHub\\HeraldeTableTop"

GAMES_PATH = os.path.join(DB_MAIN_PATH, 'database', 'games')

SPELLS = os.path.join(DB_MAIN_PATH, 'database', 'spells.json')
USERS = os.path.join(DB_MAIN_PATH, 'database', 'users.json')
SERVER_INFO = os.path.join(DB_MAIN_PATH, 'database' ,'server_info.json')
IMAGES = os.path.join(DB_MAIN_PATH, 'database', 'images.json')
CHARS = os.path.join(DB_MAIN_PATH, 'database','game', 'chars.json')




if not os.path.exists(SPELLS):
    with open(SPELLS, 'w') as f:
        json.dump({}, f)  # Create an empty dictionary to start with

if not os.path.exists(USERS):
    with open(USERS, 'w') as f:
        json.dump({}, f)  # Create an empty dictionary to start with

if not os.path.exists(SERVER_INFO):
    with open(SERVER_INFO, 'w') as f:
        json.dump({{
    "name": "HeraldeTableTop",
    "version": "0.0.1",
    "description": "A tabletop game management system",
    "server_time": "2024-11-06 11:25:33 UTC",
    "game_save_number": 5
}}, f)  # Create an empty dictionary to start with

if not os.path.exists(IMAGES):
    with open(IMAGES, 'w') as f:
        json.dump({}, f)  # Create an empty dictionary to start with
