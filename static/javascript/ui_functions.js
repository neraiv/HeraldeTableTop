
/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// CARACTHER SHEET //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
async function displayCharaterSheet(charId) {
    const char = inGameChars[charId].char;

    const characterSheet = document.createElement("div");
    characterSheet.classList.add("character-sheet");
    characterSheet.classList.add("column")
    characterSheet.classList.add("vertical")
    characterSheet.style.gap = "10px";
    characterSheet.id = "character-sheet-" + charId;
    userInterface.appendChild(characterSheet);

    const topRow = addDraggableRow(characterSheet);
    topRow.classList.add('row');
    topRow.classList.add("vertical")
    topRow.style.justifyContent = "space-between";
    topRow.style.width = "100%"
    
    const charName = document.createElement("h2");
    charName.textContent = char.name;
    charName.style.textAlign = "center";
    charName.style.fontFamily = "'Cinzel', serif"; // DnD theme font
    charName.style.fontSize = "20px"; // Larger font size
    charName.style.margin = "0px"; // No margin
    charName.style.padding = "5px"; // Padding to keep text off the edges
    charName.style.borderBottom = "1px solid black";
    charName.style.marginLeft = "5px";
    topRow.appendChild(charName);

    const closeButton = createImageButton('28', {source: "url(static/images/menu-icons/close.png)", custom_padding: 4});
    closeButton.style.marginRight = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
        characterSheet.remove();
    };
    topRow.appendChild(closeButton);
    
    const infoContainer = document.createElement("div");
    infoContainer.style.display = "block";
    infoContainer.style.width = "100%";
    infoContainer.style.height = "100%";
    infoContainer.style.gap = "10px";
    infoContainer.style.backgroundColor = "red";
    infoContainer.style.overflow = "auto";
    characterSheet.appendChild(infoContainer);

    const charInfo = document.createElement("div");
    charInfo.classList.add("row");
    charInfo.style.justifyContent = "space-between";
    charInfo.style.padding = "10px";
    charInfo.style.gap = "5px";
    infoContainer.appendChild(charInfo);

    const charStats = document.createElement("div");
    charStats.classList.add("column");
    charStats.classList.add("vertical");
    charStats.classList.add("box-circular-border");
    charStats.style.padding = "10px";
    charStats.style.gap = "5px";
    charStats.style.width = "30%";
    charInfo.style.backgroundColor = "flex";
    charInfo.appendChild(charStats);

    const charImageAndClassContainer =  document.createElement("div");
    charImageAndClassContainer.classList.add("row");
    charImageAndClassContainer.classList.add("box-circular-border")
    charImageAndClassContainer.style.justifyContent = "space-between";  
    charImageAndClassContainer.style.alignItems = "center";
    charImageAndClassContainer.style.height = "100%";
    charImageAndClassContainer.style.width = "100%";
    charStats.appendChild(charImageAndClassContainer);

    const charImage = document.createElement("div");
    charImage.style.backgroundImage = `url(static/images/character/${inGameChars[charId].img})`;
    charImage.style.backgroundSize = "contain"; // Ensures the entire image fits without cropping
    charImage.style.backgroundRepeat = "no-repeat"; // Prevents tiling
    charImage.style.backgroundPosition = "center"; // Centers the image
    charImage.style.height = "100px";
    charImage.style.width = "100px";
    charImageAndClassContainer.appendChild(charImage);

    const charClass = document.createElement("div");  
    charClass.style.gridTemplateRows = "repeat(2,auto)"
    charClass.style.display = "grid";
    charClass.style.padding = "10px"
    charImageAndClassContainer.appendChild(charClass);

    if(char.classess){
        char.classess.forEach(class_ => {
            const classContainer = document.createElement("div")
            classContainer.style.backgroundImage = `url(static/images/class-icons/${class_}.png)`
            classContainer.style.backgroundSize = "cover"
            classContainer.style.height = "50px"
            classContainer.style.width = "50px"
            charClass.appendChild(classContainer)
        });
    }

    const charStatsContainer = document.createElement("div");
    charStatsContainer.classList.add("column");
    charStatsContainer.classList.add("vertical");
    charStatsContainer.style.gap = "5px";
    charStatsContainer.style.width = "100%";
    charStats.appendChild(charStatsContainer);

    const charStatsTitle = document.createElement("h3");
    charStatsTitle.textContent = "Stats";
    charStatsTitle.style.textAlign = "center";
    charStatsTitle.style.fontFamily = "'Cinzel', serif"; // DnD theme font
    charStatsTitle.style.fontSize = "16px"; // Larger font size
    charStatsTitle.style.margin = "0px"; // No margin
    charStatsTitle.style.padding = "5px"; // Padding to keep text off the edges
    charStatsTitle.style.borderBottom = "1px solid black";
    charStatsContainer.appendChild(charStatsTitle);

    const charStatsTable = document.createElement("table");
    charStatsTable.style.width = "100%";
    charStatsTable.style.borderCollapse = "collapse";
    charStatsTable.style.border = "1px solid black";
    charStatsTable.style.borderRadius = "8px";
    charStatsTable.style.overflow = "auto";
    charStatsContainer.appendChild(charStatsTable);

    const charStatsTableHead = document.createElement("thead");
    charStatsTable.appendChild(charStatsTableHead);
    
    const charStatsTableHeadRow = document.createElement("tr");
    charStatsTableHead.appendChild(charStatsTableHeadRow);

    const charStatsTableHeadName = document.createElement("th");
    charStatsTableHeadName.textContent = "Stat";
    charStatsTable.style.width = "100%";

    const charStatsTableHeadValue = document.createElement("th");
    charStatsTableHeadValue.textContent = "Value";
    
    charStatsTableHeadRow.appendChild(charStatsTableHeadName);
    charStatsTableHeadRow.appendChild(charStatsTableHeadValue);

    const charStatsTableBody = document.createElement("tbody");
    charStatsTable.appendChild(charStatsTableBody);
    
    const searchStasts = ["str", "dex", "con", "int", "wis", "cha"]
    searchStasts.forEach(stat => {
        const row = document.createElement("tr");
        const name = document.createElement("td");
        name.textContent = stat.toUpperCase();
        const statValue = document.createElement("td");
        statValue.textContent = char[stat];
        row.appendChild(name);
        row.appendChild(statValue);
        charStatsTableBody.appendChild(row);
    });


    const charSpells = document.createElement("div");
    charSpells.classList.add("column");

    function createSpellContainer(spellInfo){
        // Create elements
        const spellDiv = document.createElement('div');
        spellDiv.classList.add('spell');
        
        // Create the header
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('spell-header');

        const nameElement = document.createElement('div');
        nameElement.classList.add('spell-name');
        nameElement.textContent = spell.name;

        const classesElement = document.createElement('div');
        classesElement.classList.add('spell-classes');
        classesElement.textContent = `Available Classes: ${spell.availableClasses.join(', ')}`;
        
        headerDiv.appendChild(nameElement);
        headerDiv.appendChild(classesElement);

        const descriptionElement = document.createElement('div');
        descriptionElement.classList.add('spell-description');
        descriptionElement.textContent = `Description: ${spell.description}`;

        // Create the additional effects
        const effectsElement = document.createElement('div');
        effectsElement.classList.add('spell-effects');

        // effectsElement.innerHTML = `<strong>Additional Effects:</strong><br>${Object.keys(characterSettings.AVAILABLE_SPELL_LEVELS).map(level => {  
        //     return spell.additionalEffects.getManaEffects(level);
        // }).join('<br>')}`;

        // Append all parts to the spell container
        spellDiv.appendChild(headerDiv);
        spellDiv.appendChild(descriptionElement);
        spellDiv.appendChild(effectsElement)

        return spellDiv;
    }



}   

