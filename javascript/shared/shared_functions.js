function createTestDots(parent, count){
    let dotList = [];
    for(let i = 0; i < count; i++){
        const dot = document.createElement('div');
        dot.classList.add('test-dot');
        dotList.push(dot);
        parent.appendChild(dot);
    }
    return dotList;
}

function removeTestDots(parent, dotlist){
    dotlist.forEach(dot => parent.removeChild(dot));
}

function createNumberInput({label, id, maxValue=99, minValue=1, isReadOnly = false, addIncrementButtons = true}) {
    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group');
    formGroup.classList.add('row');
    formGroup.classList.add('vertical');
    formGroup.style.minHeight = '30px';
    formGroup.style.height = '30px';

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', label);
    labelElement.classList.add('label-element');
    labelElement.textContent = label;

    const inputElement = document.createElement('input');
    inputElement.type = 'number';
    inputElement.classList.add('input-element');
    inputElement.id = id;
    inputElement.name = label;
    inputElement.value = minValue;

    if (isReadOnly) {
        inputElement.readOnly = true;
    }

    inputElement.onchange = () =>{
        if(inputElement.value < minValue){
            inputElement.value = minValue;
        }
        if(inputElement.value > maxValue){
            inputElement.value = maxValue;
        }
    }

    formGroup.appendChild(labelElement);
    addSpacer(formGroup);
    formGroup.appendChild(inputElement);

    if(addIncrementButtons){
        const controls = document.createElement('div');
        controls.className = 'number-controls';
    
        const buttonUp = createImageButton(19, {icon: '&#9650;'});  
        buttonUp.classList.add('button-up')
        buttonUp.onclick = function(event){
            event.preventDefault();
            if(inputElement.value < maxValue){
                inputElement.value = inputElement.value + 1;
            }
        }
        const buttonDown = createImageButton(19, {icon: '&#9660;'});  
        buttonDown.classList.add('button-down')
        buttonDown.onclick = function(event){
            event.preventDefault();
            if(inputElement.value > minValue){
                inputElement.value = inputElement.value - 1;
            }
        }
    
        controls.appendChild(buttonUp);
        controls.appendChild(buttonDown);
        formGroup.appendChild(controls);
    }
   
    return formGroup
}

function createStringInput(label, id = '', defaultValue = null, isReadOnly) {
    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group')
    formGroup.classList.add('row')
    formGroup.classList.add('centered');
    formGroup.style.minHeight = '30px';
    formGroup.style.height = '30px';

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', id); // Associate label with input via id
    labelElement.classList.add('label-element');
    labelElement.textContent = label;
    labelElement.style.alignContent = 'center';
    labelElement.style.textAlign = 'center';


    const inputElement = document.createElement('input');
    inputElement.classList.add('input-element');
    inputElement.type = 'text';
    inputElement.id = id; // Set the id for the input
    inputElement.name = id; // Optionally set the name attribute as well
    inputElement.style.display = 'flex'; //
    inputElement.value = defaultValue ? defaultValue: "";

    if (isReadOnly) {
        inputElement.readOnly = true;
    }

    formGroup.appendChild(labelElement);
    addSpacer(formGroup);
    formGroup.appendChild(inputElement);

    return formGroup;
}

function createSelectorInput(label, valueList, textList, 
    {
    nonSelectableDefault,
    id,
    disable_filter,
    multiple,
    isReadOnly,
    custom_func,
    defaultValue
    } = { nonSelectableDefault: null, id: null, disable_filter: null, multiple: false, isReadOnly: false, custom_func: null, defaultValue: null  }) {

    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group')
    formGroup.classList.add('row')
    formGroup.classList.add('centered');

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', id); // Associate label with input via id
    labelElement.classList.add('label-element');
    labelElement.textContent = label;
    labelElement.style.alignContent = 'center';
    labelElement.style.textAlign = 'center';

    const inputElement = createSelector(id, valueList, textList, {
        defaultValue: nonSelectableDefault, 
        disable_filter: disable_filter, 
        onclick_func: custom_func? custom_func: chekmarkOptionFunction}
    );

    inputElement.style.height = '98%';
    inputElement.classList.add('input-element');
    inputElement.multiple = multiple;

    if (isReadOnly) {
        inputElement.readOnly = true;
    }

    formGroup.appendChild(labelElement);
    addSpacer(formGroup);
    formGroup.appendChild(inputElement);

    for(let option of inputElement.options){
        if(defaultValue && defaultValue.includes(option.index)){
            option.selected = true;
            if(multiple){
                event_ = {
                    target: option
                }
                if(custom_func){
                    custom_func(event_)
                }else{
                    optionOnclickFunc(event_)
                }
            }
        }
    }

    return formGroup;
}

