async function displayInventory(owner, inventory, x, y) {
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
    title.textContent = owner + "'s Inventory";
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
    Object.keys(database.chars).forEach(charId => {
        sendToButtons[`${database.chars[charId].char.name} (${charId})`] = true;
        sendToButtonCharIds.push(charId);
    });
    const sendToDropDownMenu = createDropdownMenu(sendToButtons);
    sendToDropDownMenu.style.left = '105%';
    sendToDropDownMenu.style.top = '5%';
    dropdownMenu.appendChild(sendToDropDownMenu);
    
    sendToDropDownMenu.lastChild.onclick = function(){
        sendToDropDownMenu.style.display = 'none';
    }
    function inventoryUpdateItem(selectedItem){
        const effectedItem = Array.from(inventoryTable.children).find(item => item.textContent.includes(selectedItem.name));
        const newQuantity = inventory.getQuantity(selectedItem.name);
        if (newQuantity === 0) {
            effectedItem.remove();
            sendToDropDownMenu.style.display = 'none';
            dropdownMenu.style.display = 'none';
        } else {
            effectedItem.textContent = `${selectedItem.name} x${newQuantity}`;
        }
    }

    for(let i = 0; i < Object.keys(database.chars).length-1; i++){
        sendToDropDownMenu.who = sendToButtonCharIds[i]
        sendToDropDownMenu.children[i].onclick = function(){
            console.log('Send To action clicked', selectedItem, sendToDropDownMenu.children[i].textContent);
            userAskQuestion(
                'How many?', 
                'How many items would you like to send?', 
                {
                    buttons: ['Ok'],
                    input: true,
                    inputPlaceholder: 'Enter value...',
                    inputType: 'number',
                    blocking: true
                }
            ).then(result => {
                let inputValue = parseInt(result.value);
                if (inputValue) {
                    if (selectedItem.quantity < inputValue) {
                        userAskQuestion('Not enough items!', "Not enough items to send, click Ok to send all or cancel to don't send anything.", 
                            {buttons: ['Ok','Cancel'], 
                                callback: (buttonText) => {
                                    if (buttonText == 'Ok') {
                                        inputValue = selectedItem.quantity;
                                    }else{
                                        inputValue = 0;
                                    }

                                    if (inputValue > 0) {
                                        database.chars[sendToDropDownMenu.who].char.inventory.addItem(selectedItem, inputValue);
                                        inventory.removeItem(selectedItem.name, inputValue);
                                        console.log('Sent', inputValue, selectedItem.name, 'to', sendToDropDownMenu.children[i].textContent);
                                        inventoryUpdateItem(selectedItem);
                                    }
                                },
                            blocking: true});
                    }else{
                        database.chars[sendToDropDownMenu.who].char.inventory.addItem(selectedItem, inputValue);
                        inventory.removeItem(selectedItem.name, inputValue);
                        console.log('Sent', inputValue, selectedItem.name, 'to', sendToDropDownMenu.children[i].textContent);
                        inventoryUpdateItem(selectedItem);
                    }
                }
            });
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