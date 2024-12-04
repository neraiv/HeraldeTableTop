from .enums import *
from .shared import *

class Aura():
    def __init__(self, name, duration=Duration(TypeDuration.INSTANT), effects=[], description = ""):
        self.name = name
        self.duration = duration
        self.effects = effects
        self.description = description

class BuffDebuff():
    def __init__(self, name, effect: TypeEffect, value: Value, description = "", duration=Duration(TypeDuration.ALWAYS)):
        self.name = name
        self.duration = duration
        self.effect = effect
        self.value = value
        self.description = description

class Cast():
    def __init__(self, name, targets: list[TypeTarget], duration=Duration(TypeDuration.INSTANT), effects=[], description = ""):
        self.name = name
        self.targets = targets
        self.duration = duration
        self.effects = effects
        self.description = description