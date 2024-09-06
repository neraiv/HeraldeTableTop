let isPanning = false;
let startX, startY;
let scale = 1;
let panX = 0;
let panY = 0;

const gameboard = document.getElementById('gameboard');
const gameboardContent = document.getElementById('gameboard-content');
const gridBackground = document.getElementById('grid-background');
const dragOverlay = document.getElementById('drag-overlay');

const layers = Object.freeze({
    "character-layer": document.getElementById('character-layer'),
    "background-layer": document.getElementById('background-layer'),
    "fog-layer": document.getElementById('fog-layer')
});

