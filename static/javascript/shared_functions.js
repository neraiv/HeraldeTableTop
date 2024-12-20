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

function compareWithDb(arr1, arr2) {
    const result = {
        updateStatus: false,
        missing: [], // Elements in arr2 but not in arr1
        removed: []  // Elements in arr1 but not in arr2
    };

    // Find elements in arr2 that are missing in arr1
    for (const elem of arr2) {
        if (!arr1.includes(elem)) {
            result.missing.push(elem);
            result.updateStatus = true; // Mark that there are missing elements
        }
    }

    // Find elements in arr1 that are not in arr2 and remove them
    for (let i = arr1.length - 1; i >= 0; i--) {
        if (!arr2.includes(arr1[i])) {
            result.removed.push(arr1[i]);
            result.updateStatus = true; // Mark that there are missing elements
        }
    }

    return result;
}

function keepValueInBetween(value, max, min){
    return Math.min(Math.max(parseFloat(value), min), max)
}


function createInputNumber(label, id, {maxValue=99, minValue=1, isReadOnly = false, addIncrementButtons = true, defaultValue = null}) {
    if(defaultValue){
        defaultValue = keepValueInBetween(defaultValue);
    }else {
        defaultValue = minValue;
    }

    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group');
    formGroup.classList.add('row');
    formGroup.classList.add('vertical');

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', label);
    labelElement.classList.add('label-element');
    labelElement.textContent = label;

    const inputElement = document.createElement('input');
    inputElement.type = 'number';
    inputElement.classList.add('input-element');
    inputElement.id = id;
    inputElement.name = label;
    inputElement.value = defaultValue; 
    inputElement.readOnly = isReadOnly;
    

    inputElement.onchange = () =>{
        keepValueInBetween(inputElement.value )
    }

    formGroup.appendChild(labelElement);
    addSpacer(formGroup);
    formGroup.appendChild(inputElement);

    formGroup.inputElement = inputElement;

    if(addIncrementButtons){
        const controls = document.createElement('div');
        controls.className = 'number-controls';
    
        const buttonUp = createImageButton(19, {icon: '&#9650;'});  
        buttonUp.classList.add('button-up')
        buttonUp.onclick = function(event){
            event.preventDefault();
            if(inputElement.value < maxValue){
                inputElement.value = parseInt(inputElement.value) + 1;
            }
        }
        const buttonDown = createImageButton(19, {icon: '&#9660;'});  
        buttonDown.classList.add('button-down')
        buttonDown.onclick = function(event){
            event.preventDefault();
            if(inputElement.value > minValue){
                inputElement.value = parseInt(inputElement.value) - 1;
            }
        }
    
        controls.appendChild(buttonUp);
        controls.appendChild(buttonDown);
        formGroup.appendChild(controls);
    }
   
    return formGroup
}

function createInputString(label, id, {
    defaultValue = "", 
    isReadOnly = false,
    isTextArea = false,
    maxRows = 10 // Maximum rows for a textarea (if isTextArea is true)
} = {}) {
    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group', 'row', 'centered');

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', id); // Associate label with input via id
    labelElement.classList.add('label-element');
    labelElement.textContent = label;
    labelElement.style.alignContent = 'center';
    labelElement.style.textAlign = 'center';

    let inputElement;

    if (isTextArea) {
        inputElement = document.createElement('textarea');
        inputElement.rows = 4;
        inputElement.cols = 50;
        inputElement.style.overflowY = 'auto'; // Enable vertical scrolling when necessary

        // Dynamically adjust rows based on content
        inputElement.addEventListener('input', function() {
            const scrollHeight = inputElement.scrollHeight;
            const rowHeight = 24; // Approximate height of one row in pixels
            const newRows = Math.min(Math.ceil(scrollHeight / rowHeight), maxRows);
            inputElement.rows = newRows; // Set rows based on content, up to the maximum
        });

    } else {
        inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.style.overflowX = 'auto'; // Enable horizontal scrolling if the text overflows
    }

    inputElement.classList.add('input-element');
    inputElement.id = id; // Set the id for the input
    inputElement.name = id; // Optionally set the name attribute as well

    // Convert the default value to a string, preventing [object Object]
    inputElement.value = defaultValue


    inputElement.readOnly = isReadOnly;
    

    // Append the label and input to the form group
    formGroup.appendChild(labelElement);
    addSpacer(formGroup); // Assuming addSpacer is a utility function you've defined
    formGroup.appendChild(inputElement);

    formGroup.inputElement = inputElement;

    return formGroup;
}

