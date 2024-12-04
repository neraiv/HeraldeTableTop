from  .inventory import *
import json

class Wearings():
    def __init__(self):
        self.head: Item = None
        self.neck: Item = None
        self.chest: Item = None
        self.arms: Item = None
        self.legs: Item = None
        self.feet: Item = None
        self.ring1: Item = None
        self.ring2: Item = None
        self.amulet: Item = None
        self.backpack: Item = None
        self.shield: Item = None
        self.weapons: Item = []
        self.gear: Item = []
        self.tools: Item = []
        self.mount: Item = None
        self.horse: Item = None
        self.pet: Item = None
        
class Character():
    def __init__(self):
        self.type = None
        self.name = ""
        self.description = ""
        self.level = 1
        self.class_type = TypeClass.ALL
        self.char_type = TypeChar.ALLY
        self.hit_points = 10
        self.max_hit_points = 10
        self.speed = 5
        self.strength = 8
        self.dexterity = 8
        self.constitution = 8
        self.intelligence = 8
        self.wisdom = 8
        self.charisma = 8
        self.ac = 10
        self.initiative = 0
        self.proficiency_bonus = 2
        self.inventory = Inventory()
        self.skills = {}
        self.spell_slots = {}
        self.wearings = Wearings()
