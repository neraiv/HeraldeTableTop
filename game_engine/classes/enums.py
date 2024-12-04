from enum import Enum

# Enum Definitions
class TypeClass(Enum):
    ALL = None,
    WIZARD = 1,
    CLERIC = 2,
    ROGUE = 3,
    DRUID = 4,
    PALADIN = 5,
    RANGER = 6,
    WARLOCK = 7,
    SORCERER = 8,
    BARBARIAN = 9,

class TypeChar(Enum):
    ALLY = 1,
    ENEMY = 2,
    NPC = 3,
    CONJURED = 4

class TypeItem(Enum):
    WEAPON = 1,
    CONSUMABLE = 2,
    NECKLACE = 3,
    EARINGS = 4,
    RING = 5,
    CLOAK = 7,
    GLOVES = 8,
    ARMS = 14,
    CHEST = 9,
    LEGS = 10,
    BOOTS = 6,
    HELM = 13 

class TypeConsumable(Enum):
    CASTABLE = 1,
    USABLE = 2,
    REFILLABLE = 3

class TypeConsumableProperties(Enum):
    CONSUMED = 1,
    REFILLABLE = 2

class TypeRoll(Enum):
    NONE = 0,
    SAVING_THROW = 1,
    PERSPECTION_SAVING_THROW = 2,
    ABILITY_THROW = 3,

class TypeObject(Enum):
    CHARACTER = 1,
    OBSTACLE = 4,
    WALL = 5

class TypeSpellPattern(Enum):
    CIRCULAR = 1,
    BOX = 2,
    CONE_UPWARD = 3,
    CONE_DOWNWARD = 4,
    TARGET = 5

class TypeCast(Enum):
    ON_LOCATION = 1,
    FROM_CASTER = 2,
    AROUND_CASTER = 3

class TypeTarget(Enum):
    SELF = 1,
    ALLY = 2,
    ENEMY = 3,
    ANY = 4,
    CLOSEST_ENEMY = 5,
    CLOSEST_ANY = 6,
    ATTACKER = 7,
    GROUND_NO_OVERLAP = 8,
    GROUND = 9

class TypeDuration(Enum):
    TURN_BASED = 1,
    AFTER_SHORT_REST = 2,
    AFTER_LONG_REST = 3, 
    INSTANT = 4,
    ALWAYS = 5

class TypeEffect(Enum):
    DICE_CHANGE = 1,
    ATTACK_DAMAGE_BONUS = 2,
    ATTACK_RADIUS_BONUS = 3, 
    ATTACK_RANGE = 4,        
    ATTACK_RANGE_BONUS = 5,  
    PATTERN_CHANGE = 6,      
    HEAL = 7,
    DEFENSE = 8,
    VISION_RANGE_BONUS = 9,   
    TAKE_DAMAGE = 10,
    MOVE_SPEED_REDUCTION = 11

class TypeAction(Enum):
    BONUS = 1,
    MAIN = 2,
    DRUID_SOURCE = 3,
    WARLOCK_SPELL_SLOT = 4

class TypeCharActions(Enum):
    IDLE = 1,
    MOVING = 2,
    BLOCKING = 3,
    BLOCKED = 4,
    HEALING = 6,
    HEALED = 7,
    CASTING = 8,
    CASTED = 9,
    ATTACKING = 10,  
    DYING = 11,      
    DIED = 12,
    PREPARE = 13,    
    USE = 14,        
    ALWAYS = 15,     
    ATTACKED = 16,
    TURN_END = 17,
    TURN_START = 18


class TypeEncounterStat(Enum):
    PERSPECTION = 1,
    NATURE = 2,

class TypeStat(Enum):
    NONE = 0,
    STR = 1,
    DEX = 2,
    CON = 3,
    INT = 4,
    WIS = 5,
    CHA = 6,

class TypeDamage(Enum):
    NONE = 0,
    HEALING = 99,
    PSYCHIC = 1,
    FIRE = 2,
    FROST = 3,
    LIGHTNING = 4,
    NECROTIC = 5,
    FORCE = 6,
    ACID = 7,
    POISON = 8,
    RADIANT = 9,
    SLASHING = 10,
    PIERCING = 11,
    BLUDGEONING = 12,
    PURE = 13