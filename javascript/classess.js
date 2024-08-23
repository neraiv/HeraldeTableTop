class Character {
    constructor(id, {
        maxStatPoint = gameSettings.MAX_STAT_POINT,
        minStatPoint = gameSettings.MIN_STAT_POINT,
        maxCharacterLevel = gameSettings.MAX_CHARACTER_LVL,
        minCharacterLevel = gameSettings.MIN_CHARACTER_LVL,
        maxSubClassCount = gameSettings.MAX_SUB_CLASS_COUNT,
        minSubClassCount = gameSettings.MIN_SUB_CLASS_COUNT,
        level = gameSettings.MIN_CHARACTER_LVL,
        name = "",
        class_ = "",
        subclass = "",
        race = "",
        feats = [],
        dex = gameSettings.MIN_STAT_POINT,
        con = gameSettings.MIN_STAT_POINT,
        int = gameSettings.MIN_STAT_POINT,
        wis = gameSettings.MIN_STAT_POINT,
        cha = gameSettings.MIN_STAT_POINT,
        str = gameSettings.MIN_STAT_POINT,
        availableSpellLevels = {
            '1': 2,
            '2': 2
        },
        learnedSpells = ['Animal Friendship', 'Acid Arrow']
    } = {}) {
        this.ID = id;
        this.MAX_STAT_POINT = maxStatPoint;
        this.MIN_STAT_POINT = minStatPoint;
        this.MAX_CHARACTER_LVL = maxCharacterLevel;
        this.MIN_CHARACTER_LVL = minCharacterLevel;
        this.MAX_SUB_CLASS_COUNT = maxSubClassCount;
        this.MIN_SUB_CLASS_COUNT = minSubClassCount;
        this.LEVEL = level;
        this.NAME = name;
        this.CLASS_ = class_;
        this.SUBCLASS = subclass;
        this.RACE = race;
        this.FEATS = feats;
        this.DEX = dex;
        this.CON = con;
        this.INT = int;
        this.WIS = wis;
        this.CHA = cha;
        this.STR = str;
        this.AVAILABLE_SPELL_LEVELS = availableSpellLevels;
        this.LEARNED_SPELLS= learnedSpells;
        this.CURRENT_MANA = {};
        this.BUFFS = {};
        this.DEBUFFS = {};
    }

    // Example method to check if a level is valid
    isValidLevel(level) {
        return level >= this.MIN_CHARACTER_LVL && level <= this.MAX_CHARACTER_LVL;
    }

    // Example method to validate stat points
    isValidStatPoint(statPoint) {
        return statPoint >= this.MIN_STAT_POINT && statPoint <= this.MAX_STAT_POINT;
    }
}