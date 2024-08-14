const ClassType = Object.freeze({
    ALL: 'All',
    WIZARD: 'Wizard',
    CLERIC: 'Cleric',
    ROGUE: 'Rogue',
    DRUID: 'Druid',
    PALADIN: 'Paladin',
    RANGER: 'Ranger',
    WARLOCK: 'Warlock',
    SORCERER: 'Sorcerer',
    BARBARIAN: 'Barbarian',
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
    FORCE: 'Force',
    ACID: 'Acid',
    POISON: 'Poison',
    RADIANT: 'Radiant',
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
const level1_spell_list = [
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

const level2_spell_list = [
    new Spell('Acid Arrow', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.ACID, 'You hurl a flask of acid at a creature.', new Description([1, true, noAdditionalEffect], [2, false, "Deal more damage"]), '4d4'),
    new Spell('Aid', [ClassType.CLERIC, ClassType.PALADIN], StatType.CHA, DamageType.NONE, 'You touch a creature and grant it temporary hit points.', new Description([1, true, noAdditionalEffect], [2, false, "Grant more temporary hit points"]), '5d4'),
    new Spell('Alter Self', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'You temporarily alter your appearance.', new Description([1, true, noAdditionalEffect], [2, false, "Alter Self lasts longer"]), 'No damage'),
    new Spell('Animal Messenger', [ClassType.DRUID, ClassType.RANGER], StatType.WIS, DamageType.NONE, 'You send a message to a creature of your choice that you have seen or that is familiar to you.', new Description([1, true, noAdditionalEffect], [2, false, "Animal Messenger can travel farther"]), 'No damage'),
    new Spell('Arcane Lock', [ClassType.WIZARD, ClassType.ROGUE], StatType.INT, DamageType.NONE, 'You magically lock a door or container.', new Description([1, true, noAdditionalEffect], [2, false, "Arcane Lock lasts longer"]), 'No damage'),
    new Spell('Arcanist\'s Magic Aura', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'You create an aura of magical energy around yourself.', new Description([1, true, noAdditionalEffect], [2, false, "Arcanist's Magic Aura lasts longer"]), 'No damage'),
    new Spell('Augury', [ClassType.CLERIC, ClassType.WARLOCK], StatType.CHA, DamageType.NONE, 'You gain a portent, a piece of information about the future.', new Description([1, true, noAdditionalEffect], [2, false, "Augury lasts longer"]), 'No damage'),
    new Spell('Barkskin', [ClassType.DRUID, ClassType.RANGER], StatType.WIS, DamageType.NONE, 'You cause a creature\'s skin to become as tough as bark.', new Description([1, true, noAdditionalEffect], [2, false, "Barkskin lasts longer"]), 'No damage'),
    new Spell('Blindness/Deafness', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'You attempt to blind or deafen a creature.', new Description([1, true, noAdditionalEffect], [2, false, "Blindness/Deafness lasts longer"]), 'No damage'),
    new Spell('Blur', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'You become harder to hit with attacks.', new Description([1, true, noAdditionalEffect], [2, false, "Blur lasts longer"]), 'No damage'),
    new Spell('Branding Smite', [ClassType.PALADIN], StatType.CHA, DamageType.RADIANT, 'When you hit a creature with a melee weapon attack on your turn, you can expend a spell slot to deal extra radiant damage to the target.', new Description([1, true, noAdditionalEffect], [2, false, "Deal more damage"]), '2d8'),
    new Spell('Calm Emotions', [ClassType.CLERIC, ClassType.WARLOCK], StatType.CHA, DamageType.NONE, 'You attempt to calm the emotions of one or more creatures.', new Description([1, true, noAdditionalEffect], [2, false, "Calm Emotions lasts longer"]), 'No damage'),
    new Spell('Continual Flame', [ClassType.WIZARD], StatType.INT, DamageType.FIRE, 'You create a persistent flame.', new Description([1, true, noAdditionalEffect], [2, false, "Continual Flame lasts longer"]), 'No damage'),
    new Spell('Darkness', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'You create an area of darkness that obscures vision.', new Description([1, true, noAdditionalEffect], [2, false, "Darkness lasts longer"]), 'No damage'),
    new Spell('Darkvision', [ClassType.WIZARD, ClassType.DRUID], StatType.INT, DamageType.NONE, 'You gain darkvision for a short time.', new Description([1, true, noAdditionalEffect], [2, false, "Darkvision lasts longer"]), 'No damage'),
    new Spell('Detect Thoughts', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'You attempt to read the mind of a creature.', new Description([1, true, noAdditionalEffect], [2, false, "Detect Thoughts lasts longer"]), 'No damage'),
    new Spell('Enhance Ability', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'You enhance one of your ability scores.', new Description([1, true, noAdditionalEffect], [2, false, "Enhance Ability lasts longer"]), 'No damage'),
    new Spell('Enlarge/Reduce', [ClassType.WIZARD, ClassType.DRUID], StatType.INT, DamageType.NONE, 'You cause a creature to grow larger or smaller.', new Description([1, true, noAdditionalEffect], [2, false, "Enlarge/Reduce lasts longer"]), 'No damage'),
    new Spell('Enthrall', [ClassType.WIZARD, ClassType.SORCERER], StatType.CHA, DamageType.NONE, 'You attempt to charm a creature.', new Description([1, true, noAdditionalEffect], [2, false, "Enthrall lasts longer"]), 'No damage'),
    new Spell('Find Steed', [ClassType.DRUID, ClassType.RANGER], StatType.WIS, DamageType.NONE, 'You attempt to summon a steed.', new Description([1, true, noAdditionalEffect], [2, false, "Find Steed lasts longer"]), 'No damage'),
    new Spell('Find Traps', [ClassType.WIZARD, ClassType.ROGUE], StatType.INT, DamageType.NONE, 'You attempt to detect traps.', new Description([1, true, noAdditionalEffect], [2, false, "Find Traps lasts longer"]), 'No damage'),
    new Spell('Flame Blade', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.FIRE, 'You create a flaming sword.', new Description([1, true, noAdditionalEffect], [2, false, "Flame Blade lasts longer"]), '2d6'),
    new Spell('Flaming Sphere', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.FIRE, 'You create a sphere of fire that moves as you direct.', new Description([1, true, noAdditionalEffect], [2, false, "Flaming Sphere lasts longer"]), '2d6'),
    new Spell('Gentle Repose', [ClassType.CLERIC, ClassType.DRUID], StatType.WIS, DamageType.NONE, 'You touch a creature and grant it a magical slumber.', new Description([1, true, noAdditionalEffect], [2, false, "Gentle Repose lasts longer"]), 'No damage'),
    new Spell('Gust of Wind', [ClassType.WIZARD, ClassType.DRUID], StatType.INT, DamageType.NONE, 'You create a gust of wind that pushes creatures away from you.', new Description([1, true, noAdditionalEffect], [2, false, "Gust of Wind lasts longer"]), 'No damage'),
    new Spell('Heat Metal', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.FIRE, 'You cause a metal object to become intensely hot.', new Description([1, true, noAdditionalEffect], [2, false, "Heat Metal lasts longer"]), '2d8'),
    new Spell('Hold Person', [ClassType.WIZARD, ClassType.SORCERER], StatType.CHA, DamageType.NONE, 'You attempt to hold a creature in place.', new Description([1, true, noAdditionalEffect], [2, false, "Hold Person lasts longer"]), 'No damage'),
    new Spell('Invisibility', [ClassType.WIZARD, ClassType.ROGUE], StatType.INT, DamageType.NONE, 'You become invisible.', new Description([1, true, noAdditionalEffect], [2, false, "Invisibility lasts longer"]), 'No damage'),
    new Spell('Knock', [ClassType.WIZARD, ClassType.ROGUE], StatType.INT, DamageType.NONE, 'You attempt to open a locked or barred door or container.', new Description([1, true, noAdditionalEffect], [2, false, "Knock can open more difficult locks"]), 'No damage'),
    new Spell('Lesser Restoration', [ClassType.CLERIC, ClassType.DRUID], StatType.WIS, DamageType.NONE, 'You restore a creature to its full hit points, or you end one disease affecting it.', new Description([1, true, noAdditionalEffect], [2, false, "Lesser Restoration can end more diseases"]), 'No damage'),
    new Spell('Levitate', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'You cause a creature or object to levitate.', new Description([1, true, noAdditionalEffect], [2, false, "Levitate lasts longer"]), 'No damage'),
    new Spell('Locate Animals or Plants', [ClassType.DRUID, ClassType.RANGER], StatType.WIS, DamageType.NONE, 'You attempt to locate a specific animal or plant.', new Description([1, true, noAdditionalEffect], [2, false, "Locate Animals or Plants lasts longer"]), 'No damage'),
    new Spell('Locate Object', [ClassType.WIZARD, ClassType.CLERIC], StatType.INT, DamageType.NONE, 'You attempt to locate a specific object.', new Description([1, true, noAdditionalEffect], [2, false, "Locate Object lasts longer"]), 'No damage'),
    new Spell('Magic Mouth', [ClassType.WIZARD], StatType.INT, DamageType.NONE, 'You create a magical mouth that speaks words you choose.', new Description([1, true, noAdditionalEffect], [2, false, "Magic Mouth lasts longer"]), 'No damage'),
    new Spell('Magic Weapon', [ClassType.WIZARD, ClassType.CLERIC], StatType.INT, DamageType.NONE, 'You touch a weapon and imbue it with magical energy.', new Description([1, true, noAdditionalEffect], [2, false, "Magic Weapon lasts longer"]), 'No damage'),
    new Spell('Mirror Image', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'You create three illusory duplicates of yourself.', new Description([1, true, noAdditionalEffect], [2, false, "Mirror Image lasts longer"]), 'No damage'),
    new Spell('Misty Step', [ClassType.WIZARD, ClassType.ROGUE], StatType.INT, DamageType.NONE, 'You teleport a short distance.', new Description([1, true, noAdditionalEffect], [2, false, "Misty Step lasts longer"]), 'No damage'),
    new Spell('Moonbeam', [ClassType.WIZARD, ClassType.DRUID], StatType.INT, DamageType.RADIANT, 'You create a beam of moonlight that damages creatures in its path.', new Description([1, true, noAdditionalEffect], [2, false, "Moonbeam lasts longer"]), '2d10'),
    new Spell('Pass without Trace', [ClassType.ROGUE, ClassType.RANGER], StatType.DEX, DamageType.NONE, 'You and your companions can move silently and leave no tracks.', new Description([1, true, noAdditionalEffect], [2, false, "Pass without Trace lasts longer"]), 'No damage'),
    new Spell('Prayer of Healing', [ClassType.CLERIC], StatType.WIS, DamageType.NONE, 'You touch a creature and restore hit points to it.', new Description([1, true, noAdditionalEffect], [2, false, "Restore more hit points"]), '2d8+2'),
    new Spell('Protection from Poison', [ClassType.CLERIC, ClassType.DRUID], StatType.WIS, DamageType.NONE, 'You grant a creature protection from poison.', new Description([1, true, noAdditionalEffect], [2, false, "Protection from Poison lasts longer"]), 'No damage'),
    new Spell('Ray of Enfeeblement', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'You fire a ray of enervating energy at a creature.', new Description([1, true, noAdditionalEffect], [2, false, "Ray of Enfeeblement lasts longer"]), 'No damage'),
    new Spell('Rope Trick', [ClassType.WIZARD, ClassType.ROGUE], StatType.INT, DamageType.NONE, 'You create a rope that magically climbs to a height of 60 feet.', new Description([1, true, noAdditionalEffect], [2, false, "Rope Trick lasts longer"]), 'No damage'),
    new Spell('Scorching Ray', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.FIRE, 'You fire three rays of searing energy at a target creature.', new Description([1, true, noAdditionalEffect], [2, false, "Scorching Ray deals more damage"]), '3d6'),
    new Spell('See Invisibility', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'You gain the ability to see invisible creatures for a short time.', new Description([1, true, noAdditionalEffect], [2, false, "See Invisibility lasts longer"]), 'No damage'),
    new Spell('Shatter', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.FORCE, 'You create a wave of force that shatters objects.', new Description([1, true, noAdditionalEffect], [2, false, "Shatter deals more damage"]), '8d6'),
    new Spell('Silence', [ClassType.WIZARD, ClassType.SORCERER], StatType.INT, DamageType.NONE, 'You create a zone of silence that prevents creatures from casting spells and making sounds.', new Description([1, true, noAdditionalEffect], [2, false, "Silence lasts longer"]), 'No damage'),
    new Spell('Spider Climb', [ClassType.WIZARD, ClassType.DRUID], StatType.INT, DamageType.NONE, 'You gain the ability to climb on vertical surfaces.', new Description([1, true, noAdditionalEffect], [2, false, "Spider Climb lasts longer"]), 'No damage'),
    new Spell('Spike Growth', [ClassType.DRUID, ClassType.RANGER], StatType.WIS, DamageType.PIERCE, 'You cause spikes to sprout from the ground in a 20-foot-radius.', new Description([1, true, noAdditionalEffect], [2, false, "Spike Growth lasts longer"]), '2d4'),
    new Spell('Spiritual Weapon', [ClassType.CLERIC, ClassType.PALADIN], StatType.WIS, DamageType.FORCE, 'You create a spectral weapon that attacks a creature of your choice.', new Description([1, true, noAdditionalEffect], [2, false, "Spiritual Weapon lasts longer"]), '2d8'),
    new Spell('Suggestion', [ClassType.WIZARD, ClassType.SORCERER], StatType.CHA, DamageType.NONE, 'You subtly influence a creature to perform a single action of your choosing.', new Description([1, true, noAdditionalEffect], [2, false, "Suggestion lasts longer"]), 'No damage'),
    new Spell('Warding Bond', [ClassType.CLERIC, ClassType.PALADIN], StatType.CHA, DamageType.NONE, 'You mystically link yourself to another creature.', new Description([1, true, noAdditionalEffect], [2, false, "Warding Bond lasts longer"]), 'No damage'),
    new Spell('Web', [ClassType.WIZARD, ClassType.DRUID], StatType.INT, DamageType.NONE, 'You create a web of gossamer strands in a 20-foot-radius.', new Description([1, true, noAdditionalEffect], [2, false, "Web lasts longer"]), 'No damage'),
    new Spell('Zone of Truth', [ClassType.CLERIC, ClassType.PALADIN], StatType.CHA, DamageType.NONE, 'You create a zone of truth.', new Description([1, true, noAdditionalEffect], [2, false, "Zone of Truth lasts longer"]), 'No damage'),
]