spellBookButton.onclick = () => {
    const spellBook = document.getElementById("ui-spellbook");
    if (spellBook.style.display === "none") {
        spellBook.style.display = "flex";
    } else {
        spellBook.style.display = "none";
    }
}

// Player's Character Sheet
playerCharSheetButton.onclick = () => {
    displayCharaterSheet(player.charId)
}

function userAskQuestion({type = "int", message = null}) {
    if (type === "int") {
        const question = prompt(message + " ", "Please enter a number:");
        return parseInt(question, 10);
    }
    if (type === "string") {
        return prompt(message + " ", "Please enter a string:");
    }
    if (type === "bool") {
        const question = prompt(message + " ", "Please enter true or false:");
        return question === "true";
    }
    if (type === "float"){
        const question = prompt(message + " ", "Please enter a number:");
        return parseFloat(question);
    }
}

// Game Board -----------------------------------------------------------------------
function getCharScene(char_id){
    return sessionInfo.charLocations.find(charLocation => charLocation.charId === char_id).currentScene
}

function setCharScene(char_id, scene){
    sessionInfo.charLocations.find(charLocation => charLocation.charId === char_id).currentScene = scene
}

function gameBoardPan(x = null, y = null, scale = null) {
    x = x ?? boardEvent.panX;
    y = y ?? boardEvent.panY;
    scale = scale ?? boardEvent.scale;
    
    gameboardContent.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

    // Update the pan values
    boardEvent.panX = x;
    boardEvent.panY = y;
    boardEvent.scale = scale;
}

