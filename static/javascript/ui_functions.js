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


// ACTIVE ----------------------------------------------------------------------------
function addMessageToChat(chatMessage, senderName, timestamp) {
    const testMessage = document.createElement("div");
    testMessage.classList.add('chat-message');
    
    // Add classes based on whether the message is sent by the user
    if (senderName === player.userName) {
        testMessage.classList.add('self');
        senderName = "You";
    } else {
        testMessage.classList.add('other');
    }

    // Create the header (name and time)
    const header = document.createElement("div");
    header.classList.add('header');

    const nameSpan = document.createElement("span");
    nameSpan.classList.add('name');
    nameSpan.textContent = senderName;

    const timeSpan = document.createElement("span");
    timeSpan.classList.add('time');
    const date = new Date(timestamp);
    timeSpan.textContent = date.toUTCString().split(' ')[4].slice(0, -3); // Extract HH:MM from UTC time

    header.appendChild(nameSpan);
    header.appendChild(timeSpan);

    // Add the header to the message
    testMessage.appendChild(header);

    // Add the message content
    const content = document.createElement("div");
    content.classList.add('content');
    content.textContent = chatMessage;

    testMessage.appendChild(content);

    // Append the message to the chat container
    chatMessages.appendChild(testMessage);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;

    
}

sendButton.addEventListener("click", async function() {
    const chatMessage = chatWriteInput.value;
    chatWriteInput.value = '';
    const state = await sendMessage(chatMessage)
    if(state.success){
        addMessageToChat(chatMessage, player.userName, Date.now(), true);
        chat.last_idx++;
    }else{
        alert("Failed to send message")
    }
})

chatWriteArea.addEventListener("keydown", async function(event) {
    if (event.key === 'Enter') {
        const chatMessage = chatWriteInput.value;
        chatWriteInput.value = '';
        const state = await sendMessage(chatMessage)
        if(state.success){
            addMessageToChat(chatMessage, player.userName, Date.now(), true);
            chat.last_idx++;
        }else{
            alert("Failed to send message")
        }
    }
})

storageButton.onclick = () => {
    if (storage.style.left !== "50px") {
        storage.style.left = "50px";
    } else {
        storage.style.left = "-330px";
    }
};

chatButton.onclick = async () => {
    if(chat.style.right !== "0px") {
        chat.style.right = "0px";
    }else{
        chat.style.right = "-330px";
    }
    
}

function startSyncTimer() {
    
    let cnt = 0;
    async function update() {
        cnt++;
        if(isUpdating === false){
            serverInfo = await getGameFile("server_info.json", false)
            await getGameFile("game_elements.json")
        }
    }
    setInterval(update, 1000); // Update every second
}

function startSyncTimer() {
    
    let cnt = 0;
    async function update() {
        cnt++;
        if(isUpdating === false){
            const newServerInfo = await getGameFile("server_info.json", false)
            if(newServerInfo && newServerInfo.chat_idx){
                serverInfo = newServerInfo
                if (serverInfo.chat_idx !== chat.last_idx){
                    const chatData = await getChat(serverInfo.chat_idx, 10)
                    for (const data of chatData) {
                        addMessageToChat(data.message, data.user, data.timestamp)
                    }
                    chat.last_idx = serverInfo.chat_idx;
                }
            }
            gameElements = await getGameFile("game_elements.json")
            
            if(gameElements && gameElements.inGameChars){
                const charDiff = compareWithDb(Object.keys(inGameChars), gameElements.inGameChars);

                if (charDiff.updateStatus) {
                    isUpdating = true
                    if (charDiff.missing.length > 0) {
                        for (let char of charDiff.missing) {
                            const charStats = await getChar(char); // Await here works now
                            console.log("New character added: ", char, charStats);
                            inGameChars[char] = charStats; // Add the fetched charStats to the array
                        }
                    }
                    if(charDiff.removed.length > 0) {
                        for (let char of charDiff.removed) {
                            console.log("Char removed: ", char);
                            delete inGameChars[char]; // Add the fetched charStats to the array
                        }
                    }
                    
                }
            }
            isUpdating = false
        }
    }
    setInterval(update, 1000); // Update every second
}

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    player.userKey = urlParams.get("key")
    player.userName = urlParams.get("userName")

    startSyncTimer();
})