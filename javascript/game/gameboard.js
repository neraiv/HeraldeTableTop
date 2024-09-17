function setupUI(){
    addBottomBar();
    addTopBar();
    addTopRightBar();
    addDriveImageBar();
    addCharacterCreateSheet(userInterface);

    // Future
    createDriveImageContainer('dedector', 'character', tokenPaths.FOLDER_CHARTOKEN, document.getElementById('character-list'))
    createDriveImageContainer('coil', 'character', tokenPaths.FOLDER_CHARTOKEN, document.getElementById('character-list'))
}

function getInGameCharacterById(id) {
    return inGameCharacters.find(character => character.id === id);
}

function getInGameCharTokenByCharOrID(char = null, id = null){
    if (char) {
        id = char.id;
    } 
    const token = document.getElementById(`token-character-${id}`);
    return token;
}


function getObjectPositionInGameboard(element) {
    const rect = element.getBoundingClientRect(); // Get the bounding rectangle of the element
    const gameboardRect = gameboardContent.getBoundingClientRect(); // Get the bounding rectangle of the gameboard

    // Calculate the position and size relative to the gameboard
    const left = (rect.left - gameboardRect.left) / scale;
    const top = (rect.top - gameboardRect.top) / scale;

    const right = (rect.right - gameboardRect.right) / scale;
    const bottom = (rect.bottom - gameboardRect.top) / scale;

    const width = rect.width / scale;
    const height = rect.height / scale;
    const centerX = left + width/2;
    const centerY = top + height/2;

    return { left, top, right, bottom, width, height, centerX, centerY};
}

function getObjectPositionInObjectPositions(id){
    if (objectsPositions.get(id)) {
        return objectsPositions.get(id);
    } else {
        console.error(`Object with id ${id} not found in objectsPositions.`);
        return new DOMRect();
    }
}

function getMousePositionOnGameboard(event) {
    const gameboardRect = gameboardContent.getBoundingClientRect(); // Get the bounding rectangle of the gameboard

    // Calculate the mouse position relative to the gameboard
    const mouseX = (event.clientX - gameboardRect.left) / scale;
    const mouseY = (event.clientY - gameboardRect.top) / scale;

    return { x: mouseX, y: mouseY };
}

// Add dragstart event listener to images
document.addEventListener("dragstart", function(event) {
    if (event.target.id.includes('token') || event.target.tagName === 'IMG') {
        const img = event.target;
        
        // Calculate and store the offset between the mouse position and the image position
        dragStartX = event.clientX - img.getBoundingClientRect().left;
        dragStartY = event.clientY - img.getBoundingClientRect().top;
        
        // Store the initial position of the dragged image
        event.dataTransfer.setData("text/plain", img.id);
        event.dataTransfer.setData("offsetX", dragStartX);
        event.dataTransfer.setData("offsetY", dragStartY);
    }
});


