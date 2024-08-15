function setup(){
    //loadImagesWithURL();
    //loadLocalImages();
    addAvaliableImagesSelector(charImageList, charImageFilesList, "Select<br>Character");
    addAvaliableImagesSelector(backgroundImgList, backgroundImageFilesList, "Select<br>Background");
    addLayerSelecetor();
    layerChange();
    
}

function addLayerSelecetor() {
    const parent = document.getElementById("top-bar-layer-select");
    
    const row = document.createElement("div");
    row.className = "row";

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

    label.setAttribute('for', parent.id);

    parent.appendChild(row);
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

// Add dragstart event listener to images
document.addEventListener("dragstart", function(event) {
    if (event.target.tagName === 'IMG') {
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
    // Edit
    createCharacterCreateSheet(document.body);

    gameboardContent.style.transform = `translate(0px, 0px) scale(1)`;

    let isPanning = false;
    let startX, startY;
    let scale = 1;
    let panX = 0;
    let panY = 0;

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

    function addImageToBoard(src, x, y) {
        let layer;
        if (src.className.includes('character')) {
            layer = document.getElementById('character-layer');
        } else if (src.className.includes('background')) {
            layer = document.getElementById('background-layer');
        }

        if (!document.getElementById(`token-${src.id}`)) {
            const img = document.createElement('img');
            img.src = src.src;
            img.id = `token-${src.id}`;
            img.style.left = `${x}px`;
            img.style.top = `${y}px`;
            img.className = src.className.replace("drive", "token");
            img.draggable = true;
            
            if(layer.id == 'character-layer') {
                img.addEventListener('load', function() {
                    // Set image size based on scaling factor and preserve aspect ratio
                    setImageSize(img, 100, 100);
                });
            }

            img.addEventListener('dragstart', function (event) {
                event.dataTransfer.setData("text/plain", event.target.id);
                event.dataTransfer.effectAllowed = "move";
            });

            img.addEventListener('dragend', function (event) {
                event.dataTransfer.setData("text/plain", event.target.id);
            });

            layer.appendChild(img);

            // Store original positions
            objectsPositions.set(img.id, { x: x, y: y });
        }
    }

    gameboard.addEventListener('mousedown', (event) => {
        if (event.button === 1) { // Middle mouse button
            isPanning = true;
            startX = event.clientX - panX;
            startY = event.clientY - panY;
            gameboard.style.cursor = 'grabbing';
        }
    });

    gameboard.addEventListener('mouseup', () => {
        isPanning = false;
        gameboard.style.cursor = 'grab';
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
        scale = Math.min(Math.max(0.6, scale + scaleAmount), 4);
        gameboardContent.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    });

    gameboard.addEventListener("drop", function(event) {
        event.preventDefault();
        
        const id = event.dataTransfer.getData("text/plain");
        const offsetX = parseInt(event.dataTransfer.getData("offsetX"));
        const offsetY = parseInt(event.dataTransfer.getData("offsetY"));
        const img = document.getElementById(id);

        if (img) {
            // Calculate the position considering the current scale and pan values
            const rect = gameboardContent.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            // Calculate the correct position by subtracting the offset
            const x = (mouseX / scale) - (offsetX / scale);
            const y = (mouseY / scale) - (offsetY / scale);
            
            // Update image position or add to board
            if (img.className.includes('drive')) {
                addImageToBoard(img, x, y);
            } else {
                if (img.className.includes('character')){
                    if(checkIfValidMove(img, x, y)){
                        img.style.position = 'absolute'; // Ensure the image is positioned absolutely
                        img.style.left = `${x}px`;
                        img.style.top = `${y}px`;
                        objectsPositions.set(img.id, { x: x, y: y });
                    }
                }else{
                    img.style.position = 'absolute'; // Ensure the image is positioned absolutely
                    img.style.left = `${x}px`;
                    img.style.top = `${y}px`;
                    objectsPositions.set(img.id, { x: x, y: y });
                }

            }
        } else {
            console.log("Image not found with ID:", id);
        }
    });

    gameboard.addEventListener("dragstart", function(event) {
        if (event.target.tagName === 'IMG') {
            // Get element
            const id = event.dataTransfer.getData("text/plain");
            const element = document.getElementById(id);

            // Extract the image position
            const imgRect = event.target.getBoundingClientRect();
            const rect = gameboardContent.getBoundingClientRect();

            // Calculate the correct position by subtracting the offset
            const x = (imgRect.left - rect.left + (imgRect.width / 2)) / scale;
            const y = (imgRect.top - rect.top + (imgRect.height / 2)) / scale;
            
            
            if(element.className.includes("character")) {
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
        if (event.target.tagName === 'IMG') {

            // Hide and remove the overlay
            if(event.target.className.includes("character")) {
                // POP UP ERROR HERE
                dragOverlay.style.display = 'none';
            }  
        }
    });

    // Ensure images can be dragged over the grid container
    gameboard.addEventListener("dragover", function(event) {
        event.preventDefault();
    });

    setup();
});