// Background -----------------------------------------------------------------------
async function addBackground(width, height, x, y, img = null){
    const backgroundToken = document.createElement("div")
    backgroundToken.classList.add("background")
    backgroundToken.style.left = `${x}px`
    backgroundToken.style.top = `${y}px`
    backgroundToken.style.width = `${width}px`
    backgroundToken.style.height = `${height}px`
    backgroundToken.draggable = true

    if(img){
        // if image loading fails retry after 1 second
        backgroundToken.style.backgroundImage = `url(${img})` 
        backgroundToken.style.backgroundSize = "cover"
        backgroundToken.style.backgroundPosition = "center"
    }

    backgroundLayer.appendChild(backgroundToken)

    gameBoardPan(1000 - x,  1000 - y) 

    return backgroundToken
}

// Portal -----------------------------------------------------------------------
async function portalDisplayName(portalToken){
    const portalName = portalToken.firstChild
    portalName.style.display = "block"
}

async function portalHideName(portalToken){
    const portalName = portalToken.firstChild
    portalName.style.display = "none"
}

async function addPortal(portal, parent){
    const portalToken = document.createElement("div")
    portalToken.classList.add("portal")
    portalToken.classList.add("type-"+portal.type)
    portalToken.style.left = `${portal.x}px`
    portalToken.style.top = `${portal.y}px`
    portalToken.style.width = `${portal.width}px`
    portalToken.style.height = `${portal.height}px`
    portalToken.to = portal.to
    portalToken.type = portal.type
    parent.appendChild(portalToken)

    const portalName = document.createElement("div")
    portalName.classList.add("portal-name")
    if(portal.type == "layer"){ // FUTURE: Check for valid url
        portalName.textContent = "Layer " + portal.to
    }else if(portal.type == "scene"){
        portalName.textContent = portal.to
    }
    portalName.style.marginBottom = `${portal.height+5}px`
    portalToken.appendChild(portalName)

    if(portal.type == "layer"){ // FUTURE: Check for valid url
        portalToken.style.backgroundImage = `url("static/images/portal/blue.png")` 
    }else if(portal.type == "scene"){
        portalToken.style.backgroundImage = `url("static/images/portal/green.png")` 
    }

    portalToken.addEventListener("mouseenter", async function(){
        portalDisplayName(portalToken)
    })

    portalToken.addEventListener("mouseleave", async function(){
        portalHideName(portalToken)
    })

    portalToken.addEventListener("click", async function(){
        if(portalToken.type == "layer"){
            if(sceneInfo.layers[portalToken.to]){
                getCharScene(player.charId).layer = portalToken.to
                initLayer()
            }else{
                alert("Layer does not exist")
            }
        }else if(portalToken.type == "scene"){
            if(scenes[portalToken.to]){
                sceneInfo = scenes[portalToken.to]
                getCharScene(player.charId).name = portalToken.to
                getCharScene(player.charId).layer = 1
                initScene()
            }else{
                alert("Scene does not exist")
            }
        }
    })
    


    return portalToken
}

// Character -----------------------------------------------------------------------
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

