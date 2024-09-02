const listBaseWeaponAttacks = Object.freeze({
    // Add more weapon types as needed
    SLASH: new Spell('Slashing Attack', [classType.ALL], [statType.DEX], [damageType.SLASHING], 'Slashing attack!', [], new SpellPattern(patterns.TARGET, 1, 0, 1), '1d8'),
    BONK : new Spell('Bonk!!', [classType.ALL], [statType.STR], [damageType.BLUDGEONING], 'Bonking attack. Have no respect for target.', [], new SpellPattern(patterns.TARGET, 1, 0, 1),'4d4'),
});

const listWeapons = Object.freeze({
    SWORD: new Weapon('Sword', weaponType.SWORD, [weaponProperties.TWO_HANDED], [], [listBaseWeaponAttacks.SLASH], defaultWeaponLore),
    HAMMER: new Weapon('Hammer Of Mouse', weaponType.HAMMER, [weaponProperties.HEAVY], 
        [new AdditionalEffect(characterActions.MOVING, additionalEffects.BONUS, 4, "U can move faster.")], [listBaseWeaponAttacks.BONK], 
        "Stories say this hammer made by a mouse. May be cousin of Famous Chef Ratatouille."),
});