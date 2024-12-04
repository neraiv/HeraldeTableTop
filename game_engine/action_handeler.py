from classes import *
from import_db_files import *
from db_handler import wait_until_file_is_closed

def handle_action(data: dict):
    charname = data.get('charname')
    action = data.get('action')

    wait_until_file_is_closed(CHARS)
    with open(json, "r") as f:
        chars_data = json.load(f)

    char: Character = JSONHandler.from_json(Character, chars_data[charname])
    
    if action == TypeCharActions.MOVING.name:
        pass

    
with open(CHARS, "r") as f:
    chars_data = json.load(f)

char = Character()

new_inventory = Inventory()
new_inventory.add_currency(15, 2, 99)

golliath = Item()
golliath.name = "Big Fisting Golliath"
golliath.type = TypeItem.ARMS
golliath.properties = [TypeConsumableProperties.REFILLABLE, TypeDamage.BLUDGEONING]

new_inventory.add_item(golliath, 20)

char.inventory.move_to_inventory(new_inventory)
char.inventory = new_inventory

JSONHandler.save_to_json_file(char, "test.json")