async function charDisplayInventory({id = null, inventory = null}, x, y) {
    const char = inGameChars[id].char;
    if (char) {
        isCharInventory = false;

        if(inventory === null){
            inventory = char.inventory;
            isCharInventory = true
        }
        
        // Create the inventory sheet container
        const inventorySheet = document.createElement('div');
        inventorySheet.classList.add('inventory-sheet');
        inventorySheet.style.position = 'fixed'; // Ensure the inventory sheet is positioned relative to the viewport
        inventorySheet.style.left = `${x}px`;
        inventorySheet.style.top = `${y}px`;
        userInterface.appendChild(inventorySheet);
        
        const topRow = addDraggableRow(inventorySheet)
        topRow.classList.add('row');
        topRow.classList.add('centered');
        
        const title = document.createElement('h2');
        if (isCharInventory) {
            title.textContent = char.name + "'s Inventory";
        } else {
            title.textContent = "Inventory";
        }
        title.style.margin = '0';
        title.style.fontSize = '1.5em';
        title.style.color = '#333';
        topRow.appendChild(title);

        const closeButton = createImageButton('26', {source: "url(static/images/menu-icons/close.png)", custom_padding: 2});
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
            inventorySheet.remove();
        };
        topRow.appendChild(closeButton);

        // Create the inventory table container
        const inventoryTable = document.createElement('div');
        inventoryTable.classList.add('column');
        inventoryTable.classList.add('horizontal');
        inventoryTable.style.height = '90%';
        inventoryTable.style.gap = '10px';
        inventoryTable.style.marginTop = '10px';

        let selectedItem = null;

        const buttonDict = {
            'Use Item': true,
            'Send To': true,
            'Description': true,
        };

        const dropdownMenu = createDropdownMenu(buttonDict);
        dropdownMenu.style.overflow = "unset";
        inventorySheet.appendChild(dropdownMenu);

        // Create the dropdown menu for the 'Send To' button
        const sendToButtons = {}
        const sendToButtonCharIds = []
        Object.keys(inGameChars).forEach(charId => {
            if (isCharInventory && charId === id) return;
            sendToButtons[`${inGameChars[charId].char.name} (${charId})`] = true;
            sendToButtonCharIds.push(charId);
        });
        const sendToDropDownMenu = createDropdownMenu(sendToButtons);
        sendToDropDownMenu.style.left = '105%';
        sendToDropDownMenu.style.top = '5%';
        dropdownMenu.appendChild(sendToDropDownMenu);
        
        sendToDropDownMenu.lastChild.onclick = function(){
            sendToDropDownMenu.style.display = 'none';
        }

        for(let i = 0; i < Object.keys(inGameChars).length-1; i++){
            sendToDropDownMenu.who = sendToButtonCharIds[i]
            sendToDropDownMenu.children[i].onclick = function(){
                console.log('Send To action clicked', selectedItem, sendToDropDownMenu.children[i].textContent);
                let inputValue = userAskQuestion({type: "int", "Message": "How many?"});
                if (inputValue) {
                    if (selectedItem.quantity < inputValue) {
                        console.log('Not enough items to send')
                        inputValue = selectedItem.quantity;
                    }
                    inGameChars[sendToDropDownMenu.who].char.inventory.addItem(selectedItem, value);
                    inventory.removeItem(selectedItem.name, inputValue);
                    console.log('Sent', inputValue, selectedItem.name, 'to', sendToDropDownMenu.children[i].textContent);
                }
            }
        };

        dropdownMenu.children[0].onclick = function(){
            console.log('Use action clicked', selectedItem);
        }
        dropdownMenu.children[1].onclick = function(){
            console.log('Send To action clicked',  selectedItem);
            sendToDropDownMenu.style.display = 'flex';
        }
        dropdownMenu.children[2].onclick = function(event){
            console.log('Description clicked',  selectedItem);
            //displayItemDescription(selectedItem, event.clientX, event.clientY);
        }

        // Add items to the inventory table
        inventory.items.forEach(item => {
            const itemButton = document.createElement('button');
            itemButton.textContent = `${item.name} x${inventory.getQuantity(item.name)}`;
            itemButton.classList.add('inventory-button'); 

            itemButton.onclick = function (event) {
                selectedItem = item;
                dropdownMenu.style.display = 'block';
                // Calculate position for dropdown menu
                const rect = inventorySheet.getBoundingClientRect();
                dropdownMenu.style.left = `${event.clientX - rect.left}px`;
                dropdownMenu.style.top = `${event.clientY - rect.top}px`;
            };
            
            inventoryTable.appendChild(itemButton);
        });

        const currencyTab = document.createElement('div');
        currencyTab.classList.add('currency-tab');
        
        function createCurrency(imgSrc, value){
            const currency = document.createElement('div');
            currency.classList.add('box-circular-border');
            currency.classList.add('currency');
            currency.style.display = 'flex';
            currency.style.alignItems = 'center'; // Align image and text vertically
            currency.style.gap = '5px'; // Space between image and text
            const img = document.createElement('div');
            img.style.backgroundImage = `url(${imgSrc})`;
            img.style.backgroundSize = 'cover';
            img.style.paddingLeft = '3px'
            img.style.width = '24px'; // Set image size
            img.style.height = '24px';
            const text = document.createElement('span');
            text.textContent = `: ${value}`;
            text.style.fontSize = '1.1em';
            text.style.margin = '5px'
            currency.appendChild(img);
            currency.appendChild(text);
            return currency
        }
        
        // Append all currency elements to the currency tab
        currencyTab.appendChild(createCurrency("static/images/menu-icons/gold.png", inventory.currency.gold));
        currencyTab.appendChild(createCurrency("static/images/menu-icons/silver.png", inventory.currency.silver));
        currencyTab.appendChild(createCurrency("static/images/menu-icons/bronze.png", inventory.currency.bronze));

        // Assemble the components
        topRow.appendChild(title);
        addSpacer(topRow);
        topRow.appendChild(closeButton);

        inventorySheet.appendChild(topRow);
        inventorySheet.appendChild(inventoryTable);
        inventorySheet.appendChild(currencyTab);
    }
}

