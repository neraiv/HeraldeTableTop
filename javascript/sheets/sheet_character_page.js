function addCharacterSheet(parent, id) {
    // Future
    const char = new Character(id)
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

function displayInventory(inventory, x, y){
    const inventorySheet = document.createElement('div');
    inventorySheet.classList.add('inventory-sheet');
    inventorySheet.style.position = 'fixed';
    inventorySheet.style.left = `${x}px`;
    inventorySheet.style.top = `15%`;

    const topRow = document.createElement('div');
    topRow.style.width = '80%';
    topRow.classList.add('row');
    topRow.classList.add('centered');

    const title = document.createElement('h1');
    title.textContent = 'Inventory';

    const closeButton = createImageButton('26', null, userIntarfaceSettings.FOLDER_MENUICONS+'/'+userIntarfaceSettings.ICON_CLOSEBAR);
    closeButton.onclick = () => {
        inventorySheet.remove();
    }

    const inventoryTable = document.createElement('div');
    inventoryTable.style.width = '80%';
    inventoryTable.style.gap = '5px';
    inventoryTable.classList.add('column');
    inventoryTable.classList.add('centered');


    inventory.items.forEach(item => {
        const itemButton = document.createElement('button');
        itemButton.textContent = item.name + ' x' + inventory.getQuantity(item.name);
        itemButton.classList.add('inventory-button');
        inventoryTable.appendChild(itemButton);
    });

    topRow.appendChild(title);
    addSpacer(topRow);
    topRow.appendChild(closeButton);

    inventorySheet.appendChild(topRow);
    inventorySheet.appendChild(inventoryTable);
    document.body.appendChild(inventorySheet);
}

function displayItemDescription(itemName){

}

