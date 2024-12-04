from .enums import *

class Value():
    def __init__(self, value: str, type = TypeDamage.NONE):
        self.value = value
        self.type = type

class Duration():
    def __init__(self, type = TypeDuration.INSTANT, value = 1):
        self.type = type
        self.value = value
        