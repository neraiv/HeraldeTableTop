async function createAddObjectUI(){
    const reply = await getObjects();
    uiAddObject.style.display = "block";

    if (reply.success === false) {
        alert("Can't get backgrounds data.")
    }

    const availableObjects = reply.data
    
    uiAddObject.style.display = 'block';

    const [uiAddObjectTopRow, uiAddObjectSheetTitle, uiAddObjectContent, uiAddObjectCloseButton] = addUIDefaults(uiAddObject)

    uiAddObjectContent.innerHTML = ""; // Clear previous content
    uiAddObjectSheetTitle.textContent = userInteractionData.selected;

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
                userInteractionData.selectedObject = {
                    id: `${category}/${objectFile}`,
                    src: objectImage.src,
                };
                addObject(); // Function to add object to the scene/game
                uiAddObject.style.display = "none";
            };

            // Append image to container
            objectContainer.appendChild(objectImage);
        });

        // Append elements to the card
        card.appendChild(title);
        card.appendChild(objectContainer);

        // Append card to UI adder content
        uiAddObjectContent.appendChild(card);
    });

    uiAddObjectCloseButton.onclick = () => {
        uiAddObject.style.display = "none";
    };
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
    objectToken.id = userInteractionData.selectedObject.id;
    objectToken.style.left = `${sceneData.width / 2}px`;
    objectToken.style.top = `${sceneData.height / 2}px`;
    objectToken.style.width = `${sceneData.grid_size}px`;
    objectToken.draggable = true;
    objectToken.style.backgroundImage = `url(${userInteractionData.selectedObject.src})`;
    
    // Create a temporary image to determine the natural dimensions
    const tempImg = new Image();
    tempImg.onload = function() {
        const ratio = tempImg.naturalHeight / tempImg.naturalWidth;
        const adjustedHeight = sceneData.grid_size * ratio;
        objectToken.style.height = `${adjustedHeight}px`;
        editTokenShape(objectToken);

    };
    tempImg.src = userInteractionData.selectedObject.src;

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
    const [editShapeButton, editPropertiesButton] = createEditButtons(objectToken, ["Shape", "Properties"])

    editShapeButton.addEventListener("click", () => {
        editTokenShape(objectToken);
    });

    editPropertiesButton.addEventListener("click", () => {
        editObjectProperties(objectToken);
    });

    characterLayer.appendChild(objectToken);
}