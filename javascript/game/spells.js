const knownSpellString = " / Known";
const spellNormalCast = "Normal Cast";
const noEffect = "No Effect";
const attackerSpellMana     = "Attacker-Spell-Mana";
const attackerSpellLevel    = "Attacker-Spell-Level";
const attackerSpellName     = "Attacker-Spell-Name";
const noDescription = null;

let userSpells = {};

function checkSpellUsable(char, spell) {
    // Check if the character has enough spell slots
    return Object.keys(spell.spendManaEffects).every((mana) => {
        const val = char.spellSlots[mana];
        return val[1] > 0;
    });
}

let listCreatedAdditionalEffects = Object.freeze({
    'burningEffect' : new AdditionalEffect("Holy Burn", [characterActions.TURN_END], 
                            [new Aura(100, new BuffDebuff(effectTypes.TAKE_DAMAGE, [damageType.FIRE,'1d8']), [targetTypes.SELF], true)], 
                            noDescription, [durationTypes.TURN_BASED, 10], effectSourceTypes.SELF),
    'attackRadiusBonus_50' : new AdditionalEffect("Spell Shoot", [characterActions.ATTACKING],
                          [new BuffDebuff(effectTypes.ATTACK_RADIUS_BONUS, 50)], noDescription, [durationTypes.UNTIL_USE]),
                          
    'attackRadiusBonus_100' : new AdditionalEffect("Spell Shoot", [characterActions.ATTACKING],
                              [new BuffDebuff(effectTypes.ATTACK_RADIUS_BONUS, 100)], noDescription, [durationTypes.UNTIL_USE]),

    'attackRangeBonus_100' : new AdditionalEffect("Eagle Spell Shoot", [characterActions.ATTACKING],
                                  [new BuffDebuff(effectTypes.ATTACK_RANGE_BONUS, 100)], noDescription, [durationTypes.UNTIL_USE]),

    'attackRangeBonus_200' : new AdditionalEffect("Eagle Spell Shoot", [characterActions.ATTACKING],
                                      [new BuffDebuff(effectTypes.ATTACK_RANGE_BONUS, 200)], noDescription, [durationTypes.UNTIL_USE]),
                                        
    'counterSpellEffect' : new AdditionalEffect('Anti-Mage Shield', [characterActions.ATTACKED], 
                                      [new Cast('Fireball', 1, 2[targetTypes.ATTACKER, targetTypes.CLOSEST_ENEMY])], noDescription, [durationTypes.UNTIL_USE]),

    'counterMirrorSpell' : new AdditionalEffect('Dont Attack Ur Self', [characterActions.ATTACKED], 
                          [new Cast(attackerSpellMana, attackerSpellLevel, attackerSpellName , [targetTypes.ATTACKER, targetTypes.CLOSEST_ENEMY])], noDescription, [durationTypes.UNTIL_USE]),

    'holyAura' :    new AdditionalEffect("Holy Aura", [characterActions.TURN_END], 
                      [new Aura(100, new BuffDebuff(effectTypes.DEFENSE, '4'), [targetTypes.ALLY], true),
                      new Aura(100, new BuffDebuff(effectTypes.TAKE_DAMAGE, [damageType.RADIANT,'1d8']), [targetTypes.ENEMY], true)], 
                      noDescription, [durationTypes.TURN_BASED, 10], effectSourceTypes.SELF),

    'startFireBallParty' : new AdditionalEffect("Fireball For Everyone", [characterActions.TURN_START], 
                                    [new Aura(100, new Cast('Fireball', 1, 2[targetTypes.CLOSEST_ANY]), [targetTypes.ANY], true)], noDescription, [durationTypes.ALWAYS]),
                            
});

