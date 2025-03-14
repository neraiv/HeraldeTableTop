async function initGameBoard() {
    console.log("Initializing game board...")  

    const gridSize = sceneData.grid_size
    const width = sceneData.width
    const height = sceneData.height

    gridBackground.style.backgroundSize = `${gridSize}px ${gridSize}px`;

    gameboardContent.style.width = `${width}px`
    gameboardContent.style.height = `${height}px`;
    gameboardContent.style.top = "0px"
    gameboardContent.style.left = "0px";

    gameboardContent.style.transform = `translate(0px, 0px) scale(1)`;

    topBarSceneName.textContent = "Scene Ov"
    
}

async function initGameBoardFunctions() {
    const maxZoomOut = 0.6;
    const maxZoomIn = 5;
    let scale = 1; // Track scale separately for drag operations

    // Panning logic improvements
    gameboardContent.addEventListener('mousedown', (event) => {
        if (event.button === 1) { // Middle mouse only for panning
            boardEvent.isPanning = true;
            const rect = gameboardContent.getBoundingClientRect();
            boardEvent.startX = event.clientX - boardEvent.panX;
            boardEvent.startY = event.clientY - boardEvent.panY;
            gameboardContent.style.cursor = 'grabbing';
        }
    });

    gameboardContent.addEventListener('mouseup', () => {
        boardEvent.isPanning = false;
        gameboardContent.style.cursor = 'auto';
    });

    // Smoother panning
    gameboardContent.addEventListener('mousemove', (event) => {
        if (!boardEvent.isPanning) return;
        
        boardEvent.panX = event.clientX - boardEvent.startX;
        boardEvent.panY = event.clientY - boardEvent.startY;
        
        gameboardContent.style.transform = `
            translate(${boardEvent.panX}px, ${boardEvent.panY}px) 
            scale(${boardEvent.scale})
        `;
    });

    // Better zoom handling
    gameboardContent.addEventListener('wheel', (event) => {
        event.preventDefault();
        const scaleAmount = -event.deltaY * 0.001;
        boardEvent.scale = Math.min(Math.max(maxZoomOut, boardEvent.scale + scaleAmount), maxZoomIn);
        gameboardContent.style.transform = `translate(${boardEvent.panX}px, ${boardEvent.panY}px) scale(${boardEvent.scale})`;
    });

    // Corrected drag-drop handlers
    gameboardContent.addEventListener('dragstart', (event) => {
        if (event.target.classList.contains('character')) {
            const pos = gameboardGetEventPosition(event);
            boardEvent.dragStartX = pos.x;
            boardEvent.dragStartY = pos.y;
        }
    });

    gameboardContent.addEventListener('drop', (event) => {
        event.preventDefault();
        const pos = gameboardGetEventPosition(event);
        
        if (event.target.classList.contains('character')) {
            const deltaX = pos.x - boardEvent.dragStartX;
            const deltaY = pos.y - boardEvent.dragStartY;
            
            event.target.style.left = `${parseInt(event.target.style.left) + deltaX}px`;
            event.target.style.top = `${parseInt(event.target.style.top) + deltaY}px`;
            
            gameboardMove(event.target, pos.x, pos.y);
        }
    });

    // Required for drop to work
    gameboardContent.addEventListener('dragover', (event) => {
        event.preventDefault();
    });
}

function gameboardMove(token, x, y) {
    // Update the token's position on the gameboard
    // This can be extended to handle specific logic for the game, like snapping the token to a grid
    token.style.left = `${x}px`;
    token.style.top = `${y}px`;
}

function gameboardGetEventPosition(event) {
    const mouseX = (event.clientX - boardEvent.panX - sceneData.width * (1 - boardEvent.scale));
    const mouseY = (event.clientY - boardEvent.panY - sceneData.height * (1 - boardEvent.scale));

    return { x: Math.round(mouseX), y: Math.round(mouseY) };
}


async function getSelectedUI() {
    if (userInteractionData.selected === "Add Background") {
        if (userInteractionData.initStatuses.background === false){
            createAddBackgroundUI()
            userInteractionData.initStatuses.background = true
        }else{
            uiAddBackground.style.display = "block"
        }
    }

    if (userInteractionData.selected === "Add Object") {
        if (userInteractionData.initStatuses.object === false){
            createAddObjectUI()
            userInteractionData.initStatuses.object = true
        }else{
            uiAddObject.style.display = "block"
        }
    }

    if (userInteractionData.selected === "Add Npc") {
        if (userInteractionData.initStatuses.object === false){
            createAddNpcUI()
            userInteractionData.initStatuses.object = true
        }else{
            uiAddNpc.style.display = "block"
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
            userInteractionData.selected = card.innerText;
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
        const reply = await sendRequest({type: 'status', payload: "sync"})
        
        // Exit if sync is failed. Means u should not be online.
        if(reply.success === false){ 
            alert("Lost connection to server.")
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

    gameboardContent.addEventListener("mousemove", (event) => {
        const position = gameboardGetEventPosition(event);
        topBarCoordinates.textContent = `x: ${position.x}, y: ${position.y}`;
        topBarCoordinates2.textContent = `x: ${event.clientX}, y: ${event.clientY}`; 
    })
});
