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

function incrementWithId(inputId, increment) {
    // Get the input element by its ID
    const inputElement = document.getElementById(inputId);

    if (inputElement) {
        // Parse the current value as an integer (or set to 0 if it's not a number)
        let currentValue = parseInt(inputElement.value, 10) || 0;

        // Update the value by the increment (either +1 or -1)
        currentValue += increment;

        // Set the new value back to the input element
        inputElement.value = currentValue;
    }
}

function keepNumberInLimits(id, MAX, MIN) {
    const input = document.getElementById(id);
    
    if (input.value > MAX){
        input.value = MAX;
    }else if (input.value < MIN){
        input.value = MIN;
    }
}

function keepStringListInLimits(inputElement, char, MAX, MIN) {
    let value = inputElement.value; // Get the current value of the input
    let items = value.split(char);  // Split the value by the specified character

    if (items.length > MAX) {
        // If there are more than MAX elements, slice the array and join it back into a string
        inputElement.value = items.slice(0, MAX).join(char);
    } else if (items.length < MIN) {
        // If there are less than MIN elements, you can add placeholders or handle as needed
        items.push('ADD ELEMENT'); // Add empty strings or some placeholder
        inputElement.value = items.join(char);
    }
}

function createImageButton(fontSize, icon) {
    const button = document.createElement('button');
    button.className = 'image-button';
    button.style.fontSize = fontSize; // Set the font size
    button.innerHTML = icon; // Set the icon for the button
    button.style.background = 'none'; // Ensure background is none
    button.style.border = 'none'; // Ensure border is none
    button.style.cursor = 'pointer'; // Ensure cursor is pointer
    button.style.width = fontSize;
    button.style.height = fontSize; // Set the height to match the font size
    return button;
}

function createSelector(valueList, textList, defaultValue, id) {
    // Create the select element
    const selector = document.createElement('select');
    selector.id = id;
    selector.className = 'token-selector-combobox';


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
        selector.appendChild(option);
    });

    return selector;
}

function updateSelector(valueList, textList, defaultValue, id) {
    // Get the select element
    const selector = document.getElementById(id);
    
    // Clear all existing options
    selector.innerHTML = '';

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
        selector.appendChild(option);
    });

    return selector;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}