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
    PATTERN_CHANGE : 'PATTERN_CHANGE',
    HEAL: 'HEAL',
    DEFENSE : 'DEFENSE',
    VISION : 'VISION',
    ATTACK_RANGE : 'ATTACK_RANGE',
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

const BaseWeaponAttacks = Object.freeze({
    // Add more weapon types as needed
    SLASH: new Spell('Slashing Attack', [ClassType.ALL], [StatType.DEX], [DamageType.SLASHING], 'Slashing attack!', [], new SpellPattern(Patterns.TARGET, 1, 0, 1), '1d8'),
    BONK : new Spell('Bonk!!', [ClassType.ALL], [StatType.STR], [DamageType.BLUDGEONING], 'Bonking attack. Have no respect for target.', [], new SpellPattern(Patterns.TARGET, 1, 0, 1),'4d4'),
});


let spell_list = {
    // Add more spells as needed
    FIREBALL : new Spell('Fireball', 
        [ClassType.WIZARD], 
        StatType.INT, 
        [DamageType.FIRE], 
        'Conjure a glowing ball of fire.', 
        [new ManaEffect(2, new AdditionalEffect(ExtraEffects.ATTACK_RADIUS_BONUS, 1, 'Increase Attack Radius by 1'))], 
        new SpellPattern(Patterns.CIRCULAR, 12, 3, 1),
        '2d6'),
    ICE_SHARD : new Spell('Ice Shard', 
        [ClassType.WIZARD, ClassType.SORCERER], 
        StatType.INT, 
        [DamageType.COLD], 
        'A shard of ice shoots forth from your hand.', 
        [new ManaEffect(1, new AdditionalEffect(ExtraEffects.ATTACK_BONUS, 2, 'Increase Attack Damage by 2'))], 
        new SpellPattern(Patterns.TARGET, 60, 0, 1),
        '1d6'),
    LIGHTNING_BOLT : new Spell('Lightning Bolt', 
        [ClassType.WIZARD, ClassType.SORCERER], 
        StatType.INT, 
        [DamageType.LIGHTNING], 
        'A bolt of lightning shoots forth from your hand.', 
        [new ManaEffect(3, new AdditionalEffect(ExtraEffects.ATTACK_BONUS, 3, 'Increase Attack Damage by 3'))], 
        new SpellPattern(Patterns.TARGET, 100, 0, 1),
        '3d8'),
    };

