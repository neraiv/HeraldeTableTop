const gridSize = sceneData.grid_size
const width = sceneData.width
const height = sceneData.height

gridBackground.style.backgroundSize = `${gridSize}px ${gridSize}px`;

gameboardContent.style.width = `${width}px`
gameboardContent.style.height = `${height}px`;
gameboardContent.style.top = `${-height/2}px`
gameboardContent.style.left = `${-width/2}px`;

gameboardContent.style.transform = `translate(0px, 0px) scale(1)`;

// Future this whole page will go into html file
const leftSideBar = document.getElementById('ui-letside-bar');
leftSideBar.classList.add('column');
leftSideBar.classList.add('vertical')
leftSideBar.style.backgroundColor = "#d3dae2";
leftSideBar.style.top = '0px';
leftSideBar.style.left = '0px';
leftSideBar.style.width = "50px";
leftSideBar.style.height = "100%";
leftSideBar.style.paddingTop = "5px";
leftSideBar.style.gap = "5px";

const settingsButton = createImageButton(40, {icon: "settings"})
settingsButton.id = "ui-settings-button"
settingsButton.style.fontFamily = 'Material Icons Outlined'
leftSideBar.appendChild(settingsButton);

const separator1 = document.createElement('div');
separator1.style.width = "100%";
separator1.style.height = "1px";
separator1.style.backgroundColor = 'red';
leftSideBar.appendChild(separator1);

const addButton = createImageButton(40, {icon: "add"})
addButton.id = "ui-settings-button"
addButton.style.fontFamily = 'Material Icons Outlined'
leftSideBar.appendChild(addButton);

const listButton = createImageButton(40, {icon: "list"})
listButton.id = "ui-settings-button"
listButton.style.fontFamily = 'Material Icons Outlined'
leftSideBar.appendChild(listButton);

addSpacer(leftSideBar)

const logOutButton = createImageButton(40, {icon: "logout"})
logOutButton.style.justifySelf = 'flex-end'
logOutButton.style.marginBottom = '10px'
logOutButton.id = "ui-forge-item-button"
logOutButton.style.fontFamily = 'Material Icons Outlined'
leftSideBar.appendChild(logOutButton);

// Get the selection container
const addSelection = document.getElementById("ui-add-selection");
addSelection.style.position = "fixed";
addSelection.style.top = "50%";
addSelection.style.left = "50%";
addSelection.style.transform = "translate(-50%, -50%)"; // Center perfectly
addSelection.style.display = "grid";
addSelection.style.gap = "20px"; // Increased gap for better spacing
addSelection.style.width = "400px"; // Slightly wider for better layout
addSelection.style.height = "auto";
addSelection.style.padding = "25px"; // Increased padding
addSelection.style.background = "rgba(0, 0, 0, 0.9)"; // Darker background for contrast
addSelection.style.borderRadius = "16px"; // More rounded corners
addSelection.style.boxShadow = "0px 8px 20px rgba(0, 0, 0, 0.3)"; // Deeper shadow
addSelection.style.transition = "all 0.3s ease-in-out"; // Smooth transition for all properties
addSelection.style.gridTemplateColumns = "repeat(3, 1fr)"; // 2 columns for better layout
addSelection.style.color = "white"; // Default text color
addSelection.style.fontFamily = "Arial, sans-serif"; // Modern font

function createCard(card) {
    card.classList.add("card");
    card.style.width = "100px"; 
    card.style.height = "100px";
    card.style.background = "linear-gradient(145deg, #2196F3, #1976D2)";
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.justifyContent = "center";
    card.style.color = "white";
    card.style.fontSize = "16px";
    card.style.borderRadius = "12px";
    card.style.cursor = "pointer";
    card.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";
    card.style.transition = "all 0.3s ease-in-out";
    card.style.textAlign = "center";
    card.style.padding = "10px";
    card.style.letterSpacing = "0.8px";
    card.style.fontWeight = "600";
    card.style.userSelect = "none"; 
}

const addSelectionBackground = document.createElement("div");
addSelectionBackground.innerText = "Add Background";
createCard(addSelectionBackground)
addSelection.appendChild(addSelectionBackground)

const addSelectionObject = document.createElement("div");
addSelectionObject.innerText = "Add Object";
createCard(addSelectionObject)
addSelection.appendChild(addSelectionObject)