function charCalculateHoverButtonLocation(buttonSize, radius, angle){
    const finalX = (radius * 2) * Math.cos((angle * Math.PI) / 180) + radius - buttonSize / 2;
    const finalY = -(radius * 2) * Math.sin((angle * Math.PI) / 180) + radius - buttonSize / 2;
    return {finalX, finalY}
}


async function addCharacter(char, width, height, x, y, img = null){
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
        let {finalX, finalY} = charCalculateHoverButtonLocation(buttonSize, radius, angle)
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
        charDisplayInventory({id :char.id}, event.clientX, event.clientY)
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

    return charToken
}

async function addPouch(inventory, x, y){
    const pouch = document.createElement("div")
    pouch.classList.add("pouch")
    pouch.style.left = `${x}px`
    pouch.style.top = `${y}px`
    pouch.style.backgroundImage = "url(static/images/general/pouch.png)"

    pouch.inventory = inventory

    pouch.addEventListener("click", function(){
        charDisplayInventory({id : player.charId, inventory : inventory}, x, y)
    })

    characterLayer.appendChild(pouch)
}

function dropInventory(charId) {
    if(inGameChars[charId]){
        const charInfo = inGameChars[charId]
        const charLoaction = sessionInfo.charLocations.find(charLocation => charLocation.charId === charId)
        addPouch(new Inventory(charInfo.char.inventory), charLoaction.x + charInfo.width / 2 - 12.5, charLoaction.y + charInfo.height / 2 - 12.5) // -12.5 is half of the pouch size
        charInfo.char.inventory.clear()
    }else{
        alert("Character not found")
    }
}

function charOnDie(charToken){
    inGameChars[charToken.id].char.hp = 0
    charToken.style.filter = "grayscale(100%)" // FUTURE: Add animation
}


async function initLayer(){
    if (sceneInfo.discovered == false){
        const newSceneData = await dbGetScene(getCharScene(player.charId).name)
        if(newSceneData){
            sceneInfo = newSceneData
            scenes[getCharScene(player.charId).name] = sceneInfo
            sceneInfo.discovered = true
        }else{
            alert("Scene not found")
        }
    }

    if(!sceneInfo.layers) return alert("No layers found in the scene")

    // future get image  width and heigh with scale factor
    backgroundLayer.innerHTML = "" // FUTURE we may keep old layer in case of fast returning
    characterLayer.innerHTML = "" // FUTURE we may keep old layer in case of fast returning
    audioAmbiance.pause()

    const layer = sceneInfo.layers[getCharScene(player.charId).layer]

    if(!layer) return alert("Layer not found in the scene")

    topBarLayerName.textContent = "Layer " + getCharScene(player.charId).layer

    const background = await addBackground(layer.width, layer.height, layer.x, layer.y, "static/images/background/"+layer.img)
    
    if(layer.portals){
        for(let portal of Object.values(layer.portals)){
            addPortal(portal, background)
        }
    }

    async function addCharFromDb(charLocation){

        if (!inGameChars[charLocation.charId]){
            const charInfo =  await dbGetChar(charLocation.charId)

            if(charInfo){
                inGameChars[charInfo.char.id] = {
                    char : new Character(charInfo.char), 
                    width: charInfo.width, 
                    height: charInfo.height,
                    img: charInfo.img
                }
            }else{
                console.log("Character not found", charLocation.charId, ". Retrying in 1 second")
                return setTimeout(addCharFromDb, 1000, charLocation)
            }
        }
        
        const charInfo = inGameChars[charLocation.charId]

        if(charInfo.char.id === player.charId){
            inGameChars[charInfo.char.id].char.inventory.addItem(new Item("Potion", itemTypes.CONSUMABLE), 4)
            inGameChars[charInfo.char.id].char.inventory.addItem(new Item("Sword", itemTypes.WEAPON), 1)
        }

        addCharacter(charInfo.char, charInfo.width, charInfo.height, charLocation.x, charLocation.y, "static/images/character/"+charInfo.img)

    }

    if(sessionInfo.charLocations){
        for(const char of Object.values(sessionInfo.charLocations)){
            addCharFromDb(char)
        }
    }

    if (layer.ambiance) {
        audioAmbiance.src = `static/images/background/${layer.ambiance}`;
        
        // Function to play ambiance audio
        const playAmbiance = () => {
            audioAmbiance.play().catch(error => {
                console.error("Failed to play ambiance audio:", error, "Source:", audioAmbiance.src);
            });
        };

            // Add an event listener to play the audio on the first user interaction
            const userInteractionHandler = () => {
                playAmbiance();
                document.removeEventListener('click', userInteractionHandler);
                document.removeEventListener('keydown', userInteractionHandler);
            };
            document.addEventListener('click', userInteractionHandler);
            document.addEventListener('keydown', userInteractionHandler);
        
    }
}

