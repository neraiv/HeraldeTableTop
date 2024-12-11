from chat_handeler import ChatHandler
import os
from import_db_files import DB_MAIN_PATH

from import_db_files import *
from db_handler import DBHandeler

db = DBHandeler(os.path.join(DB_MAIN_PATH, 'database', 'chat.csv'))

print(db.rules)

inventory = db.rules.get("visible_inventories")
print(inventory, type(inventory))