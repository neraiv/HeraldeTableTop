const listBaseWeaponAttacks = Object.freeze({
    // Add more weapon types as needed
    SLASH: new Spell('Slashing Attack', [classType.ALL], [statType.DEX], [damageType.SLASHING], 'Slashing attack!', [], new SpellPattern(spellPatterns.TARGET, 1, 0, 1), '1d8'),
    BONK : new Spell('Bonk!!', [classType.ALL], [statType.STR], [damageType.BLUDGEONING], 'Bonking attack. Have no respect for target.', [], new SpellPattern(spellPatterns.TARGET, 1, 0, 1),'4d4'),
});

const listWeapons = Object.freeze({
    'Sword': new Item('Sword', itemType.WEAPON, weaponType.SWORD, [weaponProperties.TWO_HANDED, weaponProperties.FINESSE], [], [listBaseWeaponAttacks.SLASH], defaultWeaponLore),
    'Hammer Of Mouse': new Item('Hammer Of Mouse', itemType.WEAPON, weaponType.HAMMER, [weaponProperties.LIGHT, weaponProperties.TWO_HANDED], 
        [new AdditionalEffect(characterActions.MOVING, effectTypes.BONUS, 4, "U can move faster")], [listBaseWeaponAttacks.BONK], 
        "Stories say this hammer made by a mouse. May be cousin of Famous Chef Ratatouille."),
});

