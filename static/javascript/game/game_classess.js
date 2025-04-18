
const classTypes = Object.freeze({
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

const characterTypes = Object.freeze({
    PLAYER : 1,
    NPC: 2,
    CONJURED: 3,
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
    HELM: 13,
    // Add more item types as needed
});

const consumableTypes = Object.freeze({
    CASTABLE: 1,
    USABLE: 2,
    REFILLABLE: 3,
});

const consumableProperties = Object.freeze({
    CONSUMED: 1,
    REFILLABLE: 2,
});

const rollTypes = Object.freeze({
    SAVING_THROW: 1,
    PERSPECTION_SAVING_THROW: 2,
    ABILITY_THROW: 3,
});

const objectTypes = Object.freeze({
    CHARACTER: 1,
    OBSTACLE: 2,
    WALL: 3,
});

const spellTypes = Object.freeze({
    WEAPON: 1,
    CANTRIP: 2,
    SPELL: 3,
});

const spellPatterns = Object.freeze({
    CIRCULAR: 1,
    BOX: 2,
    CONE_UPWARD: 3,
    CONE_DOWNWARD: 4,
    TARGET: 5,
});

const castTypes = Object.freeze({
    ON_LOCATION:1,
    FROM_CASTER: 2,
    AROUND_CASTER: 3,
});

const targetTypes = Object.freeze({
    SELF: 1,
    ALLY: 2,
    ENEMY: 3,
    ANY: 4,
});

const targetOrderList = Object.freeze({
    CLOSEST_ALLY: 1,
    CLOSEST_LOWHP_ALLY : 2,
    CLOSEST_LOWHP_ENEMY : 3,
    CLOSEST_ENEMY: 5,
    CLOSEST_ANY: 6,
    LAST_ATTACKER: 7,
    LAST_TARGET: 10,
    CLOSEST_OBJECT: 11,
});

const durationTypes = Object.freeze({
    TURN: 1,
    NEXT_SHORT_REST: 2,
    NEXT_LONG_REST: 3, 
    INSTANT: 4,
    NEXT_NTH_CAST: 5
});


const effectTypes = Object.freeze({
    DICE_CHANGE: 1,
    ATTACK_DAMAGE_BONUS: 2, // value = new Damage
    ATTACK_AREA_BONUS: 3,  // value = number   
    ATTACK_RANGE_BONUS: 5,  // value = number
    PATTERN_CHANGE: 6, // value = new SpellPattern
    HEAL: 7, // value = new Damage
    DEFENSE: 8, // value = new Damage
    VISION_RANGE_BONUS: 9,  // value = number
    TAKE_DAMAGE: 10, // value = new Damage
    HASTE: 11, // value = number
});

const effectSources = Object.freeze({
    ITEM: 1,
    CHARACTER: 2,
    NPC: 3,
    ENVIRONMENT: 4,
    OBJECT: 5,
})



const actionTypes = Object.freeze({
    BONUS: 1,
    MAIN: 2,
    DRUID_SOURCE: 3,
    WARLOCK_SPELL_SLOT: 4,
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
    TURN_START: 18,
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
    LONGBOW        : 31,
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
    THROWN: 6,
});

const encounterStatTypes = Object.freeze({
    PERSPECTION: 1,
    NATURE: 2,
})

// Enum for damage types
const statTypes = Object.freeze({
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
    PURE: 13,
    // Add more damage types as needed
});

const summonTypes = Object.freeze({
    CONJURED: 1,
    SUMMONED: 2,
    ANIMATED: 3,
})

const summonLocations = Object.freeze({
    AROUND_CASTER: 1,
    ON_SPELL_END: 2,
    ON_FIRST_HIT: 3
})

const extraEffectsList = {
    "Cast": "cast",
    "Buff/Debuff": "buff-debuff", 
    "Summon": "summon",
    "Aura": "aura"
}


class Duration {
    constructor({type = durationTypes.INSTANT, value= 1}){
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
        vision = 240,
        flag = "ally",
        stats = {
            dex: 12,//gameSettings.MIN_STAT_POINT,
            con: 12,//gameSettings.MIN_STAT_POINT,
            int: 8,//gameSettings.MIN_STAT_POINT,
            wis: 12,//gameSettings.MIN_STAT_POINT,
            cha: 12,//gameSettings.MIN_STAT_POINT,
            str: 12,//gameSettings.MIN_STAT_POINT,
        },
        action = characterActions.IDLE,
        extraEffects = [],
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
        inventory = new Inventory(),
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
        this.extraEffects = extraEffects;
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
            extraEffects: [...this.extraEffects],
            spellSlots: {...this.spellSlots},
            availableSpells: {...this.availableSpells},
            learnedSpells: {...this.learnedSpells},
            inventory: new Inventory(),
            controlling: [...this.controlling]
        });
    }

    getExtraEffects(action) {
        return this.extraEffects.filter(effect => effect.triggerActions.includes(action) || effect.triggerActions.includes(characterActions.ALWAYS));
    }

    calculateResistence(damageType){
        let resistence = 0;
        this.extraEffects.forEach(effect => {
            if(effect.effectType === effectTypes.DEFENSE && effect.value.type === damageType){
                resistence += effect.value.value;
            }
        });
        return resistence;
    }

    takeDamage(damage){
        let resistence = this.calculateResistence(damage.type);
        let damageValue = damage.value - resistence;
        if(damageValue < 0){
            damageValue = 0;
        }
        this.hp -= damageValue;
        if(this.hp <= 0){
            this.action = characterActions.DYING;
            this.hp = 0;
        }else{
            this.action = characterActions.ATTACKED;
        }
    }
}

