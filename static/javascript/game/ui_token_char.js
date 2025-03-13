function charDisplayHoverButtons({token = null, char_id = null}) {
    let charToken = token;
    if (char_id) {
        charToken = document.getElementById(char_id);
    }
    if (charToken) {
        const hoverButtons = charToken.getElementsByClassName("hover-button");
        for (const button of hoverButtons) {
            button.style.display = 'flex'; // Hides the button after the transition
            button.style.transitionDelay = ''; 
            button.style.left = `${button.dataset.finalX}px`;
            button.style.top = `${button.dataset.finalY}px`;
        }
    }
}

function charHideHoverButtons({token = null, char_id = null}) {
    let charToken = token;
    if (char_id) {
        charToken = document.getElementById(char_id);
    }
    if (charToken) {
        const hoverButtons = charToken.getElementsByClassName("hover-button");
        for (const button of hoverButtons) {
            button.style.transitionDelay = '0.5s'; 
            const width = parseInt(charToken.style.width, 10);
            const height = parseInt(charToken.style.height, 10);
            const resetX = width / 2 - button.offsetWidth / 2;
            const resetY = height / 2 - button.offsetHeight / 2;
            button.style.left = `${resetX}px`;
            button.style.top = `${resetY}px`;

            // FUTURE: Hide buttons after transition
            // button.addEventListener('transitionend', () => {
            //     if(button.style.left === `${resetX}px` && button.style.top === `${resetY}px`){
            //         button.style.display = 'none'; // Hides the button after the transition
            //     }   
            // }, {once: true});
        }
    }
}

async function addCharacter(char, width, height, x, y, img = null){

    if(char.id === player.charId){ // TEST FUNC
        inGameChars[char.id].char.inventory.addItem(new Item("Potion", itemTypes.CONSUMABLE), 4)
        inGameChars[char.id].char.inventory.addItem(new Item("Sword", itemTypes.WEAPON), 1)
    }

    const charToken = document.createElement("div")
    charToken.classList.add("character")
    charToken.id = char.id
    charToken.style.left = `${x}px`
    charToken.style.top = `${y}px`
    charToken.style.width = `${width}px`
    charToken.style.height = `${height}px`
    charToken.draggable = true
    characterLayer.appendChild(charToken)

    const playerName = document.createElement("div")
    playerName.classList.add("player-name")
    playerName.style.marginTop = `${height+5}px`
    charToken.appendChild(playerName)
    

    if(char.controlledBy){
        playerName.textContent = char.name
    }

    if(img){
        charToken.style.backgroundImage = `url(${img})`
        charToken.style.backgroundSize = "cover"
        charToken.style.backgroundPosition = "center"
        charToken.style.backgroundColor = "transparent"
    }

    const buttonSize = 40
    const radius = width / 2
    let angle = 0

    function initButton(button){
        button.classList.add("hover-button")
        let {finalX, finalY} = calc_hover_button_final_location(buttonSize, radius, angle)
        button.dataset.finalX = finalX;
        button.dataset.finalY = finalY;
    }

    // Inventory button -----------------------------------------------------------------------
    angle = 45
    const charTokenInventoryButton = createImageButton(buttonSize, {source: "url(static/images/menu-icons/inventory.png)"})
    charTokenInventoryButton.classList.add("inventory-button")
    charToken.appendChild(charTokenInventoryButton)
    initButton(charTokenInventoryButton)
    charTokenInventoryButton.onclick = function(event){
        displayInventory(char.name, char.id.inventory, event.clientX, event.clientY)
    }

    // Spellbook button -----------------------------------------------------------------------
    angle = 90
    const characterSpellbookButton = createImageButton(buttonSize, {source: "url(static/images/menu-icons/spellbook.png)"})
    characterSpellbookButton.classList.add("spellbook-button")
    charToken.appendChild(characterSpellbookButton)
    initButton(characterSpellbookButton)

    // Weapon button -----------------------------------------------------------------------
    angle = 135
    const characterWeaponButton = createImageButton(buttonSize, {source: "url(static/images/menu-icons/sword.png)"})
    characterWeaponButton.classList.add("weapon-button")
    charToken.appendChild(characterWeaponButton)
    initButton(characterWeaponButton)

    // Add event listeners
    if( serverRules.visible_inventories || char.controlledBy === player.userName){ // FUTURE: Check from rules "visible_inventories"
        charToken.addEventListener('mouseenter', () => {
            charDisplayHoverButtons({token: charToken})
        });
    
        charToken.addEventListener('mouseleave', () => {
            charHideHoverButtons({token: charToken})
        });
    }

    charToken.addEventListener('dragstart', (event) => {
        const hoverButtons = charToken.getElementsByClassName("hover-button");
        for (const button of hoverButtons) {
            button.style.display = 'none';
        }
    });

    charToken.addEventListener('dragend', (event) => {
        const hoverButtons = charToken.getElementsByClassName("hover-button");
        for (const button of hoverButtons) {
            button.style.display = 'flex';
        }
    });

    gameSceneData.chars.push(charToken);
    return charToken
}

function charDropInventory(charId) {
    if(inGameChars[charId]){
        const charInfo = inGameChars[charId]
        const charLoaction = sessionInfo.charLocations.find(charLocation => charLocation.charId === charId)
        addObject(new Inventory(charInfo.char.inventory), charLoaction.x + charInfo.width / 2 - 12.5, charLoaction.y + charInfo.height / 2 - 12.5) // -12.5 is half of the pouch size
        charInfo.char.inventory.clear()
    }else{
        alert("Character not found")
    }
}