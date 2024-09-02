function createCharacterToken(img_src_element, x, y) {
    const token = document.createElement('div');
    token.style.position = 'absolute';
    token.style.width = `${userIntarfaceSettings.GRID_SIZE}px`;
    token.style.height = `${userIntarfaceSettings.GRID_SIZE}px`;
    token.style.backgroundColor = 'red';
    token.style.left = `${x}px`;
    token.style.top = `${y}px`; 
    token.draggable = true;
    token.id = `token-character-${img_src_element.id}`;

    const img = document.createElement('img');
    img.position = 'absolute';
    img.style.zIndex = 1;
    img.src = img_src_element.src;  
    img.id = `token-character-${img_src_element.id}-image`;
    img.draggable = false;

    const layer = document.getElementById('character-layer');

    setImageSize(img, userIntarfaceSettings.GRID_SIZE, userIntarfaceSettings.GRID_SIZE);
    
    token.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData("text/plain", event.target.id);
        event.dataTransfer.effectAllowed = "move";
    });

    token.addEventListener('dragend', function (event) {
        event.dataTransfer.setData("text/plain", event.target.id);
    });

    // Create buttons
    const buttonSize = 50; // Size of the buttons
    const radius = userIntarfaceSettings.GRID_SIZE / 2; // Distance from the center of the token

    const createButton = (iconSrc, angle) => {
        const button = createImageButton(buttonSize, null, iconSrc);
        button.style.position = 'absolute';
        button.style.zIndex = -1;
        button.style.transition = "all 0.3s ease-in-out"; // Smooth sliding effect

        // Start buttons at the center of the token
        button.style.left = `${radius - buttonSize / 2}px`;
        button.style.top = `${radius - buttonSize / 2}px`;

        // Calculate the final position based on the angle
        const finalX = (radius * 2) * Math.cos((angle * Math.PI) / 180) + radius - buttonSize / 2;
        const finalY = -(radius * 2) * Math.sin((angle * Math.PI) / 180) + radius - buttonSize / 2;

        // Add a data attribute to store the final position
        button.dataset.finalX = finalX;
        button.dataset.finalY = finalY;

        return button;
    };

    // Buttons with their respective angles
    const characterInventoryButton = createButton(userIntarfaceSettings.FOLDER_MENUICONS + "/" + userIntarfaceSettings.ICON_INVENTORY, 45);
    characterInventoryButton.onclick = function(event){
        console.log(inGameCharacters);
        const char = getCharacterById(img_src_element.id+'-character-sheet');

        // Future
        char.INVENTORY.addItem(listWeapons.HAMMER.name, 1);
        char.INVENTORY.addItem(listWeapons.SWORD.name, 1);

        displayInventory(char.INVENTORY, event.clientX, event.clientY);
    }

    const characterSpellbookButton = createButton(userIntarfaceSettings.FOLDER_MENUICONS + "/" + userIntarfaceSettings.ICON_SPELLBOOK, 90);
    const characterSheetButton = createButton(userIntarfaceSettings.FOLDER_MENUICONS + "/" + userIntarfaceSettings.ICON_SWORD, 135);

    // 
    characterSheetButton.onclick = () => toggleDisplay_SheetWithId(`${img_src_element.id}-character-sheet`, true);

    // Append buttons to token
    token.appendChild(characterInventoryButton);
    token.appendChild(characterSpellbookButton);
    token.appendChild(characterSheetButton);

    // Append img to token
    token.appendChild(img);

    // Append token to layer
    layer.appendChild(token);

    // Store original positions
    objectsPositions.set(token.id, { x: x, y: y });

    // Add mouseenter and mouseleave events for button animations
    token.addEventListener('mouseenter', () => {
        [characterInventoryButton, characterSpellbookButton, characterSheetButton].forEach(button => {
            button.style.transitionDelay = '';
            button.style.left = `${button.dataset.finalX}px`;
            button.style.top = `${button.dataset.finalY}px`;
        });
    });

    token.addEventListener('mouseleave', () => {
        [characterInventoryButton, characterSpellbookButton, characterSheetButton].forEach(button => {
            button.style.transitionDelay = '0.5s'; 
            button.style.left = `${radius - buttonSize / 2}px`;
            button.style.top = `${radius - buttonSize / 2}px`;
        });
    });
}