class SpellPattern  {
    constructor({
        pattern,
        range,
        area,
        castType,
        canTarget}) {
        this.pattern = pattern; // SpellPattern enum
        this.range = range;
        this.area = area;
        this.castType = castType
        this.canTarget = canTarget;
    }
}

class BuffDebuff {
    constructor({effectType, value, duration = null, triggerActions= [characterActions.TURN_START]}, source_type = null, source = null) {
        this.effectType = effectType;
        this.value = value;
        this.duration = duration;
        this.triggerActions = triggerActions;

        // Below values assigned when someoen casts buff/debuff
        this.source_type = source_type; // EffectSource enum
        this.source = source; // Character ID or Object ID
    }
}

class Aura {
    constructor({area, effectType, value, duration = new Duration(), triggerActions, targetList = [targetTypes.ALLY], canSpread = false} = {}) {
        this.area = area;
        this.effectType = effectType;
        this.value = value
        this.duration = duration;
        this.triggerActions = triggerActions;  // CharacterAction enum
        this.targetList = targetList;  // Array of TargetType enum 0: ALLY, 1: ENEMY
        this.canSpread = canSpread
    }
}

class Summon {
    constructor({id, castDuration, summonDuration, quantity = 1, summonLocation = summonLocations.AROUND_CASTER, triggerActions= [characterActions.ALWAYS]} = {}) {
        this.id = id;  // Character ID
        this.castDuration = castDuration; // Duration of the spell cast
        this.summonDuration = summonDuration;
        this.quantity = quantity; // Number of summons
        this.summonLocation = summonLocation; // Location of the summon
        this.triggerActions = triggerActions; // CharacterAction enum
    }
}

class Cast {
    constructor({spellName, mana, targetListInOrder, castTimes= 1, triggerActions = [characterActions.ALWAYS]} = {}) {
        this.spellName = spellName;  // Spell object
        this.mana = mana;
        this.targetListInOrder = targetListInOrder;
        this.castTimes = castTimes;
        this.triggerActions = triggerActions
    }
}

class Effect {
    constructor({name, type, description, effect} = {}) {
        this.name = name;  // String
        this.type = type
        this.description = description
        this.effect = effect
    }
}

class StatMultiplier{
    constructor({type, multipler} = {}){
        this.type = type;
        this.multiplier = multipler;
    }
}
class Damage{
    constructor({type, value} = {}){
        this.type = type;
        this.value = value;
    }
}


const AniShapes = Object.freeze({
    square: 1,
    circle: 2,
    triangle: 3
})

const AniDirections = Object.freeze({
    through: 1,
    around: 2
})

class AniSprite {
    constructor({
        src,
        sequanceSize,
        sequanceCount,
        srcRowCnt,
        srcColCnt,
    } = {}){
        this.src = src,
        this.sequanceSize = sequanceSize,
        this.sequanceCount = sequanceCount,
        this.srcRowCnt = srcRowCnt,
        this.srcColCnt = srcColCnt
    }
}

class AniExplosion {
    constructor({
        colors = ["rgb(190, 71, 16)", "rgb(238, 153, 25)"],
        particleCount = 30,
        particleShapes = [AniShapes.circle],
        explosionDirection = AniDirections.around,
    } = {}){
        this.colors = colors
    }
}

