function createCharacterToken(img_src_element, x, y) {
    const token = document.createElement('div');
    token.style.position = 'absolute';
    token.style.width = `${userIntarfaceSettings.GRID_SIZE}px`;
    token.style.height = `${userIntarfaceSettings.GRID_SIZE}px`;
    token.style.backgroundColor = 'red';
    token.style.left = `${x}px`;
    token.style.top = `${y}px`; 
    token.draggable = true;
    token.className = 'character-token';
    token.id = `token-character-${img_src_element.id}`;

    const char = getCharacterById(img_src_element.id);

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
        

        // Future
        char.INVENTORY.addItem(listWeapons["Hammer Of Mouse"], 1);
        char.INVENTORY.addItem(listWeapons.Sword, 1);
        char.INVENTORY.addItem(listConsumables["Healing Potion"], 4);

        displayInventory(char.INVENTORY, event.clientX, event.clientY);
    }

    const characterSpellbookButton = createButton(userIntarfaceSettings.FOLDER_MENUICONS + "/" + userIntarfaceSettings.ICON_SPELLBOOK, 90);
    characterSpellbookButton.onclick = function(event) {
        displayAvaliableSpells(char, event.clientX, event.clientY);
    }

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

function spellCast(token, spell) {

    if (!token || !spell) return;

    const tokenRect = getObjectPositionInGameboard(token);

    // Create elements for the circles
    const spellCastTarget = document.createElement('div');
    const spellRange = document.createElement('div');

    // Set up styles for inner circle
    spellCastTarget.classList.add('spell-cast'); 

    if(spell.spellPattern.pattern === patterns.CIRCULAR){
        spellCastTarget.classList.add('spell-circular');
    }else if(spell.spellPattern.pattern === patterns.BOX){
        spellCastTarget.classList.add('spell-box');
        spellCastTarget.style.left = `${tokenRect.centerX - spell.spellPattern.area/2}px`;
    }else if(spell.spellPattern.pattern === patterns.CONE_UPWARD || spell.spellPattern.pattern === patterns.CONE_DOWNWARD){
        spellCastTarget.classList.add('spell-cone');
    }

    spellCastTarget.style.left = `${tokenRect.centerX - spell.spellPattern.area/2}px`;

    if(spell.spellPattern.fromCaster){
        spellCastTarget.classList.add('spell-from-caster');
        spellCastTarget.style.top = `${tokenRect.centerY}px`;
    }else{
        spellCastTarget.style.top = `${tokenRect.centerY - spell.spellPattern.area/2}px`;
    }

    if(spell.spellPattern.pattern != patterns.CONE_UPWARD && spell.spellPattern.pattern !== patterns.CONE_DOWNWARD){
        spellCastTarget.style.width = `${spell.spellPattern.area}px`;
        spellCastTarget.style.height = `${spell.spellPattern.area}px`;
    }else{
        
        if(spell.spellPattern.pattern === patterns.CONE_DOWNWARD){
            spellCastTarget.style.borderWidth = `0px ${spell.spellPattern.area/2}px ${spell.spellPattern.area}px ${spell.spellPattern.area/2}px`;
        }else{
            spellCastTarget.style.borderWidth = `${spell.spellPattern.area}px ${spell.spellPattern.area/2}px 0px ${spell.spellPattern.area/2}px`;
        }
    }

    // Set up styles for outer circle
    spellRange.classList.add('spell-range');
    spellRange.style.left = `${tokenRect.centerX - spell.spellPattern.range}px`;
    spellRange.style.top = `${tokenRect.centerY - spell.spellPattern.range}px`;
    spellRange.style.width = `${spell.spellPattern.range*2}px`;
    spellRange.style.height = `${spell.spellPattern.range*2}px`;

    const bgLayer = document.getElementById('background-layer');

    // const dot1 = document.createElement('div');
    // dot1.classList.add('spell-dot');
    // dot1.style.left = `${tokenRect.centerX}px`;
    // dot1.style.top = `${tokenRect.centerY}px`;

    // const dot2 = document.createElement('div');
    // dot2.classList.add('spell-dot');
    // dot2.id = 'dot2';


    // bgLayer.appendChild(dot1);
    // bgLayer.appendChild(dot2);
    bgLayer.appendChild(spellCastTarget);
    bgLayer.appendChild(spellRange);

    // Update circle positions based on mouse movement
    function updatePosition(event) {
        const mouse = getMousePositionOnGameboard(event);

        let distance = Math.sqrt(
            Math.pow(mouse.x - tokenRect.centerX, 2) + 
            Math.pow(mouse.y - tokenRect.centerY, 2)
        );

        const newX = mouse.x - spell.spellPattern.area/2;
        const newY = mouse.y - spell.spellPattern.area/2;

        if(spell.spellPattern.fromCaster){
            distance = Math.min(distance, spell.spellPattern.range);
            const angle = Math.atan2(mouse.y - tokenRect.centerY, mouse.x - tokenRect.centerX);
            spellCastTarget.style.transform = `rotate(${(angle * 180 / Math.PI +270)%360}deg)`;

            if(spell.spellPattern.pattern !== patterns.CONE_UPWARD && spell.spellPattern.pattern !== patterns.CONE_DOWNWARD){
                spellCastTarget.style.height = `${distance}px`;
            }else{               
                if(spell.spellPattern.pattern === patterns.CONE_DOWNWARD){
                    spellCastTarget.style.borderBottomWidth = `${distance}px`;
                    spellCastTarget.style.borderTop = 'none';
                }else{
                    spellCastTarget.style.borderTopWidth = `${distance}px`;
                }
            }
            
            // dot2.style.left = `${mouse.x}px`;
            // dot2.style.top = `${mouse.y}px`;
            // dot2.innerHTML = `<div style= "margin: 10px;">${angle * 180 / Math.PI}</div>`

        }else{
            // Check if the mouse is outside the outer circle
            if (distance > spell.spellPattern.range) {
                // Calculate the angle from the token center to the mouse position  
                const angle = Math.atan2(mouse.y - tokenRect.centerY, mouse.x - tokenRect.centerX);

                // Position the inner circle correctly
                spellCastTarget.style.left = `${tokenRect.centerX + spell.spellPattern.range * Math.cos(angle) - spellCastTarget.offsetWidth / 2}px`;
                spellCastTarget.style.top = `${tokenRect.centerY + spell.spellPattern.range * Math.sin(angle) - spellCastTarget.offsetHeight / 2}px`;
            } else {
                // Position the inner circle directly at the new position
                spellCastTarget.style.left = `${newX}px`;
                spellCastTarget.style.top = `${newY}px`;
            }
        }     
    }

    gameboard.addEventListener('mousemove', updatePosition);

    // Clean up the circles when casting is complete
    function stopCasting() {
        bgLayer.removeChild(spellCastTarget);
        bgLayer.removeChild(spellRange);
        gameboard.removeEventListener('mousemove', updatePosition);
        gameboard.removeEventListener('click', stopCasting);
    }

    setTimeout(() => {
        gameboard.addEventListener('click', stopCasting);
    }, 1000); 
}

function getCharToken(char){
    const token = document.getElementById(`token-character-${char.ID}`);
    return token;
}