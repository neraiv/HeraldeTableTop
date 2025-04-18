from enum import Enum, auto
from dataclasses import dataclass
from typing import List, Dict, Optional, Union

# Enums for all the Object.freeze types
class ClassTypes(Enum):
    ALL = 0
    WIZARD = 1
    CLERIC = 2
    ROGUE = 3
    DRUID = 4
    PALADIN = 5
    RANGER = 6
    WARLOCK = 7
    SORCERER = 8
    BARBARIAN = 9

class CharacterTypes(Enum):
    PLAYER = 1
    NPC = 2
    CONJURED = 3

class ItemTypes(Enum):
    WEAPON = 1
    CONSUMABLE = 2
    NECKLACE = 3
    EARINGS = 4
    RING = 5
    CLOAK = 7
    GLOVES = 8
    ARMS = 14
    CHEST = 9
    LEGS = 10
    BOOTS = 6
    HELM = 13

class ConsumableTypes(Enum):
    CASTABLE = 1
    USABLE = 2
    REFILLABLE = 3

class ConsumableProperties(Enum):
    CONSUMED = 1
    REFILLABLE = 2

class RollTypes(Enum):
    SAVING_THROW = 1
    PERSPECTION_SAVING_THROW = 2
    ABILITY_THROW = 3

class ObjectTypes(Enum):
    CHARACTER = 1
    OBSTACLE = 2
    WALL = 3

class SpellTypes(Enum):
    WEAPON = 1
    CANTRIP = 2
    SPELL = 3

class SpellPatterns(Enum):
    CIRCULAR = 1
    BOX = 2
    CONE_UPWARD = 3
    CONE_DOWNWARD = 4
    TARGET = 5

class CastTypes(Enum):
    ON_LOCATION = 1
    FROM_CASTER = 2
    AROUND_CASTER = 3

class TargetTypes(Enum):
    SELF = 1
    ALLY = 2
    ENEMY = 3
    ANY = 4

class TargetOrderList(Enum):
    CLOSEST_ALLY = 1
    CLOSEST_LOWHP_ALLY = 2
    CLOSEST_LOWHP_ENEMY = 3
    CLOSEST_ENEMY = 5
    CLOSEST_ANY = 6
    LAST_ATTACKER = 7
    LAST_TARGET = 10
    CLOSEST_OBJECT = 11

class DurationTypes(Enum):
    TURN = 1
    NEXT_SHORT_REST = 2
    NEXT_LONG_REST = 3
    INSTANT = 4
    NEXT_NTH_CAST = 5

class EffectTypes(Enum):
    DICE_CHANGE = 1
    ATTACK_DAMAGE_BONUS = 2
    ATTACK_AREA_BONUS = 3
    ATTACK_RANGE_BONUS = 5
    PATTERN_CHANGE = 6
    HEAL = 7
    DEFENSE = 8
    VISION_RANGE_BONUS = 9
    TAKE_DAMAGE = 10
    HASTE = 11

class EffectSources(Enum):
    ITEM = 1
    CHARACTER = 2
    NPC = 3
    ENVIRONMENT = 4
    OBJECT = 5

class ActionTypes(Enum):
    BONUS = 1
    MAIN = 2
    DRUID_SOURCE = 3
    WARLOCK_SPELL_SLOT = 4

class CharacterActions(Enum):
    IDLE = 1
    MOVING = 2
    BLOCKING = 3
    BLOCKED = 4
    HEALING = 6
    HEALED = 7
    CASTING = 8
    CASTED = 9
    ATTACKING = 10
    DYING = 11
    DIED = 12
    PREPARE = 13
    USE = 14
    ALWAYS = 15
    ATTACKED = 16
    TURN_END = 17
    TURN_START = 18

class WeaponTypes(Enum):
    CLUB = 1
    DAGGER = 2
    GREATCLUB = 3
    HANDAXE = 4
    JAVELIN = 5
    MACE = 6
    QUARTERSTAFF = 7
    SICKLE = 8
    SPEAR = 9
    LIGHTCROSSBOW = 10
    DART = 11
    SHORTBOW = 12
    BATTLEAXE = 13
    FLAIL = 14
    GLAIVE = 15
    GREATAXE = 16
    GREATSWORD = 17
    HALBERD = 18
    LANCE = 19
    LONGSWORD = 20
    MAUL = 21
    MORNINGSTAR = 22
    PIKE = 23
    RAPIER = 24
    SCIMITAR = 25
    SHORTSWORD = 26
    TRIDENT = 27
    WARHAMMER = 28
    WHIP = 29
    HEAVYCROSSBOW = 30
    LONGBOW = 31

