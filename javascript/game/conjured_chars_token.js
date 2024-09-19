
let listConjurableChars = {
    'mountainless_dwarf'  : { 
        char: new Character('mountainless_dwarf', '',{name: 'Mountenless Dwarf Uluğ Bey',str: 20, dex: 20, con: 20, int: 20, wis: 20, cha: 100, availableSpells: {1 :  ['Heralde']}}),
        max_conjurable : 1,
        duration : [durationTypes.AFTER_LONG_REST]
        },
    'Sir Gawain'        : new Character('Sir Gawain'),
    'Gildor'            : new Character('Gildor'),
    'Gimli'             : new Character('Gimli'),
    'Thorin'            : new Character('Thorin'),
    'Faramir'           : new Character('Faramir'),
}

function createConjuredCharacterToken(conjurableCharId, x, y) {
    const conjurableData = listConjurableChars[conjurableCharId];
    const character = conjurableData.char.clone();
    let currentInGameConjured  = 0;
    inGameCharacters.find(char => {if(char.id.includes(conjurableCharId)) currentInGameConjured++;})
    if(conjurableData.max_conjurable <= currentInGameConjured) return;
    else character.id += `_${currentInGameConjured + 1}`;

    const token = document.createElement('div');
    token.style.position = 'absolute';
    token.style.width = `${userIntarfaceSettings.GRID_SIZE}px`;
    token.style.height = `${userIntarfaceSettings.GRID_SIZE}px`;
    token.style.left = `${x}px`;
    token.style.top = `${y}px`; 
    token.draggable = true;
    token.className = 'character-token';
    token.id = `token-character-${character.id}`;

    const img  =  document.createElement('img');
    const imgPrefix = 'char.png'; // Future database

    img.src = `${tokenPaths.FOLDER_CHARTOKEN}/${conjurableCharId}/${imgPrefix}`;
    img.id = character.id;
    img.draggable = false;
    inGameCharacters.push(character);

    const arr = listDestructinator[durationTypes.AFTER_LONG_REST];
    arr.push({type: objectTypes.CONJURED, id: character.id})

    const layer = document.getElementById('character-layer');

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
        character.inventory.addItem(listWeapons["Hammer Of Mouse"], 1);
        character.inventory.addItem(listWeapons.Sword, 1);
        character.inventory.addItem(listConsumables["Healing Potion"], 4);

        displayInventory(character.inventory, event.clientX, event.clientY);
    }

    const characterSpellbookButton = createButton(userIntarfaceSettings.FOLDER_MENUICONS + "/" + userIntarfaceSettings.ICON_SPELLBOOK, 90);
    characterSpellbookButton.onclick = function(event) {
        displayAvaliableSpells(character, event.clientX, event.clientY);
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

    setTimeout(() => {
        setImageSize(img, userIntarfaceSettings.GRID_SIZE, userIntarfaceSettings.GRID_SIZE);
    }, 50);

    // Store original positions
    objectsPositions.set(token.id, [tokenTypes.CHARACTER, new DOMRect(x, y, userIntarfaceSettings.GRID_SIZE, userIntarfaceSettings.GRID_SIZE)]);

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