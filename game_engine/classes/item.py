from .enums import *

class Item():
    def __init__(self):
        self.type = None
        self.name = ""
        self.description = ""
        self.weight = 0
        self.value = 0
        self.properties = {}