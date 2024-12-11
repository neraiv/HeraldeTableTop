import os

DB_MAIN_PATH = os.path.dirname(os.path.abspath(__file__))

GAMES_PATH = os.path.join(DB_MAIN_PATH, 'database', 'games')
USERS = os.path.join(DB_MAIN_PATH, 'database', 'users.json')
SERVER_INFO = os.path.join(DB_MAIN_PATH, 'database', 'server_info.json')
RULES = os.path.join(DB_MAIN_PATH, 'database', 'rules.json')

CHARS = os.path.join(DB_MAIN_PATH, 'database', 'game', 'chars.json')

IMAGES = os.path.join(DB_MAIN_PATH, 'static', 'images')


# FUTURE check file existince and assign defoults if not