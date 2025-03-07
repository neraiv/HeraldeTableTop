
// CHAT ----------------------------------------------------------------------------
sendButton.addEventListener("click", async function() {
    const chatMessage = chatWriteInput.value;
    const state = await sendRequest({type: "chat_send", payload: {message: chatMessage}})
    if(state.success === false){
        alert("Failed to send message")
    }else{
        chatWriteInput.value = '';
    }
})

chatWriteArea.addEventListener("keydown", async function(event) {
    if (event.key === 'Enter') {
        const chatMessage = chatWriteInput.value;
        chatWriteInput.value = '';
        const state = await sendRequest({type: "chat_send", payload: {message: chatMessage}})
        if(state.success === false){
            alert("Failed to send message")
        }else{
            chatWriteInput.value = '';
        }
    }
})

chatButton.onclick = async () => {
    if(chat.style.right !== "0px") {
        chat.style.right = "0px";
    }else{
        chat.style.right = "-330px";
    }
    
}

// Char Sheet ----------------------------------------------------------------------------
playerCharSheetButton.onclick = () => {
    displayCharaterSheet(player.charId)
}

// Map Button ----------------------------------------------------------------------------
mapButton.onclick = () => {
    userAskQuestion("Open Map In","Would you like to open on new tab?",
        {buttons: ["Yes", "No"],
            callback: (buttonText) => {
                if(buttonText === 'Yes'){
                    window.open('/map', '_blank');
                }else if(buttonText === 'No'){
                    
                }
            }
        }       
    )
}

// Storage Button ----------------------------------------------------------------------------
// storageButton.onclick = () => {
//     if (storage.style.left !== "50px") {
//         storage.style.left = "50px";
//     } else {
//         storage.style.left = "-330px";
//     }
// };

// Spell book button
spellBookButton.onclick = () => {
    const spellBook = document.getElementById("ui-spellbook");
    if (spellBook.style.display === "none") {
        spellBook.style.display = "flex";
    } else {
        spellBook.style.display = "none";
    }
}

infoButton.onclick = async (event) => {
    const sheet = await createQuestSheet("sari-01")
    sheet.style.left = event.clientX + "px";
    sheet.style.top = event.clientY + "px";
    userInterface.appendChild(sheet)
}

logOutButton.onclick = async (event) => {
    userAskQuestion('Logging out!', "Are you sure you want to log out?", 
        {buttons: ['Logout','Continue Advanture'], 
            callback: (buttonText) => {
                if (buttonText == 'Logout') {
                    sendRequest({type: "status", payload: "logout"})
                    window.location.href = "/";
                }
            },
        blocking: true});
}

// Update functionality
async function updateRequired(){
    isUpdating = true

    await sendRequest({type: 'status', payload: "sync"})

    // Chat updates
    if(updates.chat){
        const success = await updateChatMessages()
        if (success) {
            updates.chat = false;
        }
    }

    if(updates.reinit){
        let log = "Reinitializing "
        const _sceneData = await sendRequest({type: "update", payload: "scene"})

        if(_sceneData.success === true){
            sceneData = _sceneData.data
            if(updates.reinit.board){
                log += " Gameboard"
                await initGameBoard()
            }
            if(updates.reinit.layer){
                log += " Scene"
                await initScene()
            }
            updates.reinit = false;
            console.log(log)
        }
    }
    if(updates.scene.length > 0){

        updateList = new Set()

        for (const item of updates.scene) {
            let target = sceneData; // Reference to the root object
    
            // Traverse the object based on the "where" array except the last key
            for (let i = 0; i < item.where.length - 1; i++) {
                const key = item.where[i];
    
                // Ensure the key exists and is an object
                if (!target[key]) {
                    target[key] = {};
                }
    
                target = target[key]; // Move deeper
            }
    
            // Assign the data to the last key in the path
            target[item.where[item.where.length - 1]] = item.data;    
            
            if(item.where.includes("locations")){
                updateList.add(updateLocations)
            }else if(item.where.includes("visibleAreas")){
                updateList.add(updateFog)
            }
        }

        for(const item of updateList){
            await item()
        }

        updates.scene = []
    }
    isUpdating = false
}

function startSyncTimer() {
    
    let cnt = 0;
    async function update() {
        cnt++;
        if(isUpdating === false){
            try{
                
                await updateRequired()
            } catch(err){
                console.error("Failed to fetch chat data", err);
            }
        }
    }
    setInterval(update, 1000); // Update every second
}


document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    player.userKey = urlParams.get("key")
    player.userName = urlParams.get("userName")
    player.charId = urlParams.get("charId")

    let isUpdating = false;
    let initErrorCounter = 0

    let initStates = {
        serverInfo: false,
        sessionInfo: false,
        serverRules: false,
        sceneData: false
    }

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

                    const initResponse = await initDatabase(initStates) 
                    if(initResponse == false) initErrorCounter += 1
                    else{
                        await initGameBoard()  
                        initGameBoardFunctions()
                        await initScene()
                        await initSpells()
                        await startSyncTimer();
                        clearInterval(intervalId);
                    }
            
            }
            isUpdating = false;
        }
    }, 500)
})


