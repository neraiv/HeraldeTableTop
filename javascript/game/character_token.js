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

    const char = getInGameCharacterById(img_src_element.id);

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
        char.inventory.addItem(listWeapons["Hammer Of Mouse"], 1);
        char.inventory.addItem(listWeapons.Sword, 1);
        char.inventory.addItem(listConsumables["Healing Potion"], 4);

        displayInventory(char.inventory, event.clientX, event.clientY);
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


    const rect = token.getBoundingClientRect();
    // Store original positions
    objectsPositions.set(token.id, new DOMRect(x, y, userIntarfaceSettings.GRID_SIZE, userIntarfaceSettings.GRID_SIZE));

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

function spellCast(tokenID, spell, mana=null) {
    if (!tokenID || !spell) return;

    const tokenRect = getObjectPositionInObjectPositions(tokenID);

    const tokenCenterX = tokenRect.x + tokenRect.width / 2
    const tokenCenterY = tokenRect.y + tokenRect.height / 2
    
    const spellCastTarget = document.createElement('div');
    const spellRangeCircle = document.createElement('div');
    spellCastTarget.classList.add('spell-cast'); 

    const spellBox = document.createElement('div');
    spellBox.style.border = '1px solid black';
    spellBox.style.borderLeftWidth = '3px';
    spellBox.style.borderTopWidth = '3px';
    spellBox.style.width = '100%';
    spellBox.style.height = '100%';
    spellCastTarget.appendChild(spellBox);

    let spellPattern = spell.spellPattern.pattern;
    let spellArea = spell.spellPattern.area;
    let spellRange = spell.spellPattern.range;

    if(spell.spendManaEffects[mana]?.targetEffectTypes == targetEffectTypes.BUFF){
        for (let spellEffect of spell.spendManaEffects[mana].targetEffect) {
            if(spellEffect.effect == effectTypes.PATTERN_CHANGE){
                spellPattern = spellEffect.value;               
            }           
            if(spellEffect.effect == effectTypes.ATTACK_RADIUS_BONUS) {
                spellArea = parseInt(spellArea) + parseInt(spellEffect.value);
            }
            if(spellEffect.effect == effectTypes.ATTACK_RANGE_BONUS) {
                spellRange = parseInt(spellRange) + parseInt(spellEffect.value);
            }
        }
    }
    if(spellPattern === spellPatterns.CIRCULAR) {
        spellCastTarget.classList.add('spell-circular');
    } else if(spellPattern === spellPatterns.BOX) {
        spellCastTarget.classList.add('spell-box');
    } else if(spellPattern === spellPatterns.CONE_UPWARD || spellPattern === spellPatterns.CONE_DOWNWARD) {
        spellCastTarget.classList.add('spell-cone');
    }

    spellCastTarget.style.left = `${tokenCenterX - spellArea / 2}px`;

    if(spell.spellPattern.castType == castType.FROM_CASTER) {
        spellCastTarget.classList.add('spell-from-caster');
        spellCastTarget.style.top = `${tokenCenterY}px`;
    }else if(spell.spellPattern.castType == castType.AROUND_CASTER){
        spellCastTarget.style.top = `${tokenCenterY}px`;
        spellCastTarget.style.left = `${tokenCenterX}px`;
        spellCastTarget.style.transform = 'translate(-50%, -50%)';
    } else {
        spellCastTarget.style.top = `${tokenCenterY - spellArea / 2}px`;
    }

    if(spellPattern !== spellPatterns.CONE_UPWARD && spellPattern !== spellPatterns.CONE_DOWNWARD) {
        spellCastTarget.style.width = `${spellArea}px`;
        spellCastTarget.style.height = `${spellArea}px`;

    } else {
        if(spellPattern === spellPatterns.CONE_DOWNWARD) {
            spellCastTarget.style.borderWidth = `0px ${spellArea / 2}px ${spellArea}px ${spellArea / 2}px`;
        } else {
            spellCastTarget.style.borderWidth = `${spellArea}px ${spellArea / 2}px 0px ${spellArea / 2}px`;
        }
    }

    spellRangeCircle.classList.add('spell-range');
    spellRangeCircle.style.left = `${tokenCenterX - spellRange}px`;
    spellRangeCircle.style.top = `${tokenCenterY - spellRange}px`;
    spellRangeCircle.style.width = `${spellRange*2}px`;
    spellRangeCircle.style.height = `${spellRange*2}px`;

    const bgLayer = document.getElementById('background-layer');
    bgLayer.appendChild(spellCastTarget);
    bgLayer.appendChild(spellRangeCircle);

    const out = createTestDots(bgLayer, 4);
    out[0].style.borderColor = 'black';

    let overlappedTokens = {};
    // out[3].style.left   = `${corners[2].x-3}px`; // Bottom-left
    // out[3].style.top    = `${corners[2].y-3}px`;

    // out[2].style.left   = `${corners[1].x-3}px`; // Top-right
    // out[2].style.top    = `${corners[1].y-3}px`;

    // out[1].style.left   = `${corners[3].x-3}px`;
    // out[1].style.top    = `${corners[3].y-3}px`; // Bottom-right

    // out[0].style.left   = `${corners[0].x-3}px`; // Top-left
    // out[0].style.top    = `${corners[0].y-3}px`;
    

    function updatePosition(event) {
        const mouse = getMousePositionOnGameboard(event);
        let distance = Math.sqrt(
            Math.pow(mouse.x - tokenCenterX, 2) + 
            Math.pow(mouse.y - tokenCenterY, 2)
        );
        const mouseAngle = Math.atan2(mouse.y - tokenCenterY, mouse.x - tokenCenterX);

        const angle = mouseAngle + (1.5 * Math.PI)

        let newX, newY, spellWidth, spellHeight = 0;
        let corners = [];
        if (spell.spellPattern.castType === castType.FROM_CASTER) {
            distance = Math.min(distance, spellRange);
            spellCastTarget.style.transform = `rotate(${(angle * 180 / Math.PI) % 360}deg)`;

            if (spell.spellPattern !== spellPatterns.CONE_UPWARD && spellPattern !== spellPatterns.CONE_DOWNWARD) {
                spellCastTarget.style.height = `${distance}px`;
            } else {
                // Handle cone spellPatterns with borders
                if (spell.spellPattern.pattern === spellPatterns.CONE_DOWNWARD) {
                    spellCastTarget.style.borderBottomWidth = `${distance}px`;
                    spellCastTarget.style.borderTop = 'none';
                } else {
                    spellCastTarget.style.borderBottom = 'none';
                    spellCastTarget.style.borderTopWidth = `${distance}px`;
                }
            }
            spellWidth = spellArea;
            spellHeight = distance;
            newX = tokenCenterX - spellArea / 2;
            newY = tokenCenterY;

        } else if(spell.spellPattern.castType == castType.ON_LOCATION) {
            // castType.ON_LOCATION
            newX = mouse.x - spellArea / 2;
            newY = mouse.y - spellArea / 2;

            if (distance > spellRange) {
                newX = tokenCenterX + spellRange * Math.cos(angle) - spellCastTarget.offsetWidth / 2;
                newY = tokenCenterY + spellRange * Math.sin(angle) - spellCastTarget.offsetHeight / 2;
            }
    
            spellWidth = spellArea;
            spellHeight = spellArea;

            spellCastTarget.style.left = `${newX}px`;
            spellCastTarget.style.top = `${newY}px`;
            spellCastTarget.style.transform = `rotate(${(angle * 180 / Math.PI) % 360}deg)`;
        } else if (spell.spellPattern.castType == castType.AROUND_CASTER) {

            const newSpellAreaRadius = (distance <= spellRange) ? distance : spellRange;
            
            const newSpellArea =  (newSpellAreaRadius <= spellArea/2) ? spellArea : newSpellAreaRadius * 2;
            newX = tokenCenterX - newSpellArea /2
            newY = tokenCenterY - newSpellArea /2;
            spellHeight = newSpellArea;
            spellWidth = newSpellArea;

            spellCastTarget.style.height = `${newSpellArea}px`;
            spellCastTarget.style.width = `${newSpellArea}px`;
            spellCastTarget.style.transform = `translate(-50%, -50%) rotate(${(angle * 180 / Math.PI) % 360}deg)`;
        }
        
        if (spell.spellPattern == spellPatterns.BOX) {
            spellCastTarget.style.height = `${distance}px`;

            corners.push(
                {x: newX, y: newY},
                {x: newX + spellWidth, y: newY},
                {x: newX + spellWidth, y: newY + spellHeight},
                {x: newX, y: newY + spellWidth}
            )     
        } else if (spell.spellPattern.pattern == spellPatterns.CIRCULAR){
            corners.push(
                {x: newX, y: newY},
                {x: newX + spellWidth, y: newY},
                {x: newX + spellWidth, y: newY + spellHeight},
                {x: newX, y: newY + spellWidth}
            )   
        } 
        else if (spell.spellPattern.pattern == spellPatterns.CONE_DOWNWARD) {
            corners.push(
                {x: newX + spellWidth/2 , y: newY},
                {x: newX + spellWidth, y: newY + spellHeight},
                {x: newX, y: newY + spellWidth}
            )   
        } else if (spell.spellPattern.pattern == spellPatterns.CONE_UPWARD) {
            corners.push({
        
            })
        }

        // Now we need to check for overlap using the rotated bounds (for castType.FROM_CASTER)
        objectsPositions.forEach((targetRect, tokenKey) => {
            if (tokenKey !== tokenID) { // Exclude the current casting token
                if (isOverlap(corners, angle, targetRect)) {
                    if (!overlappedTokens[tokenKey] && tokenKey.includes('character')) {
                        overlappedTokens[tokenKey] = true;
                        highlightToken(tokenKey);
                    }
                } else {
                    removeHighlight(tokenKey);
                }
            }
        });
    }

    

    gameboard.addEventListener('mousemove', updatePosition);

    function stopCasting() {
        bgLayer.removeChild(spellCastTarget);
        bgLayer.removeChild(spellRangeCircle);
        removeDots(bgLayer, out);
        gameboard.removeEventListener('mousemove', updatePosition);
        gameboard.removeEventListener('click', stopCasting);
    }

    setTimeout(() => {
        gameboard.addEventListener('click', stopCasting);
    }, 250);

    function highlightToken(tokenId) {
        const tokenElement = document.getElementById(tokenId);
        if (tokenElement && !tokenElement.classList.contains('highlight')) {
            const highlightDiv = document.createElement('div');
            highlightDiv.classList.add('highlight-overlay');
            tokenElement.appendChild(highlightDiv);
        }
    }

    function removeHighlight(tokenId) {
        const tokenElement = document.getElementById(tokenId);
        if (tokenElement) {
            const highlightDiv = tokenElement.querySelector('.highlight-overlay');
            if (highlightDiv) {
                tokenElement.removeChild(highlightDiv);
                overlappedTokens[tokenId] = false;
            }
        }
    }
}


function checkSpellUsable(char, spell) {
    // Check if the character has enough spell slots
    return Object.keys(spell.spendManaEffects).every((mana) => {
        const val = char.spellSlots[mana];
        return val[1] > 0;
    });
}
