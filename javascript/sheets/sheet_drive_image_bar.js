

function addDriveImageBar(){
    addDriveImageTopBar()
    const characterSelectBar = document.getElementById("character-select-bar");
    addSelectBar(characterSelectBar, "Select<br>Character");
    const backgroundSelectBar = document.getElementById("background-select-bar");
    addSelectBar(backgroundSelectBar, "Select<br>Background");
}

function addSelectBar(parentElement, label_text, addIndex = null) {
    parentElement.classList.add('row');
    parentElement.classList.add('centered');
    parentElement.style.gap = "5px";

    // Create the label element
    const label = document.createElement('label');
    label.setAttribute('for', parentElement.id + '-selector');
    label.innerHTML = label_text;
    
    let classNamePrefix;
    let folder;
    let imageFiles;
    let appendParent;
    
    if (parentElement.id.includes('character')) {
        classNamePrefix = "character";
        appendParent = document.getElementById('character-list');
        folder = tokenPaths.FOLDER_CHARTOKEN;
        imageFiles = tokenPaths.IMAGELIST_CHARACTER
    } else if (parentElement.id.includes('background')) {
        classNamePrefix = "background";
        appendParent = document.getElementById('background-list');
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
            select.removeEventListener('change', handleChange);
        }
    });

    const addToGameButton = createImageButton(30, `<img src="${userIntarfaceSettings.FOLDER_MENUICONS+'/'+userIntarfaceSettings.ICON_DOWNARROWGREEN}" width="30" height="30">`);
    addToGameButton.onclick = () => createDriveImageContainer(selectedFile, classNamePrefix, folder, appendParent);
    
    const newCharacterButton = createImageButton(30, `<img src="${userIntarfaceSettings.FOLDER_MENUICONS+'/'+userIntarfaceSettings.ICON_NEWFILE}" width="30" height="30">`);
    
    // Append the label and select to the row
    select.style.width = '100%';
    select.style.flexGrow = 1;
    addToGameButton.style.width = "10%";
    parentElement.appendChild(label);
    parentElement.appendChild(select);
    parentElement.appendChild(addToGameButton);
    parentElement.appendChild(newCharacterButton);
}

function createDriveImageContainer(fileName, classNamePrefix, imageFolder, targetElement) {
    // Create image element
    if (document.getElementById(`drive-${fileName}`)) {
        return
    }

    // FUTURE UPDATE : GETS THE CHARACTER FROM FILE
    const sheetId = `${fileName}-character-sheet`;

    // Create a div to hold the image and buttons
    const imageAndButtonsContainer = document.createElement('div');
    imageAndButtonsContainer.id = `drive-${fileName}`
    imageAndButtonsContainer.className = 'drive-image-container';
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
        const exportButton = createImageButton(34, '⬇️');
        exportButton.onclick = () => export_CharacterSheet(sheetId);
        buttonContainerRow1.appendChild(exportButton);

        const characterSheetButton = createImageButton(34, null, `${userIntarfaceSettings.FOLDER_MENUICONS+"/"+userIntarfaceSettings.ICON_CHARACTERSHEET}`);
        characterSheetButton.onclick = () => toggleDisplay_SheetWithId(sheetId, true);
        buttonContainerRow1.appendChild(characterSheetButton);

        const importButton = createImageButton(34, '⬆️');
        importButton.onclick = () => import_CharacterSheet(sheetId);
        buttonContainerRow2.appendChild(importButton);

        const removeButton = createImageButton(34, '❌');
        removeButton.onclick = () => imageAndButtonsContainer.remove();
        buttonContainerRow2.appendChild(removeButton);

        buttonContainer.appendChild(buttonContainerRow1);
        buttonContainer.appendChild(buttonContainerRow2);
        addCharacterSheet(imageAndButtonsContainer, sheetId);

    }else if(classNamePrefix == 'background'){
        const exportButton = createImageButton(34, '⬇️');
        exportButton.onclick = () => export_BackgroundSheet(`${imageAndButtonsContainer.id}-background-sheet`);
        buttonContainerRow1.appendChild(exportButton);

        const backgroundSheetButton = createImageButton(34, '📄');
        backgroundSheetButton.onclick = () => toggleDisplay_SheetWithId(sheetId, true);
        buttonContainerRow1.appendChild(backgroundSheetButton);

        const importButton = createImageButton(34, '⬆️');
        importButton.onclick = () => import_BackgroundSheet(`${imageAndButtonsContainer.id}-background-sheet`);
        buttonContainerRow2.appendChild(importButton);

        const removeButton = createImageButton(34, '❌');
        removeButton.onclick = () => imageAndButtonsContainer.remove();
        buttonContainerRow2.appendChild(removeButton);

        buttonContainer.appendChild(buttonContainerRow1);
        buttonContainer.appendChild(buttonContainerRow2);
    }

    const containerBackgroundColorChange = createImageButton(24, `<img src="${userIntarfaceSettings.FOLDER_MENUICONS+"/"+userIntarfaceSettings.ICON_RAINBOWDICE}" width="24" height="24">`);
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


