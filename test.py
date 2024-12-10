from chat_handeler import ChatHandler
import os
from import_db_files import DB_MAIN_PATH

from images_handler import *

hand = ImagesHandeler()

print(hand.check_image('background', 'living-depths-1', 'dark'))
