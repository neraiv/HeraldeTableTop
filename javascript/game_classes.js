class Character {
    constructor(id, {
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

/* SPEELSS AND WEAPONS */
const ClassType = Object.freeze({
    ALL: 'All',
    WIZARD: 'Wizard',
    CLERIC: 'Cleric',
    ROGUE: 'Rogue',
    DRUID: 'Druid',
    PALADIN: 'Paladin',
    RANGER: 'Ranger',
    WARLOCK: 'Warlock',
    SORCERER: 'Sorcerer',
    BARBARIAN: 'Barbarian',
    // Add more classes as needed
});

const DamageType = Object.freeze({
    NONE: "None",
    PSYCHIC: "Psychic",
    FIRE: 'Fire',
    COLD: 'Cold',
    LIGHTNING: 'Lightning',
    NECROTIC: 'Necrotic',
    FORCE: 'Force',
    ACID: 'Acid',
    POISON: 'Poison',
    RADIANT: 'Radiant',
    SLASHING: 'Slashing',
    PIERCING: 'Piercing',
    BLUDGEONING: 'Bludgeoning'
    // Add more damage types as needed
});

  // Enum for damage types
const StatType = Object.freeze({
    STR: 'Str',
    DEX: 'Dex',
    CON: 'Con',
    INT: 'Int',
    WIS: 'Wis',
    CHA: 'Cha',
    // Add more damage types as needed
});

const weaponType = Object.freeze({
    // Add more weapon types as needed
    CLUB           : 'Club'          ,
    DAGGER         : 'Dagger'        ,
    GREATCLUB      : 'Greatclub'     ,
    HANDAXE        : 'Handaxe'       ,
    JAVELIN        : 'Javelin'       ,
    MACE           : 'Mace'          ,
    QUARTERSTAFF   : 'Quarterstaff'  ,
    SICKLE         : 'Sickle'        ,
    SPEAR          : 'Spear'         ,
    LIGHTCROSSBOW  : 'Light Crossbow',
    DART           : 'Dart'          ,
    SHORTBOW       : 'Shortbow'      ,
    BATTLEAXE      : 'Battleaxe'     ,
    FLAIL          : 'Flail'         ,
    GLAIVE         : 'Glaive'        ,
    GREATAXE       : 'Greataxe'      ,
    GREATSWORD     : 'Greatsword'    ,
    HALBERD        : 'Halberd'       ,
    LANCE          : 'Lance'         ,
    LONGSWORD      : 'Longsword'     ,
    MAUL           : 'Maul'          ,
    MORNINGSTAR    : 'Morningstar'   ,
    PIKE           : 'Pike'          ,
    RAPIER         : 'Rapier'        ,
    SCIMITAR       : 'Scimitar'      ,
    SHORTSWORD     : 'Shortsword'    ,
    TRIDENT        : 'Trident'       ,
    WARHAMMER      : 'Warhammer'     ,
    WHIP           : 'Whip'          ,
    HEAVYCROSSBOW  : 'Heavy Crossbow',
    LONGBOW        : 'Longbow'       
});

const WeaponCategory = Object.freeze({
    SIMPLE: 'Simple',
    MARTIAL: 'Martial'
});
  
const WeaponProperties = Object.freeze({
    // Add more weapon types as needed
    LIGHT: 'Light',
    HEAVY: 'Heavy',
    FINESSE: 'Finesse',
    REACH: 'Reach',
    TWO_HANDED: 'Two-Handed',
    THROWN: 'Thrown'
});

const ExtraEffects = Object.freeze({
    VALUE : 'Increase',
    DICE_CHANGE : 'DiceChange',
    MOVEMENT : 'MOVEMENT',
    ATTACK_CHANGE : 'ATTACK_CHANGE',
    ATTACK_BONUS : 'ATTACK_BONUS',
    ATTACK_RADIUS_BONUS : 'ATTACK_RADIUS',
    PATTERN_CHANGE : 'PATTERN_CHANGE',
    HEAL: 'HEAL',
    DEFENSE : 'DEFENSE',
    VISION : 'VISION',
    ATTACK_RANGE : 'ATTACK_RANGE',
});

const ExstraEffectType = Object.freeze({

});

const ExstraEffectTarget = Object.freeze({

});

const Patterns = Object.freeze({
    CIRCULAR: 'CIRCULAR',
    BOX: 'BOX',
    CONE: 'CONE',
    TARGET: 'TARGET',
});

const noAdditionalEffect = "No Additional Effect";
const notAvailable = "Not available";
const defaultWeaponLore = 'Meh regular weapons, crafted by regular crafters :/ (Which Doesnt Require any skill!)';

class SpellPattern  {
    constructor(pattern, range, area, targetCount = 0) {
        this.pattern = pattern; // SpellPattern enum
        this.range = range;
        this.area = area;
        this.targetCount = targetCount;
    }
}

class AdditionalEffect {
    constructor(efect, value, description) {
        this.efect = efect;
        this.value = value;
        this.description = description; 
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
    constructor(name, weaponType, weaponCategory, properties, additionalEffects, weaponSkills, lore) {
        this.name = name,
        this.weaponType = weaponType;
        this.weaponCategory = weaponCategory;
        this.properties = properties || []; 
        this.additionalEffects = additionalEffects || [];
        this.weaponSkills = weaponSkills || [];
        this.lore = lore || defaultWeaponLore;
    }
}