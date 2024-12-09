const godLevelServerDomain = "https://heraldednd.wuaze.com/"

const DEBUG_MODE = true;

class ClassPlayer {
    constructor(
        userKey = null,
        userName = null
    ) {
        this.userKey = userKey;
        this.userName = userName;
    }
}

class ClassPortalInfo {
    constructor(
        type,
        to,
        x,
        y,
        scale,
    ) {
        this.type = type;
        this.to = to;
        this.x = x;
        this.y = y;
        this.scale = scale;
    }
}

class ClassLayerInfo {
    constructor(
        img,
        type,
        x,
        y,
        scale,
        portals
    ) {
        this.img = img;
        this.type = type;
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.portals = portals;
    }
}
class ClassSceneInfo {
    constructor(
        width,
        height,
        grid_size,
        layers = {}
    ) {
        this.width = width;
        this.height = height;
        this.grid_size = grid_size;
        this.layers = layers;
    }
}
class ClassSessionInfo {
    constructor(
        currentScene = {},
        ingGameChars = [],
        object_positions = []
    ) {
        this.currentScene = currentScene;
        this.ingGameChars = ingGameChars;
        this.object_positions = object_positions;
    }
}

let player = new ClassPlayer()
let serverInfo = null
let gameElements = null
let sessionInfo = new ClassSessionInfo()
let sceneInfo = new ClassSceneInfo()
// UI 
let chatData = []

const gameboard = document.getElementById('gameboard');
const gameboardContent = document.getElementById('gameboard-content');
const userInterface = document.getElementById('user-interface');
const gridBackground = document.getElementById('grid-background');
const backgroundLayer = document.getElementById('background-layer')

const driveImagesBar = document.getElementById('drive-images-bar');
const dragOverlay = document.getElementById('drag-overlay');

// /* GAMEBOARD VARIABLES */
let isPanning = false;
let startX, startY;
let scale = 1;
let panX = 0;
let panY = 0;
let dragStartX, dragStartY; // Variables to store the drag start position



// let objectsPositions = new Map(); // Store original positions for each image
// let inGameChars = new Map();
// let listEnemies = [];
// let listAllies = [];
// let listNPC = [];
// let listSpells = {
//     0: {"No Spell": "No Spell"},
//     1: {"No Spell": "No Spell"},
//     2: {"No Spell": "No Spell"},
//     3: {"No Spell": "No Spell"},
//     4: {"No Spell": "No Spell"},
//     5: {"No Spell": "No Spell"},
//     6: {"No Spell": "No Spell"},
//     7: {"No Spell": "No Spell"},
//     8: {"No Spell": "No Spell"},
//     9: {"No Spell": "No Spell"}
// };

// // Database related

// let userName = "";
// let userPassword = "";

// let user;
// let serverInfo;

// let databaseListSpells = {
//     0: ["No Spell"],
//     1: ["No Spell"],
//     2: ["No Spell"],
//     3: ["No Spell"],
//     4: ["No Spell"],
//     5: ["No Spell"],
//     6: ["No Spell"],
//     7: ["No Spell"],
//     8: ["No Spell"],
//     9: ["No Spell"]
// };  

// const dictCharacterFactions = {
//     1: listAllies, 
//     2: listEnemies,
//     3: listNPC
// }
// let listDestructinator = {
//     2: [],  // durationTypes.TURN_BASED
//     3: [],  // durationTypes.AFTER_SHORT_REST
//     4: []   // durationTypes.AFTER_LONG_REST
// };


// let allFilePaths = new Program_FilePathsHolder(); 
// let uiSettings = new Program_GameUISettings();
// let gameSettings = new Program_GameSettings();

// const knownSpellString = " / Known";
// const spellNormalCast = "Normal Cast";
// const noEffect = "No Effect";
// const attackerSpellMana     = "Attacker-Spell-Mana";
// const attackerSpellLevel    = "Attacker-Spell-Level";
// const attackerSpellName     = "Attacker-Spell-Name";
// const noDescription = null;



