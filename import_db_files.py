import os
import json

SPELLS = os.path.join(os.getcwd(), 'database', 'spells.json')
USERS = os.path.join(os.getcwd(), 'database', 'users.json')
SERVER_INFO = os.path.join(os.getcwd(), 'database' ,'server_info.json')
IMAGES = os.path.join(os.getcwd(), 'database', 'images.json')


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
