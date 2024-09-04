function addCharacterSheet(parent, id) {
    // Future
    const char = new Character(id.replace('-character-sheet', ''));
    inGameCharacters.push(char);

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
        displayInventory(char.INVENTORY, event.clientX, event.clientY);
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

    const closeButton = createImageButton('26', null, userIntarfaceSettings.FOLDER_MENUICONS + '/' + userIntarfaceSettings.ICON_CLOSEBAR);
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

    // Create dropdown menu container
    const dropdownMenu = document.createElement('div');
    dropdownMenu.style.position = 'absolute';
    dropdownMenu.style.backgroundColor = '#fff';
    dropdownMenu.style.border = '1px solid #ccc';
    dropdownMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    dropdownMenu.style.padding = '5px';
    dropdownMenu.style.display = 'none'; // Initially hidden
    dropdownMenu.style.zIndex = '1000';
    
    const useItemButton = document.createElement('div');
    useItemButton.style.display = 'none';
    useItemButton.textContent = 'Use';
    useItemButton.style.padding = '5px';
    useItemButton.style.cursor = 'pointer';
    useItemButton.style.borderBottom = '1px solid #000';
    useItemButton.onclick = () => {
        console.log('Move To action clicked');
        dropdownMenu.style.display = 'none';
    };

    const moveTo = document.createElement('div');
    moveTo.textContent = 'Move To';
    moveTo.style.padding = '5px';
    moveTo.style.cursor = 'pointer';
    moveTo.style.borderBottom = '1px solid #000';
    moveTo.style.textAlign = 'center';
    moveTo.onclick = () => {
        console.log('Move To action clicked');
        dropdownMenu.style.display = 'none';
    };

    const description = document.createElement('div');
    description.textContent = 'Description';
    description.style.padding = '5px';
    description.style.cursor = 'pointer';
    description.style.textAlign = 'center';
    description.onclick = (event) => {
        displayItemDescription(selectedItem, event.clientX, event.clientY);
        dropdownMenu.style.display = 'none';
    };

    const dropDownCloseButton = document.createElement('div');
    dropDownCloseButton.textContent = 'close';
    dropDownCloseButton.style.padding = '5px';
    dropDownCloseButton.style.cursor = 'pointer';
    dropDownCloseButton.style.textAlign = 'center';
    dropDownCloseButton.onclick = () => {
        dropdownMenu.style.display = 'none';
    };

    dropdownMenu.appendChild(useItemButton);
    dropdownMenu.appendChild(moveTo);
    dropdownMenu.appendChild(description);
    dropdownMenu.appendChild(dropDownCloseButton);

    // Add items to the inventory table
    inventory.items.forEach(item => {
        const itemButton = document.createElement('button');
        itemButton.textContent = `${item.name} x${inventory.getQuantity(item.name)}`;
        itemButton.classList.add('inventory-button');

        itemButton.onclick = function (event) {
            selectedItem = item;
            dropdownMenu.style.display = 'block';
            if(item.itemType === itemType.CONSUMABLE){
                useItemButton.style.display = 'block';
                useItemButton.style.textAlign = 'center';
            }else{
                useItemButton.style.display = 'none';
            }
            // Calculate position for dropdown menu
            const rect = itemButton.getBoundingClientRect();
            dropdownMenu.style.left = `${event.clientX - rect.left}px`;
            dropdownMenu.style.top = `${event.clientY - rect.top}px`;
        };
        
        inventoryTable.appendChild(itemButton);
    });

    const currencyTab = document.createElement('div');
    currencyTab.style.display = 'flex';
    currencyTab.style.justifyContent = 'space-between';
    currencyTab.style.alignItems = 'center'; // Align items vertically centered
    currencyTab.style.width = '95%';
    currencyTab.style.padding = '10px';
    currencyTab.style.border = '2px solid black';
    currencyTab.style.backgroundColor = '#ffffff';
    
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
    currencyTab.appendChild(createCurrency(userIntarfaceSettings.FOLDER_MENUICONS + '/' + userIntarfaceSettings.ICON_GOLD, inventory.currency.gold));
    currencyTab.appendChild(createCurrency(userIntarfaceSettings.FOLDER_MENUICONS + '/' + userIntarfaceSettings.ICON_SILVER, inventory.currency.silver));
    currencyTab.appendChild(createCurrency(userIntarfaceSettings.FOLDER_MENUICONS + '/' + userIntarfaceSettings.ICON_BRONZE, inventory.currency.bronze));

    // Assemble the components
    topRow.appendChild(title);
    addSpacer(topRow);
    topRow.appendChild(closeButton);
    inventorySheet.appendChild(topRow);
    inventorySheet.appendChild(inventoryTable);
    inventorySheet.appendChild(currencyTab);
    inventorySheet.appendChild(dropdownMenu); // Append dropdown menu to the inventory sheet
    document.body.appendChild(inventorySheet);
}

