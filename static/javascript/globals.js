const godLevelServerDomain = "https://heraldednd.wuaze.com/"

const DEBUG_MODE = true;

let player = {}
let inGameChars = {}
let serverRules = {}
let serverInfo = {}
let sessionInfo = {}
let sceneData = {}

let listSpells = null
let listSpellNames = null

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


const updates = {
    chat: true,
}