function createInputBoolean(label, id, defaultValue = false) {
    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group');
    formGroup.classList.add('row');
    
    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', id);
    labelElement.classList.add('label-element');
    labelElement.textContent = label;
    labelElement.style.alignContent = 'center';
    labelElement.style.textAlign = 'center';

    const inputElement = document.createElement('input');
    inputElement.type = 'checkbox';
    inputElement.classList.add('input-element');
    inputElement.id = id;
    inputElement.checked = defaultValue;

    formGroup.appendChild(labelElement);
    addSpacer(formGroup);
    formGroup.appendChild(inputElement);

    formGroup.inputElement = inputElement;

    return formGroup;
}

function createInputDice(label, id){
    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group');
    formGroup.classList.add('row');
    formGroup.classList.add('vertical');
    formGroup.style.gap = '10px';


    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', id);
    labelElement.classList.add('label-element');
    labelElement.textContent = label;
    formGroup.appendChild(labelElement);

    const inputElementDiceRollTimes = document.createElement('input');
    inputElementDiceRollTimes.type = 'number';
    inputElementDiceRollTimes.id = id;
    inputElementDiceRollTimes.value = 0;
    inputElementDiceRollTimes.style.height = "25px";
    inputElementDiceRollTimes.style.marginRight = "2px"
    formGroup.appendChild(inputElementDiceRollTimes);

    const labelD = document.createElement('label');

    labelD.textContent = 'd';
    formGroup.appendChild(labelD);

    const inputElementDice = document.createElement('input');
    inputElementDice.type = 'number';
    inputElementDice.id = id;
    inputElementDice.value = 0;
    inputElementDice.style.height = "25px";
    inputElementDice.style.marginLeft = "2px"
    formGroup.appendChild(inputElementDice);

    formGroup.inputElement = {
        dice: inputElementDice, 
        roll: inputElementDiceRollTimes
    };

    return formGroup
}

function getDiceValue(diceInputElement){
    return diceInputElement.roll.value + "d" +diceInputElement.dice.value;
}

function setDiceValue(diceInputElement, value){
    const values = value.split("d");

    if(values.length != 2){
        console.log("Invalid dice value. Dive value should be in the format 'roll' + 'd' + 'dice' (Example: 2d6)")
        return
    }

    diceInputElement.roll.value = values[0];
    diceInputElement.dice.value = values[1];
}

