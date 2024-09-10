let isPanning = false;
let startX, startY;
let scale = 1;
let panX = 0;
let panY = 0;

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
let dragStartX, dragStartY; // Variables to store the drag start position
let currentLayer = 'character-layer'; // Default to character layer
let objectsPositions = new Map(); // Store original positions for each image

let userIntarfaceSettings = new SettingsUI();
let tokenPaths = new TokenPaths();
let environment = new Environment();

let inGameCharacters = [];
let gameFlags = new GameFlags();

let gameSettings = new SettingsGame({
    flags: gameFlags
});

const listBackgroundFiles = Object.freeze({
    'detector-green-1'      : new BackgroundFilesInfo(['dark.jpg'],['light.jpg']),
    'alchemy-shop-1'        : new BackgroundFilesInfo(['dark_1.jpg', 'dark_2.jpg'], ['light_1.jpg', 'light_2.jpg'], null, {AMBIANCE : 'ambiance.mp3'}),
    'fighting-pit-muddy-1'  : new BackgroundFilesInfo(['dark.jpg'],['light.jpg']),
    'living-depths-1'       : new BackgroundFilesInfo(['dark.jpg'],['light.jpg']),
    'living-depths-2'       : new BackgroundFilesInfo(['dark.jpg'],['light.jpg']),
    'metalsmith-workshop-1' : new BackgroundFilesInfo(['dark.jpg'],['light.jpg']),
    'ossuary-of-xilbalba-1' : new BackgroundFilesInfo(['dark.jpg'],['light.jpg']),
    'palatial-portal-1'     : new BackgroundFilesInfo(['dark.jpg'],['light.jpg']),
    'royal-bank-1'          : new BackgroundFilesInfo(['dark.jpg'],['light.jpg'])
});