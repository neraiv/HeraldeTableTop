async function initGameBoardFunctions(){
    const maxZoomOut = 0.6 // If its lower grids dissaper
    const maxZoomIn = 5 // it can be higher

    const dotList =  createTestDots(gameboardContent, 1)
    gameboardContent.addEventListener('mousedown', (event) => {
        if (event.button === 0 && gameboardContent.style.cursor === 'move') { // Middle mouse button
            boardEvent.isPanning = true;
            boardEvent.panStartX = event.clientX - boardEvent.panX;
            boardEvent.panStartY = event.clientY - boardEvent.panY;
        }
        if (event.button === 1 && gameboardContent.style.cursor !== 'move') { // Middle mouse button
            boardEvent.isPanning = true;
            boardEvent.panStartX = event.clientX - boardEvent.panX;
            boardEvent.panStartY = event.clientY - boardEvent.panY;
            gameboardContent.style.cursor = 'grabbing';
        }
    });

    gameboardContent.addEventListener('mouseup', (event) => {
        boardEvent.isPanning = false;
        if (event.button === 1 && gameboardContent.style.cursor !== 'move') gameboardContent.style.cursor = 'auto';
    });

    gameboardContent.addEventListener('mousemove', (event) => {
        if (!boardEvent.isPanning) return;
        gameBoardPan(event.clientX - boardEvent.panStartX, event.clientY - boardEvent.panStartY)
    });

    gameboardContent.addEventListener('wheel', (event) => {
        event.preventDefault();
        const scaleAmount = -event.deltaY * 0.001;
        boardEvent.scale = Math.min(Math.max(maxZoomOut, boardEvent.scale + scaleAmount), maxZoomIn);
        gameboardContent.style.transform = `translate(${boardEvent.panX}px, ${boardEvent.panY}px) scale(${boardEvent.scale})`;
    });

    gameboardContent.addEventListener('dragstart', (event) => {
        // Store initial screen position in transformed coordinates
        boardEvent.dragStartX = (event.clientX - boardEvent.panX) / boardEvent.scale;
        boardEvent.dragStartY = (event.clientY - boardEvent.panY) / boardEvent.scale;
        
        // Store element's current position
        boardEvent.elementStartX = parseInt(event.target.style.left) || 0;
        boardEvent.elementStartY = parseInt(event.target.style.top) || 0;
    });

    gameboardContent.addEventListener('dragend', (event) => {
        // Calculate final board coordinates
        const finalX = (event.clientX - boardEvent.panX) / boardEvent.scale;
        const finalY = (event.clientY - boardEvent.panY) / boardEvent.scale;

        // Calculate relative movement
        const deltaX = finalX - boardEvent.dragStartX;
        const deltaY = finalY - boardEvent.dragStartY;

        // Update element position
        const newX = boardEvent.elementStartX + deltaX;
        const newY = boardEvent.elementStartY + deltaY;

        gameBoardMoveToken(event.target, newX, newY);
    });
}

async function initGameBoard(gridSize, width, height) {
    console.log("Initializing game board...")  

    // gridBackground.style.backgroundSize = `${gridSize}px ${gridSize}px`; // FUTURE: Change it to work with canvas

    gameboardContent.style.width = `${width}px`
    gameboardContent.style.height = `${height}px`;
    gameboardContent.style.top = `${-height/2}px`
    gameboardContent.style.left = `${-width/2}px`;

    gameboardContent.style.transform = `translate(0px, 0px) scale(1)`;
}

function gameBoardPan(x = null, y = null, scale = null) {
    x = x ?? boardEvent.panX;
    y = y ?? boardEvent.panY;
    scale = scale ?? boardEvent.scale;
    
    gameboardContent.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

    // Update the pan values
    boardEvent.panX = x;
    boardEvent.panY = y;
    boardEvent.scale = scale;
}