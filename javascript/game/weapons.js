const BaseWeaponAttacks = Object.freeze({
    // Add more weapon types as needed
    SLASH: new Spell('Slashing Attack', [ClassType.ALL], [StatType.DEX], [DamageType.SLASHING], 'Slashing attack!', [], new SpellPattern(Patterns.TARGET, 1, 0, 1), '1d8'),
    BONK : new Spell('Bonk!!', [ClassType.ALL], [StatType.STR], [DamageType.BLUDGEONING], 'Bonking attack. Have no respect for target.', [], new SpellPattern(Patterns.TARGET, 1, 0, 1),'4d4'),
});
