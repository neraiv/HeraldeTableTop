const godLevelServerDomain = "https://heraldednd.wuaze.com/"
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
const fogLayer = document.getElementById('fog-layer')
const fogCanvas = document.getElementById('fog-canvas');

const dragOverlay = document.getElementById('drag-overlay');

// /* GAMEBOARD VARIABLES */
const boardEvent = {
    isPanning : false,
    panStartX : 0,
    panStartY : 0,
    scale : 1,
    panX : 0,
    panY : 0,
    dragStartX : 0,
    dragStartY : 0,
    elementStartX: 0,
    elementStartY: 0,
    dragEndX : 0,
    dragEndY : 0
}


const updates = {
    chat: true,
    scene: []
}


const database = {
    quests : {},
    npcs : {},
    dialogs : {},
    spells: {}
}