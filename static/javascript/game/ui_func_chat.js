
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

async function updateChatMessages(){
    const _sessionInfo = await sendRequest({ type: "update" , payload: "session_info"});
    if(_sessionInfo.success === true){
        sessionInfo = _sessionInfo.data
        const diff = parseInt(sessionInfo.chat_idx, 10) - parseInt(chat.last_idx, 10) - 1 ;
        const chatData = await sendRequest({type: "chat_get", payload: {start: sessionInfo.chat_idx, length: diff}})
        if (chatData.success === true){
            for (const data of chatData.data) {
                addMessageToChat(data.message, data.user, data.timestamp)
            }
            chat.last_idx = sessionInfo.chat_idx;
            return true
        }
    }
    
    return false;
}