const knownSpellString = " / Known";
const spellNormalCast = "Normal Cast";
const noEffect = "No Effect";
const attackerSpell = "Attacker-Spell";
const noDescription = null;

let userSpells = {};

function checkSpellUsable(char, spell) {
    // Check if the character has enough spell slots
    return Object.keys(spell.spendManaEffects).every((mana) => {
        const val = char.spellSlots[mana];
        return val[1] > 0;
    });
}

const burningEffect = new AdditionalEffect("Holy Burn", characterActions.TURN_END, additionalEffectTypes.AURA, 
                            [new Aura(100, new BuffDebuff(effectTypes.TAKE_DAMAGE, [damageType.FIRE,'1d8']), [targetTypes.SELF], true)], 
                            noDescription, [durationTypes.TURN_BASED, 10], effectSourceTypes.SELF)

const attackRadiusBonus_50 = new AdditionalEffect("Spell Shoot", characterActions.ATTACKING, additionalEffectTypes.BUFF,
                            [new BuffDebuff(effectTypes.ATTACK_RADIUS_BONUS, 50)], noDescription, [durationTypes.UNTIL_USE])
                            
const attackRadiusBonus_100 = new AdditionalEffect("Spell Shoot", characterActions.ATTACKING, additionalEffectTypes.BUFF,
                                [new BuffDebuff(effectTypes.ATTACK_RADIUS_BONUS, 100)], noDescription, [durationTypes.UNTIL_USE])

const attackRangeBonus_100 = new AdditionalEffect("Eagle Spell Shoot", characterActions.ATTACKING, additionalEffectTypes.BUFF,
                                    [new BuffDebuff(effectTypes.ATTACK_RANGE_BONUS, 100)], noDescription, [durationTypes.UNTIL_USE])

const attackRangeBonus_200 = new AdditionalEffect("Eagle Spell Shoot", characterActions.ATTACKING, additionalEffectTypes.BUFF,
                                        [new BuffDebuff(effectTypes.ATTACK_RANGE_BONUS, 200)], noDescription, [durationTypes.UNTIL_USE])
                                          
const counterSpellEffect = new AdditionalEffect('Anti-Mage Shield', characterActions.ATTACKED, additionalEffectTypes.CAST, 
                                        [new Cast('Fireball', 1, 2[targetTypes.ATTACKER, targetTypes.CLOSEST_ENEMY])], noDescription, [durationTypes.UNTIL_USE])

const counterMirrorSpell = new AdditionalEffect('Dont Attack Ur Self', characterActions.ATTACKED, additionalEffectTypes.CAST, 
                            [new Cast(attackerSpell, [targetTypes.ATTACKER, targetTypes.CLOSEST_ENEMY])], noDescription, [durationTypes.UNTIL_USE])

const holyAura =    new AdditionalEffect("Holy Aura", characterActions.TURN_END, additionalEffectTypes.AURA, 
                        [new Aura(100, new BuffDebuff(effectTypes.DEFENSE, '4'), [targetTypes.ALLY], true),
                        new Aura(100, new BuffDebuff(effectTypes.TAKE_DAMAGE, [damageType.RADIANT,'1d8']), [targetTypes.ENEMY], true)], 
                        noDescription, [durationTypes.TURN_BASED, 10], effectSourceTypes.SELF)

const startFireBallParty = new AdditionalEffect("Turn themind", characterActions.TURN_START, additionalEffectTypes.AURA, 
                                [new Aura(100, new Cast('Fireball', 1, 2[targetTypes.CLOSEST_ANY]), [targetTypes.ANY], true)], noDescription, [durationTypes.ALWAYS]);

const level1_spell_list = {
    // Add more spells as needed
    'Fireball' : new Spell('Fireball',
        [classType.WIZARD], 
        statType.INT, 
        damageType.FIRE, 
        'Conjure a glowing ball of fire.',
        null,
        {   '1' : spellNormalCast,
            '2' : [new AdditionalEffect("Spell Shoot", characterActions.ATTACKING, additionalEffectTypes.BUFF, [new BuffDebuff(effectTypes.ATTACK_RADIUS_BONUS, 100)], noDescription, [durationTypes.UNTIL_USE]),
                    new AdditionalEffect("Spell Shoot", characterActions.ATTACKING, additionalEffectTypes.BUFF, [new BuffDebuff(effectTypes.ATTACK_RADIUS_BONUS, 100)], noDescription, [durationTypes.UNTIL_USE])],
            '3' : ['2', new AdditionalEffect("Spell Shoot", characterActions.ATTACKING, additionalEffectTypes.BUFF, [new BuffDebuff(effectTypes.DICE_CHANGE, '4d8')], noDescription, [durationTypes.UNTIL_USE])]
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
            '2' : [attackRadiusBonus_100]},
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
            '2' : [new AdditionalEffect(characterActions.CASTING,  additionalEffectTypes.BUFF, [new BuffDebuff(durationTypes.UNTIL_USE, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1')]},
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
            '2' : [new AdditionalEffect(characterActions.CASTING,  additionalEffectTypes.BUFF, [new BuffDebuff(durationTypes.UNTIL_USE, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1')]},
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
            '2' : [new AdditionalEffect(characterActions.CASTING,  additionalEffectTypes.BUFF, [new BuffDebuff(durationTypes.UNTIL_USE, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1')]},
        new SpellPattern(spellPatterns.BOX, 800, 100, castType.FROM_CASTER),
        '2d6', durationTypes.INSTANT, actionType.MAIN, [rollTypes.INT_SAVING_THROW], [rollTypes.CON_SAVING_THROW]
    ),
    'Heralde' : new Spell('Heralde', 
        [classType.WIZARD], 
        statType.INT, 
        damageType.NONE, 
        'Increases charisma of all players around caster',
        {
            '2': [new AdditionalEffect(characterActions.CASTING,  additionalEffectTypes.CAST, [new Spell()], 'Increase Attack Radius by 1')],
        },
        {'1' : spellNormalCast,
            '2' : [new AdditionalEffect(characterActions.CASTING,  additionalEffectTypes.AURA, [new Aura()], 'Increase Attack Radius by 1')],
            '3' : [new AdditionalEffect(characterActions.CASTING,  additionalEffectTypes.CAST, [new Aura()], 'Increase Attack Radius by 1')],
            '4' : [new AdditionalEffect(characterActions.CASTING,  additionalEffectTypes.BUFF, [new BuffDebuff(durationTypes.UNTIL_USE, effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Increase Attack Radius by 1'),
                    new AdditionalEffect(characterActions.CASTING,  additionalEffectTypes.BUFF, [new BuffDebuff(durationTypes.UNTIL_USE, effectTypes.ATTACK_DAMAGE_BONUS, [damageType.HEALING, '4d8']),], 'Increase Attack Radius'),
                    new AdditionalEffect(characterActions.CASTING,  additionalEffectTypes.BUFF, [new BuffDebuff(durationTypes.UNTIL_USE, effectTypes.ATTACK_DAMAGE_BONUS, [damageType.FORCE, 20]),], 'Increase Attack Radius')]
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