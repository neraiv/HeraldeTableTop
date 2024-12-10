// Game Board -----------------------------------------------------------------------
async function addBackground(width, height, x, y, img = null){
    const background = document.createElement("div")
    background.classList.add("background")
    background.style.left = `${x}px`
    background.style.top = `${y}px`
    background.style.width = `${width}px`
    background.style.height = `${height}px`
    background.draggable = true

    if(img){
        background.style.backgroundImage = `url(${img})`
        background.style.backgroundSize = "cover"
        background.style.backgroundPosition = "center"
    }

    backgroundLayer.appendChild(background)
}

async function addCharacter(char, width, height, x, y, img = null){
    const charToken = document.createElement("div")
    charToken.classList.add("character")
    charToken.id = char.id
    charToken.style.left = `${x}px`
    charToken.style.top = `${y}px`
    charToken.style.width = `${width}px`
    charToken.style.height = `${height}px`
    charToken.draggable = true

    if(img){
        charToken.style.backgroundImage = `url(${img})`
        charToken.style.backgroundSize = "cover"
        charToken.style.backgroundPosition = "center"
    }

    characterLayer.appendChild(charToken)
}

async function initLayer(){
    // future get image  width and heigh with scale factor
    const layer = sceneInfo.layers[sessionInfo.currentScene.layer]

    backgroundLayer.innerHTML = "" // FUTURE we may keep old layer in case of fast returning

    const width = undefined
    const height = undefined


    if(width === undefined || height === undefined){
        addBackground(sceneInfo.grid_size, sceneInfo.grid_size, layer.x, layer.y)
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
    gameboardContent.style.top = `${-height/2}px`
    gameboardContent.style.left = `${-width/2}px`;

    gameboardContent.style.transform = `translate(0px, 0px) scale(1)`;

    initLayer()
}

async function addPortal(portal){
    const portalToken = document.createElement("div")
    portalToken.classList.add("portal")
    portalToken.classList.add(portal.type)
    portalToken.style.left = `${portal.x}px`
    portalToken.style.top = `${portal.y}px`
    portalToken.style.width = `${portal.width}px`
    portalToken.style.height = `${portal.height}px`
    portalToken.to = portal.to

    portalToken.addEventListener("click", async function(event){
        if(portalToken.classList.contains("layer")){
            if(sceneInfo.layers[portalToken.to]){
                sessionInfo.currentScene.layer = portalToken.to
                initLayer()
            }else{
                alert("Layer does not exist")
            }
        }else if(portalToken.classList.contains("scene")){
            if(sceneInfo[portalToken.to]){
                sessionInfo.currentScene = sceneInfo[portalToken.to]
                sessionInfo.currentScene.layer = 1
                initScene()
            }
        }

    })
    
    characterLayer.appendChild(portalToken)
}

async function initGameBoard() {
    const newSessionData = await dbGetSession()

    async function initGameBoardFunctions(){
        const maxZoomOut = 0.6 // If its lower grids dissaper
        const maxZoomIn = 5 // it can be higher
        gameboardContent.addEventListener('mousedown', (event) => {
            if (event.button === 0 && gameboardContent.style.cursor === 'move') { // Middle mouse button
                boardEvent.isPanning = true;
                boardEvent.startX = event.clientX - boardEvent.panX;
                boardEvent.startY = event.clientY - boardEvent.panY;
            }
            if (event.button === 1 && gameboardContent.style.cursor !== 'move') { // Middle mouse button
                boardEvent.isPanning = true;
                boardEvent.startX = event.clientX - boardEvent.panX;
                boardEvent.startY = event.clientY - boardEvent.panY;
                gameboardContent.style.cursor = 'grabbing';
            }
        });
    
        gameboardContent.addEventListener('mouseup', (event) => {
            boardEvent.isPanning = false;
            if (event.button === 1 && gameboardContent.style.cursor !== 'move') gameboardContent.style.cursor = 'auto';
        });
    
        gameboardContent.addEventListener('mousemove', (event) => {
            if (!boardEvent.isPanning) return;
            boardEvent.panX = event.clientX - boardEvent.startX;
            boardEvent.panY = event.clientY - boardEvent.startY;
    
            gameboardContent.style.transform = `translate(${boardEvent.panX}px, ${boardEvent.panY}px) scale(${boardEvent.scale})`;
        });
    
        gameboardContent.addEventListener('wheel', (event) => {
            event.preventDefault();
            const scaleAmount = -event.deltaY * 0.001;
            boardEvent.scale = Math.min(Math.max(maxZoomOut, scale + scaleAmount), maxZoomIn);
            gameboardContent.style.transform = `translate(${boardEvent.panX}px, ${boardEvent.panY}px) scale(${boardEvent.scale})`;
        });

        gameboardContent.addEventListener('dragStart', (event) => {
            boardEvent.dragStartX = event.clientX;
            boardEvent.dragStartY = event.clientY;
            // Which element is being dragged
            const element = event.target;
            if(element.classList.contains("background")){

            }
        })
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