
const classTypes = Object.freeze({
    ALL: null,
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

const characterTypes = Object.freeze({
    PLAYER : 1,
    NPC: 2,
    CONJURED: 3
});

const itemTypes = Object.freeze({ 
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

const consumableTypes = Object.freeze({
    CASTABLE: 1,
    USABLE: 2,
    REFILLABLE: 3
});

const consumableProperties = Object.freeze({
    CONSUMED: 1,
    REFILLABLE: 2
});

const rollTypes = Object.freeze({
    NONE: 0,
    SAVING_THROW: 1,
    PERSPECTION_SAVING_THROW: 2,
    ABILITY_THROW: 3,
});

const objectTypes = Object.freeze({
    CHARACTER: 1,
    OBSTACLE: 2,
    WALL: 3
});

const spellTypes = Object.freeze({
    WEAPON: 1,
    CANTRIP: 2,
    SPELL: 3,
    CONJURE: 4
});

const additionalEffectTypes = Object.freeze({
    CAST: 0,
    AURA: 1,
    BUFF: 2
});

const spellPatterns = Object.freeze({
    CIRCULAR: 1,
    BOX: 2,
    CONE_UPWARD: 3,
    CONE_DOWNWARD: 4,
    TARGET: 5
});

const castTypes = Object.freeze({
    ON_LOCATION:1,
    FROM_CASTER: 2,
    AROUND_CASTER: 3
});

const targetTypes = Object.freeze({
    SELF: 1,
    ALLY: 2,
    ENEMY: 3,
    ANY: 4,
    CLOSEST_ENEMY: 5,
    CLOSEST_ANY: 6,
    ATTACKER: 7,
    GROUND_NO_OVERLAP: 8,
    GROUND: 9
});

const durationTypes = Object.freeze({
    TURN_BASED: 1,
    AFTER_SHORT_REST: 2,
    AFTER_LONG_REST: 3, 
    INSTANT: 4,
});


const effectTypes = Object.freeze({
    DICE_CHANGE: 1,
    ATTACK_DAMAGE_BONUS: 2,
    ATTACK_RADIUS_BONUS: 3, // Adjusted for consistency
    ATTACK_RANGE: 4,        // Moved ATTACK_RANGE to follow ATTACK_RADIUS_BONUS
    ATTACK_RANGE_BONUS: 5,  // Adjusted to be sequential
    PATTERN_CHANGE: 6,      // Adjusted to follow ATTACK_RANGE_BONUS
    HEAL: 7,
    DEFENSE: 8,
    VISION_RANGE_BONUS: 9,   // Adjusted to be in sequential order
    TAKE_DAMAGE: 10
});

const actionTypes = Object.freeze({
    BONUS: 1,
    MAIN: 2,
    DRUID_SOURCE: 3,
    WARLOCK_SPELL_SLOT: 4
});

const characterActions = Object.freeze({
    IDLE: 1,
    MOVING: 2,
    BLOCKING: 3,
    BLOCKED: 4,
    HEALING: 6,
    HEALED: 7,
    CASTING: 8,
    CASTED: 9,
    ATTACKING: 10,  // Assuming you want ATTACKING to come after CASTED
    DYING: 11,      // Adjusting numbers for consistency
    DIED: 12,
    PREPARE: 13,    // If PREPARE should be at the end of the sequence
    USE: 14,        // Assuming USE should be the last
    ALWAYS: 15,      // Adding ALWAYS at the end
    ATTACKED: 16,
    TURN_END: 17,
    TURN_START: 18
});

const weaponTypes = Object.freeze({
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

const encounterStatTypes = Object.freeze({
    PERSPECTION: 1,
    NATURE: 2,
})

// Enum for damage types
const statTypes = Object.freeze({
    NONE:0,
    STR: 1,
    DEX: 2,
    CON: 3,
    INT: 4,
    WIS: 5,
    CHA: 6,
    // Add more damage types as needed
});

const damageTypes = Object.freeze({
    NONE: 0,
    HEALING: 99,
    PSYCHIC: 1,
    FIRE: 2,
    FROST: 3,
    LIGHTNING: 4,
    NECROTIC: 5,
    FORCE: 6,
    ACID: 7,
    POISON: 8,
    RADIANT: 9,
    SLASHING: 10,
    PIERCING: 11,
    BLUDGEONING: 12,
    PURE: 13
    // Add more damage types as needed
});

class Duration {
    constructor(type = durationTypes.INSTANT, value= 1){
        this.type = type;
        this.value = value;
    }
}

class Inventory {
    constructor({
        items,
        currency,
    }) {
        this.items = items ? items : []; // Initialize an empty array to store inventory items
        this.currency = currency ? currency : {
            gold: 0,
            silver: 0,
            bronze: 0
        }; // Initialize currency
    }

    clear() {
        this.items = [];
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
            this.items.push({ name: item.name, type: item.type, quantity }); // Add new item to the inventory
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

class Character {
    constructor({
        id, 
        controlledBy = '',
        level = 0,
        name = "",
        classess = [],
        race = "",
        hp = 100,
        dex = 12,//gameSettings.MIN_STAT_POINT,
        con = 12,//gameSettings.MIN_STAT_POINT,
        int = 8,//gameSettings.MIN_STAT_POINT,
        wis = 12,//gameSettings.MIN_STAT_POINT,
        cha = 12,//gameSettings.MIN_STAT_POINT,
        str = 12,//gameSettings.MIN_STAT_POINT,
        action = characterActions.IDLE,
        additionalEffects = [],
        spellSlots = {
            '1':[5,3],
            '2':[4,3],
            '3':[2,2],
            '4':[2,2]
        },
        availableSpells = {
            1: ['Fireball', 'Ice Cone', 'Heralde', 'Pillar of Light'],
            2: ['Lightning Ray', 'Fire Hands', 'Conjure Mountainless Dwarf']
        },
        learnedSpells = {
            1: ['Fireball', 'Ice Cone', 'Heralde', 'Pillar of Light'], 
            2: ['Lightning Ray', 'Fire Hands', 'Conjure Mountainless Dwarf']
        },
        inventory = null,
        controlling = []
    } = {}) {
        this.id = id;
        this.controlledBy = controlledBy;
        this.level = level;
        this.name = name;
        this.classess = classess;
        this.race = race;
        this.dex = dex;
        this.con = con;
        this.int = int;
        this.wis = wis;
        this.cha = cha;
        this.str = str;
        this.action = action;
        this.additionalEffects = additionalEffects;
        this.spellSlots = spellSlots;
        this.availableSpells = availableSpells;
        this.learnedSpells = learnedSpells;
        this.inventory = inventory ? new Inventory(inventory.items, inventory.currency) : new Inventory();
        this.controlling = controlling;
    }
    clone() {
        return new Character(this.id, this.controlledBy,{
            level: this.level,
            name: this.name,
            classess: [...this.classess],
            race: this.race,
            subrace: this.subrace,
            dex: this.dex,
            con: this.con,
            int: this.int,
            wis: this.wis,
            cha: this.cha,
            str: this.str,
            charCurrentAction: this.charCurrentAction,
            additionalEffects: [...this.additionalEffects],
            spellSlots: {...this.spellSlots},
            availableSpells: {...this.availableSpells},
            learnedSpells: {...this.learnedSpells},
            inventory: new Inventory(),
            controlling: [...this.controlling]
        });
    }
}

class SpellPattern  {
    constructor(
        pattern = spellPatterns.CIRCULAR,
        range = 300,
        area = 100,
        castType = castTypes.ON_LOCATION,
        canTarget = [targetTypes.ENEMY]
    ) {
        this.pattern = pattern; // SpellPattern enum
        this.range = range;
        this.area = area;
        this.castType = castType
        this.canTarget = canTarget;
    }
}

class BuffDebuff {
    constructor(effectType, value, duration = null) {
        this.type = additionalEffectTypes.BUFF;
        this.effectType = effectType;
        this.value = value;
        this.duration = duration;
    }
}

class Aura {
    constructor(area, value, targetList = [targetTypes.ALLY], canSpread = false) {
        this.type = additionalEffectTypes.AURA;
        this.area = area;
        this.value = value
        this.targetList = targetList;  // Array of TargetType enum 0: ALLY, 1: ENEMY
        this.canSpread = canSpread
    }
}


class Cast {
    constructor(spellName, spellLevel, mana, targetListInOrder) {
        this.type = additionalEffectTypes.CAST;
        this.spellName = spellName;  // Spell object
        this.spellLevel = spellLevel;
        this.mana = mana;
        this.targetListInOrder = targetListInOrder;
    }
}

class AdditionalEffect {
    constructor(name, characterAction, effects=[], description, duration= new Duration(durationTypes.INSTANT)) {
        this.name = name;  // String
        this.characterAction = characterAction;
        this.effects = effects; // BuffDebuff, Aura or Cast
        this.description = description;
        this.duration = duration;
    }
}

class Spell{
    constructor(
        name = "",
        type = spellTypes.SPELL,
        classess = [classTypes.ALL],
        spellLevel = 1,
        statType,
        damageType,
        damage = "1d1",
        description = "",
        castDuration = Duration,
        actionCost = [actionTypes.MAIN],
        spendManaEffects= {},
        spellPattern = SpellPattern,
        casterRolls = [], 
        targetRolls = [],
    ) {
        this.name = name;
        this.classess = classess;  // Array of ClassType enum 0: ALL, 1: WARRIOR, 2: ROGUE, 3: MAGE, 4: PRIEST, 5: DRUID, 6: PALADIN
        this.type = type;
        this.spellLevel = spellLevel;
        this.statType = statType;
        this.damageType = damageType;
        this.damage = damage;
        this.description = description;
        this.castDuration = castDuration;
        this.actionCost = actionCost;
        this.spendManaEffects = spendManaEffects;
        this.spellPattern = spellPattern;
        this.casterRolls = casterRolls;
        this.targetRolls = targetRolls;
    }
}

class Item {
    constructor(name, type, subType, additionalEffects, spells, lore) {
        this.name = name,
        this.type = type,
        this.subType = subType;
        this.additionalEffects = additionalEffects;
        this.spells = spells;
        this.lore = lore;
    }
}