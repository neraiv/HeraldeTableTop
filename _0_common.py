import numpy as np


def checkDistance(self, target1, target2, distance):
    
    distance_x = target1["x"] - target2["x"]
    distance_y = target1["y"] - target2["y"]
        
    return np.sqrt(distance_x**2 + distance_y**2) < distance