class WeaponProperties(Enum):
    MAIN_HAND = 10
    OFF_HAND = 20
    TWO_HANDED = 30
    LIGHT = 1
    HEAVY = 2
    FINESSE = 3
    REACH = 4
    THROWN = 6

class EncounterStatTypes(Enum):
    PERSPECTION = 1
    NATURE = 2

class StatTypes(Enum):
    STR = 1
    DEX = 2
    CON = 3
    INT = 4
    WIS = 5
    CHA = 6

class DamageTypes(Enum):
    NONE = 0
    HEALING = 99
    PSYCHIC = 1
    FIRE = 2
    FROST = 3
    LIGHTNING = 4
    NECROTIC = 5
    FORCE = 6
    ACID = 7
    POISON = 8
    RADIANT = 9
    SLASHING = 10
    PIERCING = 11
    BLUDGEONING = 12
    PURE = 13

class SummonTypes(Enum):
    CONJURED = 1
    SUMMONED = 2
    ANIMATED = 3

class SummonLocations(Enum):
    AROUND_CASTER = 1
    ON_SPELL_END = 2
    ON_FIRST_HIT = 3

class ExtraEffectsList(Enum):
    CAST = "cast"
    BUFF_DEBUFF = "buff-debuff"
    SUMMON = "summon"
    AURA = "aura"

class DiceTypes(Enum):
    D6 = 6
    D20 = 20
    D12 = 12
    D10 = 10
    D8 = 8
    D4 = 4
    D3 = 3
    D100 = 100

class AniShapes(Enum):
    SQUARE = 1
    CIRCLE = 2
    TRIANGLE = 3

class AniDirections(Enum):
    THROUGH = 1
    AROUND = 2

# Data classes for the other classes
@dataclass
class Duration:
    type: DurationTypes = DurationTypes.INSTANT
    value: int = 1

@dataclass
class Inventory:
    items: List[Dict] = None
    currency: Dict = None
    
    def __post_init__(self):
        if self.items is None:
            self.items = []
        if self.currency is None:
            self.currency = {
                "gold": 0,
                "silver": 0,
                "bronze": 0
            }
    
    def clear(self):
        self.items = []
        self.currency = {
            "gold": 0,
            "silver": 0,
            "bronze": 0
        }
    
    def add_item(self, item, quantity=1):
        existing_item = next((ex_item for ex_item in self.items if ex_item["name"] == item.name), None)
        if existing_item:
            existing_item["quantity"] += quantity
        else:
            self.items.append({"name": item.name, "type": item.type, "quantity": quantity})
        print(f"{item.name} added. Quantity: {quantity}")
    
    def remove_item(self, item_name, quantity=1):
        item_index = next((i for i, item in enumerate(self.items) if item["name"] == item_name), None)
        if item_index is None:
            print(f"Item {item_name} not found in inventory.")
            return
        
        item = self.items[item_index]
        if item["quantity"] <= quantity:
            self.items.pop(item_index)
            print(f"{item_name} removed from inventory.")
        else:
            item["quantity"] -= quantity
            print(f"{quantity} {item_name} removed. Remaining quantity: {item['quantity']}")
    
    def get_quantity(self, item_name):
        item = next((item for item in self.items if item["name"] == item_name), None)
        return item["quantity"] if item else 0
    
    def add_currency(self, gold=0, silver=0, bronze=0):
        self.currency["gold"] += gold
        self.currency["silver"] += silver
        self.currency["bronze"] += bronze
        print(f"Added {gold} Gold, {silver} Silver, {bronze} Bronze.")
    
    def convert_currency_to_gold_base(self):
        self.currency["silver"] += self.currency["bronze"] // 150
        self.currency["bronze"] = self.currency["bronze"] % 150
        
        self.currency["gold"] += self.currency["silver"] // 1342
        self.currency["silver"] = self.currency["silver"] % 1342
        
        print(f"Converted to {self.currency['gold']} Gold, {self.currency['silver']} Silver, {self.currency['bronze']} Bronze.")
    
    def convert_currency(self, gold=0, silver=0, bronze=0):
        total_bronze = (gold * 10000) + (silver * 100) + bronze
        converted_gold = total_bronze // 10000
        total_bronze %= 10000
        
        converted_silver = total_bronze // 100
        remaining_bronze = total_bronze % 100
        
        print(f"{gold} Gold, {silver} Silver, {bronze} Bronze equals to {converted_gold} Gold, {converted_silver} Silver, and {remaining_bronze} Bronze.")
        return {"gold": converted_gold, "silver": converted_silver, "bronze": remaining_bronze}
    
    def reverse_convert_currency(self, gold=0, silver=0, bronze=0):
        total_bronze = (gold * 10000) + (silver * 100) + bronze
        print(f"{gold} Gold, {silver} Silver, {bronze} Bronze equals to {total_bronze} Bronze.")
        return total_bronze
    
    def remove_currency(self, gold=0, silver=0, bronze=0):
        if (self.currency["gold"] < gold or 
            self.currency["silver"] < silver or 
            self.currency["bronze"] < bronze):
            print("Not enough currency to remove.")
            return
        
        self.currency["gold"] -= gold
        self.currency["silver"] -= silver
        self.currency["bronze"] -= bronze
        print(f"Removed {gold} Gold, {silver} Silver, {bronze} Bronze.")