function chekmarkOptionFunction(event) {  
    const option = event.target;

    // Add tick emoji if selected
    if (!option.textContent.includes('✓')) {
        option.textContent += ' ✓';
    } else {
        // Remove tick emoji if deselected
        option.textContent = option.textContent.replace(' ✓', '');
    }
        
}

function getSelectedOptionsWithCheckmark(selectElement) {
    const selectedValues = [];
    
    // Loop through the options of the select element
    for (let option of selectElement.options) {
        // Check if the option text contains the checkmark '✓'
        if (option.text.includes('✓')) {
            selectedValues.push(option.value);
        }
    }

    return selectedValues;
}

function indexedOptionFunctionWithTransperency(event) {
    const option = event.target;
    const select = option.parentElement;
    
    if (!select.dataset.index) select.dataset.index = 0;

    const index = parseInt(select.dataset.index);

    // Check if the option is already indexed (if it has a number after a hyphen)
    if (!/\-\s\d+$/.test(option.textContent)) {
        const arr = option.textContent.split('-');
        
        if (arr.length > 1) {
            arr[1] = index + 1;
        } else {
            arr.push(index + 1);
        }

        option.textContent = arr.join('- ');
        select.dataset.index = index + 1;

        // Apply gradient background based on index
        const transparency = 0.6;
        const red = 255;
        const green = 160 + (index * 15);  // Gradually increasing toward skin tone
        const blue = 122 + (index * 10);   // Gradually increasing toward skin tone
        option.style.backgroundColor = `rgba(${red}, ${green}, ${blue}, ${transparency})`;
    }
}

function indexedOptionFunction(event) {
    const option = event.target;
    const select = option.parentElement;
    
    if (!select.dataset.index) select.dataset.index = 0;

    const index = parseInt(select.dataset.index);

    // Check if the option is already indexed (if it has a number after a hyphen)
    if (!/\-\s\d+$/.test(option.textContent)) {
        const arr = option.textContent.split('-');
        
        if (arr.length > 1) {
            arr[1] = index + 1;
        } else {
            arr.push(index + 1);
        }

        option.textContent = arr.join('- ');
        select.dataset.index = index + 1;
    }
}

function getOrderedSelectedOptions(selectElement) {
    // Create an array to store the options with their index and value
    const optionsWithIndex = [];
    
    // Loop through the options of the select element
    for (let option of selectElement.options) {
        // Check if the option text contains a dash (indicating an index is present)
        const parts = option.text.split('-');
        if (parts.length === 2) {
            const index = parseInt(parts[1], 10); // Extract the index
            if (!isNaN(index)) { // Ensure it's a valid number
                optionsWithIndex.push({ index: index, value: option.value });
            }
        }
    }

    // Sort the array based on the index (ascending)
    optionsWithIndex.sort((a, b) => a.index - b.index);

    // Extract the values in the correct order
    const orderedValues = optionsWithIndex.map(option => option.value);

    return orderedValues;
}

