const bottomMenuBar = document.getElementById('bottom-menu-bar');
const driveImagesBar = document.getElementById('drive-images-bar');

/* GAMEBOARD VARIABLES */
let dragStartX, dragStartY; // Variables to store the drag start position
let currentLayer = 'character-layer'; // Default to character layer
let objectsPositions = new Map(); // Store original positions for each image

let gameSettings = new SettingsGame();
let userIntarfaceSettings = new SettingsUI();
let tokenPaths = new TokenPaths();
let environment = new Environment();
