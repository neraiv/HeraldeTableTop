const ClassType = Object.freeze({
    ALL: 'All',
    WIZARD: 'Wizard',
    CLERIC: 'Cleric',
    ROGUE: 'Rogue',
    DRUID: 'Druid',
    PALADIN: 'Paladin',
    // Add more classes as needed
  });
  
  // Enum for damage types
  const DamageType = Object.freeze({
    NONE: "None",
    PSYCHIC: "Psychic",
    FIRE: 'Fire',
    COLD: 'Cold',
    LIGHTNING: 'Lightning',
    NECROTIC: 'Necrotic',
    // Add more damage types as needed
  });

  // Enum for damage types
const StatType = Object.freeze({
    STR: 'Str',
    DEX: 'Dex',
    CON: 'Con',
    INT: 'Int',
    WIS: 'Wis',
    CHA: 'Cha',
    // Add more damage types as needed
});

// Define the RequiredMana structure
function RequiredMana(canUse, description) {
    this.canUse = canUse;
    this.description = description;
}

// Define the Description structure
function Description(...manaLevels) {
    this.requiredMana = {};
    manaLevels.forEach(([level, canUse, additionalEffect]) => {
        this.requiredMana[level] = new RequiredMana(canUse, additionalEffect);
    });
}

// Add a method to Description to get mana level descriptions
Description.prototype.getManaEffects = function(level) {
    const mana = this.requiredMana[level];
    if (mana) {
        return `Level ${level}: ${mana.description}`;
    } else {
        return `Level ${level}: ${noAdditionalEffect}.`;
    }
};

class Spell {
constructor(name, availableClasses, baseStatType, damageType, description, additionalEffects, baseDamage) {
    this.name = name;
    this.availableClasses = availableClasses; // Array of ClassType enums
    this.baseStatType = baseStatType; // StatType enum (e.g., STR, DEX, CON, etc.)
    this.damageType = damageType; // DamageType enum
    this.description = description; // Description object with required mana levels and descriptions
    this.additionalEffects = additionalEffects;
    this.baseDamage = baseDamage;
}
}

