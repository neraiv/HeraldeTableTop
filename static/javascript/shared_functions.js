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

function calcButtonsAroundLocation(buttonSize, radius, angle){
    const finalX = (radius * 2) * Math.cos((angle * Math.PI) / 180) + radius - buttonSize / 2;
    const finalY = -(radius * 2) * Math.sin((angle * Math.PI) / 180) + radius - buttonSize / 2;
    return {finalX, finalY}
}

function dictFindValueName(dict, value) {
    for (const key in dict) {
        if (dict[key] == value) {
            return key;
        }
    }
    return null; // Return null if the value is not found
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

function userWarn(description) {
    const warnPopup = document.createElement('div');
    warnPopup.className = "warn-popup show"
    warnPopup.style.zIndex = "9998";
    warnPopup.textContent = description;
    userInterface.appendChild(warnPopup);

    // Auto-hide after 3 seconds
    setTimeout(() => {
        warnPopup.classList.remove("show");
    }, 3000);
}

function userAskQuestion(title, question, {
    buttons = ['Ok'], 
    callback = null, 
    inputPlaceholder = null, 
    inputType = null,
    defaultValue = null,
    blocking = false,
} = {}) {
    return new Promise((resolve) => {
        // Create the overlay if blocking is true
        let overlay;
        if (blocking) {
            overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '9998';
            document.body.appendChild(overlay);
        }

        // Create the container
        const container = document.createElement('div');
        container.className = 'ask-question-container row centered';
        container.classList.add('box-circular-border')
        container.style.zIndex = '9999'; // Ensure it is above the overlay

        const topRow = addWinwowTopBar(container);
        container.appendChild(topRow);

        // Create the title
        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        topRow.appendChild(titleElement);

        // Create the question
        const questionElement = document.createElement('p');
        questionElement.textContent = question;
        container.appendChild(questionElement);

        // Create the input if needed
        let inputElement = undefined;
        if (inputType) {
            inputElement = document.createElement('textarea');
            inputElement.placeholder = inputPlaceholder;
            inputElement.type = inputType;
            inputElement.value = defaultValue;
            container.appendChild(inputElement);
        }

        // Create the buttons
        buttons.forEach(buttonText => {
            const button = document.createElement('button');
            button.textContent = buttonText;
            button.onclick = () => {
                if (callback) {
                    callback(buttonText);
                }
                document.body.removeChild(container);
                if (overlay) {
                    document.body.removeChild(overlay);
                }
                resolve({ elem: container, value: inputElement ? inputElement.value : null, buttonText: buttonText});
            };
            container.appendChild(button);
        });

        // Append the container to the body
        document.body.appendChild(container);

        // If not blocking, resolve immediately
        if (!blocking) {
            resolve({ elem: container, value: null });
        }
    });
}


function keepValueInBetween(value, max, min){
    return Math.min(Math.max(parseFloat(value), min), max)
}

function createInputNumber(label, id, {maxValue=99, minValue=1, isReadOnly = false, addIncrementButtons = true, defaultValue = null}) {
    
    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group');
    formGroup.classList.add('row');
    formGroup.classList.add('vertical');

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', label);
    labelElement.classList.add('label-element');
    labelElement.textContent = label;
    formGroup.appendChild(labelElement);

    addSpacer(formGroup);

    const inputElementsHolder = document.createElement('div');
    inputElementsHolder.classList.add('row');
    inputElementsHolder.style.width = "60%"
    formGroup.appendChild(inputElementsHolder);
    
    const inputElement = document.createElement('input');
    inputElement.type = 'number';
    inputElement.classList.add('input-element');
    inputElement.style.width = "100%";
    inputElement.id = id;
    inputElement.name = label;
    inputElement.value = parseFloat(defaultValue ? defaultValue : minValue); 
    inputElement.readOnly = isReadOnly;
    inputElementsHolder.appendChild(inputElement)
    
    inputElement.onchange = () =>{
        keepValueInBetween(inputElement.value, maxValue, minValue)
    }

    if(addIncrementButtons){
        const controls = document.createElement('div');
        controls.className = 'number-controls';
    
        const buttonUp = createImageButton(18, {icon: '&#9650;'});  
        buttonUp.classList.add('button-up')
        buttonUp.onclick = function(event){
            event.preventDefault();
            if(inputElement.value < maxValue){
                inputElement.value = parseFloat(inputElement.value) + 1;
            }
        }
        const buttonDown = createImageButton(18, {icon: '&#9660;'});  
        buttonDown.classList.add('button-down')
        buttonDown.onclick = function(event){
            event.preventDefault();
            if(inputElement.value > minValue){
                inputElement.value = parseFloat(inputElement.value) - 1;
            }
        }
    
        controls.appendChild(buttonUp);
        controls.appendChild(buttonDown);
        inputElementsHolder.appendChild(controls);
    }

    formGroup.getValue = function() {
        // Return the current value of the input element
        return inputElement.value;
    }

    formGroup.setValue = function(value) {
        // Set the value of the input element
        if (value) {
            inputElement.value = keepValueInBetween(parseFloat(value), maxValue, minValue); ;
        } else {
            inputElement.value = minValue;
        }
    }

    formGroup.setValue(defaultValue)
    return formGroup
}

function createInputModifier(label, id, dict, {
    defaultValue = null
}){
    const formModifierStat = document.createElement('div');
    formModifierStat.classList.add('form-group')
    formModifierStat.classList.add('column')
    formModifierStat.classList.add('centered');
    formModifierStat.classList.add("box-circular-border")
    formModifierStat.style.gap = "1rem"
    formModifierStat.value = {}

    const formModifierStatLabel = document.createElement('label');
    formModifierStatLabel.setAttribute('for', id); // Associate label with input via id
    formModifierStatLabel.classList.add('label-element');
    formModifierStatLabel.textContent = label;
    formModifierStatLabel.style.alignContent = 'center';
    formModifierStatLabel.style.textAlign = 'center';
    formModifierStat.appendChild(formModifierStatLabel);

    const formModifierStatList = document.createElement('div');
    formModifierStatList.className = 'box-circular-border form-group';
    formModifierStatList.style.width = "98%"
    formModifierStatList.style.gap = '10px';
    formModifierStatList.style.flexWrap = "wrap";
    formModifierStatList.style.display = "flex"
    formModifierStatList.style.backgroundColor = formColor
    formModifierStat.appendChild(formModifierStatList);

    addSpacer(formModifierStat, {line: true, line_width: "60%"})

    const formModifierStatAddSelection = createInputSelector("Modifier:", Object.values(dict), Object.keys(dict))
    formModifierStatAddSelection.classList.add("box-circular-border")
    formModifierStat.appendChild(formModifierStatAddSelection)

    const formModifierValue =  createInputNumber("Multiplier:", id+"-multiplier", {
        maxValue: 9999,
        minValue: 0,
        defaultValue: 1,
    })
    formModifierValue.classList.add("box-circular-border")
    formModifierStat.appendChild(formModifierValue)

    const formModifierStatListButtons = document.createElement("div")
    formModifierStatListButtons.classList.add('row', 'centered');
    formModifierStatListButtons.style.width = '60%';
    formModifierStatListButtons.style.gap = '10px';
    formModifierStat.appendChild(formModifierStatListButtons);

    function createModifierListElement(modfier_type, modifer_multiplier) {
        // Future additnal effect create bağlanacak
        const listElement = document.createElement('div');
        listElement.classList.add("list-item")
        listElement.classList.add('box-circular-border');
        listElement.classList.add('row');
        listElement.classList.add('centered');
        listElement.style.backgroundColor = formColor
        listElement.style.gap = '0.5rem';
        
        const labelElement = document.createElement('label');
        labelElement.style.textAlign = 'center';
        labelElement.style.fontSize = '14px';
        labelElement.style.paddingLeft = '5px';
        labelElement.textContent = `${modfier_type} x ${modifer_multiplier}`;
        listElement.appendChild(labelElement)

        addSpacer(listElement);

        const removeButton = createImageButton('26', {source: `url(static/images/menu-icons/close.png)`, custom_padding: 3, toolTip: "Remove"});
        listElement.appendChild(removeButton);
        removeButton.onclick = () => {
            listElement.remove()
            delete formModifierStat.value[modfier_type]    
        }

        return listElement;
    }

    function populate(element){
        const type = dictFindValueName(dict, element.type)
        if (type == null) return;
        else if (type in formModifierStat.value){
            userWarn("This modifier already added!")
            return
        }

        const newRow = createModifierListElement(type, element.multiplier)
        formModifierStatList.appendChild(newRow);
        formModifierStat.value[type] = formModifierValue.getValue()
    }

    if(defaultValue != null) {
        for(let element of defaultValue) {
            populate(element)
        }
    }

    const buttonAdd = document.createElement('button');
    buttonAdd.textContent = 'Add Modifier';
    buttonAdd.classList.add('button-add');
    buttonAdd.onclick = function(event) {
        event.preventDefault();
        if (parseFloat(formModifierValue.getValue()) > 0){
            populate({type: formModifierStatAddSelection.getValue(), multiplier: formModifierValue.getValue()})        
        }else{
            userWarn("Please select multiplier value greater than 0!")
        }
    };
    formModifierStatListButtons.appendChild(buttonAdd);

    formModifierStat.getValue = function() {
        // Return a copy of the current value object
        return {...formModifierStat.value};
    };

    formModifierStat.setValue = function(value) {
        // Set the value of the input element
        if (value) {
            formModifierStat.value = value;
            formModifierStatList.innerHTML = ""; // Clear the existing list

            for(let element in value) {
                const newRow = createModifierListElement(element.type, element.multipler)
                formModifierStatList.appendChild(newRow);
            }
        } else {
            formModifierStat.value = {};
            formModifierStatList.innerHTML = ""; // Clear the existing list
        }
    }

    return formModifierStat
}

function createInputString(label, id, {
    defaultValue = "", 
    isReadOnly = false,
    isTextArea = false,
    placeholder = null,
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

    if (placeholder) {
        inputElement.placeholder = placeholder;
    }
    
    // Append the label and input to the form group
    formGroup.appendChild(labelElement);
    addSpacer(formGroup); // Assuming addSpacer is a utility function you've defined
    formGroup.appendChild(inputElement);

    formGroup.getValue = function() {
        // Return the current value of the input element
        return inputElement.value;
    }

    formGroup.setValue = function(value) {
        // Set the value of the input element
        if (value) {
            inputElement.value = value;
        } else {
            inputElement.value = defaultValue;
        }
    }

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

    formGroup.getValue = function() {
        // Return the current value of the checkbox
        return inputElement.checked;
    }

    formGroup.setValue = function(value) {
        // Set the value of the checkbox
        if (value !== undefined) {
            inputElement.checked = value;
        } else {
            inputElement.checked = defaultValue;
        }
    }

    return formGroup;
}

function createInputDice(label, id, {
    defaultValue = null
}){
    if(defaultValue == null){
        defaultValue = "0d0"
    }   
    
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

    addSpacer(formGroup)

    const inputElementsHolder = document.createElement('div');
    inputElementsHolder.classList.add('row');
    inputElementsHolder.classList.add('centered');
    inputElementsHolder.style.width = "60%"
    formGroup.appendChild(inputElementsHolder);

    const inputElementDiceRollTimes = document.createElement('input');
    inputElementDiceRollTimes.classList.add('input-element');
    inputElementDiceRollTimes.type = 'number';
    inputElementDiceRollTimes.id = id;
    inputElementDiceRollTimes.value = defaultValue.split('d')[0];
    inputElementDiceRollTimes.style.width = "100%"
    inputElementsHolder.appendChild(inputElementDiceRollTimes);

    const labelD = document.createElement('label');
    labelD.textContent = 'd';
    labelD.style.marginInline = '5px';
    inputElementsHolder.appendChild(labelD);

    const inputElementDice = document.createElement('input');
    inputElementDice.classList.add('input-element');
    inputElementDice.type = 'number';
    inputElementDice.id = id;
    inputElementDice.value = defaultValue.split('d')[1];
    inputElementDice.style.width = "100%"
    inputElementsHolder.appendChild(inputElementDice);


    formGroup.getValue = function() {
        // Return the current value of the input element
        return inputElementDiceRollTimes.value + "d" + inputElementDice.value;
    }

    formGroup.setValue = function(value) {
        // Set the value of the input element
        if (value) {
            const values = value.split('d');
            inputElementDiceRollTimes.value = values[0];
            inputElementDice.value = values[1];
        } else {
            inputElementDiceRollTimes.value = "0";
            inputElementDice.value = "0";
        }
    }

    return formGroup
}

function createInputDamage(label, id, {
    defaultValue = null,
}){
    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group');
    formGroup.classList.add('column');
    formGroup.classList.add('vertical');

    const isIntialDamageRaw = defaultValue ? (!defaultValue.includes("d")) : false

    if(defaultValue == null){
        isIntialDamageRaw = false
        defaultValue = "0d0"
    }

    const formRawDamageInput = createInputNumber(label, id + "-number-input", {
        maxValue: 9999, 
        minValue: 0, 
        addIncrementButtons : true, 
        defaultValue: isIntialDamageRaw ? defaultValue : null
    });
    formRawDamageInput.classList.remove('form-group');
    formRawDamageInput.style.width = "100%"
    formRawDamageInput.style.display = 'none';
    formGroup.appendChild(formRawDamageInput);
    
    const diceInput = createInputDice(label, id + '-dice-input', {
        defaultValue : isIntialDamageRaw ? null : defaultValue
    });
    diceInput.classList.remove('form-group');
    diceInput.style.width = "100%"
    formGroup.appendChild(diceInput)

    //Check box
    const checkboxRow = document.createElement('div'); // Create a container
    checkboxRow.classList.add('row');
    checkboxRow.classList.add('vertical');

    const formRawCheckbox = document.createElement('input');
    formRawCheckbox.type = 'checkbox';
    formRawCheckbox.id = id; // Assuming `id` is defined elsewhere
    formRawCheckbox.style.width = '15px';
    formRawCheckbox.style.height = '15px';
    checkboxRow.appendChild(formRawCheckbox); // Add the checkbox to the container

    const checkboxLabel = document.createElement('label');
    checkboxLabel.htmlFor = id+"-checkbox"; // Associate label with the checkbox
    checkboxLabel.textContent = "Raw"; // Set the label text
    checkboxRow.appendChild(checkboxLabel); // Add the label to the container
    formGroup.appendChild(checkboxRow)

    formRawCheckbox.addEventListener('change', event => {
        if (formRawCheckbox.checked) {
            formRawDamageInput.style.display = 'flex';
            diceInput.style.display = 'none';
            formGroup.value = formRawDamageInput.querySelector('.input-element').value
        } else {
            formRawDamageInput.style.display = 'none';
            diceInput.style.display = 'flex';
            formGroup.value = diceInput.value;
        }
    });

    formGroup.getValue = function() {
        // Return the current value of the input element
        if (formRawCheckbox.checked) {
            return formRawDamageInput.getValue();
        }else{
            return diceInput.getValue();
        }
    }

    formGroup.setValue = function(value) {
        // Set the value of the input element
        if (value) {
            if (value.includes("d")) {
                diceInput.setValue(value);
            } else {
                formRawDamageInput.setValue(value);
                formRawCheckbox.checked = true;
                formRawCheckbox.dispatchEvent(new Event('change')); // Trigger the change event to show the correct input
            }
        } else {
            formRawDamageInput.setValue(0);
            diceInput.setValue("0d0");
        }
    }

    if (isIntialDamageRaw) {
        formRawCheckbox.checked = true;
        formRawCheckbox.dispatchEvent(new Event('change')); // Trigger the change event to show the correct input
    }
    return formGroup
}

function createInputSelector(label, valueList, textList, 
    {
    nonSelectableDefault,
    id,
    disable_filter,
    multiple,
    isReadOnly,
    custom_func = selectorChekmarkOptionFunction,
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
        onclick_func: multiple ? custom_func : null}
    );
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
        option.style.minHeight = "18px"
        if(defaultValue && (defaultValue.includes(option.value) || defaultValue.includes(parseInt(option.value)))){
            if(multiple) option.click();
            else option.selected = true;
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

    formGroup.selectElement = inputElement;

    formGroup.getValue = function() {
        // Return the current value of the input element
        if(inputElement.multiple ){
            if (custom_func == selectorChekmarkOptionFunction){
                return selectorGetOptionsWithCheckmark(inputElement);
            }else if (custom_func == selectorIndexedOptionFunctionWithTransparency || custom_func == selecterIndexedOptionFunction){
                return getOrderedSelectedOptions(inputElement);
            }
        }else{
            return inputElement.value;
        }
    }

    formGroup.setValue = function(value) {
        // Set the value of the input element
        if (value) {
            if (inputElement.multiple ) {
                for(let option of inputElement.options){
                    option.selected = false;
                    if(value.includes(option.value)){
                        option.click()
                    }
                }
            }else{
                inputElement.value = value;
            }
        } 
    }

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
//----------------------------- Duration Input Element -------------------------------------------

function createInputDuration(label = "Duration", id, {
    defaultValue = new Duration({type: durationTypes.TURN, value: 1}),
    avaliableDurationTypes = durationTypes} = {}) {
    
    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group')
    formGroup.classList.add('column')
    formGroup.classList.add('centered');
    formGroup.classList.add("box-circular-border")
    formGroup.style.gap = "1rem"
    

    const durationSelector = createInputSelector(label, Object.values(avaliableDurationTypes), Object.keys(avaliableDurationTypes), {
        defaultValue: [defaultValue.type]
    })
    durationSelector.classList.remove('form-group')
    durationSelector.style.width = "100%"
    formGroup.appendChild(durationSelector)
    
    durationSelector.selectElement.onchange =  (event) => {     
        displayPart(event.target.value)
    }

    const durationValue = createInputNumber("Value: ", id+'-value', {
        maxValue: 10,
        minValue: 1,
        addIncrementButtons: true
    })

    durationValue.style.backgroundColor = 'transparent';
    durationValue.style.display = "flex"
    durationValue.classList.remove("form-group")
    durationValue.style.width = "100%"
    formGroup.appendChild(durationValue);

    durationValue.querySelector('.input-element').value = defaultValue.value 

    function displayPart(type){
        if(type == durationTypes.TURN || type == durationTypes.NEXT_NTH_CAST){
            durationValue.style.display = "flex"
        }else{
            durationValue.style.display = "none"
        }
    }

    displayPart(defaultValue.type)

    formGroup.getValue = function() {
        // Return the current value of the input element
        return new Duration({type: durationSelector.getValue(), value: durationValue.getValue()})
    }

    formGroup.setValue = function(value) {
        // Set the value of the input element
        if (value) {
            durationSelector.setValue(value.type);
            durationValue.setValue(value.value);
        } else {
            durationSelector.setValue(durationTypes.TURN);
            durationValue.setValue(1);
        }
    }

    return formGroup
}
//------------------------------------------------------------------------------------------------

function createInputSpellSelect(id, {initalLevel: level = null, initialSpellName = null, availableSpells = null}) {
    const itemId = id + '-spell-select-container';
    const spellSelectContainer = document.createElement('div');
    spellSelectContainer.id = itemId;
    spellSelectContainer.classList.add('form-group');
    spellSelectContainer.classList.add('row');
    spellSelectContainer.classList.add('vertical');

    let selectedSpellLevelList = 1;

    const spellLevelSelector = createInputSelector('Spell Level:', Object.keys(database.spells), Object.keys(database.spells), {
        nonSelectableDefault: 'select', 
        id: itemId + '-spell-level',
        defaultValue: level ? [level] : null});
    spellSelectContainer.appendChild(spellLevelSelector);

    const spellNameSelect = createInputSelector('Spell:', Object.keys(database.spells[selectedSpellLevelList]), database.spells[selectedSpellLevelList], {
        nonSelectableDefault: 'select', 
        id: itemId + '-spell-level',
        defaultValue: initialSpellName ? [initialSpellName] : null});
    spellSelectContainer.appendChild(spellNameSelect);

    const spellSelectedButtonsContainer = document.createElement("div")
    spellSelectedButtonsContainer.classList.add("column")
    spellSelectedButtonsContainer.classList.add("centered")
    spellSelectedButtonsContainer.style.gap = "5px"
    spellSelectContainer.appendChild(spellSelectedButtonsContainer)

    const spellEditButton = createImageButton(20, {source: `url(static/images/menu-icons/edit.png)`, custom_padding: 3});
    spellSelectedButtonsContainer.appendChild(spellEditButton)
    spellEditButton.onclick = () => {
        if(spellLevelSelector.selectElement.selectedOptions[0].value && spellNameSelect.selectElement.selectedOptions[0].value){
            displaySpellCreate(database.spells[spellLevelSelector.selectElement.selectedOptions[0].value][spellNameSelect.selectElement.selectedOptions[0].value])
        }else {
            userWarn("Please select a Spell first by selecting level then spell name!")
        }
    }
    
    const spellInfoButton = createImageButton(20, {icon: "settings", custom_padding: 1})
    spellInfoButton.style.fontFamily = 'Material Icons Outlined'
    spellSelectedButtonsContainer.appendChild(spellInfoButton)
    spellInfoButton.onclick = () => {
        if(spellLevelSelector.selectElement.selectedOptions[0].value && spellNameSelect.selectElement.selectedOptions[0].value){
            displaySpellDescription(database.spells[spellLevelSelector.selectElement.selectedOptions[0].value][spellNameSelect.selectElement.selectedOptions[0].value])
        }else {
            userWarn("Please select a Spell first by selecting level then spell name!")
        }
    }

    spellLevelSelector.selectElement.onchange = function(event){
        selectedSpellLevelList = event.target.value;
        spellSelectContainer.spellLevel = spellLevelSelector.selectElement.selectedOptions[0].value;
        updateSelector(Object.keys(database.spells[selectedSpellLevelList]), database.spells[selectedSpellLevelList], spellNameSelect.selectElement, null, 'select');
    }

    spellNameSelect.selectElement.onchange = () => {
        spellSelectContainer.spellName = spellNameSelect.selectElement.selectedOptions[0].value;
    }

    spellSelectContainer.getValue = function() {
        // Return the current value of the input element
        return {
            mana: spellLevelSelector.getValue(),
            spellName: spellNameSelect.getValue(),
        }
    }

    spellSelectContainer.setValue = function(value) {
        // Set the value of the input element
        if (value) {
            spellLevelSelector.setValue(value.mana);
            spellNameSelect.setValue(value.spellName);
        } else {
            spellLevelSelector.setValue(null);
            spellNameSelect.setValue(null);
        }
    }

    return spellSelectContainer;
}

function createImageButton(fontSize, {icon=null, source=null, custom_padding = 8, toolTip=null}) {
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
    if (toolTip){
        button.title = toolTip;
    }
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

function addSpacer(parentElement, { line = false , line_width = "60%", line_height = "60%"} = {}) {
    const spacer = document.createElement('div');
    spacer.className = 'spacer';
    if (line) {
        spacer.style.border = '2px dashed black';
        spacer.style.width = line_width;
        spacer.style.height = line_height;
    }
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

function createCloseButton(id, parent){
    const closeButton = createImageButton('28', {source: "url(static/images/menu-icons/close.png)", custom_padding: 4});
    closeButton.id = id
    closeButton.style.marginRight = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
        parent.remove();
    };

    return closeButton;
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

function makeDraggable(parent){
    parent.onmousedown = function (event) {
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
}
function addWinwowTopBar(parent){
    const draggableRow = document.createElement('div');
    draggableRow.classList.add('window-top-bar');

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


// *****************************************************************************************************
// *****************************************************************************************************
// *****************************************************************************************************
// ********************************** TAB Containers ***************************************************
// *****************************************************************************************************
// *****************************************************************************************************
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

    for (let i = 0; i < tabCount; i++) {
        // Create tab button
        const tabName = tabNames ? tabNames[i] : `${tabMainName} ${i}`;
        const tabButton = document.createElement('button');
        tabButton.innerText = tabName;
        tabButton.className = 'tablinks';
        tabButton.dataset.index = i
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
    const tabContainer = tabbedWindowContainer.querySelector('.tab-container');
    const contentContainer = tabbedWindowContainer.querySelector('.tab-content-container'); // Corrected line

    let tabButton;

    if (identifier === undefined) {
        const tabButtons = tabContainer.getElementsByClassName('tablinks');
        tabButton = tabButtons[tabButtons.length - 1];
    } else {
        tabButton = tabContainer.querySelector(`[data-index="${String(identifier)}"]`);
    } 

    if (tabButton) {
        const tabIndex = tabButton.getAttribute('data-index');
        return contentContainer.querySelector(`#tab${tabIndex}`);
    } else {
        console.error("Tab not found with the given identifier:", identifier, typeof identifier);
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

function changeVisibiltyOfTab(tabbedWindowContainer, index, state) {
    const tabContainer = tabbedWindowContainer.querySelector('.tab-container')

    const tabButton = tabContainer.querySelector(`[data-index="${index}"]`);
    
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
        console.error("Tab not found with the given identifier:", index);
        return null;
    }
}

function activateTab(tabbedWindowContainer, identifier) {
    const tabContainer = tabbedWindowContainer.querySelector('.tab-container')

    const tabButton = tabContainer.querySelector(`[data-index="${String(identifier)}"]`);
    

    if (tabButton) {
        tabButton.click();
    } else {
        console.error("Tab not found with the given identifier:", identifier);
        return null;
    }
}



