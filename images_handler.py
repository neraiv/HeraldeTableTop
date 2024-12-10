#MAKE ME A CLASS WHİCH SEARCHİS DE static/tokens path and return a url to acces them throughr flask server
from import_db_files import *


class ImagesHandeler():
    def __init__(self):
        pass

    def check_image(self, location, name, type):
        folder_path = os.path.join(IMAGES, location, name)
        
        print(folder_path)
        
        if os.path.exists(folder_path):
            
            for file in os.listdir(folder_path):
                fileName = file.split('.')[0]
                if fileName == type:
                    return True, file
        return False, file
    