function createInputDamage(label, id){
    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group');
    formGroup.classList.add('row');
    formGroup.classList.add('vertical');
    formGroup.style.minHeight = '50px';

    const formColumn = document.createElement('div');
    formColumn.classList.add('column');
    formGroup.appendChild(formColumn)

    const damageRow = document.createElement('div');
    damageRow.classList.add('row');
    damageRow.classList.add('centered');
    formColumn.appendChild(damageRow)

    const numberInput = createInputNumber(label, id + "-number-input", {
        maxValue: 9999, 
        minValue: -9999, 
        addIncrementButtons : true, 
        defaultValue: 0
    });
    numberInput.style.backgroundColor = 'transparent';
    numberInput.style.width = "100%"
    numberInput.style.display = 'none';
    damageRow.appendChild(numberInput);
    
    const diceInput = createInputDice(label, id + '-dice-input');
    diceInput.style.backgroundColor = 'transparent';
    diceInput.style.width = "100%"
    damageRow.appendChild(diceInput)

    //Check box
    const checkboxRow = document.createElement('div'); // Create a container
    checkboxRow.classList.add('row');
    checkboxRow.classList.add('vertical');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id; // Assuming `id` is defined elsewhere
    checkbox.style.width = '15px';
    checkbox.style.height = '15px';
    checkboxRow.appendChild(checkbox); // Add the checkbox to the container

    const checkboxLabel = document.createElement('label');
    checkboxLabel.htmlFor = id+"-checkbox"; // Associate label with the checkbox
    checkboxLabel.textContent = "Raw"; // Set the label text
    checkboxRow.appendChild(checkboxLabel); // Add the label to the container
    formColumn.appendChild(checkboxRow)

    checkbox.addEventListener('change', event => {
        if (checkbox.checked) {
            numberInput.style.display = 'flex';
            diceInput.style.display = 'none';
            formGroup.value = numberInput.querySelector('.input-element').value
        } else {
            numberInput.style.display = 'none';
            diceInput.style.display = 'flex';
            formGroup.value = diceInput.value;
        }
    });

    formGroup.inputElement = {
        number: numberInput.inputElement,
        dice: diceInput.inputElement,
        isNumberInput: checkbox
    }

    return formGroup
}

function getDamageValue(damageInputElement){
    if(damageInputElement.isNumberInput.checked){
        return damageInputElement.number.value;
    }else{
        return getDiceValue(damageInputElement.dice);
    }
}

function setDamageValue(damageInputElement, value){
    if(isNaN(value)){
        setDiceValue(damageInputElement.dice, value);
        damageInputElement.isNumberInput.checked = false;

    }else{
        damageInputElement.number.value = value;
        damageInputElement.isNumberInput.checked = true;
    }
}

function createInputDuration(label = "Duration", id, {
    initalDuration = new Duration(durationTypes.TURN_BASED, 0),
    avaliableDurationTypes = durationTypes} = {}) {
    
    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group')
    formGroup.classList.add('row')
    formGroup.classList.add('centered');

    const durationSelector = createInputSelector(label, Object.values(avaliableDurationTypes), Object.keys(avaliableDurationTypes), {
        id:  id,
        defaultValue: [initalDuration.type],
    });
    durationSelector.style.backgroundColor = 'transparent';
    durationSelector.style.width = "100%"
    formGroup.appendChild(durationSelector);

    const durationValue = createInputNumber("Value: ", id+'-value', 50, 1, false, false)
    durationValue.style.backgroundColor = 'transparent';
    durationValue.style.width = "100%"
    durationValue.style.display = "none"
    formGroup.appendChild(durationValue);

    durationValue.querySelector('.input-element').value = initalDuration.value 

    durationSelector.querySelector('.input-element').onchange =  (event) => {     
        displayPart(event.target.value)
    }

    function displayPart(type){
        if(type == durationTypes.TURN_BASED){
            durationValue.style.display = "flex"
        }else{
            durationValue.style.display = "none"
        }
    }

    displayPart(initalDuration.type)

    formGroup.inputElement = {
        type: durationSelector.inputElement,
        value: durationValue.inputElement
    }

    return formGroup
}

function getDurationValue(durationInputElement){
    return new Duration(durationInputElement.type.value, durationInputElement.value.value)
}

function setDurationValue(durationInputElement, value){
    durationInputElement.type.value = value.type;
    durationInputElement.value.value = value.value;
}

function createInputSelector(label, valueList, textList, 
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
        onclick_func: multiple ? (custom_func ? custom_func: selectorChekmarkOptionFunction) : null}
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
        option.selected = false;
        if(defaultValue && (defaultValue.includes(option.value) || defaultValue.includes(parseInt(option.value)))){
            if(multiple) option.click();
            else option.selected = true;
        }
    }

    formGroup.inputElement = inputElement;

    return formGroup;
}

