async function initGameBoard() {
    console.log("Initializing game board...")  

    const gridSize = sceneData.grid_size
    const width = sceneData.width
    const height = sceneData.height

    gridBackground.style.backgroundSize = `${gridSize}px ${gridSize}px`;

    gameboardContent.style.width = `${width}px`
    gameboardContent.style.height = `${height}px`;
    gameboardContent.style.top = `${-height/2}px`
    gameboardContent.style.left = `${-width/2}px`;

    gameboardContent.style.transform = `translate(0px, 0px) scale(1)`;

    topBarSceneName.textContent = "Scene Ov"
    
}

async function initGameBoardFunctions(){
    const maxZoomOut = 0.6 // If its lower grids dissaper
    const maxZoomIn = 5 // it can be higher
    gameboardContent.addEventListener('mousedown', (event) => {
        if (event.button === 0 && gameboardContent.style.cursor === 'move') { // Middle mouse button
            boardEvent.isPanning = true;
            boardEvent.startX = event.clientX - boardEvent.panX;
            boardEvent.startY = event.clientY - boardEvent.panY;
        }
        if (event.button === 1 && gameboardContent.style.cursor !== 'move') { // Middle mouse button
            boardEvent.isPanning = true;
            boardEvent.startX = event.clientX - boardEvent.panX;
            boardEvent.startY = event.clientY - boardEvent.panY;
            gameboardContent.style.cursor = 'grabbing';
        }
    });

    gameboardContent.addEventListener('mouseup', (event) => {
        boardEvent.isPanning = false;
        if (event.button === 1 && gameboardContent.style.cursor !== 'move') gameboardContent.style.cursor = 'auto';
    });

    gameboardContent.addEventListener('mousemove', (event) => {
        if (!boardEvent.isPanning) return;
        boardEvent.panX = event.clientX - boardEvent.startX;
        boardEvent.panY = event.clientY - boardEvent.startY;
        
        gameboardContent.style.transform = `translate(${boardEvent.panX}px, ${boardEvent.panY}px) scale(${boardEvent.scale})`;
    });

    gameboardContent.addEventListener('wheel', (event) => {
        event.preventDefault();
        const scaleAmount = -event.deltaY * 0.001;
        boardEvent.scale = Math.min(Math.max(maxZoomOut, boardEvent.scale + scaleAmount), maxZoomIn);
        gameboardContent.style.transform = `translate(${boardEvent.panX}px, ${boardEvent.panY}px) scale(${boardEvent.scale})`;
    });

    gameboardContent.addEventListener('dragStart', (event) => {
        boardEvent.dragStartX = event.clientX;
        boardEvent.dragStartY = event.clientY;
    })

    gameboardContent.addEventListener('drop', (event) => {
        const rect = gameboardContent.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        // Calculate the correct position by subtracting the offset
        const x = (mouseX / scale) - (boardEvent.dragStartX / scale);
        const y = (mouseY / scale) - (boardEvent.dragStartY / scale);
        
        if (event.target.classList.contains('background')){
            // Assuming token is the element you're dragging, move it
            event.target.style.left = `${event.target.offsetLeft + x}px`;
            event.target.style.top = `${event.target.offsetTop + y}px`;
        
            // Optionally, update the event.target's position in any data model or logic
            gameboardMove(event.target, event.target.offsetLeft + x, event.target.offsetTop + y);
        }
    });
}

function gameboardMove(token, x, y) {
    // Update the token's position on the gameboard
    // This can be extended to handle specific logic for the game, like snapping the token to a grid
    token.style.left = `${x}px`;
    token.style.top = `${y}px`;
}

async function getSelectedUI() {
    if (uiSelections.selected === "Add Background") {
        if (uiSelections.initStatuses.background === false){
            createAddBackgroundUI()
            uiSelections.initStatuses.background = true
        }else{
            uiAddBackground.style.display = "block"
        }
    }

    if (uiSelections.selected === "Add Object") {
        if (uiSelections.initStatuses.object === false){
            createAddObjectUI()
            uiSelections.initStatuses.object = true
        }else{
            uiAddObject.style.display = "block"
        }
    }

    if (uiSelections.selected === "Add Npc") {
        if (uiSelections.initStatuses.object === false){
            createAddNpcUI()
            uiSelections.initStatuses.object = true
        }else{
            uiAddBackground.style.display = "block"
        }
    }
}


function initAddSelectionCardsInteractions(){

    addButton.onclick = () => {
        addSelection.style.display = "grid"
    }

    // Hover effect function
    function applyHoverEffect(card) {
        card.style.background = "linear-gradient(145deg, #1976D2, #2196F3)";
        card.style.transform = "scale(1.08)";
        card.style.boxShadow = "0px 10px 25px rgba(33, 150, 243, 0.5)";
    }

    // Reset hover effect function
    function resetHoverEffect(card) {
        card.style.background = "linear-gradient(145deg, #2196F3, #1976D2)";
        card.style.transform = "scale(1)";
        card.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";
    }

    // Click effect function
    function applyClickEffect(card) {
        card.style.transform = "scale(0.95)";
        card.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.5)";
        setTimeout(() => {
            card.style.transform = "scale(1)";
            addSelection.style.display = "none";
            uiSelections.selected = card.innerText;
            getSelectedUI()
        }, 200);
    }


    // Add event listeners for card hover effect
    const cardElements = addSelection.querySelectorAll('.card');
    cardElements.forEach(card => {
        card.addEventListener('mouseenter', () => applyHoverEffect(card));
        card.addEventListener('mouseleave', () => resetHoverEffect(card));
        card.addEventListener('click', () => applyClickEffect(card));
    });
}

function startSyncTimer() {
    
    async function update() {
        const reply = sendRequest({type: 'status', payload: "sync"})
        
        // Exit if sync is failed. Means u should not be online.
        if(reply === "false"){ 
            window.location.href = "/";
        }
    }

    setInterval(update, 1000); // Update every second
}

logOutButton.onclick = async (event) => {
    userAskQuestion('Logging out!', "Are you sure you want to log out?", 
        {buttons: ['Logout','Continue Advanture'], 
            callback: (buttonText) => {
                if (buttonText == 'Logout') {
                    sendRequest({type: "status", payload: "logout"})
                    window.location.href = "/";
                }
            },
        blocking: true});
}

topBarLayerSelector.inputElement.onchange = (event) => {
    const selectedElement = event.target.selectedOptions[0].value;

    // Find the previously active element
    if (selectedElement == "bg") {
        backgroundLayer.className = "layer active"
        characterLayer.className = "layer passive"
    }
    else if ("char") {
        backgroundLayer.className = "layer passive"
        characterLayer.className = "layer active"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    startSyncTimer();
    initGameBoard()
    initGameBoardFunctions();
    initAddSelectionCardsInteractions()
});
