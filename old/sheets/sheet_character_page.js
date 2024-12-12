function addCharacterSheet(parent, id) {
    // Future
    const charId = id.replace('-character-sheet', '')

    if(inGameChars.get(charId)){
        console.log('Character already exists!');
        return;
    }

    const char = new Character(charId);
    inGameChars.set('token-character-'+char.id, char);

    const characterSheet = document.createElement('div');
    characterSheet.id = id;
    characterSheet.className = 'character-sheet';

    const newCharButton = document.createElement('button');
    newCharButton.textContent = 'New';

    newCharButton.onclick = function(event){
        event.preventDefault();
        selectedCharacterSheetId = characterSheet.id;
        toggleDisplay_SheetWithId("character-create-sheet", true);
    }

    const characterInventoryButton = document.createElement('button');
    characterInventoryButton.textContent = 'Inventory';

    characterInventoryButton.onclick = function(event){
        event.preventDefault();
        displayInventory(char.inventory, event.clientX, event.clientY);
    }

    const exitButton = document.createElement('button');
    exitButton.textContent = 'Exit';

    exitButton.onclick = function(event){
        event.preventDefault();
        selectedCharacterSheetId = characterSheet.id;
        toggleDisplay_SheetWithId(characterSheet.id, false);
    }

    characterSheet.appendChild(newCharButton);
    characterSheet.appendChild(characterInventoryButton);
    characterSheet.appendChild(exitButton);

    parent.appendChild(characterSheet);
}