function selectorChekmarkOptionFunction(event) {  
    const option = event.target;

    // Add tick emoji if selected
    if (!option.textContent.includes('✓')) {
        option.textContent += ' ✓';
    } else {
        // Remove tick emoji if deselected
        option.textContent = option.textContent.replace(' ✓', '');
    }
        
}

function selectorGetOptionsWithCheckmark(selectElement) {
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

function selectorIndexedOptionFunctionWithTransparency(event) {
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
    } else {
        // Remove the index and recalculate other indexed elements
        option.textContent = option.textContent.split('-')[0].trim();
        option.style.backgroundColor = "unset";
        select.dataset.index = index - 1;

        // Recalculate indices for other options
        const orderedValues = getOrderedSelectedOptions(select);

        const options = Array.from(select.options);
        let currentIndex = 1;
        orderedValues.forEach(value => {
            const opt = options.find(opt => opt.value === value);
            if (opt) {
                opt.textContent = `${opt.textContent.split('-')[0].trim()} - ${currentIndex}`;
                currentIndex++;
            }
        });
    }
}

function selecterIndexedOptionFunction(event) {
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
    }else{
        // Remove the index and recalculate other indexed elements
        option.textContent = option.textContent.split('-')[0].trim();
        select.dataset.index = index - 1;

        // Recalculate indices for other options
        const orderedValues = getOrderedSelectedOptions(select);

        const options = Array.from(select.options);
        let currentIndex = 1;
        orderedValues.forEach(value => {
            const opt = options.find(opt => opt.value === value);
            if (opt) {
                opt.textContent = `${opt.textContent.split('-')[0].trim()} - ${currentIndex}`;
                currentIndex++;
            }
        });
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

function createInputSpellSelect(id, {initalLevel: level = null, initialSpellName = null, availableSpells = null}) {
    const itemId = id + '-spell-select-container';
    const spellSelectContainer = document.createElement('div');
    spellSelectContainer.id = itemId;
    spellSelectContainer.classList.add('form-group');
    spellSelectContainer.classList.add('row');
    spellSelectContainer.classList.add('vertical');

    let selectedSpellLevelList = 1;
    const spellLevelSelector = createInputSelector('Spell Level:', serverRules.spells.levels, serverRules.spells.levels, {
        nonSelectableDefault: 'select', 
        id: itemId + '-spell-level',
        defaultValue: level ? [level] : null});
    spellLevelSelector.style.width = "100%";
    spellLevelSelector.style.backgroundColor = 'transparent';

    const spellNameSelect = createInputSelector('Spell:', Object.keys(availableSpells[selectedSpellLevelList]), availableSpells[selectedSpellLevelList], {
        nonSelectableDefault: 'select', 
        id: itemId + '-spell-level',
        defaultValue: initialSpellName ? [initialSpellName] : null});
    spellNameSelect.style.width = "100%";
    spellNameSelect.style.backgroundColor = 'transparent';

    spellLevelSelector.inputElement.onchange = function(event){
        selectedSpellLevelList = event.target.value;
        spellSelectContainer.spellLevel = spellLevelSelector.inputElement.selectedOptions[0].value;
        updateSelector(availableSpells[selectedSpellLevelList], availableSpells[selectedSpellLevelList],spellNameSelect.inputElement, null, 'select');
    }

    spellNameSelect.inputElement.onchange = () => {
        spellSelectContainer.spellName = spellNameSelect.inputElement.selectedOptions[0].value;
    }

    spellSelectContainer.inputElement = {
        level: spellLevelSelector.inputElement,
        name: spellNameSelect.inputElement
    }

    spellSelectContainer.appendChild(spellLevelSelector);
    spellSelectContainer.appendChild(spellNameSelect);

    return spellSelectContainer;
}

function getSpellSelectValue(spellSelectContainer){
    return {
        level: spellSelectContainer.inputElement.level.value,
        name: spellSelectContainer.inputElement.name.value
    }
}

function setSpellSelectValue(spellSelectContainer, value){
    spellSelectContainer.inputElement.level.value = value.level;
    spellSelectContainer.inputElement.name.value = value.name;
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
        const img = document.createElement('div');
        img.style.width = `${fontSize-custom_padding}px`;
        img.style.height = `${fontSize-custom_padding}px`;
        img.style.backgroundImage = source;
        img.style.backgroundSize = 'cover';
        img.style.backgroundColor = 'transparent';
        img.style.backgroundPosition = 'center';
        img.style.backgroundRepeat = 'no-repeat';
        button.appendChild(img);
    } else if (icon) {
        // Use emoji or text icon; the font size controls the size
        button.innerHTML = icon;
    }
    button.draggable = false;
    return button;
}