@dataclass
class Character:
    id: str
    controlled_by: str = ''
    level: int = 0
    name: str = ""
    classess: List[ClassTypes] = None
    race: str = ""
    hp: int = 100
    vision: int = 240
    flag: str = "ally"
    stats: Dict = None
    action: CharacterActions = CharacterActions.IDLE
    extra_effects: List = None
    spell_slots: Dict = None
    available_spells: Dict = None
    learned_spells: Dict = None
    inventory: Inventory = None
    controlling: List = None
    
    def __post_init__(self):
        if self.classess is None:
            self.classess = []
        if self.stats is None:
            self.stats = {
                "dex": 12,
                "con": 12,
                "int": 8,
                "wis": 12,
                "cha": 12,
                "str": 12,
            }
        if self.extra_effects is None:
            self.extra_effects = []
        if self.spell_slots is None:
            self.spell_slots = {
                '1': [5, 3],
                '2': [4, 3],
                '3': [2, 2],
                '4': [2, 2]
            }
        if self.available_spells is None:
            self.available_spells = {
                1: ['Fireball', 'Ice Cone', 'Heralde', 'Pillar of Light'],
                2: ['Lightning Ray', 'Fire Hands', 'Conjure Mountainless Dwarf']
            }
        if self.learned_spells is None:
            self.learned_spells = {
                1: ['Fireball', 'Ice Cone', 'Heralde', 'Pillar of Light'],
                2: ['Lightning Ray', 'Fire Hands', 'Conjure Mountainless Dwarf']
            }
        if self.inventory is None:
            self.inventory = Inventory()
        if self.controlling is None:
            self.controlling = []
    
    def clone(self):
        return Character(
            id=self.id,
            controlled_by=self.controlled_by,
            level=self.level,
            name=self.name,
            classess=self.classess.copy(),
            race=self.race,
            hp=self.hp,
            vision=self.vision,
            flag=self.flag,
            stats=self.stats.copy(),
            action=self.action,
            extra_effects=self.extra_effects.copy(),
            spell_slots=self.spell_slots.copy(),
            available_spells=self.available_spells.copy(),
            learned_spells=self.learned_spells.copy(),
            inventory=Inventory(self.inventory.items.copy(), self.inventory.currency.copy()),
            controlling=self.controlling.copy()
        )
    
    def get_extra_effects(self, action):
        return [effect for effect in self.extra_effects 
                if action in effect.trigger_actions or CharacterActions.ALWAYS in effect.trigger_actions]
    
    def calculate_resistence(self, damage_type):
        resistence = 0
        for effect in self.extra_effects:
            if effect.effect_type == EffectTypes.DEFENSE and effect.value.type == damage_type:
                resistence += effect.value.value
        return resistence
    
    def take_damage(self, damage):
        resistence = self.calculate_resistence(damage.type)
        damage_value = damage.value - resistence
        if damage_value < 0:
            damage_value = 0
        self.hp -= damage_value
        if self.hp <= 0:
            self.action = CharacterActions.DYING
            self.hp = 0
        else:
            self.action = CharacterActions.ATTACKED

@dataclass
class SpellPattern:
    pattern: SpellPatterns
    range: int
    area: int
    cast_type: CastTypes
    can_target: List[TargetTypes]

@dataclass
class BuffDebuff:
    effect_type: EffectTypes
    value: Union[int, str, 'Damage']
    duration: Optional[Duration] = None
    trigger_actions: List[CharacterActions] = None
    source_type: Optional[EffectSources] = None
    source: Optional[str] = None
    
    def __post_init__(self):
        if self.trigger_actions is None:
            self.trigger_actions = [CharacterActions.TURN_START]

