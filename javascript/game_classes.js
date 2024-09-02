class Character {
    constructor(id ,{
        maxStatPoint = gameSettings.MAX_STAT_POINT,
        minStatPoint = gameSettings.MIN_STAT_POINT,
        maxCharacterLevel = gameSettings.MAX_CHARACTER_LVL,
        minCharacterLevel = gameSettings.MIN_CHARACTER_LVL,
        maxSubClassCount = gameSettings.MAX_SUB_CLASS_COUNT,
        minSubClassCount = gameSettings.MIN_SUB_CLASS_COUNT,
        level = gameSettings.MIN_CHARACTER_LVL,
        name = "",
        class_ = "",
        subclass = "",
        race = "",
        feats = [],
        dex = gameSettings.MIN_STAT_POINT,
        con = gameSettings.MIN_STAT_POINT,
        int = gameSettings.MIN_STAT_POINT,
        wis = gameSettings.MIN_STAT_POINT,
        cha = gameSettings.MIN_STAT_POINT,
        str = gameSettings.MIN_STAT_POINT,
        availableSpellLevels = {
            '1': 2,
            '2': 2
        },
        learnedSpells = ['Animal Friendship', 'Acid Arrow'],
        inventory = new Inventory()
    } = {}) {
        this.ID = id;
        this.MAX_STAT_POINT = maxStatPoint;
        this.MIN_STAT_POINT = minStatPoint;
        this.MAX_CHARACTER_LVL = maxCharacterLevel;
        this.MIN_CHARACTER_LVL = minCharacterLevel;
        this.MAX_SUB_CLASS_COUNT = maxSubClassCount;
        this.MIN_SUB_CLASS_COUNT = minSubClassCount;
        this.LEVEL = level;
        this.NAME = name;
        this.CLASS_ = class_;
        this.SUBCLASS = subclass;
        this.RACE = race;
        this.FEATS = feats;
        this.DEX = dex;
        this.CON = con;
        this.INT = int;
        this.WIS = wis;
        this.CHA = cha;
        this.STR = str;
        this.AVAILABLE_SPELL_LEVELS = availableSpellLevels;
        this.LEARNED_SPELLS= learnedSpells;
        this.CURRENT_MANA = {};
        this.BUFFS = {};
        this.DEBUFFS = {};
        this.INVENTORY = inventory;
    }

    // Example method to check if a level is valid
    isValidLevel(level) {
        return level >= this.MIN_CHARACTER_LVL && level <= this.MAX_CHARACTER_LVL;
    }

    // Example method to validate stat points
    isValidStatPoint(statPoint) {
        return statPoint >= this.MIN_STAT_POINT && statPoint <= this.MAX_STAT_POINT;
    }
}

class Inventory {
    constructor() {
        this.items = []; // Initialize an empty array to store inventory items
    }

    // Add an item to the inventory
    addItem(itemName, quantity = 1) {
        // Check if the item already exists
        const existingItem = this.items.find(item => item.name === itemName);
        if (existingItem) {
            existingItem.quantity += quantity; // Increase quantity if item exists
        } else {
            this.items.push({ name: itemName, quantity }); // Add new item to the inventory
        }
        console.log(`${itemName} added. Quantity: ${quantity}`);
    }

    // Remove an item from the inventory
    removeItem(itemName, quantity = 1) {
        const itemIndex = this.items.findIndex(item => item.name === itemName);
        if (itemIndex === -1) {
            console.log(`Item ${itemName} not found in inventory.`);
            return;
        }

        const item = this.items[itemIndex];
        if (item.quantity <= quantity) {
            this.items.splice(itemIndex, 1); // Remove item if quantity is less than or equal to the quantity to be removed
            console.log(`${itemName} removed from inventory.`);
        } else {
            item.quantity -= quantity; // Decrease quantity if more than one item
            console.log(`${quantity} ${itemName} removed. Remaining quantity: ${item.quantity}`);
        }
    }

    // List all items in the inventory
    listItems() {
        if (this.items.length === 0) {
            console.log("Inventory is empty.");
            return;
        }

        console.log("Inventory:");
        this.items.forEach(item => {
            console.log(`- ${item.name}: ${item.quantity}`);
        });
    }

    // Get the quantity of a specific item
    getQuantity(itemName) {
        const item = this.items.find(item => item.name === itemName);
        return item ? item.quantity : 0;
    }
}

class Environment{
    constructor({
        day = 0,
        time = 8.0,
    } = {}) {
        this.DAY = day;
        this.TIME = time;
    }
}

class SpellPattern  {
    constructor(pattern, range, area, targetCount = 0) {
        this.pattern = pattern; // SpellPattern enum
        this.range = range;
        this.area = area;
        this.targetCount = targetCount;
    }
}

