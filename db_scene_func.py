import copy
from db_mask_functions import applyMask
from .db_handler import DBHandler

db = DBHandler()

def sceneGetCharScene(charId: str):
        """Finds the current scene of the char and returns it scene data with visible areas

        Args:
            charId (str): Id of the char

        Returns:
            dict: maskedScene. The visible part of the game to user.
        """
        
        current_scene = db.session_info["locations"][charId]["currentScene"]
        scene_name = current_scene["name"]
        layer = current_scene["layer"]
        
        currentSceneName = scene_name + "-" + layer
              
        masked_scene = {
            'discovered': db.scenes[scene_name]['discovered'], 
            'width'     : db.scenes[scene_name]['width'     ], 
            'height'    : db.scenes[scene_name]['height'    ], 
            'grid_size' : db.scenes[scene_name]['grid_size' ],
            "layer"     : copy.deepcopy(db.scenes[scene_name]["layers"][layer])
        }
        
        for location_key in db.scenes[scene_name]["layers"][layer]["locations"].keys():
            masked_scene["layer"]["locations"][location_key] = applyMask(db.scenes[scene_name]["layers"][layer]["locations"][location_key],
                                                                        db.activeAreas[currentSceneName]["visibleAreas"])

        masked_scene["visibleAreas"] = db.activeAreas[currentSceneName]["visibleAreas"]
        
        return masked_scene