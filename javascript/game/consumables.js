const listConsumables = Object.freeze({
    'Healing Potion' : new Item('Healing Potion', itemType.CONSUMABLE, null, null, null, 
        [new Spell('Heal', null, null, [damageType.HEALING], "U feel refreshed", null, new SpellPattern(patterns.TARGET, 0,0),'3d6')], "Standard healing potion")
});