let WeaponList = [
    new Weapon("Holy Dagger", weaponType.DAGGER, WeaponCategory.SIMPLE, [WeaponProperties.LIGHT, WeaponProperties.FINESSE, WeaponProperties.THROWN],
        [new AdditionalEffect(ExtraEffects.ATTACK_BONUS, 4, 'Increase Attack Damage by 4')],
        [BaseWeaponAttacks.SLASH,new Spell('Holy Chase',[ClassType.ALL],StatType.WIS,[DamageType.RADIANT],'Holy Chase: You chase your deity damage and heal yourself.',[    new ManaEffect(0, new AdditionalEffect(ExtraEffects.HEAL, 5, 'Heal 5 hit points')),    new ManaEffect(0, new AdditionalEffect(ExtraEffects.ATTACK_BONUS, 2, 'Increase Attack Damage by 2')),    new ManaEffect(0, new AdditionalEffect(ExtraEffects.DEFENSE, 2, 'Increase Defense by 2')),],new SpellPattern(Patterns.BOX, 3, 1, 1),'2d8')],
        "A holly dagger, probably used by gods to kill another gods."
    ),
    new Weapon("Quarterstaff Of  Fire", weaponType.QUARTERSTAFF, WeaponCategory.SIMPLE, [WeaponProperties.REACH], [], [BaseWeaponAttacks.BONK, 
        new Spell('Fireball', [ClassType.WIZARD], StatType.INT, [DamageType.FIRE], 'Conjure a glowing ball of fire.', [new ManaEffect(0, new AdditionalEffect(ExtraEffects.ATTACK_RADIUS_BONUS, 1, 'Increase Attack Radius by 1'))], new SpellPattern(Patterns.CIRCULAR, 12, 3, 1), '2d6')],
        "A quarterstaff of fire, probably used by gods to kill another gods."),
    new Weapon("Greatsword", weaponType.GREATSWORD, WeaponCategory.MARTIAL, [WeaponProperties.HEAVY, WeaponProperties.TWO_HANDED], [], [BaseWeaponAttacks.SLASH],
        "A large, two-handed sword that is used to deal heavy damage to enemies. It is a popular choice for warriors and barbarians."),
    new Weapon("Longbow", weaponType.LONGBOW, WeaponCategory.MARTIAL, [WeaponProperties.TWO_HANDED, WeaponProperties.THROWN], [], [BaseWeaponAttacks.SLASH],
        "A large, two-handed bow that is used to deal damage to enemies from a distance. It is a popular choice for rangers and hunters."),
    new Weapon("Staff", weaponType.QUARTERSTAFF, WeaponCategory.SIMPLE, [WeaponProperties.REACH], [], [BaseWeaponAttacks.BONK],
        "A long, wooden staff that is used to deal damage to enemies. It is a popular choice for druids and monks."),
    new Weapon("Mace", weaponType.MACE, WeaponCategory.SIMPLE, [WeaponProperties.HEAVY], [], [BaseWeaponAttacks.BONK],
        "A blunt weapon that is used to deal damage to enemies. It is a popular choice for paladins and clerics."),
    new Weapon("Warhammer", weaponType.WARHAMMER, WeaponCategory.MARTIAL, [WeaponProperties.HEAVY, WeaponProperties.TWO_HANDED], [], [BaseWeaponAttacks.BONK],
        "A heavy hammer that is used to deal damage to enemies. It is a popular choice for barbarians and fighters."),
    new Weapon("Spear", weaponType.SPEAR, WeaponCategory.SIMPLE, [WeaponProperties.REACH, WeaponProperties.THROWN], [], [BaseWeaponAttacks.SLASH],
        "A long, pointed weapon that is used to deal damage to enemies. It is a popular choice for rangers and fighters."),
    new Weapon("Javelin", weaponType.JAVELIN, WeaponCategory.SIMPLE, [WeaponProperties.THROWN], [], [BaseWeaponAttacks.SLASH],
        "A short, pointed weapon that is used to deal damage to enemies. It is a popular choice for rangers and fighters."),
    new Weapon("Handaxe", weaponType.HANDAXE, WeaponCategory.SIMPLE, [WeaponProperties.LIGHT, WeaponProperties.THROWN], [], [BaseWeaponAttacks.SLASH],
        "A small, sharp axe that is used to deal damage to enemies. It is a popular choice for barbarians and fighters."),
    new Weapon("Battleaxe", weaponType.BATTLEAXE, WeaponCategory.MARTIAL, [WeaponProperties.HEAVY, WeaponProperties.TWO_HANDED], [], [BaseWeaponAttacks.SLASH],
        "A large, sharp axe that is used to deal damage to enemies. It is a popular choice for barbarians and fighters."),
    new Weapon("Flail", weaponType.FLAIL, WeaponCategory.MARTIAL, [WeaponProperties.HEAVY], [], [BaseWeaponAttacks.BONK],
        "A blunt weapon that is used to deal damage to enemies. It is a popular choice for paladins and clerics."),
    new Weapon("Glaive", weaponType.GLAIVE, WeaponCategory.MARTIAL, [WeaponProperties.REACH, WeaponProperties.TWO_HANDED], [], [BaseWeaponAttacks.SLASH],
        "A long, bladed weapon that is used to deal damage to enemies. It is a popular choice for fighters and barbarians."),
    new Weapon("Halberd", weaponType.HALBERD, WeaponCategory.MARTIAL, [WeaponProperties.REACH, WeaponProperties.TWO_HANDED], [], [BaseWeaponAttacks.SLASH],
        "A long, bladed weapon that is used to deal damage to enemies. It is a popular choice for fighters and barbarians."),
    new Weapon("Pike", weaponType.PIKE, WeaponCategory.MARTIAL, [WeaponProperties.REACH, WeaponProperties.TWO_HANDED], [], [BaseWeaponAttacks.SLASH],
        "A long, pointed weapon that is used to deal damage to enemies. It is a popular choice for fighters and barbarians."),
    new Weapon("Trident", weaponType.TRIDENT, WeaponCategory.MARTIAL, [WeaponProperties.REACH, WeaponProperties.THROWN], [], [BaseWeaponAttacks.SLASH],
        "A three-pronged spear that is used to deal damage to enemies. It is a popular choice for fighters and barbarians."),
    new Weapon("Whip", weaponType.WHIP, WeaponCategory.SIMPLE, [WeaponProperties.REACH, WeaponProperties.FINESSE], [], [BaseWeaponAttacks.SLASH],
        "A long, flexible weapon that is used to deal damage to enemies. It is a popular choice for rogues and bards."),
    new Weapon("Scimitar", weaponType.SCIMITAR, WeaponCategory.MARTIAL, [WeaponProperties.LIGHT, WeaponProperties.FINESSE], [], [BaseWeaponAttacks.SLASH],
        "A curved sword that is used to deal damage to enemies. It is a popular choice for rogues and fighters."),
    new Weapon("Rapier", weaponType.RAPIER, WeaponCategory.MARTIAL, [WeaponProperties.LIGHT, WeaponProperties.FINESSE], [], [BaseWeaponAttacks.SLASH],
        "A slender sword that is used to deal damage to enemies. It is a popular choice for rogues and fighters."),
    new Weapon("Shortsword", weaponType.SHORTSWORD, WeaponCategory.SIMPLE, [WeaponProperties.LIGHT, WeaponProperties.FINESSE], [], [BaseWeaponAttacks.SLASH],
        "A short, sharp sword that is used to deal damage to enemies. It is a popular choice for rogues and fighters."),
    new Weapon("Longsword", weaponType.LONGSWORD, WeaponCategory.MARTIAL, [WeaponProperties.LIGHT, WeaponProperties.TWO_HANDED], [], [BaseWeaponAttacks.SLASH],
        "A long, sharp sword that is used to deal damage to enemies. It is a popular choice for fighters and paladins."),
    new Weapon("Morningstar", weaponType.MORNINGSTAR, WeaponCategory.MARTIAL, [WeaponProperties.HEAVY], [], [BaseWeaponAttacks.BONK],
        "A blunt weapon with a spiked head that is used to deal damage to enemies. It is a popular choice for paladins and clerics."),
    new Weapon("Maul", weaponType.MAUL, WeaponCategory.MARTIAL, [WeaponProperties.HEAVY, WeaponProperties.TWO_HANDED], [], [BaseWeaponAttacks.BONK],
        "A heavy hammer that is used to deal damage to enemies. It is a popular choice for barbarians and fighters."),
    new Weapon("Club", weaponType.CLUB, WeaponCategory.SIMPLE, [WeaponProperties.LIGHT], [], [BaseWeaponAttacks.BONK],
        "A simple club that is used to deal damage to enemies. It is a popular choice for barbarians and fighters."),
    new Weapon("Greatclub", weaponType.GREATCLUB, WeaponCategory.SIMPLE, [WeaponProperties.HEAVY, WeaponProperties.TWO_HANDED], [], [BaseWeaponAttacks.BONK],
        "A large club that is used to deal damage to enemies. It is a popular choice for barbarians and fighters."),
    new Weapon("Light Crossbow", weaponType.LIGHTCROSSBOW, WeaponCategory.MARTIAL, [WeaponProperties.LIGHT, WeaponProperties.TWO_HANDED, WeaponProperties.THROWN], [], [BaseWeaponAttacks.SLASH],
        "A small crossbow that is used to deal damage to enemies. It is a popular choice for rogues and rangers."),
    new Weapon("Heavy Crossbow", weaponType.HEAVYCROSSBOW, WeaponCategory.MARTIAL, [WeaponProperties.HEAVY, WeaponProperties.TWO_HANDED, WeaponProperties.THROWN], [], [BaseWeaponAttacks.SLASH],
        "A large crossbow that is used to deal damage to enemies. It is a popular choice for rogues and rangers."),
    new Weapon("Dart", weaponType.DART, WeaponCategory.SIMPLE, [WeaponProperties.LIGHT, WeaponProperties.THROWN], [], [BaseWeaponAttacks.SLASH],
        "A small, pointed weapon that is used to deal damage to enemies. It is a popular choice for rogues and rangers."),
    new Weapon("Shortbow", weaponType.SHORTBOW, WeaponCategory.SIMPLE, [WeaponProperties.TWO_HANDED, WeaponProperties.THROWN], [], [BaseWeaponAttacks.SLASH],
        "A small bow that is used to deal damage to enemies. It is a popular choice for rogues and rangers."),
];