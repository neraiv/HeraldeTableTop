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
  
  // Enum for damage types
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
    MOVEMENT : 'MOVEMENT',
    ATTACK_CHANGE : 'ATTACK_CHANGE',
    ATTACK_BONUS : 'ATTACK_BONUS',
    ATTACK_RADIUS_BONUS : 'ATTACK_RADIUS',
    HEAL: 'HEAL',
    DEFENSE : 'DEFENSE',
    VISION : 'VISION',
    ATTACK_RANGE : 'ATTACK_RANGE',
});

const Patterns = Object.freeze({
    CIRCULAR: 'CIRCULAR',
    BOX: 'BOX',
    CONE: 'CONE',
});

const noAdditionalEffect = "No Additional Effect";
const notAvailable = "Not available";
const defaultWeaponLore = 'Meh regular weapons, crafted by regular crafters :/ (Which Doesnt Require any skill!)';

class SpellPattern  {
    constructor(pattern, range, area) {
        this.pattern = pattern; // SpellPattern enum
        this.range = range;
        this.area = area;
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
    constructor(mana, effect) {
        this.mana = mana;
        this.effect = effect;
    }
}

class Spell {
    constructor(name, availableClasses, baseStatType, damageTypes, description, spendManaEffects, baseDamage, spellPattern) {
        this.name = name;
        this.availableClasses = availableClasses; // Array of ClassType enums
        this.baseStatType = baseStatType; // StatType enum (e.g., STR, DEX, CON, etc.)
        this.damageTypes = damageTypes; // DamageType enum
        this.description = description; // Description object with required mana levels and descriptions
        this.spendManaEffects = spendManaEffects;
        this.baseDamage = baseDamage;
        this.spellPattern = spellPattern;
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

const BaseWeaponAttacks = Object.freeze({
    // Add more weapon types as needed
    SLASH: new Spell('Slashing Attack', [ClassType.ALL], [StatType.DEX], [DamageType.SLASHING], 'Slashing attack!', [], '1d8'),
    BONK : new Spell('Bonk!!', [ClassType.ALL], [StatType.STR], [DamageType.BLUDGEONING], 'Bonking attack. Have no respect for target.', [], '4d4'),
});


let spell_list = {
    // Add more spells as needed
    FIREBALL : new Spell('Fireball', 
        [ClassType.WIZARD], 
        StatType.INT, 
        [DamageType.FIRE], 
        'Conjure a glowing ball of fire.', 
        [new ManaEffect(2, new AdditionalEffect(ExtraEffects.ATTACK_RADIUS_BONUS, 1, 'Increase Attack Radius by 1'))], 
        '2d6'),
    };

let WeaponList = [
    new Weapon("Holy Dagger", weaponType.DAGGER, WeaponCategory.SIMPLE, [WeaponProperties.LIGHT, WeaponProperties.FINESSE, WeaponProperties.THROWN],
        [new AdditionalEffect(ExtraEffects.ATTACK_BONUS, 4, 'Increase Attack Damage by 4')],
        [BaseWeaponAttacks.SLASH,
        new Spell('Holy Chase'
        [ClassType.ALL],
        StatType.WIS,
        [DamageType.RADIANT],
        'Holy Chase: You chase your deity damage and heal yourself.',
        [
            new ManaEffect(0, new AdditionalEffect(ExtraEffects.HEAL, 5, 'Heal 5 hit points')),
            new ManaEffect(0, new AdditionalEffect(ExtraEffects.ATTACK_BONUS, 2, 'Increase Attack Damage by 2')),
            new ManaEffect(0, new AdditionalEffect(ExtraEffects.DEFENSE, 2, 'Increase Defense by 2')),
        ],
        '2d8'
        )],
        "A holly dagger, probably used by gods to kill another gods."
    )
];