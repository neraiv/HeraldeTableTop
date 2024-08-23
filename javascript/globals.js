/* IMAGES PATH */
class TokenPaths {
    constructor({
        folderClassIcons = 'tokens/class-icons',
        folderCharToken =  'tokens/character',
        folderBackgroundToken = 'tokens/background',
        folderGeneralSounds = 'tokens/general-sounds',
        folderMenuIcons = 'tokens/menu-icons',
        imageList_Character =  ['coil', 'dedector', 'druid-woman', 'elf-warrior-woman'],
        imageList_Background = ['detector-green-1', 'alchemy-shop-1', 'fighting-pit-muddy-1', 'living-depths-1', 'living-depths-2','metalsmith-workshop-1','ossuary-of-xilbalba-1',
                                'palatial-portal-1','royal-bank-1'],
        imageList_ClassIcons = ['barbarian.png', 'archer.png', 'bard.png', 'brawler.png', 'cleric.png', 'druid.png', 'fighter.png', 'mage.png', 'ranger.png', 'thief.png', 'warlock.png']
    } = {}) {
        this.FOLDER_CHARTOKEN        = folderCharToken;
        this.FOLDER_BACKGROUNDTOKEN  = folderBackgroundToken;
        this.FOLDER_CLASSICONS       = folderClassIcons;
        this.FOLDER_GENERALSOUNDS    = folderGeneralSounds;
        this.FOLDER_MENUICONS        = folderMenuIcons;
        this.IMAGELIST_CHARACTER    = imageList_Character;
        this.IMAGELIST_BACKGROUND   = imageList_Background;
        this.IMAGELIST_CLASSICONS   = imageList_ClassIcons;
    }
};
class SettingsUI {
    constructor({
        icon_downArrowGreen = "downArrowGreen.png",
        icon_newFile = "newFile.svg",
        icon_characterSheet = "sheet-icon-7.png",
        icon_rainbowDice = "rainbow-dice.png",
        icon_closeBar = "close-bar.png"
} = {}) {
        this.ICON_DOWNARROWGREEN   = icon_downArrowGreen ;
        this.ICON_NEWFILE          = icon_newFile        ;
        this.ICON_CHARACTERSHEET   = icon_characterSheet ;
        this.ICON_RAINBOWDICE      = icon_rainbowDice    ;
        this.ICON_CLOSEBAR         = icon_closeBar       ;
    }
};

/* GAMEBOARD VARIABLES */
let dragStartX, dragStartY; // Variables to store the drag start position
let currentLayer = 'character-layer'; // Default to character layer
let objectsPositions = new Map(); // Store original positions for each image

/* BOARD MAIN ELEMENTS */
const gameboard = document.getElementById('gameboard');
const gameboardContent = document.getElementById('gameboard-content');
const dragOverlay = document.getElementById('drag-overlay');
const driveImagesBar = document.getElementById('drive-images-bar');
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
        includedSpellLevels = ['1', '2', '3', '4', '5']
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

class Environment{
    constructor({
        day = 0,
        time = 8.0,
    } = {}) {
        this.DAY = day;
        this.TIME = time;
    }
}

let gameSettings = new SettingsGame();
let userIntarfaceSettings = new SettingsUI();
let tokenPaths = new TokenPaths();
let environment = new Environment();