function createStorageImageContainer(fileName, classNamePrefix, imageFolder, targetElement) {
    // Create image element
    if (document.getElementById(`storage-${fileName}`)) {
        return
    }

    // FUTURE UPDATE : GETS THE CHARACTER FROM FILE
    const sheetId = `${fileName}-character-sheet`;

    // Create a div to hold the image and buttons
    const imageAndButtonsContainer = document.createElement('div');
    imageAndButtonsContainer.id = `drive-${fileName}`
    imageAndButtonsContainer.className = 'drive-image-container';
    imageAndButtonsContainer.style.backgroundColor = genareteRandomColor();

    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';
    targetElement.appendChild(imgContainer);

    const img = document.createElement('img');
    let imgPrefix;
    if(classNamePrefix == 'background'){
        imgPrefix = listBackgroundFiles[fileName].LIGHT_FILES[0];
    }else if(classNamePrefix == "character"){
        imgPrefix = "char.jpg"
    }

    img.src = `${imageFolder}/${fileName}/${imgPrefix}`;
    img.className = `drive-${classNamePrefix}-image`;
    img.id = fileName;
    img.dataset.filename = fileName;
    img.draggable = true;

    // img.addEventListener('load', function() {
    //     // Set image size based on scaling factor and preserve aspect ratio
    //     const scalingFactor = getScalingFactor(targetElement, 80);
    //     setImageSize(img, scalingFactor.widthFactor, scalingFactor.heightFactor);
    // });

    img.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.filename);
        event.dataTransfer.effectAllowed = 'move';
    });

    // Append image to the container
    imgContainer.appendChild(img)
    imageAndButtonsContainer.appendChild(imgContainer);

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.style.width = '40%';

    const buttonContainerRow1 = document.createElement('div');
    buttonContainerRow1.className = "row"

    const buttonContainerRow2 = document.createElement('div');
    buttonContainerRow2.className = "row"

    // Create and append buttons with icons
    if(classNamePrefix == 'character'){
        const exportButton = createImageButton(34, {icon: '⬇️'});
        exportButton.onclick = () => export_CharacterSheet(sheetId);
        buttonContainerRow1.appendChild(exportButton);

        const characterSheetButton = createImageButton(34, {source:`${uiSettings.folderMenuIcons+"/"+uiSettings.icon_characterSheet}`});
        characterSheetButton.onclick = () => toggleDisplay_SheetWithId(sheetId, true);
        buttonContainerRow1.appendChild(characterSheetButton);

        const importButton = createImageButton(34, {icon: '⬆️'});
        importButton.onclick = (event) => {
            const buttonDict = {
                "Enemy": true,
                "Ally": true,
                "NPC": true,
            }
            const dropDownFactionChange = createDropdownMenu(userInterface, buttonDict)
            dropDownFactionChange.style.display = 'block';
            dropDownFactionChange.style.top = `${event.clientY}px`;
            dropDownFactionChange.style.left = `${event.clientX}px`;
            
            for(let i = 0; i < Object.values(buttonDict).length; i++){
                const button = dropDownFactionChange.querySelector('.index-'+i)
                button.onclick = () => {
                    dropDownFactionChange.remove();
                    changeCharacterFaction('token-character-'+img.id);
                }
            }
        };
        buttonContainerRow2.appendChild(importButton);

        const removeButton = createImageButton(34, {icon: '❌'});
        removeButton.onclick = () => imageAndButtonsContainer.remove();
        buttonContainerRow2.appendChild(removeButton);

        buttonContainer.appendChild(buttonContainerRow1);
        buttonContainer.appendChild(buttonContainerRow2);

        addCharacterSheet(imageAndButtonsContainer, sheetId);

    }else if(classNamePrefix == 'background'){
        const exportButton = createImageButton(34, {icon: '⬇️'});
        exportButton.onclick = () => export_BackgroundSheet(`${imageAndButtonsContainer.id}-background-sheet`);
        buttonContainerRow1.appendChild(exportButton);

        const backgroundSheetButton = createImageButton(34, {icon: '📄'});
        backgroundSheetButton.onclick = () => toggleDisplay_SheetWithId(sheetId, true);
        buttonContainerRow1.appendChild(backgroundSheetButton);

        const importButton = createImageButton(34, {icon: '⬆️'});
        importButton.onclick = () => import_BackgroundSheet(`${imageAndButtonsContainer.id}-background-sheet`);
        buttonContainerRow2.appendChild(importButton);

        const removeButton = createImageButton(34, {icon: '❌'});
        removeButton.onclick = () => imageAndButtonsContainer.remove();
        buttonContainerRow2.appendChild(removeButton);

        buttonContainer.appendChild(buttonContainerRow1);
        buttonContainer.appendChild(buttonContainerRow2);
    }

    const containerBackgroundColorChange = createImageButton(24, {source: `${uiSettings.folderMenuIcons+"/"+uiSettings.icon_rainbowDice}`});
    containerBackgroundColorChange.style.position = 'absolute';
    containerBackgroundColorChange.style.top = '2px';
    containerBackgroundColorChange.style.left = '2px';
    containerBackgroundColorChange.onclick = () => {
        imageAndButtonsContainer.style.backgroundColor = genareteRandomColor();
    };

    // Append button container to the main container
    imageAndButtonsContainer.appendChild(containerBackgroundColorChange);
    imageAndButtonsContainer.appendChild(buttonContainer);
    
    // Append the main container to the target element
    targetElement.appendChild(imageAndButtonsContainer);
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

