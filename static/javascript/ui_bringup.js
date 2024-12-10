const leftSideBar = document.getElementById('ui-letside-bar');
leftSideBar.classList.add('column');
leftSideBar.classList.add('vertical')
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

const spellBook = createImageButton(40, {icon: "menu_book"})
spellBook.id = "ui-spellbook-button"
spellBook.style.fontFamily = 'Material Icons Outlined'
leftSideBar.appendChild(spellBook);

const accountButton = createImageButton(40, {icon: "account_circle"})
accountButton.id = "ui-account-button"
accountButton.style.fontFamily = 'Material Icons Outlined'
leftSideBar.appendChild(accountButton);

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


const topBar = document.getElementById("ui-top-bar");
topBar.classList.add("row");
topBar.style.display = "flex";
topBar.style.height = "40px";
topBar.style.marginTop = "5px";
topBar.style.gap = "5px";

const topBarSceneName = document.createElement("h2");
topBarSceneName.textContent = "Scene Name";

topBarSceneName.style.flex = "auto";
topBarSceneName.style.textAlign = "center";
topBarSceneName.style.background = "linear-gradient(135deg, #8e44ad, #3498db)"; // Gradient background
topBarSceneName.style.color = "#f5f5f5"; // Light text color
topBarSceneName.style.borderRadius = "8px"; // Rounded corners
topBarSceneName.style.fontFamily = "'Cinzel', serif"; // DnD theme font
topBarSceneName.style.fontSize = "24px"; // Larger font size
topBarSceneName.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.3)"; // Subtle shadow for depth
topBarSceneName.style.padding = "5px"; // Padding to keep text off the edges
topBarSceneName.style.margin = "0px"; // No margin

topBar.appendChild(topBarSceneName);
