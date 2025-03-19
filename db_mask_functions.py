
from enum import Enum
import numpy as np

DEBUG_PRINT = True

ERROR_GENERAL = {'error': "Something went wrong in database!"}

    
def calcAcceptedAreas(locations: dict, chars: dict) -> dict:
    visableAreas = []
    
    char_locations = locations["chars"]
    
    for id in char_locations.keys():
        pos: dict = char_locations.get(id, None)
        loc_x  = pos.get("x")
        loc_y = pos.get("y")

        charInfo: dict = chars.get(id, None)
        
        if not charInfo:
            raise ValueError(f"Character info not found for id: {id}")
        
        char: dict = charInfo.get("char", None)
        
        if not char:
            raise ValueError(f"Character not found in char info {charInfo}")
        
        vision: str = char.get("vision", None)
        
        if not vision:
            raise ValueError(f"Vision not found in char info {char}")
        
        visableAreas.append({
            "x": loc_x,
            "y": loc_y,
            "shape": "circle",
            "radius": vision
        })
                
    object_locations = locations["objects"]
    
    for object in object_locations.values():
        
        vision = object.get("vision", None)
        
        if vision:
            x = object.get("x")
            y = object.get("y")
            
            if x is None or y is None:
                raise ValueError(f"Invalid object values: {object}")
            
            visableAreas.append({
                "x": x,
                "y": y,
                "shape": "circle",
                "radius": vision
            })
    
    return visableAreas


def applyMask(locations: dict, acceptedAreas: list) -> dict:
    """
    Applies fog to given locations
    
    locations dict items must contain x and y values.
    """ 
    visable_items = {}
    
    for area in acceptedAreas:
        x = area.get("x")
        y = area.get("y")
        shape = area.get("shape")
        
        if shape == "circle":
            radius = area.get("radius")
            
            if x is None or y is None or radius is None:
                raise ValueError(f"Invalid area values: {area}")
            
            for key in locations:
                item = locations[key]
                loc_x = item.get("x")
                loc_y = item.get("y")
                
                if loc_x is None or loc_y is None:
                    raise ValueError(f"Item {key} missing x or y coordinates.")
                
                distance = np.sqrt((loc_x - x)**2 + (loc_y - y)**2)
                
                if distance <= radius:
                    visable_items[key] = item
    
    return visable_items    
            
            

                        