const addSelectionNPC = document.createElement("div");
addSelectionNPC.innerText = "Add Npc";
createCard(addSelectionNPC)
addSelection.appendChild(addSelectionNPC)

const addSelectionMovableSpace = document.createElement("div");
addSelectionMovableSpace.innerText = "Add Movable Space";
createCard(addSelectionMovableSpace)
addSelection.appendChild(addSelectionMovableSpace)

// Styling for the UI adder container
uiAddBackground.style.position = "fixed";
uiAddBackground.style.display = "none"
uiAddBackground.style.top = "50%";
uiAddBackground.style.left = "50%";
uiAddBackground.style.transform = "translate(-50%, -50%)";

const topBar = document.getElementById("ui-top-bar");
topBar.classList.add("row");
topBar.style.display = "flex";
topBar.style.marginTop = "5px";
topBar.style.gap = "5px";

const topBarSceneInfo = document.createElement("div");
topBarSceneInfo.classList.add("column");
topBarSceneInfo.classList.add("centered");
topBarSceneInfo.style.flex = "auto";
topBarSceneInfo.style.overflow = "overflow"
topBar.appendChild(topBarSceneInfo);

const topBarSceneName = document.createElement("h2");
topBarSceneName.textContent = "Scene Name";

topBarSceneName.style.flex = "auto";
topBarSceneName.style.textAlign = "center";
topBarSceneName.style.background = "linear-gradient(135deg, #8e44ad, #3498db)"; // Gradient background
topBarSceneName.style.color = "#f5f5f5"; // Light text color
topBarSceneName.style.borderRadius = "8px"; // Rounded corners
topBarSceneName.style.fontFamily = "'Cinzel', serif"; // DnD theme font
topBarSceneName.style.fontSize = "20px"; // Larger font size
topBarSceneName.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.3)"; // Subtle shadow for depth
topBarSceneName.style.padding = "5px"; // Padding to keep text off the edges
topBarSceneName.style.margin = "0px"; // No margin
topBarSceneInfo.appendChild(topBarSceneName);

const topBarLayerName = document.createElement("h3");
topBarLayerName.textContent = "Layer 1";
topBarLayerName.style.flex = "auto";
topBarLayerName.style.textAlign = "center";
topBarLayerName.style.background = "red";
topBarLayerName.style.color = "#f5f5f5"; // Light text color
topBarLayerName.style.borderBottomLeftRadius = "8px"; // Rounded corners
topBarLayerName.style.borderBottomRightRadius = "8px"; // Rounded corners
topBarLayerName.style.fontFamily = "'Cinzel', serif"; // DnD theme font
topBarLayerName.style.fontSize = "14px"; // Larger font size
topBarLayerName.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.3)"; // Subtle shadow for depth
topBarLayerName.style.padding = "5px"; // Padding to keep text off the edges
topBarLayerName.style.margin = "0px"; // No margin
topBarSceneInfo.appendChild(topBarLayerName);


const topBarOptions = document.createElement("div");
topBarOptions.style.display = "flex";
topBarOptions.style.flexDirection = "row"
topBarOptions.style.gap = "5px"
topBar.appendChild(topBarOptions);

const topBarTools = document.createElement("div");
topBarTools.classList.add("row");
topBarTools.classList.add("centered");
topBarTools.style.backgroundColor = "#d3dae2";
topBarTools.style.borderRadius = "8px";
topBarTools.style.padding = "5px";
topBarTools.style.width = "fit-content";
topBarTools.style.height = "fit-content";
topBarTools.style.flex = "auto";
topBarTools.style.gap = "5px";
topBarOptions.appendChild(topBarTools);

const topBarCursorButton = createImageButton(36, {source:  "url(static/images/menu-icons/cursor.png)"})
topBarTools.appendChild(topBarCursorButton);

const topBarPanningButton = createImageButton(36, {source: "url(static/images/menu-icons/move.png)"})
topBarTools.appendChild(topBarPanningButton);

const topBarCenterButton = createImageButton(36, {source:  "url(static/images/menu-icons/center.png)"})
topBarTools.appendChild(topBarCenterButton);

const topBarLayerSelector = createInputSelector("Layer: ", ["bg", "char"], ["Background", "Character"])

topBarOptions.appendChild(topBarLayerSelector)