function createSpellSelectContainer(id, initalLevel = null, initialSpellName = null){
    const itemId = id + '-spell-select-container';
    const spellSelectContainer = document.createElement('div');
    spellSelectContainer.classList.add('form-group');
    spellSelectContainer.classList.add('box-circular-border');
    spellSelectContainer.classList.add('row');
    spellSelectContainer.classList.add('vertical');

    let selectedSpellLevelList = 1;
    const spellLevelSelector = createSelectorInput('Spell Level:', gameSettings.includedSpellLevels, gameSettings.includedSpellLevels, {
        nonSelectableDefault: 'select', 
        id: itemId + '-spell-level',
        defaultValue: initalLevel ? [initalLevel] : null});

    spellLevelSelector.classList.add('spell-level-selector')
    const spellSelect = createSelectorInput('Spell:', Object.keys(listSpells[selectedSpellLevelList]), Object.keys(listSpells[selectedSpellLevelList]), {
        nonSelectableDefault: 'select', 
        id: itemId + '-spell-level',
        defaultValue: initialSpellName ? [initialSpellName] : null});
    spellSelect.classList.add('spell-name-selector')

    spellLevelSelector.querySelector('.input-element').onchange = function(event){
        selectedSpellLevelList = event.target.value;
        spellSelectContainer.spellLevel = spellLevelSelector.querySelector('.input-element').selectedOptions[0].value;
        updateSelector(Object.keys(listSpells[selectedSpellLevelList]), Object.keys(listSpells[selectedSpellLevelList]),spellSelect.querySelector('.input-element'), null, 'select');
    }

    spellSelect.querySelector('.input-element').onchange = () => {
        spellSelectContainer.spellName = spellSelect.querySelector('.input-element').selectedOptions[0].value;
    }

    spellSelectContainer.spellLevel = 0
    spellSelectContainer.spellName = null

    spellSelectContainer.appendChild(spellLevelSelector);
    spellSelectContainer.appendChild(spellSelect);

    return spellSelectContainer;
}

function createImageButton(fontSize, {icon=null, source=null, custom_padding = 8}) {
    const button = document.createElement('button');
    button.className = 'image-button';

    // Apply font size to the button
    button.style.fontSize = `${fontSize-custom_padding}px`;

    // Set button size
    button.style.width = `${fontSize}px`; // Width of the button
    button.style.height = `${fontSize}px`; // Height of the button
    
    if (source) {
        // Use an image source; set width and height to 100% to fill the button
         button.innerHTML = `<img src="${source}" width="${fontSize-custom_padding}px" height="${fontSize-custom_padding}px" draggable = "false"/>`;
    } else if (icon) {
        // Use emoji or text icon; the font size controls the size
        button.innerHTML = icon;
    }
    button.draggable = false;
    return button;
}

// Function to set image size while preserving aspect ratio
function setImageSize(img, maxWidth, maxHeight, extra_ratio = NaN) {
    let ratio = img.naturalWidth / img.naturalHeight;

    let newWidth = maxWidth;
    let newHeight = maxWidth / ratio;

    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = maxHeight * ratio;
    }

    if (!isNaN(extra_ratio)) {
        newWidth = maxWidth * extra_ratio;
        newHeight = newWidth * extra_ratio;
    }
    img.style.width = `${newWidth}px`;
    img.style.height = `${newHeight}px`;
}

function getScalingFactor(container, scale) {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    return {
        widthFactor: containerWidth / 100 * scale, // Adjust this based on your requirement
        heightFactor: containerHeight / 100 * scale // Adjust this based on your requirement
    };
}

function toggleSliding_SheetWithId(id, open= null, page= null) {
    if(!page){
        page = document.getElementById(id);
    }
    if(open == null){
        if(page.classList.contains('active')){
            page.classList.remove('active');
            page.classList.add('closed');
        }else{
            page.classList.remove('closed');
            page.classList.add('active');
        }
    }else{
        if(open){
            page.classList.remove('closed');
            page.classList.add('active');
        } else {
            page.classList.remove('active');
            page.classList.add('closed');
        }
    } 
}

function toggleDisplay_SheetWithId(id, open= null, page= null) {
    if(!page){
        page = document.getElementById(id);
    }
    if(open == null){
        if(page.style.display == 'none'){
            page.style.display = 'flex';
        }else{
            page.style.display = 'none';
        }
    }else{
        if(open){
            page.style.display = 'flex';
        } else {
            page.style.display = 'none';
        }
    } 
}

function genareteRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function addSpacer(parentElement){
    const spacer = document.createElement('div');
    spacer.className = 'spacer';
    parentElement.appendChild(spacer);
}

