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

# FUTURE check file existince and assign defoults if not