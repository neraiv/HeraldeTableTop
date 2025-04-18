

import numpy as np


class SocketUpdate(object):
    """
    This class is used to update the socket status.
    """

    def __init__(self, status: str, message: str = None):
        self.status = status
        self.message = message

    def __repr__(self):
        return f"SocketUpdate(status={self.status}, message={self.message})"
    
class SocketReply(object):
    """
    This class is used to reply to the socket status.
    """

    def __init__(self, status: bool, message: str = None, data: dict = None):
        self.status = status
        self.message = message
        self.data = data
        
    def toDict(self):
        return {
            "status": self.status,
            "message": self.message,
            "data": self.data
        }

    def __repr__(self):
        return f"SocketReply(status={self.status}, message={self.message}, data={self.data})"
    
def checkDistance(self, target1, target2, distance):
    
    distance_x = target1["x"] - target2["x"]
    distance_y = target1["y"] - target2["y"]
        
    return np.sqrt(distance_x**2 + distance_y**2) < distance