function displayItemDescription(inventroyItem, x, y) {
    // Find the item in the list of weapons
    let item;
    if(inventroyItem.itemType === itemType.WEAPON){
        item = listWeapons[inventroyItem.name];
    }else if(inventroyItem.itemType === itemType.CONSUMABLE){
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

    if(item.additionalEffects && item.additionalEffects.length >0){
        const effectsList = document.createElement("ul");
        const title = document.createElement("h4");
        title.textContent = "Additonal Effect(s)";
        title.style.marginBottom = "10px";
        title.style.fontWeight = "bold";
        effectsList.appendChild(title);
        item.additionalEffects.forEach(property => {
            const listItem = document.createElement("li");
            listItem.textContent = "When "+ Object.keys(characterActions).find(key => characterActions[key] === property.characterAction) +" -> "+property.description +" by " + property.value;
            effectsList.appendChild(listItem);
        }); 
        descriptionContainer.appendChild(effectsList);
    }

    if(item.spells && item.spells.length >0){  
        const effectsList = document.createElement("ul");
        const title = document.createElement("h4");
        title.textContent = "Spell(s)";
        title.style.marginBottom = "10px";
        title.style.fontWeight = "bold";
        effectsList.appendChild(title);
        item.spells.forEach(property => {
            addSpellInfo(effectsList, property);    
        }); 
        descriptionContainer.appendChild(effectsList);
    }

    // Append the container to the body or game area
    document.body.appendChild(descriptionContainer);

    // Optional: Remove the description when clicked
    descriptionContainer.addEventListener("click", () => {
        document.body.removeChild(descriptionContainer);
    });
}

function addSpellInfo(parent, spell, char = null){
    const listItem = document.createElement("li");
    let text = "";
    text += "Name: " + spell.name;
    if (spell.availableClasses && spell.availableClasses.length > 0 && char == null) {
        const matchedStatTypes = Object.keys(classType).filter(key => 
            spell.availableClasses.includes(classType[key])
        );
        text += "<br>Avaliable Classes: " + matchedStatTypes.join(" / ");
    }     
    if (spell.baseStatType && spell.baseStatType.length > 0) {
        const matchedStatTypes = Object.keys(statType).filter(key => 
            spell.baseStatType.includes(statType[key])
        );
        if(char){
            const charStats = {
                STR: char.STR,
                DEX: char.DEX,
                CON: char.CON,
                INT: char.INT,
                WIS: char.WIS,
                CHA: char.CHA
            }
            let bonuses = "";
            matchedStatTypes.forEach(stat => {
                const bonus = Math.floor((charStats[stat]-10)/2)
                if(bonus !== 0){
                    bonuses += stat + " " + `${bonus}`;
                }
            });
            if(bonuses !== ""){
                text += "<br>Modifiers: " + bonuses;
            }else{
                text += "<br>Modifiers: None";
            }
        }else{
            text += "<br>Empowered With: " + matchedStatTypes.join(" / ");
        }
    }            
    if (spell.damageTypes && spell.damageTypes.length > 0) {
        const matchedDamageTypes = Object.keys(damageType).filter(key => 
            spell.damageTypes.includes(damageType[key])
        );
        text += "<br>Damage Type: " + matchedDamageTypes.join(" / ");
    }
    if(spell.description){
        text += "<br>Description: " + spell.description;
    }
    if(spell.spellPattern){
        text += "<br>Pattern: " + Object.keys(patterns).find(key => patterns[key] === spell.spellPattern.pattern);
    }
    if(spell.baseDamage){
        text += "<br>Dice: " + spell.baseDamage;
    }
    if(spell.castTime){
        text += "<br>Cast Time: " + spell.castTime;
    }

    listItem.innerHTML = text;
    parent.appendChild(listItem);
}

function displayAvaliableSpells(char, x, y) {

    let selectedSpellLevelList;
    let selectedSpell;
    
    // Create the inventory sheet container
    const spellsSheet = document.createElement('div');
    spellsSheet.classList.add('avaliable-spells-sheet');
    spellsSheet.style.left = `${x}px`;
    spellsSheet.style.top = `${y}px`;

    // Create the inventory table container
    const spellTable = document.createElement('div');
    spellTable.classList.add('column');
    spellTable.classList.add('horizontal');
    spellTable.style.height = '90%';
    spellTable.style.gap = '10px';
    spellTable.style.marginTop = '10px';

    // Create dropdown menu container
    const dropdownMenu = document.createElement('div');
    dropdownMenu.style.position = 'absolute';
    dropdownMenu.style.backgroundColor = '#fff';
    dropdownMenu.style.border = '1px solid #ccc';
    dropdownMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    dropdownMenu.style.padding = '5px';
    dropdownMenu.style.display = 'none'; // Initially hidden
    dropdownMenu.style.zIndex = '1000';
    
    const castSpellButton = document.createElement('div');
    castSpellButton.textContent = 'Cast';
    castSpellButton.style.padding = '5px';
    castSpellButton.style.cursor = 'pointer';
    castSpellButton.style.borderBottom = '1px solid #000';
    castSpellButton.onclick = () => {
        spellCast(getCharToken(char), selectedSpellLevelList[`${selectedSpell}`]);
        dropdownMenu.style.display = 'none';
    };

    const moveTo = document.createElement('div');
    moveTo.textContent = 'Move To';
    moveTo.style.padding = '5px';
    moveTo.style.cursor = 'pointer';
    moveTo.style.borderBottom = '1px solid #000';
    moveTo.style.textAlign = 'center';
    moveTo.onclick = () => {
        console.log('Move To action clicked');
        dropdownMenu.style.display = 'none';
    };

    const description = document.createElement('div');
    description.textContent = 'Description';
    description.style.padding = '5px';
    description.style.cursor = 'pointer';
    description.style.textAlign = 'center';
    description.onclick = (event) => {
        displaySpellDescription(char, spellName, event.clientX, event.clientY);
        dropdownMenu.style.display = 'none';
    };

    const dropDownCloseButton = document.createElement('div');
    dropDownCloseButton.textContent = 'close';
    dropDownCloseButton.style.padding = '5px';
    dropDownCloseButton.style.cursor = 'pointer';
    dropDownCloseButton.style.textAlign = 'center';
    dropDownCloseButton.onclick = () => {
        dropdownMenu.style.display = 'none';
    };

    dropdownMenu.appendChild(castSpellButton);
    dropdownMenu.appendChild(moveTo);
    dropdownMenu.appendChild(description);
    dropdownMenu.appendChild(dropDownCloseButton);

    Object.entries(char.AVAILABLE_SPELLS).forEach(([spellLevel, avaliable]) => {
  
        selectedSpellLevelList = level1_spell_list;
 

        avaliable.forEach((spellName) => {
            const itemButton = document.createElement('button');
            itemButton.textContent = `${spellName}`;
            itemButton.classList.add('inventory-button');
    
            itemButton.onclick = function (event) {
                selectedSpell = spellName;
                dropdownMenu.style.display = 'block';

                // selectedItem = item;
                // dropdownMenu.style.display = 'block';
                // if(item.itemType === itemType.CONSUMABLE){
                //     useItemButton.style.display = 'block';
                //     useItemButton.style.textAlign = 'center';
                // }else{
                //     useItemButton.style.display = 'none';
                // }
                // // Calculate position for dropdown menu
                // const rect = itemButton.getBoundingClientRect();
                // dropdownMenu.style.left = `${event.clientX - rect.left}px`;
                // dropdownMenu.style.top = `${event.clientY - rect.top}px`;
            };
            
            spellTable.appendChild(itemButton); 
        });
    });

    const topRow = document.createElement('div');
    topRow.classList.add('row');
    topRow.classList.add('centered');
    topRow.style.width = '95%';

    const title = document.createElement('h2');
    title.textContent = 'Baudrates';
    title.style.margin = '0';
    title.style.fontSize = '1.5em';
    title.style.color = '#333';

    const closeButton = createImageButton('26', null, userIntarfaceSettings.FOLDER_MENUICONS + '/' + userIntarfaceSettings.ICON_CLOSEBAR);
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
        spellsSheet.remove();
    };

    // Assemble the components
    topRow.appendChild(title);
    addSpacer(topRow);
    topRow.appendChild(closeButton);
    spellsSheet.appendChild(topRow);
    spellsSheet.appendChild(spellTable);
    spellsSheet.appendChild(dropdownMenu); 
    document.body.appendChild(spellsSheet);
    
}

function displaySpellDescription(char, spell, x, y) {
    // Create a container for the item description
    const descriptionContainer = document.createElement("div");
    descriptionContainer.id = id;
    descriptionContainer.style.position = "absolute";
    descriptionContainer.style.display = "block";
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