async function initScene(){
    const gridSize = sceneInfo.grid_size
    const width = sceneInfo.width
    const height = sceneInfo.height

    gridBackground.style.backgroundSize = `${gridSize}px ${gridSize}px`;

    gameboardContent.style.width = `${width}px`
    gameboardContent.style.height = `${height}px`;
    gameboardContent.style.top = `${-height/2}px`
    gameboardContent.style.left = `${-width/2}px`;

    gameboardContent.style.transform = `translate(0px, 0px) scale(1)`;

    topBarSceneName.textContent = getCharScene(player.charId).name
    initLayer()
}

async function initGameBoard() {
    const newSessionData = await dbGetSession()

    let isOk = false    

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
            // Which element is being dragged
            const element = event.target;
            if(element.classList.contains("background")){

            }
        })
    }
    
    if(newSessionData){
        if(newSessionData.session){
            sessionInfo = newSessionData.session
        
            console.log(sessionInfo)
            isOk = true;
        }

        if (newSessionData.scenes){
            scenes = newSessionData.scenes
            
            let playerCharScene = getCharScene(player.charId)
            if(!playerCharScene){
                alert("Character not found in the session.")
            }else{
                sceneInfo = scenes[playerCharScene.name]
                console.log(newSessionData.scenes)
                initScene()
                initGameBoardFunctions()
            }
            
        }else if(isOk) isOk = false;
    }

    if(!isOk) return setTimeout(initGameBoard(), 500);
}


// ACTIVE ----------------------------------------------------------------------------
function addMessageToChat(chatMessage, senderName, timestamp) {
    const testMessage = document.createElement("div");
    testMessage.classList.add('chat-message');
    
    // Add classes based on whether the message is sent by the user
    if (senderName === player.userName) {
        testMessage.classList.add('self');
        senderName = "You";
    } else {
        testMessage.classList.add('other');
    }

    // Create the header (name and time)
    const header = document.createElement("div");
    header.classList.add('header');

    const nameSpan = document.createElement("span");
    nameSpan.classList.add('name');
    nameSpan.textContent = senderName;

    const timeSpan = document.createElement("span");
    timeSpan.classList.add('time');
    const date = new Date(timestamp);
    timeSpan.textContent = date.toUTCString().split(' ')[4].slice(0, -3); // Extract HH:MM from UTC time

    header.appendChild(nameSpan);
    header.appendChild(timeSpan);

    // Add the header to the message
    testMessage.appendChild(header);

    // Add the message content
    const content = document.createElement("div");
    content.classList.add('content');
    content.textContent = chatMessage;

    testMessage.appendChild(content);

    // Append the message to the chat container
    chatMessages.appendChild(testMessage);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;

    
}

sendButton.addEventListener("click", async function() {
    const chatMessage = chatWriteInput.value;
    const state = await sendMessage(chatMessage)
    if(state.success === null){
        alert("Failed to send message")
    }else{
        chatWriteInput.value = '';
    }
})

