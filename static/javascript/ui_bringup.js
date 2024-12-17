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

const storageButton = createImageButton(40, {icon: "storage"})
storageButton.id = "ui-storage-button"
storageButton.style.fontFamily = 'Material Icons Outlined'
leftSideBar.appendChild(storageButton);

const spellBookButton = createImageButton(40, {icon: "menu_book"})
spellBookButton.id = "ui-spellbook-button"
spellBookButton.style.fontFamily = 'Material Icons Outlined'
leftSideBar.appendChild(spellBookButton);

const addItemButton = createImageButton(40, {icon: "add_circle_outline"})
addItemButton.id = "ui-forge-item-button"
addItemButton.style.fontFamily = 'Material Icons Outlined'
leftSideBar.appendChild(addItemButton);

const playerCharSheetButton = createImageButton(40, {icon: "account_circle"})
playerCharSheetButton.id = "ui-account-button"
playerCharSheetButton.style.fontFamily = 'Material Icons Outlined'
leftSideBar.appendChild(playerCharSheetButton);

const bottomBar = document.getElementById('ui-bottom-bar');
bottomBar.classList.add('row');
bottomBar.classList.add('vertical');
bottomBar.style.justifyContent = "right";
bottomBar.style.position = 'absolute';
bottomBar.style.height = "40px";
bottomBar.style.width = "100%";
bottomBar.style.gap = "1px";
bottomBar.style.bottom = '5px';
bottomBar.style.right = '5px';
bottomBar.style.zIndex = "10"

const chatButton = createImageButton(40, {icon: "chat"})
chatButton.id = "ui-chat-button"
chatButton.style.fontFamily = 'Material Icons Outlined'
bottomBar.appendChild(chatButton);


//Storage
const storage = document.getElementById("ui-storage");

const menuBar = document.createElement("div");
menuBar.classList.add("menu-bar")
storage.appendChild(menuBar);

const menuName = document.createElement("div");
menuName.textContent = "Storage"; 
menuName.classList.add("menu-name")
menuBar.appendChild(menuName);

const closeButton = createImageButton(40, {icon: "arrow_circle_left"});
closeButton.id = "ui-storage-close-button";
closeButton.style.fontFamily = 'Material Icons Outlined';
menuBar.appendChild(closeButton);

const tabbedContainer = createTabbedContainer(3, ["Chars", "Env", "NPC"], "ui-storage-tabbed-container", false)
tabbedContainer.style.width = "96%";
tabbedContainer.style.flex= "auto";
storage.appendChild(tabbedContainer);

const contentChars = getContentContainer(tabbedContainer, "Chars")
contentChars.innerHTML = ""
const contentEnv   = getContentContainer(tabbedContainer, "Env")
contentEnv.innerHTML = ""
const contentNPC    = getContentContainer(tabbedContainer, "NPC")
contentNPC.innerHTML = ""


// CHAT
const chat = document.getElementById("ui-chat");

chat.last_idx = 0;

const chatMenuBar = document.createElement("div");
chatMenuBar.classList.add("menu-bar")
chat.appendChild(chatMenuBar);

const chatMenuName = document.createElement("div");
chatMenuName.textContent = "Chat"; 
chatMenuName.classList.add("menu-name")
chatMenuBar.appendChild(chatMenuName);

const chatCloseButton = createImageButton(40, {icon: "arrow_circle_right"});
chatCloseButton.id = "ui-storage-close-button";
chatCloseButton.style.fontFamily = 'Material Icons Outlined';
chatMenuBar.appendChild(chatCloseButton);

const chatContainer = document.createElement("div");
chatContainer.id = "chat-container";
chat.appendChild(chatContainer);

const chatMessages = document.createElement("div")
chatMessages.classList.add('chat-messages-container')
chatContainer.appendChild(chatMessages);

const chatWriteArea = document.createElement("div")
chatWriteArea.classList.add('chat-write-area')
chatContainer.appendChild(chatWriteArea);

