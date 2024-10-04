const knownSpellString = " / Known";
const spellNormalCast = "Normal Cast";
const noEffect = "No Effect";
const attackerSpellMana     = "Attacker-Spell-Mana";
const attackerSpellLevel    = "Attacker-Spell-Level";
const attackerSpellName     = "Attacker-Spell-Name";
const noDescription = null;

let userSpells = {};

let listCreatedAdditionalEffects = Object.freeze({
    'burningEffect' : new AdditionalEffect("Holy Burn", [characterActions.TURN_END], 
                            [new Aura(100, new BuffDebuff(effectTypes.TAKE_DAMAGE, [damageTypes.FIRE,'1d8']), [targetTypes.SELF], true)], 
                            noDescription, [durationTypes.TURN_BASED, 10]),
    'attackRadiusBonus_50' : new AdditionalEffect("Spell Shoot", [characterActions.ATTACKING],
                          [new BuffDebuff(effectTypes.ATTACK_RADIUS_BONUS, 50)], noDescription, [durationTypes.INSTANT]),
                          
    'attackRadiusBonus_100' : new AdditionalEffect("Spell Shoot", [characterActions.ATTACKING],
                              [new BuffDebuff(effectTypes.ATTACK_RADIUS_BONUS, 100)], noDescription, [durationTypes.INSTANT]),

    'attackRangeBonus_100' : new AdditionalEffect("Eagle Spell Shoot", [characterActions.ATTACKING],
                                  [new BuffDebuff(effectTypes.ATTACK_RANGE_BONUS, 100)], noDescription, [durationTypes.INSTANT]),

    'attackRangeBonus_200' : new AdditionalEffect("Eagle Spell Shoot", [characterActions.ATTACKING],
                                      [new BuffDebuff(effectTypes.ATTACK_RANGE_BONUS, 200)], noDescription, [durationTypes.INSTANT]),
                                        
    'counterSpellEffect' : new AdditionalEffect('Anti-Mage Shield', [characterActions.ATTACKED], 
                                      [new Cast('Fireball', 1, 2[targetTypes.ATTACKER, targetTypes.CLOSEST_ENEMY])], noDescription, [durationTypes.INSTANT]),

    'counterMirrorSpell' : new AdditionalEffect('Dont Attack Ur Self', [characterActions.ATTACKED], 
                          [new Cast(attackerSpellMana, attackerSpellLevel, attackerSpellName , [targetTypes.ATTACKER, targetTypes.CLOSEST_ENEMY])], noDescription, [durationTypes.INSTANT]),

    'holyAura' :    new AdditionalEffect("Holy Aura", [characterActions.TURN_END], 
                      [new Aura(100, new BuffDebuff(effectTypes.DEFENSE, '4'), [targetTypes.ALLY], true),
                      new Aura(100, new BuffDebuff(effectTypes.TAKE_DAMAGE, [damageTypes.RADIANT,'1d8']), [targetTypes.ENEMY], true)], 
                      noDescription, [durationTypes.TURN_BASED, 10]),

    'startFireBallParty' : new AdditionalEffect("Fireball For Everyone", [characterActions.TURN_START], 
                                    [new Aura(100, new Cast('Fireball', 1, 2[targetTypes.CLOSEST_ANY]), [targetTypes.ANY], true)], noDescription, [durationTypes.ALWAYS]),
                            
});