function addClickHighlightListener(element) {
    // Add event listeners for 'mousedown' and 'mouseup' events
    element.addEventListener('mousedown', function() {
        element.classList.add('highlight');
    });

    element.addEventListener('mouseup', function() {
        element.classList.remove('highlight');
    });
}

function addToogleHighlight(element, parentElement = null) {
    if(element.classList.contains('highlight')){
        element.classList.remove('highlight');
    }else{
        if(parentElement){
            // Get all child elements with the class 'child' under the parent
            const children = parentElement.querySelectorAll('.image-button');

            // Convert NodeList to an array (optional)
            const childrenArray = Array.from(children);

            // Log each child element
            childrenArray.forEach(child => {
                if(child.classList.contains('highlight')){
                    child.classList.remove('highlight');
                }
            });
        }
        element.classList.add('highlight');
    }
}


function createDropdownMenu(parent, buttonsDict) {
    // searc querySelector('.index-0')
    // Create dropdown menu container
    const dropdownMenu = document.createElement('div');
    dropdownMenu.classList.add('dropdown-menu');
    let index = 0;
    Object.entries(buttonsDict).forEach(([key, value]) => {
        const button = document.createElement('div');
        button.textContent = key;
        button.classList.add('dropdown-menu-button');
        button.classList.add('index-'+index);
        if (value === false) {
            button.style.display = 'none'; // Hide if value is false
        }
        dropdownMenu.appendChild(button);
        index++;
    });

    const closeButton = document.createElement('div');
    closeButton.textContent = 'close';
    closeButton.classList.add('dropdown-menu-close-button');
    closeButton.classList.add('close-button')
    closeButton.onclick = () => {
        dropdownMenu.style.display = 'none';
    };
    dropdownMenu.appendChild(closeButton);

    parent.appendChild(dropdownMenu);

    return dropdownMenu;
}

function createSelector(id, valueList, textList, {defaultValue=null, disable_filter= null, onclick_func=null}) {
    // Create the select element
    const selector = document.createElement('select');
    if (id) selector.id = id;
    selector.className = 'token-selector-combobox'; // Future


    // Create and add the default option
    if(defaultValue != null){
        const defaultOption = document.createElement('option');
        defaultOption.value = ''; // Empty value for default
        defaultOption.textContent = defaultValue; 
        defaultOption.disabled = true; // Make it non-selectable
        defaultOption.selected = true; // Set as the default selected option
        selector.appendChild(defaultOption);
    }

    // Add options based on valueList and textList
    valueList.forEach((value, index) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = textList[index] || value; // Use value if textList is shorter

        if(onclick_func){
            option.addEventListener('click', onclick_func);
        }

        if(disable_filter && option.textContent.includes(disable_filter)){
            option.disabled = true;
        }

        selector.appendChild(option);
    });

    return selector;
}

function updateSelector(valueList, textList, selector = null, selectorId = null, defaultValue = 'select', disable_filter = null) {
    // Fetch the selector by ID if it's not directly passed
    if (selectorId) {
        selector = document.getElementById(selectorId);
    }

    if (!selector) {
        console.log('Selector not found');
        return;
    }

    // Clear the options
    selector.innerHTML = '';

    // Create and add the default option
    if (defaultValue != null) {
        const defaultOption = document.createElement('option');
        defaultOption.value = ''; // Empty value for default
        defaultOption.textContent = defaultValue;
        defaultOption.disabled = true; // Make it non-selectable
        defaultOption.selected = true; // Set as the default selected option
        selector.appendChild(defaultOption);
    }

    // Add options based on the new valueList and textList
    valueList.forEach((value, index) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = textList[index] || value; // Use value if textList is shorter

        if (disable_filter && option.textContent.includes(disable_filter)) {
            option.disabled = true;
        }

        selector.appendChild(option);
    });
}

