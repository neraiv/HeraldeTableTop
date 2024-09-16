const knownSpellString = " / Known";
const spellNormalCast = "Normal Cast";

let userSpells = {};

const level1_spell_list = {
    // Add more spells as needed
    'Fireball' : new Spell('Fireball',
        [classType.WIZARD], 
        statType.INT, 
        [damageType.FIRE], 
        'Conjure a glowing ball of fire.',
        null,
        {'1' : spellNormalCast,
            '2' : new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1')},
        new SpellPattern(spellPatterns.CIRCULAR, 800, 100, castType.ON_LOCATION),
        '2d6', durationTypes.INSTANT, actionType.MAIN),
    'Ice Cone' : new Spell('Ice Cone', 
        [classType.WIZARD], 
        statType.INT, 
        [damageType.FIRE], 
        'Conjure a glowing ball of fire.',
        null,
        {'1' : spellNormalCast,
            '2' : new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1')},
        new SpellPattern(spellPatterns.CONE_UPWARD, 800, 100, castType.ON_LOCATION),
        '2d6', durationTypes.INSTANT, actionType.MAIN),
    'Fire Hands' : new Spell('Fire Hands', 
        [classType.WIZARD], 
        statType.INT, 
        [damageType.FIRE], 
        'Conjure a glowing ball of fire.',
        null,
        {'1' : spellNormalCast,
            '2' : new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1')},
        new SpellPattern(spellPatterns.CONE_DOWNWARD, 800, 100, castType.FROM_CASTER),
        '2d6', durationTypes.INSTANT, actionType.MAIN),
    'Lightning Ray' : new Spell('Lightning Ray', 
        [classType.WIZARD], 
        statType.INT, 
        [damageType.FIRE], 
        'Conjure a glowing ball of fire.',
        null,
        {'1' : spellNormalCast,
            '2' : new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1')},
        new SpellPattern(spellPatterns.BOX, 800, 100, castType.FROM_CASTER),
        '2d6', durationTypes.INSTANT, actionType.MAIN),
    'Heralde' : new Spell('Heralde', 
        [classType.WIZARD], 
        statType.INT, 
        [damageType.FIRE], 
        'Increases charisma of all players around caster',
        null,
        {'1' : spellNormalCast,
            '2' : new AdditionalEffect(characterActions.CASTING,  targetEffectTypes.BUFF, [new BuffDebuff(durationTypes.INSTANT, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1')},
        new SpellPattern(spellPatterns.CIRCULAR, 800, 100, castType.AROUND_CASTER),
        '2d6', durationTypes.INSTANT, actionType.MAIN),
};


let listSpells = {
    1: level1_spell_list,
    2: level1_spell_list    //Future
};