document.addEventListener("DOMContentLoaded", () => {

    setupUI();
            
    gridBackground.style.backgroundSize = `${userIntarfaceSettings.GRID_SIZE}px ${userIntarfaceSettings.GRID_SIZE}px`;
    const boardSize = userIntarfaceSettings.BOARD_SIZE;
    
    console.log(`${startX} ${startY} ${boardSize}`);

    gameboardContent.style.width = `${boardSize}px`
    gameboardContent.style.height = `${boardSize}px`;
    gameboardContent.style.left = `${-boardSize/2}px`;
    gameboardContent.style.top = `${-boardSize/2}px`;
  
    gameboardContent.style.transform = `translate(0px, 0px) scale(1)`;

    function checkIfValidMove(img, mouseX, mouseY) {
        //const overlayRect = dragOverlay.getBoundingClientRect();
        const position = objectsPositions.get(img.id);

        const oldX = position.x;
        const oldY = position.y;

        const distance = Math.sqrt(
            Math.pow(mouseX - oldX, 2) + Math.pow(mouseY - oldY, 2)
        );
        
        if (distance > 150) {
            return false;
        }
        return true;
    }

    function addObjectToBoard(src, layer, x, y) {
        if (src.className.includes('character')) {
            if(objectsPositions.has('token-character-'+src.id)) return;
            createCharacterToken(src, x, y);
        } else if (src.className.includes('background')) {
            if(objectsPositions.has('token-background-'+src.id)) return;
            const parts = src.src.split('/'); // Split the path into an array
            const secondToLastItem = parts[parts.length - 2]; // Access the second-to-last item
            const list = listBackgroundFiles[secondToLastItem].LIGHT_FILES.concat(listBackgroundFiles[secondToLastItem].DARK_FILES);
            // Example usage
            askForListSelect(list).then(selectedValue => {
                createBackgroundToken(src, x, y);
            });

        }
    }

    gameboard.addEventListener('mousedown', (event) => {
        if (event.button === 0 && gameboard.style.cursor === 'move') { // Middle mouse button
            isPanning = true;
            startX = event.clientX - panX;
            startY = event.clientY - panY;
        }
        if (event.button === 1 && gameboard.style.cursor !== 'move') { // Middle mouse button
            isPanning = true;
            startX = event.clientX - panX;
            startY = event.clientY - panY;
            gameboard.style.cursor = 'grabbing';
        }
    });

    gameboard.addEventListener('mouseup', (event) => {
        isPanning = false;
        if (event.button === 1 && gameboard.style.cursor !== 'move') gameboard.style.cursor = 'auto';
    });

    gameboard.addEventListener('mousemove', (event) => {
        if (!isPanning) return;
        panX = event.clientX - startX;
        panY = event.clientY - startY;

        gameboardContent.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    });

    gameboard.addEventListener('wheel', (event) => {
        event.preventDefault();
        const scaleAmount = -event.deltaY * 0.001;
        scale = Math.min(Math.max(userIntarfaceSettings.MAX_ZOOM_OUT, scale + scaleAmount), userIntarfaceSettings.MAX_ZOOM_IN);
        gameboardContent.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    });

    gameboard.addEventListener("drop", function(event) {
        event.preventDefault();
        
        const id = event.dataTransfer.getData("text/plain");
        const token = document.getElementById(id);

        if (token) {
            // Calculate the position considering the current scale and pan values
            const offsetX = parseInt(event.dataTransfer.getData("offsetX"));
            const offsetY = parseInt(event.dataTransfer.getData("offsetY"));

            const rect = gameboardContent.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            // Calculate the correct position by subtracting the offset
            const x = (mouseX / scale) - (offsetX / scale);
            const y = (mouseY / scale) - (offsetY / scale);
            
            // Update image position or add to board
            if (token.className.includes('drive')) {
                if(token.className.includes('character')){
                    addObjectToBoard(token, layers["character-layer"], x, y);
                }else if(token.className.includes('background')){
                    addObjectToBoard(token, layers["background-layer"], x, y);
                }
            } else {
                if (token.className.includes('character-token')){
                    if(checkIfValidMove(token, x, y)){
                        moveObject(token, x, y);
                    }
                }else if (token.className.includes('background-token')){
                    moveObject(token, x, y);
                }
            }
        } else {
            console.log("Image not found with ID:", id);
        }
    });

    gameboard.addEventListener("dragstart", function(event) {
        if(gameboard.style.cursor === 'move') return;
        if (event.target.id.includes("token")) {
            // Get element
            const id = event.dataTransfer.getData("text/plain");
            const element = document.getElementById(id);

            // Extract the image position
            const imgRect = event.target.getBoundingClientRect();
            const rect = gameboardContent.getBoundingClientRect();

            // Calculate the correct position by subtracting the offset
            const x = (imgRect.left - rect.left + (imgRect.width / 2)) / scale;
            const y = (imgRect.top - rect.top + (imgRect.height / 2)) / scale;
            
            
            if(element.id.includes("character")) {
                // Show the overlay circle at the position
                dragOverlay.style.display = 'block';
                dragOverlay.style.left = `${x - dragOverlay.offsetWidth / 2}px`; // Center the circle
                dragOverlay.style.top = `${y - dragOverlay.offsetHeight / 2}px`; // Center the circle
            }

            // Calculate and store the offset between the mouse position and the image position
            dragStartX = event.clientX - imgRect.left;
            dragStartY = event.clientY - imgRect.top;
            
            // Store the offset in the dataTransfer object
            event.dataTransfer.setData("text/plain", event.target.id);
            event.dataTransfer.setData("offsetX", dragStartX);
            event.dataTransfer.setData("offsetY", dragStartY);
        }
    });

    // Event listener for when dragging ends
    gameboard.addEventListener("dragend", function(event) {
        event.preventDefault();
        if (event.target.id.includes("token")) {
            // Hide and remove the overlay
            if(event.target.id.includes("character")) {
                // POP UP ERROR HERE
                dragOverlay.style.display = 'none';
            }  
        }
    });

    // Ensure images can be dragged over the grid container
    gameboard.addEventListener("dragover", function(event) {
        event.preventDefault();
    });
});



