/* GAMEBOARD VARIABLES */
let dragStartX, dragStartY; // Variables to store the drag start position
let currentLayer = 'character-layer'; // Default to character layer
let objectsPositions = new Map(); // Store original positions for each image

/* IMAGES PATH */
const pathCharImages = 'images/chars/';
const pathClassIconsImages = 'images/class-icons/';
const pathBackgroundImages = 'images/backgrounds/';

/* IMAGES ARRAYS */
const charImageFilesList = ['bobin.jpg', 'dedektor.png', 'druid-woman.png', 'ThugElfFemaleMelee.png']
const classIconFilesList = ['barbarian.png', 'archer.png', 'bard.png', 'brawler.png', 'cleric.png', 'druid.png', 'fighter.png', 'mage.png', 'ranger.png', 'thief.png', 'warlock.png'];
const backgroundImageFilesList = ['green.png', 'p.webp'];

/* BOARD MAIN ELEMENTS */
const gameboard = document.getElementById('gameboard');
const gameboardContent = document.getElementById('gameboard-content');
const dragOverlay = document.getElementById('drag-overlay');
const charImageList = document.getElementById('character-list');
const backgroundImgList = document.getElementById('background-list');
const layerSelect = document.getElementById('layer-select');


class SettingsGame {
    constructor({
        maxStatPoint = 20,
        minStatPoint = 0,
        maxCharacterLevel = 15,
        minCharacterLevel = 1,
        maxSubClassCount = 2,
        minSubClassCount = 0,
        includedSpellLevels = [1, 2, 3, 4, 5]
    } = {}) {
        this.MAX_STAT_POINT = maxStatPoint;
        this.MIN_STAT_POINT = minStatPoint;
        this.MAX_CHARACTER_LVL = maxCharacterLevel;
        this.MIN_CHARACTER_LVL = minCharacterLevel;
        this.MAX_SUB_CLASS_COUNT = maxSubClassCount;
        this.MIN_SUB_CLASS_COUNT = minSubClassCount;
        this.INCLUDED_SPELL_LEVELS = includedSpellLevels;
    }
}

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
        avaliableSpellLevels = [1],
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
        this.AVALIABLE_SPELL_LEVELS = avaliableSpellLevels;
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

let gameSettings = new SettingsGame();