const level1_spell_list = {
    // Add more spells as needed
    'Fireball' : new Spell('Fireball',
        [classType.WIZARD], 
        statType.INT, 
        damageType.FIRE, 
        'Conjure a glowing ball of fire.',
        null,
        {   '1' : [spellNormalCast],
            '2' : [listCreatedAdditionalEffects.attackRadiusBonus_100, listCreatedAdditionalEffects.attackRangeBonus_200],
            '3' : ['2', new AdditionalEffect("Spell Shoot", [characterActions.ATTACKING], [new BuffDebuff(effectTypes.DICE_CHANGE, '4d8')], noDescription, [durationTypes.UNTIL_USE])]
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
        {'1' : [spellNormalCast],
            '2' : [listCreatedAdditionalEffects.attackRadiusBonus_100]},
        new SpellPattern(spellPatterns.CONE_UPWARD, 800, 100, castType.ON_LOCATION),
        '2d6', durationTypes.INSTANT, actionType.MAIN, [rollTypes.INT_SAVING_THROW], [rollTypes.CON_SAVING_THROW]
    ),
    'Pillar of Light' : new Spell('Pillar of Light', 
        [classType.WIZARD], 
        statType.INT, 
        damageType.RADIANT, 
        'Conjure a glowing piller of light.',
        null,
        {'1' : [spellNormalCast],
            '2' : [new AdditionalEffect([characterActions.CASTING],  [new BuffDebuff(durationTypes.UNTIL_USE, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1')]},
        new SpellPattern(spellPatterns.CONE_DOWNWARD, 800, 100, castType.ON_LOCATION),
        '2d6', durationTypes.INSTANT, actionType.MAIN, [rollTypes.INT_SAVING_THROW], [rollTypes.CON_SAVING_THROW], [targetTypes.ENEMY]
    ),   
    'Fire Hands' : new Spell('Fire Hands', 
        [classType.WIZARD], 
        statType.INT, 
        damageType.FIRE, 
        'Conjure a glowing ball of fire.',
        null,
        {'1' : [spellNormalCast],
            '2' : [new AdditionalEffect([characterActions.CASTING],  [new BuffDebuff(durationTypes.UNTIL_USE, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1')]},
        new SpellPattern(spellPatterns.CONE_DOWNWARD, 800, 100, castType.FROM_CASTER),
        '2d6', durationTypes.INSTANT, actionType.MAIN, [rollTypes.INT_SAVING_THROW], [rollTypes.CON_SAVING_THROW]
    ),
    'Lightning Ray' : new Spell('Lightning Ray', 
        [classType.WIZARD], 
        statType.INT, 
        damageType.LIGHTNING, 
        'Conjure a glowing ball of fire.',
        null,
        {'1' : [spellNormalCast],
            '2' : [new AdditionalEffect([characterActions.CASTING],  [new BuffDebuff(durationTypes.UNTIL_USE, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1')]},
        new SpellPattern(spellPatterns.BOX, 800, 100, castType.FROM_CASTER),
        '2d6', durationTypes.INSTANT, actionType.MAIN, [rollTypes.INT_SAVING_THROW], [rollTypes.CON_SAVING_THROW]
    ),
    'Heralde' : new Spell('Heralde', 
        [classType.WIZARD], 
        statType.INT, 
        damageType.NONE, 
        'Increases charisma of all players around caster',
        {
            '2': [listCreatedAdditionalEffects.counterMirrorSpell],
        },
        {   '1' : [spellNormalCast],
            '2' : [listCreatedAdditionalEffects.holyAura],
            '3' : [listCreatedAdditionalEffects.attackRadiusBonus_100, listCreatedAdditionalEffects.attackRangeBonus_200],
            '4' : [listCreatedAdditionalEffects.startFireBallParty, listCreatedAdditionalEffects.attackRadiusBonus_100]
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
        {'1' : [spellNormalCast]},
        new SpellPattern(spellPatterns.CIRCULAR, 500, 100, castType.ON_LOCATION),
        'mountainless_dwarf', durationTypes.INSTANT, actionType.MAIN, [rollTypes.INT_SAVING_THROW], [rollTypes.CON_SAVING_THROW], [targetTypes.ANY]
    ),
};


let listSpells = {
    0: level1_spell_list,
    1: level1_spell_list,
    2: level1_spell_list,    //Future
    3: level1_spell_list,
    4: level1_spell_list,    //Future
    5: level1_spell_list,    //Future
    6: level1_spell_list,    //Future
    7: level1_spell_list,    //Future
    8: level1_spell_list,    //Future
    9: level1_spell_list,    //Future
};
