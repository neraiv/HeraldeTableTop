const gameboard = document.getElementById('gameboard');
const gameboardContent = document.getElementById('gameboard-content');
const driveImagesBar = document.getElementById('drive-images-bar');
const userInterface = document.getElementById('user-interface');
const gridBackground = document.getElementById('grid-background');
const dragOverlay = document.getElementById('drag-overlay');

const layers = Object.freeze({
    "character-layer": document.getElementById('character-layer'),
    "background-layer": document.getElementById('background-layer'),
    "fog-layer": document.getElementById('fog-layer')
});

/* GAMEBOARD VARIABLES */
let isPanning = false;
let startX, startY;
let scale = 1;
let panX = 0;
let panY = 0;
let dragStartX, dragStartY; // Variables to store the drag start position
let currentLayer = 'character-layer'; // Default to character layer
let objectsPositions = new Map(); // Store original positions for each image
let inGameChars = new Map();
let listEnemies = [];
let listAllies = [];
let listNPC = [];
let listSpells = {
    0: {"No Spell": "No Spell"},
    1: {"No Spell": "No Spell"},
    2: {"No Spell": "No Spell"},
    3: {"No Spell": "No Spell"},
    4: {"No Spell": "No Spell"},
    5: {"No Spell": "No Spell"},
    6: {"No Spell": "No Spell"},
    7: {"No Spell": "No Spell"},
    8: {"No Spell": "No Spell"},
    9: {"No Spell": "No Spell"}
};

// Database related
let user = new Porgram_User();
let serverInfo = new Porgram_ServerInfo();

let databaseListSpells = {
    0: ["No Spell"],
    1: ["No Spell"],
    2: ["No Spell"],
    3: ["No Spell"],
    4: ["No Spell"],
    5: ["No Spell"],
    6: ["No Spell"],
    7: ["No Spell"],
    8: ["No Spell"],
    9: ["No Spell"]
};  

const dictCharacterFactions = {
    1: listAllies, 
    2: listEnemies,
    3: listNPC
}
let listDestructinator = {
    2: [],  // durationTypes.TURN_BASED
    3: [],  // durationTypes.AFTER_SHORT_REST
    4: []   // durationTypes.AFTER_LONG_REST
};


const allFilePaths = new Program_FilePathsHolder({
    folderClassIcons: 'tokens/class-icons',
    folderCharToken: 'tokens/character',
    folderBackgroundToken: 'tokens/background',
    folderGeneralSounds: 'tokens/general-sounds',
    listCharacter:  ['coil.jpg', 'dedector.jpg'],
    listNPC:        [ 'druid_woman.jpg', 'elf_warrior_woman.jpg', 'mountenless_dwarf.png'],
    listBackground: Object.freeze({
        'detector-green-1'      : new Program_BackgroundFilesHolder(['dark.jpg'],['light.jpg']),
        'alchemy-shop-1'        : new Program_BackgroundFilesHolder(['dark_1.jpg', 'dark_2.jpg'], ['light_1.jpg', 'light_2.jpg'], null, {AMBIANCE : 'ambiance.mp3'}),
        'fighting-pit-muddy-1'  : new Program_BackgroundFilesHolder(['dark.jpg'],['light.jpg']),
        'living-depths-1'       : new Program_BackgroundFilesHolder(['dark.jpg'],['light.jpg']),
        'living-depths-2'       : new Program_BackgroundFilesHolder(['dark.jpg'],['light.jpg']),
        'metalsmith-workshop-1' : new Program_BackgroundFilesHolder(['dark.jpg'],['light.jpg']),
        'ossuary-of-xilbalba-1' : new Program_BackgroundFilesHolder(['dark.jpg'],['light.jpg']),
        'palatial-portal-1'     : new Program_BackgroundFilesHolder(['dark.jpg'],['light.jpg']),
        'royal-bank-1'          : new Program_BackgroundFilesHolder(['dark.jpg'],['light.jpg'])
    }),
    listClassIcons: ['barbarian.png', 'archer.png', 'bard.png', 'brawler.png', 'cleric.png', 'druid.png', 'fighter.png', ' mage.png', 'ranger.png', 'thief.png', 'warlock.png', 'conjurable.png'],
    default_char_profile: 'tokens/character/default_profile/char.png'
})

const uiSettings = new Program_GameUISettings();

let gameSettings = new Program_GameSettings();

const knownSpellString = " / Known";
const spellNormalCast = "Normal Cast";
const noEffect = "No Effect";
const attackerSpellMana     = "Attacker-Spell-Mana";
const attackerSpellLevel    = "Attacker-Spell-Level";
const attackerSpellName     = "Attacker-Spell-Name";
const noDescription = null;