class AdditionalEffect {
    constructor(characterAction, efect, value, description) {
        this.characterAction = characterAction;
        this.efect = efect;
        this.value = value;
    }
}

class ManaEffect {
    constructor(mana, additionalEffect) {
        this.mana = mana;
        this.additionalEffect = additionalEffect;
    }
}

class Spell {
    constructor(name, availableClasses, baseStatType, damageTypes, description, spendManaEffects, spellPattern, baseDamage) {
        this.name = name;
        this.availableClasses = availableClasses; // Array of ClassType enums
        this.baseStatType = baseStatType; // StatType enum (e.g., STR, DEX, CON, etc.)
        this.damageTypes = damageTypes; // DamageType enum
        this.description = description; // Description object with required mana levels and descriptions
        this.spendManaEffects = spendManaEffects;
        this.spellPattern = spellPattern;
        this.baseDamage = baseDamage;

    }
}
    
class Weapon {
    constructor(name, weaponType, properties, additionalEffects, weaponSkills, lore) {
        this.name = name,
        this.weaponType = weaponType;
        this.properties = properties || []; 
        this.additionalEffects = additionalEffects || [];
        this.weaponSkills = weaponSkills || [];
        this.lore = lore || defaultWeaponLore;
    }
}

/* SPEELSS AND WEAPONS */
const classType = Object.freeze({
    ALL: 0,
    WIZARD: 1,
    CLERIC: 2,
    ROGUE: 3,
    DRUID: 4,
    PALADIN: 5,
    RANGER: 6,
    WARLOCK: 7,
    SORCERER: 8,
    BARBARIAN: 9,
    // Add more classes as needed
});

const damageType = Object.freeze({
    NONE: 0,
    PSYCHIC: 1,
    FIRE: 2,
    COLD: 3,
    LIGHTNING: 4,
    NECROTIC: 5,
    FORCE: 6,
    ACID: 7,
    POISON: 8,
    RADIANT: 9,
    SLASHING: 10,
    PIERCING: 11,
    BLUDGEONING: 12
    // Add more damage types as needed
});

// Enum for damage types
const statType = Object.freeze({
    STR: 1,
    DEX: 2,
    CON: 3,
    INT: 4,
    WIS: 5,
    CHA: 6,
    // Add more damage types as needed
});

const weaponType = Object.freeze({
    // Add more weapon types as needed
    CLUB           : 1,
    DAGGER         : 2,
    GREATCLUB      : 3,
    HANDAXE        : 4,
    JAVELIN        : 5,
    MACE           : 6,
    QUARTERSTAFF   : 7,
    SICKLE         : 8,
    SPEAR          : 9,
    LIGHTCROSSBOW  : 10,
    DART           : 11,
    SHORTBOW       : 12,
    BATTLEAXE      : 13,
    FLAIL          : 14,
    GLAIVE         : 15,
    GREATAXE       : 16,
    GREATSWORD     : 17,
    HALBERD        : 18,
    LANCE          : 19,
    LONGSWORD      : 20,
    MAUL           : 21,
    MORNINGSTAR    : 22,
    PIKE           : 23,
    RAPIER         : 24,
    SCIMITAR       : 25,
    SHORTSWORD     : 26,
    TRIDENT        : 27,
    WARHAMMER      : 28,
    WHIP           : 29,
    HEAVYCROSSBOW  : 30,
    LONGBOW        : 31
});
  
const weaponProperties = Object.freeze({
    // Add more weapon types as needed
    MAIN_HAND: 10,
    OFF_HAND: 20,
    TWO_HANDED: 30,
    LIGHT: 1,
    HEAVY: 2,
    FINESSE: 3,
    REACH: 4,
    TWO_HANDED: 5,
    THROWN: 6
});

const characterActions = Object.freeze({
    ALWAYS : 50,
    PREPARE: 99,
    ATTACKING: 1,
    MOVING: 2,
    BLOCKING: 3,
    BLOCKED: 4,
    ATTACKED: 5,
    HEALING: 6,
    HEALED: 7,
    CASTING: 8,
    CASTED: 9,
    DYING: 13,
});

const additionalEffects = Object.freeze({
    DICE_CHANGE : 1,
    BONUS : 2,
    ATTACK_RADIUS_BONUS : 4,
    PATTERN_CHANGE : 5,
    HEAL: 6,
    DEFENSE : 7,
    VISION : 8,
    ATTACK_RANGE : 9,
});

const patterns = Object.freeze({
    CIRCULAR: 1,
    BOX: 2,
    CONE: 3,
    TARGET: 4,
});

const noAdditionalEffect = "No Additional Effect";
const notAvailable = "Not available";
const defaultWeaponLore = 'Meh regular weapons, crafted by regular crafters :/ (Which Doesnt Require any skill!)';
