const gameboardContent = document.getElementById('gameboard-content');
const userInterface = document.getElementById('user-interface');
const gridBackground = document.getElementById('grid-background');
const backgroundLayer = document.getElementById('background-layer')
const characterLayer = document.getElementById('character-layer')

const uiAdder = document.getElementById('ui-adder')
const uiAddBackground = document.getElementById('ui-add-background');
const uiAddObject = document.getElementById('ui-add-object');
const uiAddNpc = document.getElementById('ui-add-npc')

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

const uiSelections = {
    selected : "",
    initStatuses: {
        background: false,
        object: false,
        npc: false
    } 
}

const urlParams = new URLSearchParams(window.location.search);

const user = {
    key: urlParams.get("key"),
    name: urlParams.get("userName")
}

const sceneData = {grid_size: 50, width: 2000, height: 2000}