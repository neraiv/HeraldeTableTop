



const listConsumables = Object.freeze({
    'Healing Potion' : new Item('Healing Potion', itemType.CONSUMABLE, consumableTypes.USED, null, null, 
        [new Spell('Heal', null, null, [damageType.HEALING], "U feel refreshed", null, null, new SpellPattern(spellPatterns.TARGET, 0,0),'3d6')], "Standard healing potion"),
    'Kaphe Kahve' : new Item('Kahpe Kahve', itemType.CONSUMABLE, consumableTypes.USED, (3,3),
        [new AdditionalEffect(characterActions.ALWAYS, additionalEffects.DEFENSE, '8', 'Sütlü-Buzlu-Köpüklü-Şekerli-Soğuk uyku kalkanı.')],null, "Dağsız Uluğ Bey - Zincir Kıran Zincirli Neraiv tarafından tasarlandı."),

});