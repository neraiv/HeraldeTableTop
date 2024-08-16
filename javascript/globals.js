/* 
Google Drive Reletad
*/
const imageFolder = 'https://lh3.google.com/u/0/d/';
// List of Google Drive file IDs
const imageChars = [
    '1KlXS6mDg_cB_QkHgiQZEwrII8sV0CrQB', // Replace with your file IDs
];
const imageBackgrounds = [
    '1rKoD9A2tZ0dEnpL4tGzVc1YlE4v6Rbpt',
];
/* Google Drive Reletad END*/

let dragStartX, dragStartY; // Variables to store the drag start position
let currentLayer = 'character-layer'; // Default to character layer
let objectsPositions = new Map(); // Store original positions for each image

// Path to local images (relative to the root of your project)
const charImagesFolder = 'images/chars/';
const classIconsImagesFolder = 'images/class-icons/';
const backgroundImagesFolder = 'images/backgrounds/';

// Array of character image filenames
const charImageFiles = ['bobin.jpg', 'dedektor.png'] ; // ['bobin.jpg', 'dedektor.png']  // ['ThugElfFemaleMelee.png', 'druid-woman.png']
const backgroundImageFiles = ['green.png']; // ['green.png'] // ['p.webp']
const classIconFiles = ['barbarian.png', 'archer.png', 'bard.png', 'brawler.png', 'cleric.png', 'druid.png', 'fighter.png', 'mage.png', 'ranger.png', 'thief.png', 'warlock.png']
const spellList = ['fire', 'firefox', 'earth','air','mıç mıç', 'yilmaç']

const gameboard = document.getElementById('gameboard');
const gameboardContent = document.getElementById('gameboard-content');
const dragOverlay = document.getElementById('drag-overlay');
const charImageList = document.getElementById('character-list');
const backgroundImgList = document.getElementById('background-list');

const characterSheet_t = {
    name: "John",
    age: 30,
    city: "New York"
};

/*Variables*/
let MAX_STAT_POINT = 20;
let MIN_STAT_POINT =  0;
let MAX_CHARACTER_LVL = 15;
let MIN_CHARACTER_LVL =  1;
let MAX_SUB_CLASS_COUNT = 2;
let MIN_SUB_CLASS_COUNT =  0;
let allLevels = ['1', '2', '3'];
let selectedCharacterSheetId;