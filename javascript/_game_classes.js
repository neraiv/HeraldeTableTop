const itemType = Object.freeze({ 
    WEAPON: 1,
    CONSUMABLE: 2,
    NECKLACE: 3,
    EARINGS: 4,
    RING: 5,
    CLOAK: 7,
    GLOVES: 8,
    ARMS: 14,
    CHEST: 9,
    LEGS: 10,
    BOOTS: 6,
    HELM: 13 
    // Add more item types as needed
});
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
    HEALING: 99,
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
    IDLE : 25,
    ALWAYS : 50,
    PREPARE: 99,
    USE : 100,
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
    ATTACK_RANGE_BONUS: 10
});

const patterns = Object.freeze({
    CIRCULAR: 1,
    BOX: 2,
    CONE_UPWARD: 3,
    CONE_DOWNWARD: 4,
    TARGET: 5,
});

const actionType = Object.freeze({
    BONUS: 1,
    MAIN: 2,
});

const castType = Object.freeze({
    ON_LOCATION:1,
    FROM_CASTER: 2,
    AROUND_CASTER: 3,
});

const notAvailable = "Not available";
const defaultWeaponLore = 'Meh regular weapons, crafted by regular crafters :/ (Which Doesnt Require any skill!)';

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
        charCurrentAction = characterActions.IDLE,
        spellSlots = {
            '1':5,
            '2':4,
            '3':2,
            '4':2
        },
        remainingManaSlots = {
            '1': 3,
            '2': 3,
            '3': 2,
            '4': 2
        },
        availableSpells = {
            1: ['Fireball', 'Ice Cone'],
            2: ['Lightning Ray', 'Fire Hands']
        },
        learnedSpells = ['Fireball', 'Lightning Ray', 'Fire Hands', 'Ice Cone'],
        inventory = new Inventory()
    } = {}) {
        this.ID = id;
        this.maxStatPoint       = maxStatPoint          ;
        this.minStatPoint       = minStatPoint          ;
        this.maxCharacterLevel  = maxCharacterLevel     ;   
        this.minCharacterLevel  = minCharacterLevel     ;   
        this.maxSubClassCount   = maxSubClassCount      ;   
        this.minSubClassCount   = minSubClassCount      ;   
        this.level              = level                 ;
        this.name               = name                  ;
        this.class_             = class_                ;
        this.subclass           = subclass              ;
        this.race               = race                  ;
        this.feats              = feats                 ;
        this.dex                = dex                   ;
        this.con                = con                   ;
        this.int                = int                   ;
        this.wis                = wis                   ;
        this.cha                = cha                   ;
        this.str                = str                   ;
        this.charCurrentAction  = charCurrentAction     ;
        this.spellSlots         = spellSlots            ;
        this.remainingManaSlots = remainingManaSlots    ;
        this.availableSpells    = availableSpells       ;
        this.learnedSpells      = learnedSpells         ;
        this.inventory          = inventory             ;
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
        this.currency = {
            gold: 0,
            silver: 0,
            bronze: 0
        };
    }

    // Add an item to the inventory
    addItem(item, quantity = 1) {
        const existingItem = this.items.find(exItem => exItem.name === item.name);
        if (existingItem) {
            existingItem.quantity += quantity; // Increase quantity if item exists
        } else {
            this.items.push({ name: item.name, itemType: item.itemType, quantity }); // Add new item to the inventory
        }
        console.log(`${item.name} added. Quantity: ${quantity}`);
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
        console.log(`Currency: ${this.currency.gold} Gold, ${this.currency.silver} Silver, ${this.currency.bronze} Bronze`);
    }

    // Get the quantity of a specific item
    getQuantity(itemName) {
        const item = this.items.find(item => item.name === itemName);
        return item ? item.quantity : 0;
    }

    // Add currency
    addCurrency(gold = 0, silver = 0, bronze = 0) {
        this.currency.gold += gold;
        this.currency.silver += silver;
        this.currency.bronze += bronze;
        console.log(`Added ${gold} Gold, ${silver} Silver, ${bronze} Bronze.`);
    }

    convertCurrencyToGoldBase() {
        // Convert bronze to silver
        this.currency.silver += Math.floor(this.currency.bronze / 150);
        this.currency.bronze = this.currency.bronze % 150;
    
        // Convert silver to gold
        this.currency.gold += Math.floor(this.currency.silver / 1342);
        this.currency.silver = this.currency.silver % 1342;
    
        console.log(`Converted to ${this.currency.gold} Gold, ${this.currency.silver} Silver, ${this.currency.bronze} Bronze.`);
    }

    convertCurrency(gold = 0, silver = 0, bronze = 0) {
        // Convert the total value to Bronze
        let totalBronze = (gold * 10000) + (silver * 100) + bronze;
    
        // Convert total Bronze to Gold, Silver, and remaining Bronze
        const convertedGold = Math.floor(totalBronze / 10000);
        totalBronze %= 10000;
    
        const convertedSilver = Math.floor(totalBronze / 100);
        const remainingBronze = totalBronze % 100;
    
        console.log(`${gold} Gold, ${silver} Silver, ${bronze} Bronze equals to ${convertedGold} Gold, ${convertedSilver} Silver, and ${remainingBronze} Bronze.`);
        return { gold: convertedGold, silver: convertedSilver, bronze: remainingBronze };
    }

    reverseConvertCurrency(gold = 0, silver = 0, bronze = 0) {
        const totalBronze = (gold * 10000) + (silver * 100) + bronze;
        console.log(`${gold} Gold, ${silver} Silver, ${bronze} Bronze equals to ${totalBronze} Bronze.`);
        return totalBronze;
    }
    

    // Remove currency
    removeCurrency(gold = 0, silver = 0, bronze = 0) {
        if (this.currency.gold < gold || this.currency.silver < silver || this.currency.bronze < bronze) {
            console.log("Not enough currency to remove.");
            return;
        }

        this.currency.gold -= gold;
        this.currency.silver -= silver;
        this.currency.bronze -= bronze;
        console.log(`Removed ${gold} Gold, ${silver} Silver, ${bronze} Bronze.`);
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
    constructor(pattern, range, area, targetCount = 0, castType = false) {
        this.pattern = pattern; // SpellPattern enum
        this.range = range;
        this.area = area;
        this.castType = castType
    }
}

