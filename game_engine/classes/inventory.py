from .enums import *
from .shared import *
from .effect import *
from .item import *

class Inventory():
    class Error(Enum):
        NO_SPACE = 1, 
        WRONG_ITEM_TYPE = 2,
        NOT_ENOUGH_CURRENCY = 3

    class Effects:
        OVERWEIGHT = BuffDebuff("Overweight", TypeEffect.MOVE_SPEED_REDUCTION, Value("50"), "You are carrying too heavy items.", Duration(TypeDuration.ALWAYS))

    def __init__(self):
        self.items : list[Item] = []
        self.max_slots = 30

        self.weight = 0
        self.max_weight = 0
        self.self_weight = 1

        self.effects = []

        self.currency = {
            "gold" : 0,
            "silver" : 0,
            "copper" : 0
        }
    
    def add_item(self, item = Item, quantity=1):
        if item.type in list(TypeItem):
            self.items.extend([item]*quantity)
            if self.weight + (item.weight * quantity) <= self.max_weight:
                self.effects.append(Inventory.Effects.OVERWEIGHT)

    def remove_item(self, item = Item, quantity=1):
        if item.type in list(TypeItem):
            if quantity <= len(self.items):
                self.items = [i for i in self.items if not (i.type == item.type and i.name == item.name)]
                self.weight -= (item.weight * quantity)
                if self.effects.count(Inventory.Effects.OVERWEIGHT) > 0 and self.weight < self.max_weight:
                    self.effects.remove(Inventory.Effects.OVERWEIGHT)

    def add_currency(self, gold = 0, silver = 0, copper = 0):
        self.currency["gold"] += gold
        self.currency["silver"] += silver
        self.currency["copper"] += copper

    def remove_currency(self, gold = 0, silver = 0, copper = 0):
        
        if self.currency["gold"] >= gold and self.currency["silver"] >= silver and self.currency["copper"] >= copper:
            self.currency["gold"] -= gold
            self.currency["silver"] -= silver
            self.currency["copper"] -= copper
        else:
            raise Inventory.Error.NOT_ENOUGH_CURRENCY
        
    def move_to_inventory(self, inventory: 'Inventory'):
        for item in self.items:
            inventory.add_item(item)
        self.items = []
        self.weight = 0