@dataclass
class Aura:
    area: int
    effect_type: EffectTypes
    value: Union[int, str, 'Damage']
    duration: Duration = None
    trigger_actions: List[CharacterActions] = None
    target_list: List[TargetTypes] = None
    can_spread: bool = False
    
    def __post_init__(self):
        if self.duration is None:
            self.duration = Duration()
        if self.trigger_actions is None:
            self.trigger_actions = []
        if self.target_list is None:
            self.target_list = [TargetTypes.ALLY]

@dataclass
class Summon:
    id: str
    cast_duration: Duration
    summon_duration: Duration
    quantity: int = 1
    summon_location: SummonLocations = SummonLocations.AROUND_CASTER
    trigger_actions: List[CharacterActions] = None
    
    def __post_init__(self):
        if self.trigger_actions is None:
            self.trigger_actions = [CharacterActions.ALWAYS]

@dataclass
class Cast:
    spell_name: str
    mana: Union[int, str]
    target_list_in_order: List[TargetOrderList]
    cast_times: int = 1
    trigger_actions: List[CharacterActions] = None
    
    def __post_init__(self):
        if self.trigger_actions is None:
            self.trigger_actions = [CharacterActions.ALWAYS]

@dataclass
class Effect:
    name: str
    type: ExtraEffectsList
    description: str
    effect: Union[Cast, BuffDebuff, Aura, Summon]

@dataclass
class StatMultiplier:
    type: StatTypes
    multiplier: Union[int, float]

@dataclass
class Damage:
    type: DamageTypes
    value: Union[int, str]

@dataclass
class AniSprite:
    src: str
    sequence_size: int
    sequence_count: int
    src_row_cnt: int
    src_col_cnt: int

@dataclass
class AniExplosion:
    colors: List[str] = None
    particle_count: int = 30
    particle_shapes: List[AniShapes] = None
    explosion_direction: AniDirections = AniDirections.AROUND
    
    def __post_init__(self):
        if self.colors is None:
            self.colors = ["rgb(190, 71, 16)", "rgb(238, 153, 25)"]
        if self.particle_shapes is None:
            self.particle_shapes = [AniShapes.CIRCLE]

@dataclass
class AniArea:
    colors: List[str] = None
    shape: AniShapes = AniShapes.CIRCLE
    sprite: Optional[AniSprite] = None
    
    def __post_init__(self):
        if self.colors is None:
            self.colors = ["rgb(190, 71, 16)", "rgb(238, 153, 25)"]

@dataclass
class AniDnd:
    area: Optional[AniArea] = None
    explosion: Optional[AniExplosion] = None

@dataclass
class Roll:
    dice_type: DiceTypes
    roll_type: RollTypes
    target: int

@dataclass
class Spell:
    name: str
    type: SpellTypes
    classess: List[ClassTypes]
    level: int = 1
    modifiers: List[StatMultiplier] = None
    damage: List[Damage] = None
    description: str = ""
    cast_duration: Duration = None
    action_cost: List[ActionTypes] = None
    spend_mana_effects: Dict = None
    spell_pattern: SpellPattern = None
    caster_rolls: List[Roll] = None
    target_rolls: List[Roll] = None
    animation: Optional[AniDnd] = None
    
    def __post_init__(self):
        if self.modifiers is None:
            self.modifiers = []
        if self.damage is None:
            self.damage = []
        if self.cast_duration is None:
            self.cast_duration = Duration(type=DurationTypes.INSTANT)
        if self.action_cost is None:
            self.action_cost = []
        if self.spend_mana_effects is None:
            self.spend_mana_effects = {}
        if self.caster_rolls is None:
            self.caster_rolls = []
        if self.target_rolls is None:
            self.target_rolls = []
    
    def get_extra_effects(self, used_mana):
        available_keys = [key for key in self.spend_mana_effects.keys() if key <= used_mana]
        available_keys.sort()
        
        all_effects = {
            "caster": [],
            "target": []
        }
        
        for key in available_keys:
            effects = self.spend_mana_effects[key]
            if "caster" in effects:
                all_effects["caster"].extend(effects["caster"])
            if "target" in effects:
                all_effects["target"].extend(effects["target"])
        
        return all_effects

@dataclass
class Item:
    name: str
    type: ItemTypes
    sub_type: Optional[str] = None
    additional_effects: Optional[List[Effect]] = None
    spells: Optional[List[Spell]] = None
    lore: Optional[str] = None