function addDraggableRow(parent){
    const draggableRow = document.createElement('div');
    draggableRow.classList.add('draggable-row');

    // Make the draggable row actually draggable (optional)
    let offsetX, offsetY;
    draggableRow.onmousedown = function (event) {
        offsetX = event.clientX - parent.offsetLeft;
        offsetY = event.clientY - parent.offsetTop;
        document.onmousemove = function (event) {
            parent.style.left = `${event.clientX - offsetX}px`;
            parent.style.top = `${event.clientY - offsetY}px`;
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    parent.appendChild(draggableRow);
}

function convertToRoman(num) {
    if(num >= 40){
        console.log('cant convert to Roman');
        return num;
    }

    const romanNumeralMap = [
        { value: 10, symbol: 'X' },
        { value: 9, symbol: 'IX' },
        { value: 5, symbol: 'V' },
        { value: 4, symbol: 'IV' },
        { value: 1, symbol: 'I' }
    ];
    
    let roman = '';
    
    for (let i = 0; i < romanNumeralMap.length; i++) {
        while (num >= romanNumeralMap[i].value) {
            roman += romanNumeralMap[i].symbol;
            num -= romanNumeralMap[i].value;
        }
    }
    
    return roman;
}

function getKeyFromMapWithValue(map, searchValue){
    const matchingEntry = Object.entries(map).find(([key, value]) => value === searchValue);
    if(matchingEntry){
        return [matchingEntry[0]];
    }else{
        return undefined;
    }   
}
function getMissingArrayValues(inputArray, searchArray) {

    // Filter out the missing types
    const missingTypes = searchArray.filter(type => !inputArray.includes(type));

    return missingTypes;
}



function createTabbedContainer(tabCount, tabNames = null, id = null, isGrowable = false, tabMainName = null) {
    // Create a parent container for both tab and content containers
    tabMainName = tabMainName != null ? tabMainName : 'Tab';
    const tabbedWindowContainer = document.createElement('div');
    tabbedWindowContainer.length = tabCount;
    tabbedWindowContainer.className = id ? `${id}-tabbed-window` : 'default-tabbed-window'; // Optional class for styling

    const tabContainer = document.createElement('div');
    tabContainer.classList.add('tab-container');
    tabContainer.id = id ? `${id}-tab-container` : 'default-tab-container'; // Fallback ID if none is provided


    const contentContainer = document.createElement('div');
    contentContainer.className = id ? `${id}-tab-content-container` : 'default-tab-content-container';
    contentContainer.classList.add('tab-content-container'); // Added a class for the content container

    // Append the tab and content containers to the tabbed window container
    tabbedWindowContainer.appendChild(tabContainer);
    tabbedWindowContainer.appendChild(contentContainer);

    // Create tabs
    createTabs(tabContainer, contentContainer, tabCount, tabNames, id, tabMainName);

    // If growable, add an "Add Tab" button/icon at the end
    if (isGrowable) {
        const addTabButton = document.createElement('button');
        addTabButton.className = 'add-tab-button';
        addTabButton.innerText = '+';  // Or set as an icon
        addTabButton.onclick = () => addNewTab(tabContainer, contentContainer, null, tabMainName);
        tabContainer.appendChild(addTabButton);  // Add the button to the tab container
        tabbedWindowContainer.addTabButton = addTabButton; // Add a method to open tabs
    }

    // Return the tabbed window container
    return tabbedWindowContainer;
}


function createTabs(tabContainer, contentContainer, tabCount, tabNames = null, id = null, tabMainName = null) {
    // Clear any existing tabs
    tabContainer.innerHTML = '';
    contentContainer.innerHTML = '';

    tabMainName = tabMainName != null ? tabMainName : 'Tab';

    for (let i = 1; i <= tabCount; i++) {
        // Create tab button
        const tabName = tabNames ? tabNames[i - 1] : `${tabMainName} ${i}`;
        const tabButton = document.createElement('button');
        tabButton.innerText = tabName;
        tabButton.className = 'tablinks';
        tabButton.setAttribute('data-index', i);
        tabButton.setAttribute('data-name', tabName);
        tabButton.onclick = function(event) { openTab(event, `tab${i}`, contentContainer); };
        tabContainer.appendChild(tabButton);

        // Create tab content
        const tabContent = document.createElement('div');
        tabContent.id = `tab${i}`;  // Use dynamic IDs for the tab content
        tabContent.className = 'tab-content';
        tabContent.innerHTML = `<h3>${tabName}</h3><p>Content for Tab ${i}</p>`;
        contentContainer.appendChild(tabContent);
    }

    // Activate first tab by default
    if (tabContainer.children.length > 0) {
        tabContainer.children[0].classList.add('active');
    }
    if (contentContainer.children.length > 0) {
        contentContainer.children[0].classList.add('active');
    }
}

function openTab(evt, tabName, contentContainer) {
    // Hide all tab content within this specific container
    const tabContentElements = contentContainer.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContentElements.length; i++) {
        tabContentElements[i].classList.remove('active');
    }

    // Remove active class from all buttons in the parent tab container
    const tabLinks = evt.currentTarget.parentElement.getElementsByClassName('tablinks');
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove('active');
    }

    // Show the current tab and mark the clicked button as active
    const tabToShow = contentContainer.querySelector(`#${tabName}`);
    if (tabToShow) {
        tabToShow.classList.add('active');
    }
    evt.currentTarget.classList.add('active');
}

