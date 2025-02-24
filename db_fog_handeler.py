
from enum import Enum

DEBUG_PRINT = True

ERROR_GENERAL = {'error': "Something went wrong in database!"}

class FogType(Enum):
    NONE = 0,
    FACTION_BASED = 1,
    PLAYER_BASED = 2,

def get_fog_type(string) -> FogType:
    if string == FogType.FACTION_BASED.name:
        return FogType.FACTION_BASED
    elif string == FogType.PLAYER_BASED.name:
        return FogType.PLAYER_BASED
    else:
        return FogType.NONE
    
def calc_visible_areas(locations: dict, fog_type: FogType, chars: dict) -> dict:
    visableAreas = []
    
    char_locations = locations["chars"]
    
    for id in char_locations.keys():
        pos: dict = char_locations.get(id, None)
        loc_x  = pos.get("x")
        loc_y = pos.get("y")

        if fog_type == FogType.FACTION_BASED.name:
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
    
    for object in object_locations:
        
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


def apply_mask(locations: dict, visableAreas: list) -> dict:
    """
    Applies fog to given locations
    
    locations dict items must contain x and y values.
    """ 
    visable_items = {}
    
    for area in visableAreas:
        x = area.get("x")
        y = area.get("y")
        radius = area.get("radius")
        
        if x is None or y is None or radius is None:
            raise ValueError(f"Invalid area values: {area}")
        
        for key in locations:
            item = locations[key]
            loc_x = item.get("x")
            loc_y = item.get("y")
            
            if loc_x is None or loc_y is None:
                raise ValueError(f"Item {key} missing x or y coordinates.")
            
            dx = loc_x - x
            dy = loc_y - y
            distance_sq = dx ** 2 + dy ** 2
            
            if distance_sq <= radius ** 2:
                visable_items[key] = item
    
    return visable_items    
            
            

                        