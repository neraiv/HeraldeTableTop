// Function to parse and roll dice based on the roll list

function createNumberInput(label, isReadOnly, returnElements = false){
    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group');
    formGroup.classList.add('row');
    formGroup.classList.add('vertical');

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', label);
    labelElement.textContent = label;

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.id = label;
    inputElement.name = label;

    if (isReadOnly) {
        inputElement.readOnly = true;
    }

    formGroup.appendChild(labelElement);
    addSpacer(formGroup);
    formGroup.appendChild(inputElement);

    const controls = document.createElement('div');
    controls.className = 'number-controls';

    const buttonUp = createImageButton(19, '&#9650;');  
    buttonUp.onclick = function(event){event.preventDefault();}
    const buttonDown = createImageButton(19, '&#9660;');  
    buttonDown.onclick = function(event){event.preventDefault();}

    controls.appendChild(buttonUp);
    controls.appendChild(buttonDown);
    formGroup.appendChild(controls);

    let childs = null;

    if(returnElements){
        childs = [inputElement, buttonUp, buttonDown];
    }

    return [formGroup, childs]
}

function createStringInput(label, id = '', isReadOnly, returnElements = false) {
    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group')
    formGroup.classList.add('row')
    formGroup.classList.add('centered');

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', id); // Associate label with input via id
    labelElement.textContent = label;
    labelElement.style.alignContent = 'center';
    labelElement.style.textAlign = 'center';


    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.id = id; // Set the id for the input
    inputElement.name = id; // Optionally set the name attribute as well
    inputElement.style.display = 'flex'; //

    if (isReadOnly) {
        inputElement.readOnly = true;
    }

    formGroup.appendChild(labelElement);
    addSpacer(formGroup);
    formGroup.appendChild(inputElement);

    let childs = null;
    if (returnElements) {
        childs = [inputElement];
    }

    return [formGroup, childs];
}

function createAdditionalEffectCreateContainer(){
    new AdditionalEffect()

    
}

function createSelectorInput(label, valueList, textList, defaultValue, id = null, disable_filter = null,multiple = true, isReadOnly= false, custom_func= null) {

    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group')
    formGroup.classList.add('row')
    formGroup.classList.add('centered');

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', id); // Associate label with input via id
    labelElement.textContent = label;
    labelElement.style.alignContent = 'center';
    labelElement.style.textAlign = 'center';

    function optionOnclickFunc(event) {  
        const option = event.target;

        // Add tick emoji if selected
        if (!option.textContent.includes('✓')) {
            option.textContent += ' ✓';
        } else {
            // Remove tick emoji if deselected
            option.textContent = option.textContent.replace(' ✓', '');
        }
            
    }

    const inputElement = createSelector(valueList, textList, defaultValue, id, disable_filter,custom_func? custom_func: optionOnclickFunc);
    inputElement.style.height = '98%';
    inputElement.multiple = multiple;


    if (isReadOnly) {
        inputElement.readOnly = true;
    }

    formGroup.appendChild(labelElement);
    addSpacer(formGroup);
    formGroup.appendChild(inputElement);

    return [formGroup, inputElement, labelElement];
}

function roll(rollList, bonuses = 0, rollTime = 1) {

    // Iterate through each roll in the rollList
    let result = 0;
    for (let i = 0; i < rollTime; i++) {
        let total = 0;
        for (let roll of rollList) {
            // Parse the roll string (e.g., '3d6')
            const [numDice, diceSides] = roll.split('d').map(Number);
            
            // Roll the dice and sum the results
            let rollTotal = 0;
            for (let i = 0; i < numDice; i++) {
                rollTotal += Math.floor(Math.random() * diceSides) + 1;
            }""

            // Add bonuses if any
            rollTotal += bonuses;

            // Add to the total
            total += rollTotal;

            // Log each roll for reference (optional)
            console.log(`Rolled ${numDice}d${diceSides}: ${rollTotal}`);
        }
        result = Math.max(result, total);
    }

    // Return the total roll result
    return result;
}

function getAdditionalEffects(targetEffect){
    return effectsList.filter(effect => effect.effect === targetEffect);
}

function getScalingFactor(container, scale) {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    return {
        widthFactor: containerWidth / 100 * scale, // Adjust this based on your requirement
        heightFactor: containerHeight / 100 * scale // Adjust this based on your requirement
    };
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

function createImageButton(fontSize, icon=null, source=null, custom_padding = 8) {
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

function getRandomColor() {
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

function createSelector(valueList, textList, defaultValue=null, id= null, disable_filter= null, onclick_func=null) {
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
function handleChange(event) {
    console.log('Change detected:', event.target.value);
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

function moveObject(element, newX, newY){
    element.style.left = `${newX}px`;
    element.style.top = `${newY}px`;

    const elementRect = objectsPositions.get(element.id);
    elementRect.x = newX;
    elementRect.y = newY;

    console.log("hello")
}

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

function getTokenShape(rect, tokenShapeType){
    if(tokenShapeType == tokenShapeTypes.BOX){
        return getBoxFromRect(rect);
    } else if(tokenShapeType == tokenShapeTypes.HEXAGON){
        return getHexagonFromRect(rect);
    }
}

function getBoxFromRect(rect){
    const shape = [
        {x: rect.left, y: rect.top},
        {x: rect.left + rect.width, y: rect.top},
        {x: rect.left + rect.width, y: rect.top + rect.height},
        {x: rect.left, y: rect.top + rect.height}
    ]
    return shape;
}

function getHexagonFromRect(rect){
    const { x, y, width, height } = rect;

    // Calculate the center of the DOMRect
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    // Radius of the hexagon - we use half the smaller dimension for fitting
    const radius = Math.min(width, height) / 2;

    // Create an array to store the points of the hexagon
    const hexagonPoints = [];

    // Calculate the 6 corner points using trigonometry
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;  // 60 degrees in radians for each vertex
        const pointX = centerX + radius * Math.cos(angle);
        const pointY = centerY + radius * Math.sin(angle);
        hexagonPoints.push({ x: pointX, y: pointY });
    }

    return hexagonPoints;  
}

function getKeyFromMapWithValue(map, searchValue){
    const matchingEntry = Object.entries(map).find(([key, value]) => value === searchValue);
    if(matchingEntry){
        return [matchingEntry[0]];
    }else{
        return undefined;
    }
    
}

function moveToEnemyAlly(id, to_enemy) {
    let allyIndex = listAllies.findIndex(ally => ally.id === id);
    let enemyIndex = listEnemies.findIndex(enemy => enemy.id === id);

    if(to_enemy && allyIndex !== -1) { // Moving from allies to enemies
        let ally = listAllies.splice(allyIndex, 1)[0]; // Remove from allies
        listEnemies.push(ally); // Add to enemies
    } else if (!to_enemy && enemyIndex !== -1) { // Moving from enemies to allies
        let enemy = listEnemies.splice(enemyIndex, 1)[0]; // Remove from enemies
        listAllies.push(enemy); // Add to allies
    }
}

function getMissingTargetTypes(selectedTypes) {
    // Get all the possible target type values
    const allTypes = Object.values(targetTypes);

    // Filter out the missing types
    const missingTypes = allTypes.filter(type => !selectedTypes.includes(type));

    return missingTypes;
}

function getIdFromTokenId(tokenId){
    const _ = tokenId.split('-');
    return _[_.length - 1]; 
}