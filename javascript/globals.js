const bottomMenuBar = document.getElementById('bottom-menu-bar');
const driveImagesBar = document.getElementById('drive-images-bar');

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