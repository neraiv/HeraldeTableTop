function setupUI(){
    addBottomBar();
    addTopBar();
    addDriveImageBar();
    //addCharacterCreateSheet(document.body);
}
/* BOTTOM BAR */
function addBottomBar(){
    const row = document.createElement('div');
    row.classList.add('row');
    row.classList.add('centered');
    row.classList.add('box-circular-border')
    row.style.backgroundColor = '#ddd';
    row.style.padding = '4px';
    row.style.gap = '5px';
    
    const openDriveImageBar = createImageButton(32, '💽');
    openDriveImageBar.addEventListener('click', () => {
        toggleSliding_SheetWithId(driveImagesBar.id);
    });

    const openChat = createImageButton(32, '💬');
    
    row.appendChild(openDriveImageBar);
    row.appendChild(openChat);

    bottomMenuBar.appendChild(row);
}
/* END OF BOTTOM BAR */

/* TOP BAR */
function addTopBar(){
    editToolBar();
    addToolsBar();
    addLayerSelecetor();
    layerChange();
}

function editToolBar(){
    const parent = document.getElementById("top-menu-bar");
    parent.classList.add('column');
    parent.classList.add('centered');
    parent.style.gap = '5px';

}

function addToolsBar(){
    const parent = document.getElementById("top-menu-bar");
    const row = document.createElement("div");
    row.classList.add('row');
    row.classList.add('centered');
    row.classList.add('box-circular-border')
    row.style.padding = '4px';
    row.style.gap = '4px';
    row.style.backgroundColor = "#ddd";
    
    const cursorButton = createImageButton(36, null, `${userIntarfaceSettings.FOLDER_MENUICONS}/${userIntarfaceSettings.ICON_CURSOR}`);
    cursorButton.onclick = () => {
        if(gameboard.style.cursor !== 'auto'){
            gameboard.style.cursor = 'auto';
        } 
        addToogleHighlight(cursorButton, parent);
    }

    const panningButton = createImageButton(36, null, `${userIntarfaceSettings.FOLDER_MENUICONS}/${userIntarfaceSettings.ICON_PANNING}`);
    panningButton.onclick = () => {
        if(gameboard.style.cursor === 'move'){
            gameboard.style.cursor = 'auto';
        } else {
            gameboard.style.cursor = 'move';
        }
        addToogleHighlight(panningButton, parent);
    }

    const centerButton = createImageButton(36, null, `${userIntarfaceSettings.FOLDER_MENUICONS}/${userIntarfaceSettings.ICON_CENTER}`);
    centerButton.onclick = () => {
        const gameboardContent = document.getElementById('gameboard-content');
        isPanning = false;     
        panX = 0; 
        panY = 0;
        gameboardContent.style.transform = `translate(0px, 0px) scale(${scale})`;  
    }

    addClickHighlightListener(centerButton);

    row.appendChild(cursorButton);
    row.appendChild(panningButton);
    row.appendChild(centerButton);

    parent.appendChild(row);
}
function addLayerSelecetor() {
    const parent = document.getElementById("top-menu-bar");

    const layerSelect = document.createElement("div");
    layerSelect.id = "layer-select";
    layerSelect.style.padding = "5px"
    layerSelect.style.backgroundColor = "#ddd";
    layerSelect.classList.add('box-circular-border');
    const row = document.createElement("div");
    row.className = "row";
    row.style.gap = "5px";

    const label =  document.createElement("label");
    label.textContent = "Layer: ";

    const select = document.createElement("select");
    select.id = "layer-select";
    select.addEventListener("change", function(event) {
        event.preventDefault();
        currentLayer = this.value;
        layerChange();
    });

    const option1 = document.createElement("option");
    option1.value = "character-layer";
    option1.textContent = "Character";
    select.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = "background-layer";
    option2.textContent = "Background";
    select.appendChild(option2);
    
    const option3 = document.createElement("option");
    option3.value = "fog-layer";
    option3.textContent = "Fog";
    select.appendChild(option3);

    row.appendChild(label);
    row.appendChild(select);

    label.setAttribute('for', layerSelect.id);

    layerSelect.appendChild(row);
    parent.appendChild(layerSelect);
}

function getObjectPositionInGameboard(element) {
    const rect = element.getBoundingClientRect(); // Get the bounding rectangle of the element
    const gameboardRect = gameboardContent.getBoundingClientRect(); // Get the bounding rectangle of the gameboard

    // Calculate the position and size relative to the gameboard
    const left = (rect.left - gameboardRect.left) / scale;
    const top = (rect.top - gameboardRect.top) / scale;
    const width = rect.width / scale;
    const height = rect.height / scale;
    const centerX = left + width/2;
    const centerY = top + height/2;

    return { left, top, width, height, centerX, centerY};
}

function getMousePositionOnGameboard(event) {
    const gameboardRect = gameboardContent.getBoundingClientRect(); // Get the bounding rectangle of the gameboard

    // Calculate the mouse position relative to the gameboard
    const mouseX = (event.clientX - gameboardRect.left) / scale;
    const mouseY = (event.clientY - gameboardRect.top) / scale;

    return { x: mouseX, y: mouseY };
}

function layerChange() {
    // Get all layers
    const layers = document.querySelectorAll('.layer');

    // Loop through all layers and disable interactions
    layers.forEach(layer => {
        if (layer.id === currentLayer) {
            layer.style.pointerEvents = 'auto'; // Enable interactions for the selected layer
        } else {
            layer.style.pointerEvents = 'none'; // Disable interactions for other layers
        }
    });
}
/* END OF TOP BAR */

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
            createCharacterToken(src, x, y);
        } else if (src.className.includes('background')) {
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
                        moveObjectInGameBoardToPosition(token, x, y);
                    }
                }else if (token.className.includes('background-token')){
                    moveObjectInGameBoardToPosition(token, x, y);
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



