async function  initDatabase(initStates){
    try {
        // Fetch server info
        const _serverInfo = await sendRequest({ type: "update" , payload: "server_info"});
        const _sessionInfo = await sendRequest({ type: "update" , payload: "session_info"});
        const _serverRules = await sendRequest({type: "update" , payload: "rules"})
        const _sceneData = await sendRequest({type: "update", payload: "scene"})
        const _register = await sendRequest({event: "register"})

        if (_register.success === true){
            initStates.register = true
        }

        if (_serverInfo.success === true) {
            database.serverInfo = _serverInfo.data;
            initStates.serverInfo = true;
        }
        if (_sessionInfo.success === true) {
            database.sessionInfo = _sessionInfo.data;
            initStates.sessionInfo = true;
        }
        if (_serverRules.success === true) {
            database.serverRules = _serverRules.data;
            initStates.serverRules = true;
        }
        if(_sceneData.success === true){
            database.sceneData = _sceneData.data
            initStates.sceneData = true;
        }

    } catch (error) {
        // Handle unexpected errors
        return false
    }

    // Wait for all tasks to complete before returning
    if (Object.values(initStates).every(state => state === true)) {
        console.log("Database initialized successfully.");
        return true;
    } else {
        console.warn("Failed to initialize database:", initStates);
        return false;
    }
}


const socket = io(serverUrl);

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', (reason) => {
    console.warn('Disconnected:', reason);
});

socket.on('change', async (data) => {
    resolveChanges(data)
});

function resolveChanges(data) {
    consol.log("Data: ", data)
}

async function sendRequest({event = "request", payload = {}, timeout = 5000}) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error(`Request timed out after ${timeout}ms. event: ${event} payload: ${payload}.`));
        }, timeout);

        socket.emit( event, {
            key: player.userKey,
            payload: payload
        });

        socket.once("response", (data) => {
            clearTimeout(timeoutId);
            if(data.success === false) {
                console.log("Error Fetching Request: ", data)
            }
            resolve(data);
        });

        socket.once("error", (err) => {
            clearTimeout(timeoutId);
            console.error("Socket error:", err);
            reject(err);
        });
    });
}