function toggleDisplay_Sheet({id, page}, open= null, ) {
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


function createDropdownMenu(buttonsDict) {
    // searc querySelector('.index-0')
    // Create dropdown menu container
    const dropdownMenu = document.createElement('div');
    dropdownMenu.classList.add('dropdown-menu');
    dropdownMenu.classList.add('column')
    dropdownMenu.classList.add('vertical')

    Object.entries(buttonsDict).forEach(([key, value]) => {
        const button = document.createElement('div');
        button.textContent = key;
        button.classList.add('dropdown-menu-button');
        if (value === false) {
            button.style.display = 'none'; // Hide if value is false
        }
        dropdownMenu.appendChild(button);
    });

    const closeButton = document.createElement('div');
    closeButton.textContent = 'close';
    closeButton.classList.add('dropdown-menu-close-button');
    closeButton.classList.add('close-button')
    closeButton.onclick = () => {
        dropdownMenu.style.display = 'none';
    };
    dropdownMenu.appendChild(closeButton);

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
        // Define the event listener function
        function handleClick() {
            defaultOption.disabled = true;
            
            // Remove the event listener after it has run
            selector.removeEventListener('click', handleClick);
        }

        // Add the event listener
        selector.addEventListener('click', handleClick);
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
    return draggableRow
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
    tabbedWindowContainer.classList.add("tabbed-window")

    const tabContainer = document.createElement('div');
    tabContainer.classList.add('tab-container');
    tabContainer.id = id ? `${id}-tab-container` : 'default-tab-container'; // Fallback ID if none is provided


    const contentContainer = document.createElement('div');
    contentContainer.classList.add('tab-content-container'); // Added a class for the content container
    // Append the tab and content containers to the tabbed window container
    tabbedWindowContainer.appendChild(tabContainer);
    tabbedWindowContainer.appendChild(contentContainer);

    // Create tabs
    if(parseInt(tabCount)>0){
        createTabs(tabContainer, contentContainer, tabCount, tabNames, id, tabMainName);
    }

    // If growable, add an "Add Tab" button/icon at the end
    if (isGrowable) {
        const addTabButton = document.createElement('button');
        addTabButton.className = 'add-tab-button';
        addTabButton.innerText = '+';  // Or set as an icon
        addTabButton.onclick = () => addNewTab(tabbedWindowContainer, null, tabMainName);
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
function getContentContainer(tabbedWindowContainer, identifier) {
    const tabContainer = tabbedWindowContainer.querySelector('.tab-container')

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

        return contentContainer.querySelector(`#tab${tabIndex}`); // Search only within the content container
    } else {
        console.error("Tab not found with the given identifier:", identifier);
        return null;
    }
}


function addNewTab(tabbedWindowContainer, name, tabMainName= 'Tab') {
    const tabContainer = tabbedWindowContainer.querySelector('.tab-container')
    const contentContainer = tabbedWindowContainer.querySelector('.tab-content-container')

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

    // Dispatch custom event
    const event = new CustomEvent('onNewTabAdded', {
        detail: {
            tabName: newTabName,
            tabIndex: newTabIndex,
        },
    });

    tabbedWindowContainer.dispatchEvent(event);

    // Optionally, activate the new tab after creation
    openTab({ currentTarget: newTabButton }, `tab${newTabIndex}`, contentContainer);

    return newTabContent;
}

function changeVisibiltyOfTab(tabbedWindowContainer, identifier, state) {
    const tabContainer = tabbedWindowContainer.querySelector('.tab-container')

    let tabButton;

    // If the identifier is a number, treat it as an index
    if (typeof identifier === 'number') {
        tabButton = tabContainer.querySelector(`[data-index="${identifier}"]`);
    } 
    // If the identifier is a string, treat it as a tab name
    else if (typeof identifier === 'string') {
        tabButton = tabContainer.querySelector(`[data-name="${identifier}"]`);
    }

    if (tabButton) {
        const tabIndex = tabButton.getAttribute('data-index');

        if(state == false){
            if(tabButton.classList.contains('active')){
                const nextTabButton = tabContainer.querySelector(`[data-index="${parseInt(tabIndex)+1}"]`)
                if(nextTabButton){
                    nextTabButton.click()
                    tabButton.style.display = 'none';
                }
            }
            tabButton.style.display = 'none';
        }
        if(state == true){
            tabButton.style.display = 'block';
        }

    } else {
        console.error("Tab not found with the given identifier:", identifier);
        return null;
    }
}

function activateTab(tabbedWindowContainer, identifier) {
    const tabContainer = tabbedWindowContainer.querySelector('.tab-container')

    let tabButton;

    // If the identifier is a number, treat it as an index
    if (typeof identifier === 'number') {
        tabButton = tabContainer.querySelector(`[data-index="${identifier}"]`);
    } 
    // If the identifier is a string, treat it as a tab name
    else if (typeof identifier === 'string') {
        tabButton = tabContainer.querySelector(`[data-name="${identifier}"]`);
    }

    if (tabButton) {
        tabButton.getAttribute('data-index');

        tabButton.click();
    } else {
        console.error("Tab not found with the given identifier:", identifier);
        return null;
    }
}