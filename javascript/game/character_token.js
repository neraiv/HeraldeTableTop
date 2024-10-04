function createCharacterToken(img_src_element, x, y, faction = characterTypes.ALLY, controlledBy = '') {

    if(controlledBy != ''){
        controlledByIdentifier = '-'+controlledBy
    }
    const tokenID = `token-character-${img_src_element.id}` + controlledByIdentifier

    const token = document.createElement('div');
    token.style.position = 'absolute';
    token.style.width = `${uiSettings.grid_size}px`;
    token.style.height = `${uiSettings.grid_size}px`;
    token.style.left = `${x}px`;
    token.style.top = `${y}px`; 
    token.draggable = true;
    token.className = 'character-token';
    token.id = tokenID;

    let char;

    if(faction == characterTypes.CONJURED){
        char =  listConjurableChars[img_src_element.id].char.clone()
        char.controlledBy = controlledBy 
        inGameChars.set(tokenID, char)
        listDestructinator[listConjurableChars[img_src_element.id].duration.type].push(new Program_Destructionator(destructionTypes.TOKEN, {tokenId: tokenID}))
    }
    
    char = inGameChars.get(tokenID);

    if(faction == characterTypes.CONJURED){

    }
    dictCharacterFactions[faction].push(tokenID);

    const img = document.createElement('img');
    img.position = 'absolute';
    img.style.zIndex = 1;
    img.src = img_src_element.src;  
    img.id = `token-character-${img_src_element.id}-image`;
    img.draggable = false;

    const layer = document.getElementById('character-layer');

    setImageSize(img, uiSettings.grid_size, uiSettings.grid_size);
    
    token.addEventListener('dragstart', function (event) {
        toggleButtonsDisplay(false);
        event.dataTransfer.setData("text/plain", event.target.id);
        event.dataTransfer.effectAllowed = "move";
    });

    token.addEventListener('dragend', function (event) {
        toggleButtonsDisplay(true);
        event.dataTransfer.setData("text/plain", event.target.id);
    });

    // Create buttons
    const buttonSize = 50; // Size of the buttons
    const radius = uiSettings.grid_size / 2; // Distance from the center of the token

    const createButton = (iconSrc, angle) => {
        const button = createImageButton(buttonSize, {source: iconSrc});
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
    const characterInventoryButton = createButton(uiSettings.folderMenuIcons + "/" + uiSettings.icon_inventory, 45);
    characterInventoryButton.onclick = function(event){
        displayInventory(char.inventory, event.clientX, event.clientY);
    }

    const characterSpellbookButton = createButton(uiSettings.folderMenuIcons + "/" + uiSettings.icon_spellbook, 90);
    characterSpellbookButton.onclick = function(event) {
        displayAvaliableSpells(char, event.clientX, event.clientY);
    }

    const characterWeaponAttackButton = createButton(uiSettings.folderMenuIcons + "/" + uiSettings.icon_sword, 135);

    // 
    characterWeaponAttackButton.onclick = () => toggleDisplay_SheetWithId(`${img_src_element.id}-character-sheet`, true);

    // Append buttons to token
    token.appendChild(characterInventoryButton);
    token.appendChild(characterSpellbookButton);
    token.appendChild(characterWeaponAttackButton);

    // Append img to token
    token.appendChild(img);

    // Append token to layer
    layer.appendChild(token);


    const rect = token.getBoundingClientRect();
    // Store original positions
    objectsPositions.set(token.id, [tokenTypes.CHARACTER, new DOMRect(x, y, uiSettings.grid_size, uiSettings.grid_size)]);

    // Add mouseenter and mouseleave events for button animations
    token.addEventListener('mouseenter', () => {
        let isSomeoneCasting = false;
        inGameChars.forEach((inGameChar, key) => {
            if (inGameChar.action === characterActions.CASTING) {
                isSomeoneCasting = true;
                return;  // Stops further iteration once a caster is found
            }
        });
        if(!isSomeoneCasting){
            [characterInventoryButton, characterSpellbookButton, characterWeaponAttackButton].forEach(button => {
                button.style.transitionDelay = '';
                button.style.left = `${button.dataset.finalX}px`;
                button.style.top = `${button.dataset.finalY}px`;
            });
        }
    });

    token.addEventListener('mouseleave', () => {
        [characterInventoryButton, characterSpellbookButton, characterWeaponAttackButton].forEach(button => {
            button.style.transitionDelay = '0.5s'; 
            button.style.left = `${radius - buttonSize / 2}px`;
            button.style.top = `${radius - buttonSize / 2}px`;
        });
    });

    function toggleButtonsDisplay(state) {
        if(state){
            characterInventoryButton.style.display = 'flex';
            characterSpellbookButton.style.display = 'flex';
            characterWeaponAttackButton    .style.display = 'flex';
        }else{
            characterInventoryButton.style.display = 'none';
            characterSpellbookButton.style.display = 'none';
            characterWeaponAttackButton    .style.display = 'none';
        }
    }

    return token;
}