function displayInventory(inventory, x, y) {
    let selectedItem;

    // Create the inventory sheet container
    const inventorySheet = document.createElement('div');
    inventorySheet.classList.add('inventory-sheet');
    inventorySheet.style.position = 'fixed'; // Ensure the inventory sheet is positioned relative to the viewport
    inventorySheet.style.left = `${x}px`;
    inventorySheet.style.top = `${y}px`;

    addDraggableRow(inventorySheet);
    // Create the top row with the title and close button
    const topRow = document.createElement('div');
    topRow.classList.add('row');
    topRow.classList.add('centered');
    topRow.style.width = '95%';

    const title = document.createElement('h2');
    title.textContent = 'Baudrates';
    title.style.margin = '0';
    title.style.fontSize = '1.5em';
    title.style.color = '#333';

    const closeButton = createImageButton('26', {source: uiSettings.folderMenuIcons + '/' + uiSettings.icon_closeBar});
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
        inventorySheet.remove();
    };

    // Create the inventory table container
    const inventoryTable = document.createElement('div');
    inventoryTable.classList.add('column');
    inventoryTable.classList.add('horizontal');
    inventoryTable.style.height = '90%';
    inventoryTable.style.gap = '10px';
    inventoryTable.style.marginTop = '10px';

    const buttonDict = {
        'Use Item': false,
        'Move To': true,
        'Description': true,
    };

    const dropdownMenuItems = createDropdownMenu(inventorySheet, buttonDict);

    dropdownMenuItems.querySelector(0).onclick = function(){
        console.log('Use action clicked');
        dropdownMenuItems[0].style.display = 'none';
    }
    dropdownMenuItems.querySelector(1).onclick = function(){
        console.log('Move To action clicked');
    }
    dropdownMenuItems.querySelector(2).onclick = function(event){
        displayItemDescription(selectedItem, event.clientX, event.clientY);
    }

    // Add items to the inventory table
    inventory.items.forEach(item => {
        const itemButton = document.createElement('button');
        itemButton.textContent = `${item.name} x${inventory.getQuantity(item.name)}`;
        itemButton.classList.add('inventory-button'); 

        itemButton.onclick = function (event) {
            selectedItem = item;
            dropdownMenuItems[0].style.display = 'block';
            if(item.itemType === itemTypes.CONSUMABLE){
                dropdownMenuItems[1][0].style.display = 'block';
            }else{
                dropdownMenuItems[1][0].style.display = 'none';
            }
            // Calculate position for dropdown menu
            const rect = inventorySheet.getBoundingClientRect();
            dropdownMenuItems[0].style.left = `${event.clientX - rect.left}px`;
            dropdownMenuItems[0].style.top = `${event.clientY - rect.top}px`;
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
        const img = document.createElement('img');
        img.src = imgSrc;
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
    currencyTab.appendChild(createCurrency(uiSettings.folderMenuIcons + '/' + uiSettings.icon_gold, inventory.currency.gold));
    currencyTab.appendChild(createCurrency(uiSettings.folderMenuIcons + '/' + uiSettings.icon_silver, inventory.currency.silver));
    currencyTab.appendChild(createCurrency(uiSettings.folderMenuIcons + '/' + uiSettings.icon_bronze, inventory.currency.bronze));

    // Assemble the components
    topRow.appendChild(title);
    addSpacer(topRow);
    topRow.appendChild(closeButton);
    inventorySheet.appendChild(topRow);
    inventorySheet.appendChild(inventoryTable);
    inventorySheet.appendChild(currencyTab);
    document.body.appendChild(inventorySheet);
}

function displayItemDescription(inventroyItem, x, y) {
    // Find the item in the list of weapons
    let item;
    if(inventroyItem.itemType === itemTypes.WEAPON){
        item = listWeapons[inventroyItem.name];
    }else if(inventroyItem.itemType === itemTypes.CONSUMABLE){
        item = listConsumables[inventroyItem.name];
    }

    const id = 'description-container-' + inventroyItem.name;
    const element = document.getElementById(id);
    if(element){
        element.remove();
    }

    if (!item) {
        console.log("No item found for description");
        return;
    }

    // Create a container for the item description
    const descriptionContainer = document.createElement("div");
    descriptionContainer.id = id;
    descriptionContainer.style.position = "absolute";
    descriptionContainer.style.left = `${x}px`;
    descriptionContainer.style.top = `${y}px`;
    descriptionContainer.style.padding = "15px";
    descriptionContainer.style.border = "2px solid #603B1D"; // Dark brown border for D&D style
    descriptionContainer.style.backgroundColor = "#F5CBA7"; // Skin tone background color
    descriptionContainer.style.borderRadius = "8px";
    descriptionContainer.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.4)"; // Subtle shadow for depth
    descriptionContainer.style.fontFamily = "Georgia, serif"; // Fantasy-themed font
    descriptionContainer.style.color = "#2C3E50"; // Dark text color for readability
    descriptionContainer.style.maxWidth = "250px"; // Limit width to fit typical D&D-style popup
    descriptionContainer.style.zIndex = 1000; // Ensure it appears on top

    // Create the item title
    const itemTitle = document.createElement("h3");
    itemTitle.textContent = item.name;
    itemTitle.style.marginBottom = "10px";
    itemTitle.style.fontWeight = "bold";
    descriptionContainer.appendChild(itemTitle);

    // Create the item description
    const itemDescription = document.createElement("p");
    itemDescription.textContent = item.lore;
    itemDescription.style.marginBottom = "10px";
    descriptionContainer.appendChild(itemDescription);

    // Create the item properties list
    if(item.properties && item.properties.length > 0){
        const propertiesList = document.createElement("ul");
        const title = document.createElement("h4");
        title.textContent = "Propertie(s)";
        title.style.marginBottom = "10px";
        title.style.fontWeight = "bold";
        propertiesList.appendChild(title);
        item.properties.forEach(property => {
            const listItem = document.createElement("li");
            listItem.textContent = Object.keys(weaponProperties).find(key => weaponProperties[key] === property);
            propertiesList.appendChild(listItem);
        });       
        descriptionContainer.appendChild(propertiesList);
    }

    if(item.additionalEffects && item.additionalEffects.length > 0){
        const effectsList = document.createElement("ul");
        const title = document.createElement("h4");
        title.textContent = "Additonal Effect(s)";
        title.style.marginBottom = "10px";
        title.style.fontWeight = "bold";
        effectsList.appendChild(title);
        item.additionalEffects.forEach(property => {
            const listItem = document.createElement("li");
            listItem.textContent = "When " + Object.keys(characterActions).find(key => characterActions[key] === property.characterAction) + " -> " + property.description + " by " + property.value;
            effectsList.appendChild(listItem);
        }); 
        descriptionContainer.appendChild(effectsList);
    }

    if(item.spells && item.spells.length > 0){  
        const effectsList = document.createElement("ul");
        const title = document.createElement("h4");
        title.textContent = "Spell(s)";
        title.style.marginBottom = "10px";
        title.style.fontWeight = "bold";
        effectsList.appendChild(title);
        const listItem = document.createElement("li");
        item.spells.forEach(property => {         
            addSpellInfo(listItem, property);    
        }); 
        effectsList.appendChild(listItem);
        descriptionContainer.appendChild(effectsList);
    }

    // Append the container to the body or game area
    document.body.appendChild(descriptionContainer);

    // Adjust position if the container exceeds the available screen space
    const containerHeight = descriptionContainer.offsetHeight;
    const windowHeight = window.innerHeight;
    if (y + containerHeight > windowHeight) {
        // Adjust the container's position to stay within the screen
        descriptionContainer.style.top = `${windowHeight - containerHeight - 10}px`; // 10px padding from the bottom
    }

    // Optional: Remove the description when clicked
    descriptionContainer.addEventListener("click", () => {
        document.body.removeChild(descriptionContainer);
    });
}


function addSpellInfo(parent, spell, char = null) {
    const listItem = document.createElement("div");

    // Helper function to create labeled elements with bold-red label
    function createLabeledElement(labelText, contentText,labelFont = 'font-red bold', contentFont = 'font-description-1') {
        const container = document.createElement("div");
        
        const label = document.createElement("span");
        label.textContent = `${labelText}: `;
        labelFont.split(' ').forEach(element => {
            label.classList.add(element); // Apply bold-red class
        });
        
        
        const content = document.createElement("span");
        content.textContent = contentText;
        contentFont.split(' ').forEach(element => {
            content.classList.add(element); // Apply bold-red class
        });

        
        container.appendChild(label);
        container.appendChild(content);
        
        return container;
    }

    // Create and append Name
    const nameElement = createLabeledElement("Name", spell.name);
    listItem.appendChild(nameElement);

    // Available Classes
    if (spell.availableClasses && spell.availableClasses.length > 0 && char == null) {
        const matchedStatTypes = Object.keys(classType).filter(key => 
            spell.availableClasses.includes(classType[key])
        );
        const availableClassesElement = createLabeledElement("Available Classes", matchedStatTypes.join(" / "));
        listItem.appendChild(availableClassesElement);
    }

    // Base Stat Type
    if (spell.baseStatType && spell.baseStatType.length > 0) {
        const matchedStatTypes = Object.keys(statType).filter(key => 
            spell.baseStatType.includes(statType[key])
        );

        if (char) {
            const charStats = {
                STR: char.str,
                DEX: char.dex,
                CON: char.con,
                INT: char.int,
                WIS: char.wis,
                CHA: char.cha
            };
            let bonuses = "";
            matchedStatTypes.forEach(stat => {
                const bonus = Math.floor((charStats[stat] - 10) / 2);
                if (bonus !== 0) {
                    bonuses += `${stat} ${bonus} / `;
                }
            });
            const modifiersText = bonuses !== "" ? bonuses.slice(0, -3) : "None";
            const baseStatTypeElement = createLabeledElement("Modifiers", modifiersText);
            listItem.appendChild(baseStatTypeElement);
        } else {
            const baseStatTypeElement = createLabeledElement("Empowered With",matchedStatTypes.join(" / "));
            listItem.appendChild(baseStatTypeElement);
        }
    }

    // Damage Types
    if (spell.damageTypes && spell.damageTypes.length > 0) {
        const matchedDamageTypes = Object.keys(damageType).filter(key => 
            spell.damageTypes.includes(damageType[key])
        );
        const damageTypeElement = createLabeledElement("Damage Type", matchedDamageTypes.join(" / "));
        listItem.appendChild(damageTypeElement);
    }

    // Description
    if (spell.description) {
        const descriptionElement = createLabeledElement("Description", spell.description);
        listItem.appendChild(descriptionElement);
    }

    // Spend Mana Effects
    if (spell.spendManaEffects) {
        Object.entries(spell.spendManaEffects).forEach(([key, value]) => {
            const property = value;
            const effectText = property == null 
                ? "No additional effect." 
                : `When ${Object.keys(characterActions).find(key => characterActions[key] === property.characterAction)} -> ${property.description} by ${property.value}`;
            const manaEffectElement = createLabeledElement(`Mana ${key}`, effectText);
            listItem.appendChild(manaEffectElement);
        });
    }

    // Spell Pattern
    if (spell.spellPattern) {
        const patternText = Object.keys(spellPatterns).find(key => spellPatterns[key] === spell.spellPattern.pattern);
        const patternElement = createLabeledElement("Pattern", patternText);
        listItem.appendChild(patternElement);
    }

    // Base Damage
    if (spell.baseDamage) {
        const baseDamageElement = createLabeledElement("Dice", spell.baseDamage);
        listItem.appendChild(baseDamageElement);
    }

    // Cast Time
    if (spell.castTime) {
        const castTimeElement = createLabeledElement("Cast Time", spell.castTime);
        listItem.appendChild(castTimeElement);
    }

    // Append list item to the parent
    parent.appendChild(listItem);
}

function displayAvaliableSpells(char, x, y) {  
    const spellsSheet = document.createElement('div');
    spellsSheet.classList.add('avaliable-spells-sheet');
    spellsSheet.style.left = `${x}px`;
    spellsSheet.style.top = `${y}px`;

    const topRow = document.createElement('div');
    topRow.classList.add('row');
    topRow.classList.add('centered');
    topRow.style.width = '95%';

    const title = document.createElement('h2');
    title.textContent = 'Usable Spells';
    title.style.margin = '0';
    title.style.fontSize = '1.5em';
    title.style.color = 'white';

    const closeButton = createImageButton('26', {source: uiSettings.folderMenuIcons + '/' + uiSettings.icon_closeBar} );
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
        spellsSheet.remove();
    };

    const spellSlotsRow = document.createElement('div');
    spellSlotsRow.classList.add('row');
    spellSlotsRow.classList.add('centered');
    spellSlotsRow.style.width = '95%';

    Object.entries(char.spellSlots).forEach(([key, value]) => {
        const manaDisplay = document.createElement('div');
        manaDisplay.classList.add('slot-display');
        
        const text = document.createElement('div');
        text.classList.add('font-slot');
        text.textContent = `${convertToRoman(key)}`;

        const gridContainer = document.createElement('div');
        gridContainer.classList.add('slot-container');

        for (let index = 0; index < value[0]; index++) {
            const mana = document.createElement('div');
            mana.classList.add('slot-circle');
            if(value[1] < index+1){
                mana.classList.add('slot-spend');
            }else{
                mana.classList.add('slot-mana');
            }
            gridContainer.appendChild(mana);
        }
        manaDisplay.appendChild(text);
        manaDisplay.appendChild(gridContainer);
        spellSlotsRow.appendChild(manaDisplay);
    });
    

    const tabbedWindowContainer = createTabbedContainer(Object.keys(char.spellSlots).length, null, char.id + '-usable-spells', false, "")
    tabbedWindowContainer.style.width = '95%';
    tabbedWindowContainer.style.height = '95%';

    const tabsContainer = tabbedWindowContainer.querySelector('.tab-container');

    let clickedSpell;
    
    function displayDropDownMenu(menu, x, y){
        menu.style.display = 'block'
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
    }
    
    
    const spellClickOptionsButtonDict = {
        'Cast Spell': true,
        'Description': true,
    };

    const spellClickOptions = createDropdownMenu(spellsSheet, spellClickOptionsButtonDict); // I defined first cuz i want it to be dsiplayed on bottom of mana options
    spellClickOptions.style.display = 'none';
    
    let manaOptionsButtonDict = {}
    gameSettings.includedSpellLevels.forEach(spellLevel => {
        manaOptionsButtonDict[`Mana ${spellLevel}`] = false
    })

    const manaOptions = createDropdownMenu(spellsSheet, manaOptionsButtonDict);
    manaOptions.style.display = 'none';

    const castButton = spellClickOptions.querySelector('.index-0')
    castButton.onclick = (event) => {
        const rectSpellClickOptions = spellClickOptions.getBoundingClientRect();

        const rectspellsSheet = spellsSheet.getBoundingClientRect();
        // Loop through each key in dict2 and check if it matches any key in dict1
        const charMana = Object.keys(manaOptionsButtonDict)
        const spellManaLevels = clickedSpell.spendManaEffects ? Object.keys(clickedSpell.spendManaEffects): []

        let displayedManaLevelIndexes = [clickedSpell.spellLevel]
        spellManaLevels.forEach((level) =>{
            if(isSpellUsable(char, clickedSpell, level)){
                displayedManaLevelIndexes.push(level)
            }
        })
        
        displayedManaLevelIndexes.forEach((index) => {
            const option = manaOptions.querySelector(`.index-${index}`)
            option.style.display = 'block';
            option.onclick = () =>{
                spellCast('token-character-'+char.id, clickedSpell, index)
                spellsSheet.remove();
            }
        })
        displayDropDownMenu(manaOptions, parseFloat(spellClickOptions.style.left) + parseFloat(rectSpellClickOptions.width), event.clientY- rectspellsSheet.y);
    }

    const descriptionButton = spellClickOptions.querySelector('.index-1')
    descriptionButton.onclick = (event) => {
        displaySpellDescription(char, clickedSpell, event.clientX, event.clientY);
    }



    for(let index of Object.keys(char.spellSlots)){
        const tabContentContainer = getContentContainer(tabsContainer, parseInt(index))
        tabContentContainer.innerHTML = ''
        const spellList = document.createElement('div');
        spellList.classList.add('column');
        spellList.classList.add('vertical')
        spellList.style.width = '98%'
        spellList.style.height = '98%'
        spellList.style.gap = '5px'
        spellList.style.marginTop = '10px';

        if(char.availableSpells[index]){
            for(let i = 0; i < char.availableSpells[index].length; i++){
                const spellButton = document.createElement('button');
                spellButton.classList.add('avaliable-spells-button')
                spellButton.textContent = char.availableSpells[index][i];
                spellButton.style.fontWeight = '15px';
                spellButton.onclick = (event) => {
                    manaOptions.style.display = 'none';
                    clickedSpell = listSpells[getActiveTabIndex(tabsContainer)][spellButton.textContent];
                    if(!isSpellUsable(char, clickedSpell)) castButton.style.display = 'none';
                    const rect = spellsSheet.getBoundingClientRect();
                    displayDropDownMenu(spellClickOptions, event.clientX - rect.x, event.clientY- rect.y);
                    
                }
                spellList.appendChild(spellButton);
            }
        }   
        
        tabContentContainer.appendChild(spellList)
    }

    // Assemble the components
    topRow.appendChild(title);
    addSpacer(topRow);
    topRow.appendChild(closeButton);

    addDraggableRow(spellsSheet);
    spellsSheet.appendChild(topRow);
    spellsSheet.appendChild(spellSlotsRow); // Add the spell slots row at the bottom
    spellsSheet.appendChild(tabbedWindowContainer);
    userInterface.appendChild(spellsSheet);
    
}

function displaySpellDescription(char, spell, x, y) {
    // Create a container for the item description
    const id = spell.name + '-description'

    if(document.getElementById(id)) return;
    const descriptionContainer = document.createElement("div");
    descriptionContainer.id = id;
    descriptionContainer.style.left = `${x}px`;
    descriptionContainer.style.top = `${y}px`;
    descriptionContainer.classList.add('description-container');

    const SpellInfoContainer = document.createElement("ul");
    const title = document.createElement("h4");
    title.textContent = "Spell";
    title.style.marginBottom = "10px";
    title.style.fontWeight = "bold";
    SpellInfoContainer.appendChild(title);
    
    addSpellInfo(SpellInfoContainer, spell, char);  

    descriptionContainer.appendChild(SpellInfoContainer);

    // Append the container to the body or game area
    document.body.appendChild(descriptionContainer);

    // Optional: Remove the description when clicked
    descriptionContainer.addEventListener("click", () => {
        document.body.removeChild(descriptionContainer);
    });
}