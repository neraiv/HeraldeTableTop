from chat_handeler import ChatHandler
import os
from import_db_files import DB_MAIN_PATH
from server import getGameFile

chat = ChatHandler(os.path.join(DB_MAIN_PATH, 'database', 'chat.csv'))

print(getGameFile("server_info.json", False))
print(chat.last_idx)