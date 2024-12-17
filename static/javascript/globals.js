const godLevelServerDomain = "https://heraldednd.wuaze.com/"

const DEBUG_MODE = true;

class ClassPlayer {
    constructor({
        userKey = null,
        userName = null,
        charId = null
    } = {}) {
        this.userKey = userKey;
        this.userName = userName;
        this.charId = charId;
    }
}
class ClassSceneInfo {
    constructor({
        width,
        height,
        grid_size,
        layers = {}
    } = {}) {
        this.width = width;
        this.height = height;
        this.grid_size = grid_size;
        this.layers = layers;
    }
}
class ClassSessionInfo {
    constructor({
        currentScene = {},
        ingGameChars = [],
        object_positions = []
    } = {}) {
        this.currentScene = currentScene;
        this.ingGameChars = ingGameChars;
        this.object_positions = object_positions;
    }
}
class ClassGameRules {
    constructor({
        visible_inventories =  true,
        is_player_can_make_items =  {
            state :  true,
            count :  "unlimited"
        },
        fog_type =  null,
        include_all_classic_spells =  true,
        spells =  {
            levels :  [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
    } = {}) {
        this.visible_inventories = visible_inventories;
        this.is_player_can_make_items = is_player_can_make_items;
        this.fog_type = fog_type;
        this.include_all_classic_spells = include_all_classic_spells;
        this.spells = spells;
    }
}
class ClassServerInfo {
    constructor({
        server_time,
        server_status,
        last_session,
        chat_idx
    } = {}) {
        this.server_time = server_time;
        this.server_status = server_status;
        this.last_session = last_session;
        this.chat_idx = chat_idx;
    }
}

let player = new ClassPlayer()
let inGameChars = {}
let serverRules = new ClassGameRules()
let serverInfo = new ClassServerInfo()
let sessionInfo = new ClassSessionInfo()
let scenes = null
let sceneInfo = new ClassSceneInfo()
let spells = null
// UI 
let chatData = []
const audioAmbiance = new Audio();

const gameboardContent = document.getElementById('gameboard-content');
const userInterface = document.getElementById('user-interface');
const gridBackground = document.getElementById('grid-background');
const backgroundLayer = document.getElementById('background-layer')
const characterLayer = document.getElementById('character-layer')

const dragOverlay = document.getElementById('drag-overlay');

// /* GAMEBOARD VARIABLES */
const boardEvent = {
    isPanning : false,
    startX : 0,
    startY : 0,
    scale : 1,
    panX : 0,
    panY : 0,
    dragStartX : 0,
    dragStartY : 0
}



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



