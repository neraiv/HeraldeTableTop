function loadAllLocalImages() {
    // Load character images
    charImageFiles.forEach(fileName => {
        createDriveImageContainer(fileName, 'character', charImagesFolder, charImageList);
    });

    // Load background images
    backgroundImageFiles.forEach(fileName => {
        createDriveImageContainer(fileName, 'background', backgroundImagesFolder, backgroundImgList);
    
    });
}

function addAvaliableImagesSelector(parentElement, label_text) {
    // Create the label element
    const selectorDiv = document.createElement('div');
    selectorDiv.className = 'token-selector';
    
    // Create the row element
    const row = document.createElement('div');
    row.className = 'row';
    
    // Create the label element
    const label = document.createElement('label');
    label.setAttribute('for', parentElement.id + '-selector');
    label.innerHTML = label_text;
    
    let classNamePrefix;
    let folder;
    let imageFiles;
    
    if (parentElement.id === 'character-list') {
        classNamePrefix = "character";
        folder = tokenPaths.FOLDER_CHARTOKEN;
        imageFiles = tokenPaths.IMAGELIST_CHARACTER
    } else if (parentElement.id === 'background-list') {
        classNamePrefix = "background";
        folder = tokenPaths.FOLDER_BACKGROUNDTOKEN;
        imageFiles = tokenPaths.IMAGELIST_BACKGROUND;      
    }

    let labelsList = [];
    imageFiles.forEach(file => {
        const fileName = file.split('.').slice(0, -1).join('.'); // Remove the file extension
        labelsList.push(fileName); // Use push to add the fileName to labelsList
    });

    const select = createSelector(imageFiles, labelsList, 'select', parentElement.id + '-selector');
    
    let selectedFile;
    let firstChangeNotOccurred = true;

    select.addEventListener('change', function(event) {
        selectedFile = event.target.value;
        if (firstChangeNotOccurred) {
            firstChangeNotOccurred = false;
            select.remove(0);
        }
    });

    const addToGameButton = createImageButton(30, `<img src="${tokenPaths.FOLDER_MENUICONS+'/'+userIntarfaceSettings.ICON_DOWNARROWGREEN}" width="30" height="30">`);
    addToGameButton.onclick = () => createDriveImageContainer(selectedFile, classNamePrefix, folder, parentElement);
    
    const newCharacterButton = createImageButton(30, `<img src="${tokenPaths.FOLDER_MENUICONS+'/'+userIntarfaceSettings.ICON_NEWFILE}" width="30" height="30">`);
    
    // Append the label and select to the row
    row.appendChild(label);
    row.appendChild(select);
    row.appendChild(addToGameButton);
    row.appendChild(newCharacterButton);
    selectorDiv.appendChild(row);
    parentElement.appendChild(selectorDiv);
}

function createDriveImageContainer(fileName, classNamePrefix, imageFolder, targetElement) {
    // Create image element
    const imageName = fileName.split('.')[0];

    if (document.getElementById(`drive-${imageName}`)) {
        return
    }

    // Create a div to hold the image and buttons
    const imageAndButtonsContainer = document.createElement('div');
    imageAndButtonsContainer.id = `drive-${imageName}`
    imageAndButtonsContainer.className = 'image-and-buttons-container';
    imageAndButtonsContainer.style.backgroundColor = getRandomColor();

    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';
    targetElement.appendChild(imgContainer);

    const img = document.createElement('img');
    let imgPrefix;
    if(classNamePrefix == 'background'){
        if(environment.TIME > 6.00 && environment.TIME < 20.00){
            imgPrefix = 'light.jpg';
        }else{
            imgPrefix = 'dark.jpg';
        }
    }else if(classNamePrefix == "character"){
        imgPrefix = "char.jpg"
    }

    img.src = `${imageFolder}/${fileName}/${imgPrefix}`;
    img.className = `drive-${classNamePrefix}-image`;
    img.id = imageName;
    img.dataset.filename = imageName;
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

    // Create and append buttons with icons
    if(classNamePrefix == 'character'){
        const defaultButton = createImageButton(36, `<img src="${tokenPaths.FOLDER_MENUICONS+"/"+userIntarfaceSettings.ICON_CHARACTERSHEET}" width="36" height="36">`);
        defaultButton.onclick = () => open_CharacterSheet(`${imageAndButtonsContainer.id}-character-sheet`);
        buttonContainer.appendChild(defaultButton);

        const exportButton = createImageButton(36, '⬇️');
        exportButton.onclick = () => export_CharacterSheet(`${imageAndButtonsContainer.id}-character-sheet`);
        buttonContainer.appendChild(exportButton);

        const importButton = createImageButton(36, '⬆️');
        importButton.onclick = () => import_CharacterSheet(`${imageAndButtonsContainer.id}-character-sheet`);
        buttonContainer.appendChild(importButton);

        const removeButton = createImageButton(36, '❌');
        removeButton.onclick = () => remove_CharacterSheet(imageAndButtonsContainer);
        buttonContainer.appendChild(removeButton);

        createCharacterSheet(imageAndButtonsContainer);
    }else if(classNamePrefix == 'background'){
        const defaultButton = createImageButton(36, '📄');
        defaultButton.onclick = () => open_BackgroundSheet(`${imageAndButtonsContainer.id}-background-sheet`);
        buttonContainer.appendChild(defaultButton);

        const exportButton = createImageButton(36, '⬇️');
        exportButton.onclick = () => export_BackgroundSheet(`${imageAndButtonsContainer.id}-background-sheet`);
        buttonContainer.appendChild(exportButton);
        
        const importButton = createImageButton(36, '⬆️');
        importButton.onclick = () => import_BackgroundSheet(`${imageAndButtonsContainer.id}-background-sheet`);
        buttonContainer.appendChild(importButton);
        
        const removeButton = createImageButton(36, '❌');
        removeButton.onclick = () => remove_BackgroundSheet(imageAndButtonsContainer);
        buttonContainer.appendChild(removeButton)
    }

    const containerBackgroundColorChange = createImageButton(24, `<img src="${tokenPaths.FOLDER_MENUICONS+"/"+userIntarfaceSettings.ICON_RAINBOWDICE}" width="24" height="24">`);
    containerBackgroundColorChange.style.position = 'absolute';
    containerBackgroundColorChange.style.top = '2px';
    containerBackgroundColorChange.style.left = '2px';
    containerBackgroundColorChange.onclick = () => {
        imageAndButtonsContainer.style.backgroundColor = getRandomColor();
    };

    // Append button container to the main container
    imageAndButtonsContainer.appendChild(containerBackgroundColorChange);
    imageAndButtonsContainer.appendChild(buttonContainer);
    
    // Append the main container to the target element
    targetElement.appendChild(imageAndButtonsContainer);
}