chatWriteArea.addEventListener("keydown", async function(event) {
    if (event.key === 'Enter') {
        const chatMessage = chatWriteInput.value;
        chatWriteInput.value = '';
        const state = await sendMessage(chatMessage)
        if(state.success === null){
            alert("Failed to send message")
        }else{
            chatWriteInput.value = '';
        }
    }
})

storageButton.onclick = () => {
    if (storage.style.left !== "50px") {
        storage.style.left = "50px";
    } else {
        storage.style.left = "-330px";
    }
};

chatButton.onclick = async () => {
    if(chat.style.right !== "0px") {
        chat.style.right = "0px";
    }else{
        chat.style.right = "-330px";
    }
    
}

function startSyncTimer() {
    
    let cnt = 0;
    async function update() {
        cnt++;
        if(isUpdating === false){
            serverInfo = await getGameFile("server_info.json", false)
            await getGameFile("game_elements.json")
        }
    }
    setInterval(update, 1000); // Update every second
}

async function  initDatabase(initStates){
    try {
        // Fetch server info
        const newServerInfo = await getGameFile("server_info.json", false);

        // Ensure server info is valid
        if (!newServerInfo || newServerInfo.server_status !== "online") {
            return false; 
        }

        if(initStates.isChatOk == false){
            // Ensure chat_idx exists
            if (newServerInfo.chat_idx) {
                serverInfo = newServerInfo; // Update global serverInfo variable

                // Fetch chat data based on the latest index
                const chatData = await getChat(serverInfo.chat_idx, 10);

                // Process and add chat messages
                for (const data of chatData) {
                    addMessageToChat(data.message, data.user, data.timestamp);
                }

                // Update chat last index
                chat.last_idx = serverInfo.chat_idx;

                initStates.isChatOk = true;
            }else {
                alert("Chat index is missing in the server info.");
            }
        } 
        if(initStates.isRulesOk == false){
            // Fetch game elements
            const rules = await getGameFile("rules.json");

            // Ensure game elements are valid
            if (rules) {
                serverRules = rules; // Update global serverRules variable
                initStates.isRulesOk = true;
            } else {
                alert("Failed to fetch game elements.");
            }
        }
    } catch (error) {
        // Handle unexpected errors
        return false
    }

    // Wait for all tasks to complete before returning
    if (Object.values(initStates).every(state => state === true)) {
        console.log("Chat synchronization started successfully.");
        return true;
    } else {
        console.warn("Failed to start chat synchronization.");
        return false;
    }
}

async function loadSpells(){
    const spellData = await getGameFile("spells.json")
    if(spellData){
        // check spell data correctness
        spells = spellData
    }else{
        return loadSpells()
    }
}   

function startSyncTimer() {
    
    let cnt = 0;
    async function update() {
        cnt++;
        if(isUpdating === false){
            const newServerInfo = await getGameFile("server_info.json", false)
            if(newServerInfo){
                if(newServerInfo.chat_idx !== chat.last_idx){
                    const diff = parseInt(newServerInfo.chat_idx, 10) - parseInt(chat.last_idx, 10) - 1 ;
                    const chatData = await getChat(serverInfo.chat_idx, diff)
                    for (const data of chatData) {
                        addMessageToChat(data.message, data.user, data.timestamp)
                    }
                    chat.last_idx = newServerInfo.chat_idx;
                }
            }

            isUpdating = false
        }
    }
    setInterval(update, 1000); // Update every second
}

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    player.userKey = urlParams.get("key")
    player.userName = urlParams.get("userName")
    player.charId = urlParams.get("charId")

    let isUpdating = false;
    let initErrorCounter = 0

    let initStates = {
        isChatOk: false,
        isRulesOk: false,
    }
    const intervalId = setInterval(async function () {
        if(isUpdating == false){
            isUpdating = true;
            if(initErrorCounter == 10){
                alert("Server is offline or server info could not be fetched. Retrying... In 5 seconds");
                initErrorCounter++;
            }else if(initErrorCounter > 20){
                initErrorCounter = 0;
            }
            else{

                    const initResponse = await initDatabase(initStates) 
                    if(initResponse == false) initErrorCounter += 1
                    else{
                        initGameBoard()
                        loadSpells()
                        startSyncTimer();
                        clearInterval(intervalId);
                    }
            
            }
            isUpdating = false;
        }
    }, 500)
})