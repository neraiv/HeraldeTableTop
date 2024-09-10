const knownSpellString = " / Known";

let userSpells = {};

const listSpellEffect = Object.freeze({
    COUNTER_SPELL: new AdditionalEffect(characterActions.ATTACKED, additionalEffects.CAST, null, "U strike back with this spell"),
});

const level1_spell_list = {
    // Add more spells as needed
    'Fireball' : new Spell('Fireball', 
        [classType.WIZARD], 
        statType.INT, 
        [damageType.FIRE], 
        'Conjure a glowing ball of fire.', 
        {'1' : 1,
            '2' : new AdditionalEffect(characterActions.CASTING, additionalEffects.ATTACK_RADIUS_BONUS, 50, 'Increase Attack Radius by 1')}, 
        new SpellPattern(spellPatterns.CIRCULAR, 400, 100, 1, castType.ON_LOCATION),
        '2d6'),
    'Ice Cone' : new Spell('Ice Cone', 
        [classType.WIZARD, classType.SORCERER], 
        statType.INT, 
        [damageType.COLD], 
        'A Cone of ice shoots forth from your hand.', 
        { '1' : new AdditionalEffect(characterActions.CASTING, additionalEffects.ATTACK_BONUS, 2, 'Increase Attack Damage')}, 
        new SpellPattern(spellPatterns.CONE_UPWARD, 400, 100, 1, castType.FROM_CASTER),
        '1d6'),
    'Fire Hands' : new Spell('Fire Hands', 
        [classType.WIZARD, classType.SORCERER], 
        statType.INT, 
        [damageType.FIRE], 
        'Burn them all !!!!.', 
        {'1': new AdditionalEffect(characterActions.CASTING, additionalEffects.ATTACK_BONUS, 2, 'Increase Attack Damage')}, 
        new SpellPattern(spellPatterns.CONE_DOWNWARD, 400, 100, 1, castType.FROM_CASTER),
        '1d6'),
    'Lightning Ray' : new Spell('Lightning Ray', 
        [classType.WIZARD, classType.SORCERER], 
        statType.INT, 
        [damageType.LIGHTNING], 
        'A bolt of lightning shoots forth from your hand.', 
        null, characterActions.ATTACKED, 
        { '2' : new AdditionalEffect(characterActions.CASTING, additionalEffects.ATTACK_BONUS, 3, 'Increase Attack Damage'),
            '3' : new AdditionalEffect(characterActions.CASTING, additionalEffects.ATTACK_RANGE_BONUS, 100, 'Increase Attack Damage')}, 
        new SpellPattern(spellPatterns.BOX, 400, 100, 1, castType.FROM_CASTER),
        '3d8'),
    'Heralde' : new Spell('Heralde', [classType.ALL], statType.NONE, damageType.NONE, "Heralde abla!", [listSpellEffect.COUNTER_SPELL], characterActions.ATTACKED, null, 
            new SpellPattern(spellPatterns.TARGET, 1, 1, castType.ON_LOCATION, [targetTypes.SELF]), '0'),
};


let listSpells = {
    1: level1_spell_list,
    2: level1_spell_list    //Future
};