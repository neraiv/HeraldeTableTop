#MAKE ME A CLASS WHİCH SEARCHİS DE static/tokens path and return a url to acces them throughr flask server
from db_import import *


class ImagesHandeler():
    def __init__(self):
        pass

    def check_image(self, location, name, type):
        """
        This function checks if a specific image file exists in a given location within the static/tokens directory.

        Parameters:
        - location (str): The subfolder within the static/tokens directory where the image is located.
        - name (str): The name of the image folder.
        - type (str): The type of the image file (e.g., 'png', 'jpg', etc.).

        Returns:
        - bool: True if the image file exists and matches the specified type, False otherwise.
        - str: The name of the image file if it exists and matches the specified type, otherwise, it returns the last checked file.
        """
        folder_path = os.path.join(IMAGES, location, name)

        print(folder_path)

        if os.path.exists(folder_path):

            for file in os.listdir(folder_path):
                fileName = file.split('.')[0]
                if fileName == type:
                    return True, file
        return False, file

    