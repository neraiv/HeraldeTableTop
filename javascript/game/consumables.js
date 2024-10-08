



const listConsumables = Object.freeze({
    'Healing Potion' : new Item('Healing Potion', itemTypes.CONSUMABLE, consumableTypes.USED, null, null, 
        [new Spell('Heal', null, null, [damageTypes.HEALING], "U feel refreshed", null, null, new SpellPattern(spellPatterns.TARGET, 0,0),'3d6')], "Standard healing potion"),
    'Kaphe Kahve' : new Item('Kahpe Kahve', itemTypes.CONSUMABLE, consumableTypes.USED, (3,3),
        [new AdditionalEffect(characterActions.ALWAYS, effectTypes.DEFENSE, '8', 'Sütlü-Buzlu-Köpüklü-Şekerli-Soğuk uyku kalkanı.')],null, "Dağsız Uluğ Bey - Zincir Kıran Zincirli Neraiv tarafından tasarlandı."),

});