const noAdditionalEffect = "No Additional Effect";
const spells_list = [
    new Spell('Alarm', [ClassType.WIZARD, ClassType.CLERIC], StatType.WIS, DamageType.NONE, 'Creates a magical alarm that sounds if a creature enters the warded area.', new Description([1, true, noAdditionalEffect], [2, false, "+1 more hours"]), 'No damage'),
    new Spell('Animal Friendship', [ClassType.DRUID, ClassType.RANGER], StatType.WIS, DamageType.NONE, 'Charm a beast to be friendly to you.', new Description([1, true, noAdditionalEffect], [2, false, "Can charm a beast with higher CR"]), 'No damage'),
    new Spell('Bane', [ClassType.CLERIC, ClassType.WARLOCK], StatType.CHA, DamageType.NONE, 'Curse a creature, making it have disadvantage on attack rolls, ability checks, and saving throws.', new Description([1, true, noAdditionalEffect], [2, false, "Curse lasts longer"]), 'No damage'),
    new Spell('Bless', [ClassType.CLERIC, ClassType.PALADIN], StatType.CHA, DamageType.NONE, 'Blesses a creature, giving it advantage on attack rolls, ability checks, and saving throws.', new Description([1, true, noAdditionalEffect], [2, false, "Bless lasts longer"]), 'No damage'),
    new Spell('Burning Hands', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.FIRE, 'A line of fire erupts from your hand, dealing fire damage to all creatures in a 15-foot line.', new Description([1, true, noAdditionalEffect], [2, false, "Deal more damage"]), '2d6'),
    new Spell('Charm Person', [ClassType.WIZARD, ClassType.SORCERER], StatType.CHA, DamageType.NONE, 'Charm a humanoid to be friendly to you.', new Description([1, true, noAdditionalEffect], [2, false, "Charm lasts longer"]), 'No damage'),
    new Spell('Chromatic Orb', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'A beam of energy shoots from your hand, dealing damage of a type you choose.', new Description([1, true, noAdditionalEffect], [2, false, "Deal more damage"]), '3d8'),
    new Spell('Color Spray', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'A cone of magical energy erupts from your hand, dealing damage to all creatures in a 15-foot cone.', new Description([1, true, noAdditionalEffect], [2, false, "Deal more damage"]), '1d8'),
    new Spell('Command', [ClassType.WIZARD, ClassType.SORCERER], StatType.CHA, DamageType.NONE, 'You command a creature to do a simple task.', new Description([1, true, noAdditionalEffect], [2, false, "Command lasts longer"]), 'No damage'),
    new Spell('Comprehend Languages', [ClassType.WIZARD, ClassType.CLERIC], StatType.INT, DamageType.NONE, 'You can understand and speak any language for a short time.', new Description([1, true, noAdditionalEffect], [2, false, "Comprehend lasts longer"]), 'No damage'),
    new Spell('Create or Destroy Water', [ClassType.WIZARD, ClassType.DRUID], StatType.INT, DamageType.NONE, 'You create or destroy water in a 10-foot cube.', new Description([1, true, noAdditionalEffect], [2, false, "Create or destroy more water"]), 'No damage'),
    new Spell('Cure Wounds', [ClassType.CLERIC, ClassType.PALADIN], StatType.WIS, DamageType.NONE, 'You touch a creature and restore hit points to it.', new Description([1, true, noAdditionalEffect], [2, false, "Restore more hit points"]), '2d8'),
    new Spell('Detect Evil and Good', [ClassType.CLERIC, ClassType.PALADIN], StatType.WIS, DamageType.NONE, 'You sense the presence of good and evil creatures within 120 feet of you.', new Description([1, true, noAdditionalEffect], [2, false, "Detect lasts longer"]), 'No damage'),
    new Spell('Detect Magic', [ClassType.WIZARD, ClassType.CLERIC], StatType.INT, DamageType.NONE, 'You sense the presence of magical auras within 120 feet of you.', new Description([1, true, noAdditionalEffect], [2, false, "Detect lasts longer"]), 'No damage'),
    new Spell('Detect Poison and Disease', [ClassType.CLERIC, ClassType.DRUID], StatType.WIS, DamageType.NONE, 'You sense the presence of poison and disease within 60 feet of you.', new Description([1, true, noAdditionalEffect], [2, false, "Detect lasts longer"]), 'No damage'),
    new Spell('Disguise Self', [ClassType.WIZARD, ClassType.ROGUE], StatType.CHA, DamageType.NONE, 'You change your appearance to resemble another creature.', new Description([1, true, noAdditionalEffect], [2, false, "Disguise lasts longer"]), 'No damage'),
    new Spell('Divine Favor', [ClassType.CLERIC, ClassType.PALADIN], StatType.CHA, DamageType.NONE, 'You grant a creature divine favor, giving it a bonus to attack rolls and saving throws.', new Description([1, true, noAdditionalEffect], [2, false, "Divine Favor lasts longer"]), 'No damage'),
    new Spell('Entangle', [ClassType.DRUID, ClassType.WIZARD], StatType.INT, DamageType.NONE, 'You cause a patch of ground to become tangled with thorny vines, hindering creatures that move through it.', new Description([1, true, noAdditionalEffect], [2, false, "Entangle lasts longer"]), 'No damage'),
    new Spell('Expeditious Retreat', [ClassType.WIZARD, ClassType.ROGUE], StatType.INT, DamageType.NONE, 'You gain an increase to your speed for a short time.', new Description([1, true, noAdditionalEffect], [2, false, "Expeditious Retreat lasts longer"]), 'No damage'),
    new Spell('Faerie Fire', [ClassType.WIZARD, ClassType.DRUID], StatType.INT, DamageType.NONE, 'You cause a creature to glow with magical energy, making it easier to hit with attacks.', new Description([1, true, noAdditionalEffect], [2, false, "Faerie Fire lasts longer"]), 'No damage'),
    new Spell('False Life', [ClassType.WIZARD, ClassType.CLERIC], StatType.WIS, DamageType.NONE, 'You gain temporary hit points.', new Description([1, true, noAdditionalEffect], [2, false, "Gain more temporary hit points"]), 'No damage'),
    new Spell('Feather Fall', [ClassType.WIZARD, ClassType.DRUID], StatType.INT, DamageType.NONE, 'You slow your descent if you are falling.', new Description([1, true, noAdditionalEffect], [2, false, "Feather Fall lasts longer"]), 'No damage'),
    new Spell('Find Familiar', [ClassType.WIZARD, ClassType.DRUID], StatType.INT, DamageType.NONE, 'You gain a familiar, a magical creature that serves as your companion.', new Description([1, true, noAdditionalEffect], [2, false, "Familiar is stronger"]), 'No damage'),
    new Spell('Floating Disk', [ClassType.WIZARD, ClassType.DRUID], StatType.INT, DamageType.NONE, 'You create a magical disk that can be used to carry objects.', new Description([1, true, noAdditionalEffect], [2, false, "Disk can carry more weight"]), 'No damage'),
    new Spell('Fog Cloud', [ClassType.WIZARD, ClassType.DRUID], StatType.INT, DamageType.NONE, 'You create a cloud of fog that obscures vision.', new Description([1, true, noAdditionalEffect], [2, false, "Fog Cloud lasts longer"]), 'No damage'),
    new Spell('Goodberry', [ClassType.DRUID, ClassType.CLERIC], StatType.WIS, DamageType.NONE, 'You create a number of berries that can be used to restore hit points.', new Description([1, true, noAdditionalEffect], [2, false, "Create more berries"]), 'No damage'),
    new Spell('Grease', [ClassType.WIZARD, ClassType.ROGUE], StatType.INT, DamageType.NONE, 'You create a patch of grease that makes creatures slip and fall.', new Description([1, true, noAdditionalEffect], [2, false, "Grease lasts longer"]), 'No damage'),
    new Spell('Guiding Bolt', [ClassType.CLERIC, ClassType.PALADIN], StatType.CHA, DamageType.LIGHTNING, 'You call upon divine power to create a beam of radiant energy that streaks toward a target creature.', new Description([1, true, noAdditionalEffect], [2, false, "Deal more damage"]), '4d6'),
    new Spell('Healing Word', [ClassType.CLERIC, ClassType.PALADIN], StatType.WIS, DamageType.NONE, 'You touch a creature and restore hit points to it.', new Description([1, true, noAdditionalEffect], [2, false, "Restore more hit points"]), '1d4'),
    new Spell('Hellish Rebuke', [ClassType.CLERIC, ClassType.WARLOCK], StatType.CHA, DamageType.FIRE, 'You unleash a burst of fire energy at a creature that is within 30 feet of you.', new Description([1, true, noAdditionalEffect], [2, false, "Deal more damage"]), '3d8'),
    new Spell('Heroism', [ClassType.CLERIC, ClassType.PALADIN], StatType.CHA, DamageType.NONE, 'You imbue a creature with courage, giving it a bonus to attack rolls, ability checks, and saving throws.', new Description([1, true, noAdditionalEffect], [2, false, "Heroism lasts longer"]), 'No damage'),
    new Spell('Hideous Laughter', [ClassType.WIZARD, ClassType.SORCERER], StatType.CHA, DamageType.NONE, 'You attempt to induce helpless laughter in a creature.', new Description([1, true, noAdditionalEffect], [2, false, "Hideous Laughter lasts longer"]), 'No damage'),
    new Spell("Hunter's Mark", [ClassType.RANGER, ClassType.PALADIN], StatType.WIS, DamageType.NONE, 'You choose a creature within 60 feet of you that you can see.', new Description([1, true, noAdditionalEffect], [2, false, "Hunter's Mark lasts longer"]), 'No damage'),
    new Spell('Identify', [ClassType.WIZARD, ClassType.CLERIC], StatType.INT, DamageType.NONE, 'You identify the properties of one object or creature.', new Description([1, true, noAdditionalEffect], [2, false, "Identify more objects"]), 'No damage'),
    new Spell('Illusory Script', [ClassType.WIZARD, ClassType.ROGUE], StatType.INT, DamageType.NONE, 'You create an illusion that appears to be written text.', new Description([1, true, noAdditionalEffect], [2, false, "Illusory Script lasts longer"]), 'No damage'),
    new Spell('Inflict Wounds', [ClassType.CLERIC, ClassType.WARLOCK], StatType.CHA, DamageType.NECROTIC, 'You touch a creature and deal necrotic damage to it.', new Description([1, true, noAdditionalEffect], [2, false, "Deal more damage"]), '3d10'),
    new Spell('Jump', [ClassType.ROGUE, ClassType.BARBARIAN], StatType.STR, DamageType.NONE, 'You gain a bonus to your jump checks.', new Description([1, true, noAdditionalEffect], [2, false, "Jump lasts longer"]), 'No damage'),
    new Spell('Longstrider', [ClassType.WIZARD, ClassType.ROGUE], StatType.INT, DamageType.NONE, 'You gain an increase to your speed for a short time.', new Description([1, true, noAdditionalEffect], [2, false, "Longstrider lasts longer"]), 'No damage'),
    new Spell('Mage Armor', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'You imbue yourself with magical armor, gaining a bonus to your AC.', new Description([1, true, noAdditionalEffect], [2, false, "Mage Armor lasts longer"]), 'No damage'),
    new Spell('Magic Missile', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.FORCE, 'You launch three glowing darts of magical energy at a target creature.', new Description([1, true, noAdditionalEffect], [2, false, "Launch more darts"]), '1d4+1'),
    new Spell('Protection from Evil and Good', [ClassType.CLERIC, ClassType.PALADIN], StatType.WIS, DamageType.NONE, 'You grant a creature protection from creatures of a specific alignment.', new Description([1, true, noAdditionalEffect], [2, false, "Protection lasts longer"]), 'No damage'),
    new Spell('Purify Food and Drink', [ClassType.CLERIC, ClassType.DRUID], StatType.WIS, DamageType.NONE, 'You purify a quantity of food or drink.', new Description([1, true, noAdditionalEffect], [2, false, "Purify more food or drink"]), 'No damage'),
    new Spell('Sanctuary', [ClassType.CLERIC, ClassType.PALADIN], StatType.CHA, DamageType.NONE, 'You grant a creature sanctuary, making it harder for creatures to attack it.', new Description([1, true, noAdditionalEffect], [2, false, "Sanctuary lasts longer"]), 'No damage'),
    new Spell('Shield', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'You create a magical shield that protects you from damage.', new Description([1, true, noAdditionalEffect], [2, false, "Shield lasts longer"]), 'No damage'),
    new Spell('Shield of Faith', [ClassType.CLERIC, ClassType.PALADIN], StatType.CHA, DamageType.NONE, 'You grant a creature a bonus to its AC.', new Description([1, true, noAdditionalEffect], [2, false, "Shield of Faith lasts longer"]), 'No damage'),
    new Spell('Silent Image', [ClassType.WIZARD, ClassType.ROGUE], StatType.INT, DamageType.NONE, 'You create a silent, visual illusion.', new Description([1, true, noAdditionalEffect], [2, false, "Silent Image lasts longer"]), 'No damage'),
    new Spell('Sleep', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'You cause creatures in a 20-foot radius to fall asleep.', new Description([1, true, noAdditionalEffect], [2, false, "Sleep affects more creatures"]), 'No damage'),
]