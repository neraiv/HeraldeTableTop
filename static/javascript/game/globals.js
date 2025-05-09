const godLevelServerDomain = "https://heraldednd.wuaze.com/"
let player = {}

// UI 
const audioAmbiance = new Audio();

const gameboardContent = document.getElementById('gameboard-content');
const userInterface = document.getElementById('user-interface');

const app = new PIXI.Application();
const uiLayer = new PIXI.Container();
const gameLayer = new PIXI.Container();

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
    chat: {
        requires: false,
        data: null
    },
    scene : {
        requires: false,
        data: []
    },
    turnStatus: {
        requires: false,
        data: {}
    },
}

const database = {
    quests : {},
    chars : {},
    npcs : {},
    dialogs : {},
    spells: {},
    sceneData :{},
    sessionInfo : {},
    serverInfo : {},
    serverRules: {}
}

const gameSceneData = {
    portals : [],
    chars : [],
    objects : [],
    npcs: [],
}