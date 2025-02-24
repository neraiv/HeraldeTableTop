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

async function editTokenShape(token) {
    // Create the pop-up container
    const editPopup = document.createElement("div");
    editPopup.style.position = "fixed";
    editPopup.style.top = "50%";
    editPopup.style.left = "50%";
    editPopup.style.transform = "translate(-50%, -50%)";
    editPopup.style.width = "300px";
    editPopup.style.padding = "20px";
    editPopup.style.backgroundColor = "#fff";
    editPopup.style.borderRadius = "10px";
    editPopup.style.boxShadow = "0px 8px 20px rgba(0, 0, 0, 0.3)";
    editPopup.style.zIndex = "1000";

    // Create input fields for token properties

    function createLabeledInput(labelText, inputType, initialValue) {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.justifyContent = "space-between";
        wrapper.style.marginBottom = "10px";

        const input = document.createElement("input");
        input.type = inputType;
        input.value = initialValue;
        input.style.width = "60%";
        input.style.marginRight = "10px";

        const label = document.createElement("span");
        label.textContent = labelText;
        label.style.fontSize = "0.9em";
        label.style.color = "#555";

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        editPopup.appendChild(wrapper);

        return input;
    }

    const srcInput = createLabeledInput("Image URL", "text", token.style.backgroundImage.replace(/url\((['"])?|(['"])?\)/g, ''));
    const topInput = createLabeledInput("Top (px)", "number", parseInt(token.style.top, 10) || 0);
    const leftInput = createLabeledInput("Left (px)", "number", parseInt(token.style.left, 10) || 0);
    const widthInput = createLabeledInput("Width (px)", "number", parseInt(token.style.width, 10) || 100);
    const heightInput = createLabeledInput("Height (px)", "number", parseInt(token.style.height, 10) || 100);

    // Checkbox for keeping width/height ratio
    const ratioCheckboxWrapper = document.createElement("div");
    ratioCheckboxWrapper.style.display = "flex";
    ratioCheckboxWrapper.style.alignItems = "center";
    ratioCheckboxWrapper.style.marginBottom = "10px";

    const ratioCheckbox = document.createElement("input");
    ratioCheckbox.type = "checkbox";
    ratioCheckbox.id = "keepRatio";
    // Default to checked if a valid image is loaded
    ratioCheckbox.checked = false;
    ratioCheckboxWrapper.appendChild(ratioCheckbox);

    const ratioLabel = document.createElement("label");
    ratioLabel.htmlFor = "keepRatio";
    ratioLabel.textContent = "Keep width/height ratio";
    ratioLabel.style.marginLeft = "5px";
    ratioCheckboxWrapper.appendChild(ratioLabel);

    editPopup.appendChild(ratioCheckboxWrapper);

    // Live preview of changes
    const previewChanges = document.createElement("div");
    previewChanges.style.marginBottom = "10px";
    previewChanges.style.fontSize = "0.9em";
    previewChanges.style.color = "#555";
    editPopup.appendChild(previewChanges);

    // Track the natural aspect ratio of the image
    let aspectRatio = null;
    function updateAspectRatio() {
        const tempImg = new Image();
        tempImg.onload = function () {
            aspectRatio = tempImg.naturalHeight / tempImg.naturalWidth;
            // When the ratio checkbox is enabled, update the height based on current width
            if (ratioCheckbox.checked) {
                const newWidth = parseInt(widthInput.value, 10);
                if (!isNaN(newWidth) && aspectRatio) {
                    heightInput.value = Math.round(newWidth * aspectRatio);
                }
            }
        };
        tempImg.src = srcInput.value;
    }
    // Initial aspect ratio calculation
    updateAspectRatio();

    // Update aspect ratio when the source changes
    srcInput.addEventListener("change", () => {
        updateAspectRatio();
    });

    // If "keep ratio" is checked, update height when width changes
    widthInput.addEventListener("input", () => {
        if (ratioCheckbox.checked && aspectRatio) {
            const newWidth = parseInt(widthInput.value, 10);
            if (!isNaN(newWidth)) {
                heightInput.value = Math.round(newWidth * aspectRatio);
            }
        }
    });

    // When toggling the ratio checkbox, update the height if needed
    ratioCheckbox.addEventListener("change", () => {
        if (ratioCheckbox.checked && aspectRatio) {
            const newWidth = parseInt(widthInput.value, 10);
            if (!isNaN(newWidth)) {
                heightInput.value = Math.round(newWidth * aspectRatio);
            }
        }
    });

    // Create a button to save the changes
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Changes";
    saveButton.style.width = "100%";
    saveButton.style.padding = "10px";
    saveButton.style.marginTop = "10px";
    saveButton.style.backgroundColor = "#4CAF50";
    saveButton.style.color = "#fff";
    saveButton.style.border = "none";
    saveButton.style.borderRadius = "5px";
    saveButton.style.cursor = "pointer";
    editPopup.appendChild(saveButton);

    // Create a button to cancel the edit and close the popup
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.width = "100%";
    cancelButton.style.padding = "10px";
    cancelButton.style.marginTop = "10px";
    cancelButton.style.backgroundColor = "#f44336";
    cancelButton.style.color = "#fff";
    cancelButton.style.border = "none";
    cancelButton.style.borderRadius = "5px";
    cancelButton.style.cursor = "pointer";
    editPopup.appendChild(cancelButton);

    // Append the pop-up to the user interface container (assumed to be defined as 'userInterface')
    userInterface.appendChild(editPopup);

    // Event listener for save button
    saveButton.addEventListener("click", () => {
        token.style.backgroundImage = `url(${srcInput.value})`;
        token.style.top = `${topInput.value}px`;
        token.style.left = `${leftInput.value}px`;
        token.style.width = `${widthInput.value}px`;
        token.style.height = `${heightInput.value}px`;

        // Remove the pop-up
        userInterface.removeChild(editPopup);
    });

    // Event listener for cancel button
    cancelButton.addEventListener("click", () => {
        userInterface.removeChild(editPopup); // Close the pop-up without saving
    });
}


async function editObjectProperties(objectToken) {
    // Ensure the object has a data property
    if (!objectToken.data) {
        objectToken.data = {};
    }

    return new Promise((resolve) => {
        // Create overlay to block background interactions
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "9999";

        // Create modal container
        const modal = document.createElement("div");
        modal.style.background = "#fff";
        modal.style.padding = "20px";
        modal.style.borderRadius = "8px";
        modal.style.boxShadow = "0 0 10px rgba(0,0,0,0.25)";
        modal.style.width = "80%";
        modal.style.maxWidth = "600px";

        // Modal Title
        const title = document.createElement("h2");
        title.textContent = "Edit Object Properties";
        modal.appendChild(title);

        // Create textarea pre-populated with JSON
        const textarea = document.createElement("textarea");
        textarea.style.width = "100%";
        textarea.style.height = "300px";
        try {
            textarea.value = JSON.stringify(objectToken.data, null, 4);
        } catch (e) {
            textarea.value = "{}";
        }
        modal.appendChild(textarea);

        // Button container
        const btnContainer = document.createElement("div");
        btnContainer.style.display = "flex";
        btnContainer.style.justifyContent = "flex-end";
        btnContainer.style.marginTop = "10px";

        // Save button
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.style.marginRight = "10px";
        saveBtn.addEventListener("click", () => {
            try {
                const newData = JSON.parse(textarea.value);
                objectToken.data = newData; // Update the object's data
                document.body.removeChild(overlay);
                resolve(newData);
            } catch (error) {
                alert("Invalid JSON: " + error.message);
            }
        });
        btnContainer.appendChild(saveBtn);

        // Cancel button
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", () => {
            document.body.removeChild(overlay);
            resolve(null);
        });
        btnContainer.appendChild(cancelBtn);

        modal.appendChild(btnContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    });
}

async function addObject() {
    // Create a new object token
    const objectToken = document.createElement("div");
    objectToken.classList.add("background");
    objectToken.id = uiSelections.selectedObject.id;
    objectToken.style.left = `${sceneData.width / 2}px`;
    objectToken.style.top = `${sceneData.height / 2}px`;
    objectToken.style.width = `${sceneData.grid_size}px`;
    objectToken.draggable = true;
    objectToken.style.backgroundImage = `url(${uiSelections.selectedObject.src})`;
    
    // Create a temporary image to determine the natural dimensions
    const tempImg = new Image();
    tempImg.onload = function() {
        const ratio = tempImg.naturalHeight / tempImg.naturalWidth;
        const adjustedHeight = sceneData.grid_size * ratio;
        objectToken.style.height = `${adjustedHeight}px`;
        editTokenShape(objectToken);

    };
    tempImg.src = uiSelections.selectedObject.src;

    // Create the edit buttons container
    const editButtons = document.createElement("div");
    editButtons.style.position = "absolute";
    editButtons.style.top = "-35px"; // Positioned above the object
    editButtons.style.left = "50%";
    editButtons.style.transform = "translateX(-50%)"; // Center it horizontally
    editButtons.style.display = "none"; // Initially hidden
    editButtons.style.flexDirection = "row";
    editButtons.style.alignItems = "center";
    editButtons.style.gap = "5px";
    editButtons.style.padding = "5px";
    editButtons.style.background = "rgba(0, 0, 0, 0.7)";
    editButtons.style.borderRadius = "8px";
    editButtons.style.boxShadow = "0px 2px 6px rgba(0, 0, 0, 0.2)";
    editButtons.style.transition = "opacity 0.2s ease-in-out";
    editButtons.style.opacity = "0"; // Invisible until hovered
    editButtons.style.pointerEvents = "none"; // Prevent accidental hover issues

    // Function to show edit buttons
    function showEditButtons() {
        editButtons.style.display = "flex";
        setTimeout(() => {
            editButtons.style.opacity = "1";
            editButtons.style.pointerEvents = "auto";
        }, 10);
    }

    // Function to hide edit buttons
    function hideEditButtons() {
        editButtons.style.opacity = "0";
        editButtons.style.pointerEvents = "none";
        setTimeout(() => {
            if (!editButtons.matches(":hover") && !objectToken.matches(":hover")) {
                editButtons.style.display = "none";
            }
        }, 200);
    }

    // Edit Shape Button
    const editShapeButton = document.createElement("button");
    editShapeButton.textContent = "Shape";
    editShapeButton.style.padding = "5px 10px";
    editShapeButton.style.backgroundColor = "#4CAF50";
    editShapeButton.style.color = "#fff";
    editShapeButton.style.border = "none";
    editShapeButton.style.borderRadius = "5px";
    editShapeButton.style.cursor = "pointer";
    editShapeButton.addEventListener("click", () => {
        editTokenShape(objectToken);
    });
    editButtons.appendChild(editShapeButton);

    // Edit Properties Button
    const editPropertiesButton = document.createElement("button");
    editPropertiesButton.textContent = "Properties";
    editPropertiesButton.style.padding = "5px 10px";
    editPropertiesButton.style.backgroundColor = "#4CAF50";
    editPropertiesButton.style.color = "#fff";
    editPropertiesButton.style.border = "none";
    editPropertiesButton.style.borderRadius = "5px";
    editPropertiesButton.style.cursor = "pointer";
    editPropertiesButton.addEventListener("click", () => {
        editObjectProperties(objectToken);
    });
    editButtons.appendChild(editPropertiesButton);

    // Show edit buttons when hovering over objectToken
    objectToken.addEventListener("mouseenter", showEditButtons);
    objectToken.addEventListener("mouseleave", hideEditButtons);
    
    // Keep edit buttons visible when hovered over them
    editButtons.addEventListener("mouseenter", showEditButtons);
    editButtons.addEventListener("mouseleave", hideEditButtons);

    objectToken.appendChild(editButtons);
    characterLayer.appendChild(objectToken);
}


// Function to add the background
async function addBackground() {
    console.log(uiSelections.selectedBackground);

    // Create a background token (a draggable element representing the background)
    const backgroundToken = document.createElement("div");
    backgroundToken.classList.add("background");
    backgroundToken.id = uiSelections.selectedBackground.id;
    backgroundToken.style.left = `${sceneData.width/2}px`;
    backgroundToken.style.top = `${sceneData.height/2}px`;
    backgroundToken.style.width = `${200}px`;
    backgroundToken.style.height = `${200}px`;
    backgroundToken.draggable = true;
    backgroundToken.style.backgroundImage = `url(${uiSelections.selectedBackground.src})`;
    backgroundToken.ambiance = uiSelections.selectedBackground.ambiance

    editTokenShape(backgroundToken); // Call the edit function when the background is clicked

    const editButton = document.createElement("button")
    editButton.textContent = "Edit";
    editButton.style.width = "100px";
    editButton.style.padding = "10px";
    editButton.style.backgroundColor = "#4CAF50";
    editButton.style.color = "#fff";
    editButton.style.border = "none";
    editButton.style.borderRadius = "5px";
    editButton.style.cursor = "pointer";
    editButton.style.display = "none";
    editButton.style.zIndex = uiAdder.style.zIndex
    editButton.addEventListener("click", () => {
        editTokenShape(backgroundToken);
    });
    backgroundToken.appendChild(editButton);

    backgroundToken.addEventListener("mouseenter", () => {
        editButton.style.display = "block";
    })
    backgroundToken.addEventListener("mouseleave", () => {
        editButton.style.display = "none";
    })
    // Append the background token to the background layer (or another container)
    backgroundLayer.appendChild(backgroundToken);
}


async function initAdder() {
    if (uiSelections.addSelection === "Add Background") {
        const availableBackgrounds = await getBackgrounds();
        uiAdder.style.display = 'block';
        uiAdderContent.innerHTML = ""; // Clear previous content
        uiAdderSheetTitle.textContent = uiSelections.addSelection;

        Object.entries(availableBackgrounds).forEach(([background, details]) => {
            // Card container for each background
            const card = document.createElement("div");
            card.style.width = "250px";
            card.style.height = "auto";
            card.style.borderRadius = "12px";
            card.style.overflow = "hidden";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.alignItems = "center";
            card.style.justifyContent = "space-between";
            card.style.background = "#222";
            card.style.color = "white";
            card.style.padding = "10px";
            card.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";
            card.style.transition = "all 0.3s ease-in-out";

            // Background image (first layer by default)
            const image = document.createElement("img");
            const lightImage = details.layers["1"]?.light
                ? `static/images/background/${background}/${details.layers["1"].light}`
                : null;
            const darkImage = details.layers["1"]?.dark
                ? `static/images/background/${background}/${details.layers["1"].dark}`
                : null;
            image.src = lightImage || darkImage || "static/images/default.jpg"; // Fallback
            image.style.width = "100%";
            image.style.height = "200px";
            image.style.objectFit = "cover";
            image.style.borderRadius = "8px";
            image.draggable = false;

            // Title for the background
            const title = document.createElement("h3");
            title.textContent = background;
            title.style.margin = "10px 0";

            // Layer container for displaying dark and light options
            const layerContainer = document.createElement("div");
            layerContainer.style.width = "100%";
            layerContainer.style.display = "flex";
            layerContainer.style.flexDirection = "column";
            layerContainer.style.gap = "10px";

            // Loop through each layer and display dark/light options
            if (details.layers) {
                Object.entries(details.layers).forEach(([layer, images]) => {
                    const layerItem = document.createElement("div");
                    layerItem.style.display = "flex";
                    layerItem.style.flexDirection = "row";
                    layerItem.style.alignItems = "center";
                    layerItem.style.justifyContent = "center";
                    layerItem.style.borderRadius = "8px";
                    layerItem.style.gap = "10px";
                    layerItem.style.background = "#333";
                    layerItem.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
                    
                    const layerTitle = document.createElement("p");
                    layerTitle.textContent = `Layer ${layer}`;
                    layerItem.appendChild(layerTitle);

                    // Dark option for layer
                    if (images.dark) {
                        const darkButton = document.createElement("button");
                        darkButton.textContent = "🌑 Dark";
                        darkButton.style.padding = "5px 10px";
                        darkButton.style.borderRadius = "8px";
                        darkButton.style.border = "none";
                        darkButton.style.background = "#444";
                        darkButton.style.color = "white";
                        darkButton.style.cursor = "pointer";
                        darkButton.addEventListener("mouseenter", () => (image.src = `static/images/background/${background}/${images.dark}`));
                        darkButton.addEventListener("mouseleave", () => (image.src = lightImage || darkImage));
                        darkButton.onclick = () => {
                            uiSelections.selectedBackground = {id: ` ${background}-${images.dark}`,src: image.src, ambiance: details.ambiance}
                            addBackground()
                            uiAdder.style.display = 'none';
                        }
                        layerItem.appendChild(darkButton);
                    }

                    // Light option for layer
                    if (images.light) {
                        const lightButton = document.createElement("button");
                        lightButton.textContent = "🌕 Light";
                        lightButton.style.padding = "5px 10px";
                        lightButton.style.borderRadius = "8px";
                        lightButton.style.border = "none";
                        lightButton.style.background = "#bbb";
                        lightButton.style.color = "black";
                        lightButton.style.cursor = "pointer";
                        lightButton.addEventListener("mouseenter", () => (image.src = `static/images/background/${background}/${images.light}`));
                        lightButton.addEventListener("mouseleave", () => (image.src = lightImage || darkImage));

                        lightButton.onclick = () => {
                            uiSelections.selectedBackground = {id: ` ${background}/${images.light}`, src: image.src, ambiance: details.ambiance}
                            addBackground()
                            uiAdder.style.display = 'none';
                        }
                        layerItem.appendChild(lightButton);
                    }

                    // Add the layer item to the container
                    layerContainer.appendChild(layerItem);
                });
            }

            // Append image, title, and layer container to card
            card.appendChild(image);
            card.appendChild(title);
            card.appendChild(layerContainer);

            // Append the card to the UI adder
            uiAdderContent.appendChild(card);
        });
    }

    if (uiSelections.addSelection === "Add Object") {
        const availableObjects = await getObjects();
        uiAdder.style.display = "block";
        uiAdderContent.innerHTML = ""; // Clear previous content
        uiAdderSheetTitle.textContent = uiSelections.addSelection;
    
        Object.entries(availableObjects).forEach(([category, items]) => {
            // Create card container for each object category
            const card = document.createElement("div");
            card.style.width = "250px";
            card.style.height = "auto";
            card.style.borderRadius = "12px";
            card.style.overflow = "hidden";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.alignItems = "center";
            card.style.justifyContent = "space-between";
            card.style.background = "#222";
            card.style.color = "white";
            card.style.padding = "10px";
            card.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";
            card.style.transition = "all 0.3s ease-in-out";
    
            // Title for the object category
            const title = document.createElement("h3");
            title.textContent = category;
            title.style.margin = "10px 0";
    
            // Container for object images
            const objectContainer = document.createElement("div");
            objectContainer.style.width = "100%";
            objectContainer.style.display = "flex";
            objectContainer.style.flexWrap = "wrap";
            objectContainer.style.justifyContent = "center";
            objectContainer.style.gap = "10px";
    
            // Loop through each object in the category
            items.forEach((objectFile) => {
                const objectImage = document.createElement("img");
                objectImage.src = `static/images/objects/${category}/${objectFile}`;
                objectImage.style.width = "80px";
                objectImage.style.height = "80px";
                objectImage.style.objectFit = "contain";
                objectImage.style.borderRadius = "8px";
                objectImage.style.cursor = "pointer";
                objectImage.style.boxShadow = "0px 2px 6px rgba(0, 0, 0, 0.2)";
                objectImage.style.transition = "transform 0.2s ease-in-out";
                objectImage.draggable = false;
    
                objectImage.addEventListener("mouseenter", () => {
                    objectImage.style.transform = "scale(1.1)";
                });
                objectImage.addEventListener("mouseleave", () => {
                    objectImage.style.transform = "scale(1.0)";
                });
    
                objectImage.onclick = () => {
                    uiSelections.selectedObject = {
                        id: `${category}/${objectFile}`,
                        src: objectImage.src,
                    };
                    addObject(); // Function to add object to the scene/game
                    uiAdder.style.display = "none";
                };
    
                // Append image to container
                objectContainer.appendChild(objectImage);
            });
    
            // Append elements to the card
            card.appendChild(title);
            card.appendChild(objectContainer);
    
            // Append card to UI adder content
            uiAdderContent.appendChild(card);
        });
    }
    
}




function initAddSelectionCards(){

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
            uiSelections.addSelection = card.innerText;
            initAdder()
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


async function getBackgrounds() {
    try {
        const response = await fetch('/getBackground');
        const data = await response.json();
        return data
    } catch (error) {
        console.error("Failed to fetch backgrounds:", error);
    }
}

async function getObjects() {
    try {
        const response = await fetch('/getObjects');
        const data = await response.json();
        return data
    } catch (error) {
        console.error("Failed to fetch backgrounds:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initGameBoardFunctions();
    initAddSelectionCards()
});