class AdditionalEffect {
    constructor(characterAction, effect, value, description) {
        this.characterAction = characterAction;
        this.effect = effect;
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
    constructor(name, availableClasses, baseStatType, damageTypes, description, spendManaEffects, spellPattern, baseDamage, castTime=1, actionCost = actionType.MAIN) {
        this.name               = name;
        this.availableClasses   = availableClasses; // Array of ClassType enums
        this.baseStatType       = baseStatType; // StatType enum (e.g., STR, DEX, CON, etc.)
        this.damageTypes        = damageTypes; // DamageType enum
        this.description        = description; // Description object with required mana levels and descriptions
        this.spendManaEffects   = spendManaEffects;
        this.spellPattern       = spellPattern;
        this.baseDamage         = baseDamage;
        this.castTime           = castTime;
        this.actionCost         = actionCost; // ActionType enum
    }
}
    
class Item {
    constructor(name, itemType, itemSubType, properties, additionalEffects, spells, lore) {
        this.name = name,
        this.itemType = itemType,
        this.itemSubType = itemSubType;
        this.properties = properties; 
        this.additionalEffects = additionalEffects;
        this.spells = spells;
        this.lore = lore;
    }
}

class GameFlags {
    constructor({
        useEnvorinmentTimeBasedBackground = false,
        }={}){
            this.USE_ENVORINMENT_TIME_BASED_BACKGROUND = useEnvorinmentTimeBasedBackground;
        }
}

class SettingsGame {
    constructor({
        maxStatPoint = 20,
        minStatPoint = 0,
        maxCharacterLevel = 15,
        minCharacterLevel = 1,
        maxSubClassCount = 2,
        minSubClassCount = 0,
        includedSpellLevels = ['1', '2', '3', '4', '5'],
        flags, 
    } = {}) {
        this.maxStatPoint   = maxStatPoint;
        this.minStatPoint   = minStatPoint;
        this.maxCharacterLevel   = maxCharacterLevel;
        this.minCharacterLevel   = minCharacterLevel;
        this.maxSubClassCount   = maxSubClassCount;
        this.minSubClassCount   = minSubClassCount;
        this.includedSpellLevels   = includedSpellLevels;
        this.flags   = flags;
    }
}