const chatWriteInput = document.createElement("textarea");
chatWriteInput.placeholder = "Write a message...";
chatWriteArea.appendChild(chatWriteInput);

const sendButton = createImageButton(40, {icon: "send"})
sendButton.style.fontFamily = 'Material Icons Outlined';
chatWriteArea.appendChild(sendButton);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// TOP BAR //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

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
topBar.appendChild(topBarTools);

const topBarCursorButton = createImageButton(36, {source:  "url(static/images/menu-icons/cursor.png)"})
topBarTools.appendChild(topBarCursorButton);

const topBarPanningButton = createImageButton(36, {source: "url(static/images/menu-icons/move.png)"})
topBarTools.appendChild(topBarPanningButton);

const topBarCenterButton = createImageButton(36, {source:  "url(static/images/menu-icons/center.png)"})
topBarTools.appendChild(topBarCenterButton);

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// TOP BAR //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/

const spellBook = document.getElementById("ui-spellbook");
spellBook.style.display = "flex";
spellBook.style.width = "1000px";
spellBook.style.height = "85%";
spellBook.style.position = "absolute";
spellBook.style.top = "50%";
spellBook.style.left = "50%";
spellBook.style.transform = "translate(-50%, -50%)";
spellBook.style.backgroundColor = "#d3dae2";
spellBook.style.borderRadius = "8px";
spellBook.style.padding = "5px";
spellBook.style.flexDirection = "column";
spellBook.style.alignItems = "center";
spellBook.style.gap = "5px";


const spellBookTopBar = addDraggableRow(spellBook)
spellBookTopBar.style.justifyContent = "space-between";


const createSpellButton = document.createElement("button");
createSpellButton.textContent = "Conjure A Spell";
createSpellButton.style.position = "absolute"; 
createSpellButton.style.fontFamily = "'Cinzel', serif"; // DnD theme font
createSpellButton.style.fontSize = "16px"; // Larger font size
createSpellButton.style.padding = "5px"; // Padding to keep text off the edges
createSpellButton.style.margin = "0px"; // No margin
createSpellButton.style.cursor = "pointer"; // Pointer cursor
createSpellButton.style.marginLeft = "5px"; // No outline
createSpellButton.style.border = "none"; // No border
createSpellButton.style.borderRadius = "8px"; // Rounded corners
// shiny grenn background
createSpellButton.style.background = "linear-gradient(135deg, #2ecc71, #27ae60)"; // Gradient background
createSpellButton.style.color = "#f5f5f5"; // Light text color
createSpellButton.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.3)"; // Subtle shadow for depth
spellBookTopBar.appendChild(createSpellButton);


const spellBookName = document.createElement("h2");
spellBookName.textContent = "Spell Book";
spellBookName.style.flex = "auto";
spellBookName.style.textAlign = "center";
spellBookName.style.fontFamily = "'Cinzel', serif"; // DnD theme font
spellBookName.style.fontSize = "20px"; // Larger font size
spellBookName.style.padding = "5px"; // Padding to keep text off the edges
spellBookName.style.margin = "0px"; // No margin
spellBookTopBar.appendChild(spellBookName);

const spellBookCloseButton = createImageButton(40, {icon: "arrow_circle_right"});
spellBookCloseButton.id = "ui-spellbook-close-button";
spellBookCloseButton.style.fontFamily = 'Material Icons Outlined';
spellBookTopBar.appendChild(spellBookCloseButton);


const spellBookTabs = createTabbedContainer(2, ["Your Spells", "All Spells"], "ui-spellbook-tabbed-container", false)
spellBookTabs.style.width = "100%";
spellBookTabs.style.height = "100%";
spellBook.appendChild(spellBookTabs);

const contentYourSpells = getContentContainer(spellBookTabs, "Your Spells")
contentYourSpells.innerHTML = ""
contentYourSpells.style.flexDirection = "column";

const contentAllSpells = getContentContainer(spellBookTabs, "All Spells")
contentAllSpells.innerHTML = ""