function addDriveImageTopBar() {
    const topBar = document.getElementById('drive-images-bar-top-bar');
    topBar.classList.add('row');
    topBar.classList.add('centered');
    topBar.style.width = '95%'
    topBar.style.border = '2px solid';
    topBar.style.borderRadius = '10px';
    topBar.style.gap = '3px'
    topBar.style.backgroundColor = 'gold';

    const label = document.createElement('div');
    label.innerText = 'Drive Images Bar';
    label.style.fontSize = '24px';
    label.style.paddingLeft = '4px';

    let pageIndex = 0;

    const closeButton = createImageButton(32, null, `${userIntarfaceSettings.FOLDER_MENUICONS+'/'+userIntarfaceSettings.ICON_CLOSEBAR}`);
    closeButton.onclick = () =>{
        toggleSliding_SheetWithId('drive-images-bar', false);
    };

    const rightButton = createImageButton(32, '→');
    rightButton.onclick = () =>{
        if (pageIndex < 3) (pageIndex = pageIndex + 1); else pageIndex = 3;
        changeCurrentDriveImageBar(pageIndex)
    };

    const leftButton = createImageButton(32, '←');
    leftButton.onclick = () =>{
        if (pageIndex > 0) (pageIndex = pageIndex - 1); else pageIndex = 0;
        changeCurrentDriveImageBar(pageIndex)
    };

    const spacer1 = document.createElement('div');
    spacer1.className = 'spacer';

    topBar.appendChild(label);
    topBar.appendChild(spacer1);
    topBar.appendChild(leftButton);
    topBar.appendChild(rightButton);
    topBar.appendChild(closeButton);
}

function changeCurrentDriveImageBar(index){
    const characterListContainer = document.getElementById('character-list-container');
    const npcListContainer        = document.getElementById('npc-list-container');
    const backgroundListContainer = document.getElementById('background-list-container');

    if(index == 0){
        if(!characterListContainer.classList.contains('active')){
            characterListContainer.classList.add('active');
            npcListContainer.classList.remove('active');
            backgroundListContainer.classList.remove('active');
        }
    }else if(index == 1) {
        if(!npcListContainer.classList.contains('active')){
            characterListContainer.classList.remove('active');
            npcListContainer.classList.add('active');
            backgroundListContainer.classList.remove('active');
        }
    }else if(index == 2) {
        if(!backgroundListContainer.classList.contains('active')){
            characterListContainer.classList.remove('active');
            npcListContainer.classList.remove('active');
            backgroundListContainer.classList.add('active');
        }
    }
}
// function loadAllLocalImages() {
//     // Load character images
//     charImageFiles.forEach(fileName => {
//         createDriveImageContainer(fileName, 'character', charImagesFolder, charImageList);
//     });

//     // Load background images
//     backgroundImageFiles.forEach(fileName => {
//         createDriveImageContainer(fileName, 'background', backgroundImagesFolder, backgroundImgList);
    
//     });
// }
