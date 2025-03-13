async function  createAddBackgroundUI() {
    const reply = await getBackgrounds();

    if (reply.success === false) {
        alert("Can't get backgrounds data.")
    }

    const availableBackgrounds = reply.data

    uiAddBackground.style.display = 'block';

    const [uiAddBackgroundTopRow, uiAddBackgroundSheetTitle, uiAddBackgroundContent, uiAddBackgroundCloseButton] = addUIDefaults(uiAddBackground)
    
    uiAddBackgroundContent.innerHTML = ""; // Clear previous content
    uiAddBackgroundSheetTitle.textContent = userInteractionData.selected;

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
                        userInteractionData.selectedBackground = {id: ` ${background}-${images.dark}`,src: image.src, ambiance: details.ambiance}
                        addBackground()
                        uiAddBackground.style.display = 'none';
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
                        userInteractionData.selectedBackground = {id: ` ${background}/${images.light}`, src: image.src, ambiance: details.ambiance}
                        addBackground()
                        uiAddBackground.style.display = 'none';
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
        uiAddBackgroundContent.appendChild(card);
    });

    uiAddBackgroundCloseButton.onclick = () => {
        uiAddBackground.style.display = 'none';
    }
}

// Function to add the background
async function addBackground() {
    console.log(userInteractionData.selectedBackground);

    // Create a background token (a draggable element representing the background)
    const backgroundToken = document.createElement("div");
    backgroundToken.classList.add("background");
    backgroundToken.id = userInteractionData.selectedBackground.id;
    backgroundToken.style.left = `${sceneData.width/2}px`;
    backgroundToken.style.top = `${sceneData.height/2}px`;
    backgroundToken.style.width = `${200}px`;
    backgroundToken.style.height = `${200}px`;
    backgroundToken.draggable = true;
    backgroundToken.style.backgroundImage = `url(${userInteractionData.selectedBackground.src})`;
    backgroundToken.ambiance = userInteractionData.selectedBackground.ambiance

    editTokenShape(backgroundToken); // Call the edit function when the background is clicked

    const [editShapeButton] = createEditButtons(backgroundToken, ["Shape"])
    
    editShapeButton.addEventListener("click", () => {
        editTokenShape(backgroundToken);
    });

    // Append the background token to the background layer (or another container)
    backgroundLayer.appendChild(backgroundToken);
}