class AniArea {
    constructor({
        colors = ["rgb(190, 71, 16)", "rgb(238, 153, 25)"],
        shape = AniShapes.circle,
        sprite = null
    } = {}){
        this.colors = colors
    }
}

class AniDnd {
    constructor({area =  null, explosion = null} = {}){

    }
}

// Modified Spell Class (from step 1 above)
class Spell {
    constructor({
        name, // Required
        type, // Required
        classess, // Required (e.g., [classTypes.WIZARD])
        level = 1, // Default level is 1
        modifiers = [], // Default to empty array
        damage = null, // Default to null, might need specific handling if always expected
        description = "", // Default to empty string
        castDuration = new Duration({ type: durationTypes.INSTANT }), // Default duration
        actionCost = [], // Default to empty array
        spendManaEffects = {}, // Default to empty object
        spellPattern = new SpellPattern(), // Required or provide a default SpellPattern? Assuming required for now.
        casterRolls = [], // Default to empty array
        targetRolls = [], // Default to empty array
        animation = null, // Optional animation data
    } = {}) { // Add '= {}' to handle constructor called with no arguments

        // Basic validation for required fields (optional but recommended)
        if (!name) throw new Error("Spell requires a 'name'.");
        if (type === undefined || type === null) throw new Error("Spell requires a 'type'.");
        if (!classess || classess.length === 0) throw new Error("Spell requires 'classess'.");
        if (!spellPattern) throw new Error("Spell requires a 'spellPattern'.");
        // Add more validation as needed

        this.name = name;
        this.type = type;
        this.classess = classess;
        this.level = level;
        this.modifiers = modifiers;
        this.damage = damage;
        this.description = description;
        this.castDuration = castDuration;
        this.actionCost = actionCost;
        this.spendManaEffects = spendManaEffects;
        this.spellPattern = spellPattern;
        this.casterRolls = casterRolls;
        this.targetRolls = targetRolls;
        this.animation = animation; // Assign animation if provided
    }

