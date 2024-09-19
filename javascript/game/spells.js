const knownSpellString = " / Known";
const spellNormalCast = "Normal Cast";

let userSpells = {};

function checkSpellUsable(char, spell) {
    // Check if the character has enough spell slots
    return Object.keys(spell.spendManaEffects).every((mana) => {
        const val = char.spellSlots[mana];
        return val[1] > 0;
    });
}

const level1_spell_list = {
    // Add more spells as needed
    'Fireball' : new Spell('Fireball',
        [classType.WIZARD], 
        statType.INT, 
        damageType.FIRE, 
        'Conjure a glowing ball of fire.',
        null,
        {   '1' : spellNormalCast,
            '2' : [new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_RADIUS_BONUS, 100),], 'Increase Attack Radius'),
                    new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_DAMAGE_BONUS, [damageType.ACID, 5]),], 'Increase Attack Radius')],
            '3' : [new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_RADIUS_BONUS, 100),], 'Increase Attack Radius'),
                    new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_DAMAGE_BONUS, [damageType.ACID, 5]),], 'Increase Attack Radius'),
                    new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.DICE_CHANGE, '4d8'),], 'Increase Attack Radius')]
        },
        new SpellPattern(spellPatterns.CIRCULAR, 800, 100, castType.ON_LOCATION),
        '2d6', durationTypes.INSTANT, actionType.MAIN, [rollTypes.INT_SAVING_THROW], [rollTypes.CON_SAVING_THROW]
    ),
    'Ice Cone' : new Spell('Ice Cone', 
        [classType.WIZARD], 
        statType.INT, 
        damageType.FROST, 
        'Conjure a glowing ball of fire.',
        null,
        {'1' : spellNormalCast,
            '2' : [new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1')]},
        new SpellPattern(spellPatterns.CONE_UPWARD, 800, 100, castType.ON_LOCATION),
        '2d6', durationTypes.INSTANT, actionType.MAIN, [rollTypes.INT_SAVING_THROW], [rollTypes.CON_SAVING_THROW]
    ),
    'Pillar of Light' : new Spell('Pillar of Light', 
        [classType.WIZARD], 
        statType.INT, 
        damageType.RADIANT, 
        'Conjure a glowing piller of light.',
        null,
        {'1' : spellNormalCast,
            '2' : [new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1')]},
        new SpellPattern(spellPatterns.CONE_DOWNWARD, 800, 100, castType.ON_LOCATION),
        '2d6', durationTypes.INSTANT, actionType.MAIN, [rollTypes.INT_SAVING_THROW], [rollTypes.CON_SAVING_THROW], [targetTypes.ENEMY]
    ),   
    'Fire Hands' : new Spell('Fire Hands', 
        [classType.WIZARD], 
        statType.INT, 
        damageType.FIRE, 
        'Conjure a glowing ball of fire.',
        null,
        {'1' : spellNormalCast,
            '2' : [new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1')]},
        new SpellPattern(spellPatterns.CONE_DOWNWARD, 800, 100, castType.FROM_CASTER),
        '2d6', durationTypes.INSTANT, actionType.MAIN, [rollTypes.INT_SAVING_THROW], [rollTypes.CON_SAVING_THROW]
    ),
    'Lightning Ray' : new Spell('Lightning Ray', 
        [classType.WIZARD], 
        statType.INT, 
        damageType.LIGHTNING, 
        'Conjure a glowing ball of fire.',
        null,
        {'1' : spellNormalCast,
            '2' : [new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1')]},
        new SpellPattern(spellPatterns.BOX, 800, 100, castType.FROM_CASTER),
        '2d6', durationTypes.INSTANT, actionType.MAIN, [rollTypes.INT_SAVING_THROW], [rollTypes.CON_SAVING_THROW]
    ),
    'Heralde' : new Spell('Heralde', 
        [classType.WIZARD], 
        statType.INT, 
        damageType.NONE, 
        'Increases charisma of all players around caster',
        {
            '2': [new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.CAST, [new Spell()], 'Increase Attack Radius by 1')],
        },
        {'1' : spellNormalCast,
            '2' : [new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.AURA, [new Aura()], 'Increase Attack Radius by 1')],
            '3' : [new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.CAST, [new Aura()], 'Increase Attack Radius by 1')],
            '4' : [new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1'),
                    new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_DAMAGE_BONUS, [damageType.HEALING, '4d8']),], 'Increase Attack Radius'),
                    new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_DAMAGE_BONUS, [damageType.FORCE, 20]),], 'Increase Attack Radius')]
        },
        new SpellPattern(spellPatterns.CIRCULAR, 800, 100, castType.AROUND_CASTER),
        '2d6', durationTypes.INSTANT, actionType.MAIN, [rollTypes.INT_SAVING_THROW], [rollTypes.CON_SAVING_THROW], [targetTypes.ALLY, targetTypes.SELF]
    ),
    'Conjure Mountainless Dwarf': new Spell('Conjure Mountainless Dwarf',
        [classType.WIZARD], 
        statType.INT, 
        damageType.CONJURE, 
        'Conjure a Mountainless dwarf',
        null,
        {'1' : spellNormalCast},
        new SpellPattern(spellPatterns.CIRCULAR, 500, 100, castType.ON_LOCATION),
        'mountainless_dwarf', durationTypes.INSTANT, actionType.MAIN, [rollTypes.INT_SAVING_THROW], [rollTypes.CON_SAVING_THROW], [targetTypes.ANY]
    ),
};


let listSpells = {
    1: level1_spell_list,
    2: level1_spell_list    //Future
};