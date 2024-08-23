function createTopBar() {
    const topBar = document.getElementById('drive-images-bar-top-bar');
    topBar.className = 'row';
    topBar.style.width = '95%'
    topBar.style.border = '2px solid';
    topBar.style.borderRadius = '10px';
    topBar.style.backgroundColor = 'gold';

    const label = document.createElement('div');
    label.innerText = 'Drive Images Bar';
    label.style.fontSize = '24px';
    label.style.paddingLeft = '10px';

    const closeButton = createImageButton(24, `<img src="${iconsFolder+icon_closeBar}" width="24" height="24">`);
    closeButton.onclick = () =>{
        togglePage('drive-images-bar', false);
    };

    const spacer1 = document.createElement('div');
    spacer1.className = 'spacer';

    topBar.appendChild(label);
    topBar.appendChild(spacer1);
    topBar.appendChild(closeButton);

}

// function createLayerSelecetor() {
//     const parent = document.getElementById("top-bar-layer-select");
    
//     const row = document.createElement("div");
//     row.className = "row";

//     const label =  document.createElement("label");
//     label.textContent = "Layer: ";

//     const select = document.createElement("select");
//     select.id = "layer-select";
//     select.addEventListener("change", function(event) {
//         event.preventDefault();
//         currentLayer = this.value;
//         layerChange();
//     });

//     const option1 = document.createElement("option");
//     option1.value = "character-layer";
//     option1.textContent = "Character";
//     select.appendChild(option1);

//     const option2 = document.createElement("option");
//     option2.value = "background-layer";
//     option2.textContent = "Background";
//     select.appendChild(option2);
    
//     const option3 = document.createElement("option");
//     option3.value = "fog-layer";
//     option3.textContent = "Fog";
//     select.appendChild(option3);

//     row.appendChild(label);
//     row.appendChild(select);

//     label.setAttribute('for', parent.id);

//     parent.appendChild(row);
// }

function createGameBoardOptionsTop(){
    const parent = document.getElementById("top-bar-gameboard-options");
    
    const row = document.createElement("div");
    row.className = "row";
    row.style.gap = "5px";

    const panButton = createImageButton(36, `<img src="${paths.FOLDERMENUICONS+userIntarfaceSettings.ICON_DOWNARROWGREEN}" width="36" height="36" alt="Close">`);
    const selectButton = createImageButton(36, `<img src="${paths.FOLDERMENUICONS+userIntarfaceSettings.ICON_DOWNARROWGREEN}" width="36" height="36" alt="Close">`);

    row.appendChild(selectButton);
    row.appendChild(panButton);

    parent.appendChild(row);
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