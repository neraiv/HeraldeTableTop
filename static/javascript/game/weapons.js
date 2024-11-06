const defaultWeaponLore = 'Meh regular weapons, crafted by regular crafters :/ (Which Doesnt Require any skill!)';

const listBaseWeaponAttacks = Object.freeze({
    // Add more weapon types as needed
    SLASH: new Spell('Slashing Attack', [classTypes.ALL], [statTypes.DEX], [damageTypes.SLASHING], 'Slashing attack!', [], new SpellPattern(spellPatterns.TARGET, 1, 0, 1), '1d8'),
    BONK : new Spell('Bonk!!', [classTypes.ALL], [statTypes.STR], [damageTypes.BLUDGEONING], 'Bonking attack. Have no respect for target.', [], new SpellPattern(spellPatterns.TARGET, 1, 0, 1),'4d4'),
});

const listWeapons = Object.freeze({
    'Sword': new Item('Sword', itemTypes.WEAPON, weaponTypes.SWORD, [weaponProperties.TWO_HANDED, weaponProperties.FINESSE], [], [listBaseWeaponAttacks.SLASH], defaultWeaponLore),
    'Hammer Of Mouse': new Item('Hammer Of Mouse', itemTypes.WEAPON, weaponTypes.HAMMER, [weaponProperties.LIGHT, weaponProperties.TWO_HANDED], 
        [new AdditionalEffect(characterActions.MOVING, effectTypes.BONUS, 4, "U can move faster")], [listBaseWeaponAttacks.BONK], 
        "Stories say this hammer made by a mouse. May be cousin of Famous Chef Ratatouille."),
});