function getActiveTabIndex(tabContainer){
    const tabLinks = tabContainer.querySelectorAll('.tablinks');
    const activeTabLink = Array.from(tabLinks).find(link => link.classList.contains('active'));
    return activeTabLink.getAttribute('data-index');
}

// Function to get contentContainer by tab index or name (scoped to parent container)
function getContentContainer(tabContainer, identifier) {
    let tabButton;

    // If no identifier is provided, get the last tab button
    if (identifier === undefined) {
        const tabButtons = tabContainer.getElementsByClassName('tablinks');
        tabButton = tabButtons[tabButtons.length - 1]; // Get the last tab button
    } 
    // If the identifier is a number, treat it as an index
    else if (typeof identifier === 'number') {
        tabButton = tabContainer.querySelector(`[data-index="${identifier}"]`);
    } 
    // If the identifier is a string, treat it as a tab name
    else if (typeof identifier === 'string') {
        tabButton = tabContainer.querySelector(`[data-name="${identifier}"]`);
    }

    if (tabButton) {
        const tabIndex = tabButton.getAttribute('data-index');
        const contentContainer = tabContainer.nextElementSibling; // Get the content container within the same parent
        const tab = `#tab${tabIndex}`
        return contentContainer.querySelector(`#tab${tabIndex}`); // Search only within the content container
    } else {
        console.error("Tab not found with the given identifier:", identifier);
        return null;
    }
}


function addNewTab(tabContainer, contentContainer, name, tabMainName= 'Tab') {
    const tabCount = tabContainer.getElementsByClassName('tablinks').length; // Get current number of tabs
    const newTabIndex = tabCount + 1;
    const newTabName = name ? name : `${tabMainName} ${newTabIndex}`; // Default name for the new tab

    // Create new tab button
    const newTabButton = document.createElement('button');
    newTabButton.innerText = newTabName;
    newTabButton.className = 'tablinks';
    newTabButton.setAttribute('data-index', newTabIndex);
    newTabButton.setAttribute('data-name', newTabName);
    newTabButton.onclick = function(event) { openTab(event, `tab${newTabIndex}`, contentContainer); };

    // Insert before the "Add Tab" button if it exists
    const addButton = tabContainer.querySelector('.add-tab-button');
    tabContainer.insertBefore(newTabButton, addButton || null);

    // Create new tab content
    const newTabContent = document.createElement('div');
    newTabContent.id = `tab${newTabIndex}`;  // Use dynamic IDs for the tab content
    newTabContent.className = 'tab-content';
    newTabContent.innerHTML = `<h3>${newTabName}</h3><p>Content for ${newTabName}</p>`;

    // Append new content to content container
    contentContainer.appendChild(newTabContent);
    tabContainer.parentElement.length = newTabIndex;
    // Optionally, activate the new tab after creation
    openTab({ currentTarget: newTabButton }, `tab${newTabIndex}`, contentContainer);
}