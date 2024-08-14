function loadImagesWithURL() {
    const charImageList = document.getElementById('character-list');
    const backgroundImgList = document.getElementById('background-list');

    // Load character images
    imageChars.forEach(fileId => {
        const img = document.createElement('img');
        img.src = `${imageFolder}${fileId}`;
        img.className = 'drive-character-image';
        img.id = `${fileId}`;
        img.dataset.id = fileId;
        img.draggable = true;

        // img.addEventListener('load', function() {
        //     // Set image size based on scaling factor and preserve aspect ratio
        //     const charScalingFactor = getScalingFactor(charImageList);
        //     setImageSize(img, charScalingFactor.widthFactor, charScalingFactor.heightFactor);
        // });

        img.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData('text/plain', event.target.dataset.id);
            event.dataTransfer.effectAllowed = 'move';
        });

        charImageList.appendChild(img);
    });
    
    // Load background images
    imageBackgrounds.forEach(fileId => {
        const img = document.createElement('img');
        img.src = `${imageFolder}${fileId}`;
        img.className = 'drive-background-image';
        img.id = `${fileId}`;
        img.dataset.id = fileId;
        img.draggable = true;

        // img.addEventListener('load', function() {
        //     // Set image size based on scaling factor and preserve aspect ratio
        //     const backgroundScalingFactor = getScalingFactor(backgroundImgList);
        //     setImageSize(img, backgroundScalingFactor.widthFactor, backgroundScalingFactor.heightFactor);
        // });

        img.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData('text/plain', event.target.dataset.id);
            event.dataTransfer.effectAllowed = 'move';
        });

        backgroundImgList.appendChild(img);
    });
}

function loadLocalImages() {
    // Load character images
    charImageFiles.forEach(fileName => {
        createDriveImageContainer(fileName, 'character', charImagesFolder, charImageList);
    });

    // Load background images
    backgroundImageFiles.forEach(fileName => {
        createDriveImageContainer(fileName, 'background', backgroundImagesFolder, backgroundImgList);
    
    });
}

function createSelector(valueList, textList, defaultValue) {
    // Create the select element
    const selector = document.createElement('select');
    selector.id = 'image-select';
    selector.className = 'token-selector-combobox';

    // Create and add the default option
    const defaultOption = document.createElement('option');
    defaultOption.value = ''; // Empty value for default
    defaultOption.textContent = defaultValue;
    defaultOption.disabled = true; // Make it non-selectable
    defaultOption.selected = true; // Set as the default selected option
    selector.appendChild(defaultOption);

    // Add options based on valueList and textList
    valueList.forEach((value, index) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = textList[index] || value; // Use value if textList is shorter
        selector.appendChild(option);
    });

    return selector;
}

function addAvaliableImagesSelector(parentElement, imageFiles, label_text) {
    // Create the label element
    const selectorDiv = document.createElement('div');
    selectorDiv.className = 'token-selector';
    
    // Create the row element
    const row = document.createElement('div');
    row.className = 'row';
    
    // Create the label element
    const label = document.createElement('label');
    label.setAttribute('for', 'image-select');
    label.textContent = label_text;
    

    let newList = [];
    imageFiles.forEach(file => {
        const fileName = file.split('.').slice(0, -1).join('.'); // Remove the file extension
        newList.push(fileName); // Use push to add the fileName to newList
    });

    const select = createSelector(imageFiles, newList, 'select');
    
    let selectedFile;

    let firstChangeNotOccurred = true;

    select.addEventListener('change', function(event) {
        if (!firstChangeNotOccurred) {
            firstChangeNotOccurred = false;
            selectElement.remove(0);
        }
        selectedFile = event.target.value;
        console.log('Selected: ' + selectedFile);
    });
    
    const defaultButton = createImageButton(30, '➕');
 
    let classNamePrefix;
    let folder;
    
    if (parentElement.id === 'character-list') {
        classNamePrefix = "character";
        folder = charImagesFolder;
    } else if (parentElement.id === 'background-list') {
        classNamePrefix = "background";
        folder = backgroundImagesFolder;
    }
    
    defaultButton.onclick = () => createDriveImageContainer(selectedFile, classNamePrefix, folder, parentElement);
    
    // Append the label and select to the row
    row.appendChild(label);
    row.appendChild(select);
    row.appendChild(defaultButton);
    selectorDiv.appendChild(row);
    parentElement.appendChild(selectorDiv);
}