    getExtraEffects(usedMana){
        const availableKeys = Object.keys(this.spendManaEffects)
            .filter(key => key <= usedMana)
            .sort((a, b) => a - b); // Optional: sort for consistency

        const allEffects = {
            caster: [],
            target: []
        };

        for (const key of availableKeys) {
            const effects = this.spendManaEffects[key];
            if (effects.caster) allEffects.caster.push(...effects.caster);
            if (effects.target) allEffects.target.push(...effects.target);
        }

        return allEffects;
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

const diceTypes = Object.freeze({
    D6: 6,
    D20: 20,
    D12: 12,
    D10: 10,
    D8: 8,
    D6: 6,
    D4: 4,
    D3: 3,
    D100: 100
})

class Roll{
    constructor(diceType, rollType, target){
        this.diceType = diceType;
        this.rollType = rollType;
        this.target = target;
    }
}

const spells = {
    0: {},
    1: {
        "fireBolt": new Spell({
            name: "Fire Bolt",
            type: spellTypes.SPELL,
            classess: [classTypes.DRUID, classTypes.PALADIN, classTypes.WARLOCK, classTypes.SORCERER, classTypes.WIZARD],
            level: 1,
            modifiers: [new StatMultiplier({ type: statTypes.INT, multipler: 2 }), new StatMultiplier({ type: statTypes.WIS, multipler: 1.5 })],
            damage: [new Damage({ type: damageTypes.FIRE, value: "1d8" })],
            description: "Conjure a fire bolt.",
            castDuration: new Duration({ type: durationTypes.TURN, value: 1 }),
            actionCost: [actionTypes.MAIN],
            spendManaEffects: {
                "2": {
                    caster: [new Effect({name: "Fiery", type: extraEffectsList.Cast, description: "So much power.",
                        effect: new Cast({ spellName: "fireBolt", mana: "1", targetListInOrder: [targetOrderList.LAST_TARGET], castTimes: 1 })})]
                },
                "3": {
                    caster: [new Effect({name: "Fiery", type: extraEffectsList.Cast, description: "So much more power.",
                         effect: new Cast({ spellName: "fireBolt", mana: "1", targetListInOrder: [targetOrderList.LAST_TARGET], castTimes: 1 })})],
                    target: [
                        new Effect({name: "Burn", type: extraEffectsList["Buff/Debuff"], description: "U shall burn.",
                            effect: new BuffDebuff({
                                effectType: effectTypes.TAKE_DAMAGE,
                                value: new Damage({ type: damageTypes.FIRE, value: "1d2" }),
                                duration: new Duration({ type: durationTypes.TURN, value: 5 }),
                                triggerActions: [characterActions.TURN_START]
                            })}),
                    ]
                }
            },
            spellPattern: new SpellPattern({ pattern: spellPatterns.BOX, range: 200, area: 50, castType: castTypes.FROM_CASTER, canTarget: [targetTypes.ANY] }),
            casterRolls: [new Roll(diceTypes.D20, rollTypes.ABILITY_THROW, 10)],
            targetRolls: [new Roll(diceTypes.D20, rollTypes.SAVING_THROW, 20)]
            // animation: new AniDnd({ /* ... */ }) // Example if you add animation data
        }),
        "holyAura": new Spell({
            name: "Holy Aura",
            type: spellTypes.SPELL,
            classess: [classTypes.CLERIC, classTypes.PALADIN],
            level: 1,
            modifiers: [new StatMultiplier({ type: statTypes.DEX, multipler: 1.8 })],
            damage: [new Damage({ type: damageTypes.NONE, value: "0" })], // Explicitly setting damage even if none
            description: "Apply holy aura to target.",
            castDuration: new Duration({ type: durationTypes.INSTANT }),
            actionCost: [actionTypes.MAIN],
            spendManaEffects: {
                "1": {
                    caster: [],
                    target: [new Effect({name: "Holy Aura", type: extraEffectsList.Aura, description: "Applys a holy aura around caster.",
                                effect: new Aura({
                                    area: 250, effectType: effectTypes.HEAL,
                                    value: new Damage({ type: damageTypes.HEALING, value: "1d8" }),
                                    duration: new Duration({ type: durationTypes.TURN, value: 10 }),
                                    triggerActions: [characterActions.TURN_END], targetList: [targetTypes.ALLY], canSpread: false
                                    })})
                            ]
                    }
            },
            spellPattern: new SpellPattern({ pattern: spellPatterns.TARGET, range: 250, area: 50, castType: castTypes.ON_LOCATION, canTarget: [targetTypes.ALLY] }),
            // casterRolls: [], // Default, can omit
            // targetRolls: []  // Default, can omit
        }),
    },
    2: {
        "conjureSlave": new Spell({
            name: "Conjure Your Slave",
            type: spellTypes.SPELL,
            classess: [classTypes.WARLOCK, classTypes.WIZARD, classTypes.DRUID],
            level: 2,
            modifiers: [new StatMultiplier({ type: statTypes.CHA, multipler: 2 })],
            damage: [new Damage({ type: damageTypes.NONE, value: "0" })],
            description: "Conjure your beloved slave.",
            castDuration: new Duration({ type: durationTypes.TURN, value: 1 }),
            actionCost: [actionTypes.MAIN],
            spendManaEffects: {
                "2": {
                    caster: [
                        new Effect({name: "Summon Your Slave", type: extraEffectsList.Summon, description: "Summon your peasent.",
                            effect: new Summon({
                                id: "slave",
                                castDuration: new Duration({ type: durationTypes.INSTANT}),
                                summonDuration: new Duration({type: durationTypes.NEXT_LONG_REST})})}
                        ),
                    ],
                    target: []
                },
                "4" : {
                    caster: [
                        new Effect({name: "Extra Help", type: extraEffectsList.Summon, description: "Your slave summons an extra.",
                            effect: new Summon({
                                id: "farmer-1",
                                castDuration: new Duration({ type: durationTypes.INSTANT}),
                                summonDuration: new Duration({type: durationTypes.NEXT_LONG_REST})})}
                        ),
                    ],
                    target: []
                }
            },
            spellPattern: new SpellPattern({ pattern: spellPatterns.CIRCULAR, range: 50, area: 50, castType: castTypes.ON_LOCATION, canTarget: [targetTypes.GROUND] }), // Assuming GROUND is a target type or needs definition
            // casterRolls: [], // Default, can omit
            // targetRolls: []  // Default, can omit
        }),
        "conjureWorm": new Spell({
            name: "Conjure Dweller Worm",
            type: spellTypes.SPELL,
            classess: [classTypes.WARLOCK, classTypes.WIZARD, classTypes.DRUID],
            level: 2,
            modifiers: [new StatMultiplier({ type: statTypes.CHA, multipler: 2 })],
            damage: [new Damage({ type: damageTypes.NONE, value: "0" })],
            description: "Cast a summoning spell.",
            castDuration: new Duration({ type: durationTypes.TURN, value: 1 }),
            actionCost: [actionTypes.MAIN],
            spendManaEffects: {
                "2": {
                    caster: [
                        new Effect({name: "Dweller Worm", type: extraEffectsList.Summon, description: "Conjure a dweller worm from the depts of hell.",
                            effect: new Summon({
                                id: "dwellerWorm",
                                castDuration: new Duration({ type: durationTypes.INSTANT}),
                                summonDuration: new Duration({type: durationTypes.NEXT_LONG_REST}),
                                quantity: 5,
                                summonLocation: summonLocations.ON_FIRST_HIT
                            })}
                        ),
                        new Effect({name: "Cast Frenzy", type: extraEffectsList["Buff/Debuff"],
                            description: "Applies haste which lowers turn count for casting or attacking.",
                            effect: new BuffDebuff({
                                effectType: effectTypes.HASTE,
                                value: "10", // Assuming value is a string or number indicating haste amount/percentage?
                                duration: new Duration({ type: durationTypes.TURN, value: 5 }),
                                triggerActions: [characterActions.CASTING]
                            })}
                        )
                    ],
                    target: []
                }
            },
            spellPattern: new SpellPattern({
                pattern: spellPatterns.CIRCULAR,
                range: 50,
                area: 50,
                castType: castTypes.ON_LOCATION,
                canTarget: [targetTypes.ANY]
            }),
            // casterRolls: [], // Default, can omit
            // targetRolls: []  // Default, can omit
        }),
        "emergencyHeal": new Spell({
            name: "Emergency Heal",
            type: spellTypes.CANTRIP, // This should probably be spellTypes.SPELL if it has a level and cost, or level 0 if truly a cantrip? Assuming SPELL based on level 2. Changed to CANTRIP as per original code.
            classess: [classTypes.PALADIN, classTypes.CLERIC],
            level: 2, // Level was 2 in original definition for emergencyHeal
            modifiers: [new StatMultiplier({ type: statTypes.WIS, multipler: 2 })],
            damage: [new Damage({ type: damageTypes.HEALING, value: "2d8" })],
            description: "Heals around instantly.",
            castDuration: new Duration({ type: durationTypes.INSTANT }),
            actionCost: [actionTypes.BONUS],
            // spendManaEffects: {}, // Default, can omit
            spellPattern: new SpellPattern({ pattern: spellPatterns.CIRCULAR, range: 200, area: 200, castType: castTypes.AROUND_CASTER, canTarget: [targetTypes.ALLY] }),
            // casterRolls: [], // Default, can omit
            // targetRolls: []  // Default, can omit
        })
    },
    3: {},
    4: {
        "lightningTrident": new Spell({
            name: "Lightning Trident",
            type: spellTypes.SPELL,
            classess: [classTypes.DRUID, classTypes.SORCERER, classTypes.WIZARD],
            level: 4,
            modifiers: [new StatMultiplier({ type: statTypes.INT, multipler: 3 }), new StatMultiplier({ type: statTypes.WIS, multipler: 1.5 })],
            damage: [new Damage({ type: damageTypes.LIGHTNING, value: "3d8" })],
            description: "Conjure a lightning trident strike.", // Slightly improved description
            castDuration: new Duration({ type: durationTypes.TURN, value: 1 }),
            actionCost: [actionTypes.MAIN],
            spendManaEffects: {
                "5": {
                    caster: [new Effect({name: "Tridents Rage", type: extraEffectsList["Buff/Debuff"], description: "Ur new attack will deal extra damage.",
                        effect: new BuffDebuff({
                            effectType: effectTypes.ATTACK_DAMAGE_BONUS, value: new Damage({ type: damageTypes.PURE, value: "1d8" }),
                            duration: new Duration({ type: durationTypes.NEXT_NTH_CAST, value: 1 }), triggerActions: [characterActions.CASTING]
                        })})
                    ],
                    target: []
                }
            },
            spellPattern: new SpellPattern({ pattern: spellPatterns.CONE_UPWARD, range: 150, area: 100, castType: castTypes.FROM_CASTER, canTarget: [targetTypes.ANY] }),
            casterRolls: [new Roll(diceTypes.D20, rollTypes.ABILITY_THROW, 10)],
            targetRolls: [new Roll(diceTypes.D20, rollTypes.SAVING_THROW, 20)]
        })
    },
    5: {},
    6: {},
    7: {},
    8: {},
    9: {},
}
