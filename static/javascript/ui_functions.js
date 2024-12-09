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

// Game Board -----------------------------------------------------------------------
async function addBackground(width, height, x, y, img = null){
    const background = document.createElement("div")
    background.classList.add("background")
    background.style.left = `${x}px`
    background.style.top = `${y}px`
    background.style.width = `${width}px`
    background.style.height = `${height}px`

    if(img){
        background.style.backgroundImage = `url(${img})`
        background.style.backgroundSize = "cover"
        background.style.backgroundPosition = "center"
    }

    backgroundLayer.appendChild(background)
}

async function initGameBoard() {
    const newSessionData = await dbGetSession()

    async function initLayer(layer){
        // future get image  width and heigh with scale factor

        const width = undefined
        const height = undefined


        if(width === undefined || height === undefined){
            addBackground(100, 100, layer.x, layer.y)
        }else{
            addBackground(layer.width, layer.height, layer.x, layer.y)
        }
        
    }

    async function initScene(){

        const gridSize = sceneInfo.grid_size
        const width = sceneInfo.width
        const height = sceneInfo.height

        gridBackground.style.backgroundSize = `${gridSize}px ${gridSize}px`;

        gameboardContent.style.width = `${width}px`
        gameboardContent.style.height = `${height}px`;
        gameboardContent.style.left = `${-width/2}px`;
        gameboardContent.style.top = `${-height/2}px`;

        gameboardContent.style.transform = `translate(0px, 0px) scale(1)`;

        const activeLayerIdx = sessionInfo.currentScene.layer;
        
        initLayer(sceneInfo.layers[activeLayerIdx])
    }

    async function initGameBoardFunctions(){
        gameboard.addEventListener('mousedown', (event) => {
            if (event.button === 0 && gameboard.style.cursor === 'move') { // Middle mouse button
                isPanning = true;
                startX = event.clientX - panX;
                startY = event.clientY - panY;
            }
            if (event.button === 1 && gameboard.style.cursor !== 'move') { // Middle mouse button
                isPanning = true;
                startX = event.clientX - panX;
                startY = event.clientY - panY;
                gameboard.style.cursor = 'grabbing';
            }
        });
    
        gameboard.addEventListener('mouseup', (event) => {
            isPanning = false;
            if (event.button === 1 && gameboard.style.cursor !== 'move') gameboard.style.cursor = 'auto';
        });
    
        gameboard.addEventListener('mousemove', (event) => {
            if (!isPanning) return;
            panX = event.clientX - startX;
            panY = event.clientY - startY;
    
            gameboardContent.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
        });
    
        gameboard.addEventListener('wheel', (event) => {
            event.preventDefault();
            const scaleAmount = -event.deltaY * 0.001;
            scale = Math.min(Math.max(uiSettings.max_zoom_out, scale + scaleAmount), uiSettings.max_zoom_in);
            gameboardContent.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
        });
    }
    
    if(newSessionData){
        if(newSessionData.session){
            sessionInfo = newSessionData.session
            
            for(let i = 0; i < sessionInfo.inGameChars.length; i++){
                
            }

            console.log(sessionInfo)
        }
        if (newSessionData.scene){
            sceneInfo = newSessionData.scene
            console.log(newSessionData.scene)
            initScene()
            initGameBoardFunctions()
        }
    }


}


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
    const state = await sendMessage(chatMessage)
    if(state.success === null){
        alert("Failed to send message")
    }else{
        chatWriteInput.value = '';
    }
})

chatWriteArea.addEventListener("keydown", async function(event) {
    if (event.key === 'Enter') {
        const chatMessage = chatWriteInput.value;
        chatWriteInput.value = '';
        const state = await sendMessage(chatMessage)
        if(state.success === null){
            alert("Failed to send message")
        }else{
            chatWriteInput.value = '';
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

async function  initDatabase(){
    let isChatOk = false;
    try {
        // Fetch server info
        const newServerInfo = await getGameFile("server_info.json", false);

        // Ensure server info is valid
        if (!newServerInfo || newServerInfo.server_status !== "online") {
            return false; 
        }

        // Ensure chat_idx exists
        if (newServerInfo.chat_idx) {
            serverInfo = newServerInfo; // Update global serverInfo variable

            // Fetch chat data based on the latest index
            const chatData = await getChat(serverInfo.chat_idx, 10);

            // Process and add chat messages
            for (const data of chatData) {
                addMessageToChat(data.message, data.user, data.timestamp);
            }

            // Update chat last index
            chat.last_idx = serverInfo.chat_idx;

            isChatOk = true;
        } else {
            console.warn("Chat index is missing in the server info.");
        }
    } catch (error) {
        // Handle unexpected errors
        return false
    }

    // Wait for all tasks to complete before returning
    if (isChatOk) {
        console.log("Chat synchronization started successfully.");
        return true;
    } else {
        console.warn("Failed to start chat synchronization.");
        return false;
    }
}

function startSyncTimer() {
    
    let cnt = 0;
    async function update() {
        cnt++;
        if(isUpdating === false){
            const newServerInfo = await getGameFile("server_info.json", false)
            if(newServerInfo){
                if(newServerInfo.chat_idx !== chat.last_idx){
                    const diff = parseInt(newServerInfo.chat_idx, 10) - parseInt(chat.last_idx, 10) - 1 ;
                    const chatData = await getChat(serverInfo.chat_idx, diff)
                    for (const data of chatData) {
                        addMessageToChat(data.message, data.user, data.timestamp)
                    }
                    chat.last_idx = newServerInfo.chat_idx;
                }
            }
 
            // if(gameElements && gameElements.inGameChars){
            //     const charDiff = compareWithDb(Object.keys(inGameChars), gameElements.inGameChars);

            //     if (charDiff.updateStatus) {
            //         isUpdating = true
            //         if (charDiff.missing.length > 0) {
            //             for (let char of charDiff.missing) {
            //                 const charStats = await getChar(char); // Await here works now
            //                 console.log("New character added: ", char, charStats);
            //                 inGameChars[char] = charStats; // Add the fetched charStats to the array
            //             }
            //         }
            //         if(charDiff.removed.length > 0) {
            //             for (let char of charDiff.removed) {
            //                 console.log("Char removed: ", char);
            //                 delete inGameChars[char]; // Add the fetched charStats to the array
            //             }
            //         }
                    
            //     }
            // }
            isUpdating = false
        }
    }
    setInterval(update, 1000); // Update every second
}

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    player.userKey = urlParams.get("key")
    player.userName = urlParams.get("userName")

    let isUpdating = false;
    let initErrorCounter = 0
    const intervalId = setInterval(async function () {
        if(isUpdating == false){
            isUpdating = true;
            if(initErrorCounter == 10){
                alert("Server is offline or server info could not be fetched. Retrying... In 5 seconds");
                initErrorCounter++;
            }else if(initErrorCounter > 20){
                initErrorCounter = 0;
            }
            else{

                    const initResponse = await initDatabase() 
                    if(initResponse == false) initErrorCounter += 1
                    else{
                        initGameBoard()
                        startSyncTimer();
                        clearInterval(intervalId);
                    }
            
            }
            isUpdating = false;
        }
    }, 500)
})