const level1_spell_list = {
    // Add more spells as needed
    'Fireball' : new Spell('Fireball',
        spellTypes.SPELL, [classTypes.WIZARD, classTypes.DRUID],
        1, statTypes.INT, damageTypes.LIGHTNING, '2d8', 'Zapp ur enemies on path, or annoying friends',
        new Duration(durationTypes.INSTANT), actionTypes.MAIN,
        {
            '2' : {caster: [new AdditionalEffect('Double The Zap',[characterActions.CASTING], [new BuffDebuff(effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Double the lighting ray path')]}
        },
        new SpellPattern(spellPatterns.CIRCULAR, 800, 100, castTypes.ON_LOCATION, [targetTypes.ENEMY]),
        [rollTypes.ABILITY_THROW], null
    ),
    'Ice Cone' : new Spell('Ice Cone', 
        spellTypes.SPELL, [classTypes.WIZARD, classTypes.DRUID],
        1, statTypes.INT, damageTypes.LIGHTNING, '2d8', 'Zapp ur enemies on path, or annoying friends',
        new Duration(durationTypes.INSTANT), actionTypes.MAIN,
        {
            '2' : {caster: [new AdditionalEffect('Double The Zap',[characterActions.CASTING], [new BuffDebuff(effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Double the lighting ray path')]}
        },
        new SpellPattern(spellPatterns.CONE_UPWARD, 800, 100, castTypes.FROM_CASTER, [targetTypes.ANY]),
        [rollTypes.ABILITY_THROW], null
    ),
    'Pillar of Light' : new Spell('Pillar of Light', 
        spellTypes.SPELL, [classTypes.WIZARD, classTypes.DRUID],
        1, statTypes.INT, damageTypes.LIGHTNING, '2d8', 'Zapp ur enemies on path, or annoying friends',
        new Duration(durationTypes.INSTANT), actionTypes.MAIN,
        {
            '2' : {caster: [new AdditionalEffect('Double The Zap',[characterActions.CASTING], [new BuffDebuff(effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Double the lighting ray path')]}
        },
        new SpellPattern(spellPatterns.CONE_UPWARD, 800, 100, castTypes.ON_LOCATION, [targetTypes.ANY]),
        [rollTypes.ABILITY_THROW], null
    ),   
    'Fire Hands' : new Spell('Fire Hands', 
        spellTypes.SPELL, [classTypes.WIZARD, classTypes.DRUID],
        1, statTypes.INT, damageTypes.LIGHTNING, '2d8', 'Zapp ur enemies on path, or annoying friends',
        new Duration(durationTypes.INSTANT), actionTypes.MAIN,
        {
            '2' : {caster: [new AdditionalEffect('Double The Zap',[characterActions.CASTING], [new BuffDebuff(effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Double the lighting ray path')]}
        
        },
        new SpellPattern(spellPatterns.CONE_DOWNWARD, 800, 100, castTypes.FROM_CASTER, [targetTypes.ANY]),
        [rollTypes.ABILITY_THROW], null
    ),
    'Lightning Ray' : new Spell('Lightning Ray', 
        spellTypes.SPELL, [classTypes.WIZARD, classTypes.DRUID],
        1, statTypes.INT, damageTypes.LIGHTNING, '2d8', 'Zapp ur enemies on path, or annoying friends',
        new Duration(durationTypes.INSTANT), actionTypes.MAIN,
        {
            '2' : {caster: [new AdditionalEffect('Double The Zap',[characterActions.CASTING], [new BuffDebuff(effectTypes.ATTACK_RADIUS_BONUS, 100)], 'Double the lighting ray path')]}
        },
        new SpellPattern(spellPatterns.BOX, 800, 100, castTypes.FROM_CASTER, [targetTypes.ANY]),
        [rollTypes.ABILITY_THROW], null
    ),
    'Heralde' : new Spell('Heralde', 
        spellTypes.SPELL, [classTypes.WIZARD],
        1, statTypes.CHA, damageTypes.NONE, null, 'Increases charisma of all players around caster', 
        new Duration(durationTypes.INSTANT), actionTypes.MAIN,
        {
            '2' : {caster: [listCreatedAdditionalEffects.holyAura], 
                    target: [listCreatedAdditionalEffects.counterSpellEffect]},
            '3' : {caster: [listCreatedAdditionalEffects.attackRadiusBonus_100, listCreatedAdditionalEffects.attackRangeBonus_200]},
            '4' : {caster: [listCreatedAdditionalEffects.startFireBallParty, listCreatedAdditionalEffects.attackRadiusBonus_100]}
        },
        new SpellPattern(spellPatterns.CIRCULAR, 800, 100, castTypes.AROUND_CASTER, [targetTypes.ALLY, targetTypes.SELF]),
        [rollTypes.ABILITY_THROW], null
    ),
    'Conjure Mountainless Dwarf': new Spell('Conjure Mountainless Dwarf',
        spellTypes.CONJURE,[classTypes.DRUID],
        1, statTypes.NONE, damageTypes.NONE, 'mountainless_dwarf', 'Conjure a Mountainless dwarf',
        new Duration(durationTypes.INSTANT), actionTypes.MAIN,
        [], new SpellPattern(spellPatterns.CIRCULAR, 500, 100, castTypes.ON_LOCATION, [targetTypes.GROUND_NO_OVERLAP]),
        [rollTypes.ABILITY_THROW], null
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
