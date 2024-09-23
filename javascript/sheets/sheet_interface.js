/* BOTTOM BAR */
function addBottomBar(){
    const bottomMenuBar = document.getElementById('bottom-menu-bar');
    const row = document.createElement('div');
    row.classList.add('row');
    row.classList.add('centered');
    row.classList.add('box-circular-border')
    row.style.backgroundColor = '#ddd';
    row.style.padding = '4px';
    row.style.gap = '5px';
    
    const openDriveImageBar = createImageButton(32, '💽');
    openDriveImageBar.addEventListener('click', () => {
        toggleSliding_SheetWithId(driveImagesBar.id);
    });

    const openChat = createImageButton(32, '💬');
    
    row.appendChild(openDriveImageBar);
    row.appendChild(openChat);

    bottomMenuBar.appendChild(row);
}
/* END OF BOTTOM BAR */

/* TopLeft BAR */
function addTopRightBar(){
    const TopRightMenuBar = document.getElementById('top-right-menu-bar');
    const column = document.createElement('div');
    column.classList.add('column');
    column.classList.add('vertical');
    column.classList.add('box-circular-border')
    column.style.backgroundColor = '#ddd';
    column.style.padding = '4px';
    column.style.gap = '5px';
    
    
    const openDriveImageBar = createImageButton(32, '⚙️');
    openDriveImageBar.addEventListener('click', () => {
    });

    const spellCreator = addSpellCreator();
    
    const openSpellCreate = createImageButton(32, '✨');
    addClickHighlightListener(openSpellCreate);
    openSpellCreate.addEventListener('click', () => {
        toggleDisplay_SheetWithId(null, null, spellCreator);
    });      

    column.appendChild(openDriveImageBar);
    column.appendChild(openSpellCreate);

    TopRightMenuBar.appendChild(column);
}
/* END OF TopRight BAR */

/* TOP BAR */
function addTopBar(){
    editToolBar();
    addToolsBar();
    addLayerSelecetor();
    layerChange();
}

function editToolBar(){
    const parent = document.getElementById("top-menu-bar");
    parent.classList.add('column');
    parent.classList.add('centered');
    parent.style.gap = '5px';

}

function addToolsBar(){
    const parent = document.getElementById("top-menu-bar");
    const row = document.createElement("div");
    row.classList.add('row');
    row.classList.add('centered');
    row.classList.add('box-circular-border')
    row.style.padding = '4px';
    row.style.gap = '4px';
    row.style.backgroundColor = "#ddd";
    
    const cursorButton = createImageButton(36, null, `${userIntarfaceSettings.FOLDER_MENUICONS}/${userIntarfaceSettings.ICON_CURSOR}`);
    cursorButton.onclick = () => {
        if(gameboard.style.cursor !== 'auto'){
            gameboard.style.cursor = 'auto';
        } 
        addToogleHighlight(cursorButton, parent);
    }

    const panningButton = createImageButton(36, null, `${userIntarfaceSettings.FOLDER_MENUICONS}/${userIntarfaceSettings.ICON_PANNING}`);
    panningButton.onclick = () => {
        if(gameboard.style.cursor === 'move'){
            gameboard.style.cursor = 'auto';
        } else {
            gameboard.style.cursor = 'move';
        }
        addToogleHighlight(panningButton, parent);
    }

    const centerButton = createImageButton(36, null, `${userIntarfaceSettings.FOLDER_MENUICONS}/${userIntarfaceSettings.ICON_CENTER}`);
    centerButton.onclick = () => {
        const gameboardContent = document.getElementById('gameboard-content');
        isPanning = false;     
        panX = 0; 
        panY = 0;
        gameboardContent.style.transform = `translate(0px, 0px) scale(${scale})`;  
    }

    addClickHighlightListener(centerButton);

    row.appendChild(cursorButton);
    row.appendChild(panningButton);
    row.appendChild(centerButton);

    parent.appendChild(row);
}

function addLayerSelecetor() {
    const parent = document.getElementById("top-menu-bar");

    const layerSelect = document.createElement("div");
    layerSelect.id = "layer-select-container";
    layerSelect.style.padding = "5px"
    layerSelect.style.backgroundColor = "#ddd";
    layerSelect.classList.add('box-circular-border');
    const row = document.createElement("div");
    row.className = "row";
    row.style.gap = "5px";

    const label =  document.createElement("label");
    label.setAttribute('for', "layer-select");
    label.textContent = "Layer: ";

    const select = document.createElement("select");
    select.id = "layer-select";
    select.addEventListener("change", function(event) {
        event.preventDefault();
        currentLayer = this.value;
        layerChange();
    });

    const option1 = document.createElement("option");
    option1.value = "character-layer";
    option1.textContent = "Character";
    select.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = "background-layer";
    option2.textContent = "Background";
    select.appendChild(option2);
    
    const option3 = document.createElement("option");
    option3.value = "fog-layer";
    option3.textContent = "Fog";
    select.appendChild(option3);

    row.appendChild(label);
    row.appendChild(select);

    layerSelect.appendChild(row);
    parent.appendChild(layerSelect);
}

function layerChange() {
    // Get all layers
    const layers = document.querySelectorAll('.layer');

    // Loop through all layers and disable interactions
    layers.forEach(layer => {
        if (layer.id === currentLayer) {
            layer.style.pointerEvents = 'auto'; // Enable interactions for the selected layer
        } else {
            layer.style.pointerEvents = 'none'; // Disable interactions for other layers
        }
    });
}
/* END OF TOP BAR */