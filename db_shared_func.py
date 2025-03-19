from datetime import datetime, timezone

from db_types import TypeQuestStatus
from db_handler import DBHandler


db = DBHandler()

def get_currentTime() -> str:
    """
    Returns the current time in UTC format.

    Parameters:
    None

    Returns:
    str: The current time in the format "YYYY-MM-DD HH:MM:SS Z".
    """
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S %Z")


def checkDistance(target1: dict, target2: dict, distance: float) -> bool:
    """
    Checks if the distance between two points is less than a given distance.

    Parameters:
    target1 (dict): A dictionary containing 'x' and 'y' coordinates of the first point.
    target2 (dict): A dictionary containing 'x' and 'y' coordinates of the second point.
    distance (float): The maximum distance between the two points.

    Returns:
    bool: True if the distance between the two points is less than the given distance, False otherwise.
    """
    distance_x = target1["x"] - target2["x"]
    distance_y = target1["y"] - target2["y"]

    return np.sqrt(distance_x**2 + distance_y**2) < distance


def checkReqirement(rquirement, charId):
    type = rquirement["type"]
    if type == "scene":
        return db.session_info["locations"][charId]["currentScene"]["name"] == rquirement["target"]
    elif "quest" in type:
        questFullId = rquirement["target"]
        questGiver, questId = questFullId.split("-")
        
        if "completed" in type:
            return db.quests[questGiver]["quests"][questId]["status"] == TypeQuestStatus.COMPLETED.value
        elif "ok" in type:
            return db.quests[questGiver]["quests"][questId]["status"] == TypeQuestStatus.OK.value
        else:
            return False
    else:
        return False