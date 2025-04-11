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

async function initSpells(){
    const _listSpells = await sendRequest({type: "update", payload: "spells"})
    if (_listSpells.success === true){
        database.spells = _listSpells.data

        populateSpellBook()
    }
}  

async function initGameBoardFunctions(){
    const maxZoomOut = 0.6 // If its lower grids dissaper
    const maxZoomIn = 5 // it can be higher

    const dotList =  createTestDots(gameboardContent, 1)
    gameboardContent.addEventListener('mousedown', (event) => {
        if (event.button === 0 && gameboardContent.style.cursor === 'move') { // Middle mouse button
            boardEvent.isPanning = true;
            boardEvent.panStartX = event.clientX - boardEvent.panX;
            boardEvent.panStartY = event.clientY - boardEvent.panY;
        }
        if (event.button === 1 && gameboardContent.style.cursor !== 'move') { // Middle mouse button
            boardEvent.isPanning = true;
            boardEvent.panStartX = event.clientX - boardEvent.panX;
            boardEvent.panStartY = event.clientY - boardEvent.panY;
            gameboardContent.style.cursor = 'grabbing';
        }
    });

    gameboardContent.addEventListener('mouseup', (event) => {
        boardEvent.isPanning = false;
        if (event.button === 1 && gameboardContent.style.cursor !== 'move') gameboardContent.style.cursor = 'auto';
    });

    gameboardContent.addEventListener('mousemove', (event) => {
        if (!boardEvent.isPanning) return;
        gameBoardPan(event.clientX - boardEvent.panStartX, event.clientY - boardEvent.panStartY)
    });

    gameboardContent.addEventListener('wheel', (event) => {
        event.preventDefault();
        const scaleAmount = -event.deltaY * 0.001;
        boardEvent.scale = Math.min(Math.max(maxZoomOut, boardEvent.scale + scaleAmount), maxZoomIn);
        gameboardContent.style.transform = `translate(${boardEvent.panX}px, ${boardEvent.panY}px) scale(${boardEvent.scale})`;
    });

    gameboardContent.addEventListener('dragstart', (event) => {
        // Store initial screen position in transformed coordinates
        boardEvent.dragStartX = (event.clientX - boardEvent.panX) / boardEvent.scale;
        boardEvent.dragStartY = (event.clientY - boardEvent.panY) / boardEvent.scale;
        
        // Store element's current position
        boardEvent.elementStartX = parseInt(event.target.style.left) || 0;
        boardEvent.elementStartY = parseInt(event.target.style.top) || 0;
    });

    gameboardContent.addEventListener('dragend', (event) => {
        // Calculate final board coordinates
        const finalX = (event.clientX - boardEvent.panX) / boardEvent.scale;
        const finalY = (event.clientY - boardEvent.panY) / boardEvent.scale;

        // Calculate relative movement
        const deltaX = finalX - boardEvent.dragStartX;
        const deltaY = finalY - boardEvent.dragStartY;

        // Update element position
        const newX = boardEvent.elementStartX + deltaX;
        const newY = boardEvent.elementStartY + deltaY;

        gameBoardMoveToken(event.target, newX, newY);
    });
}

async function initGameBoard() {
    console.log("Initializing game board...")  

    const gridSize = database.sceneData.grid_size
    const width = database.sceneData.width
    const height = database.sceneData.height

    gridBackground.style.backgroundSize = `${gridSize}px ${gridSize}px`;

    gameboardContent.style.width = `${width}px`
    gameboardContent.style.height = `${height}px`;
    gameboardContent.style.top = `${-height/2}px`
    gameboardContent.style.left = `${-width/2}px`;

    gameboardContent.style.transform = `translate(0px, 0px) scale(1)`;
}

async function initScene(){
    console.log("Initializing layer...")

    // future get image  width and heigh with scale factor
    backgroundLayer.innerHTML = "" // FUTURE we may keep old layer in case of fast returning
    characterLayer.innerHTML = "" // FUTURE we may keep old layer in case of fast returning
    audioAmbiance.pause()

    Object.keys(gameSceneData).forEach((key) => gameSceneData[key] = [])

    if(!database.sceneData.layer) return alert("Layer not found in the scene")

    topBarSceneName.textContent = database.sessionInfo.locations[player.charId].currentScene.name
    topBarLayerName.textContent = "Layer " + database.sessionInfo.locations[player.charId].currentScene.layer

    const background = await addBackground(database.sceneData.layer.width, database.sceneData.layer.height, database.sceneData.layer.x, database.sceneData.layer.y, "static/images/background/"+database.sceneData.layer.img)
    
    await updateLocations()

    await updateFog()

    if (database.sceneData.layer.ambiance) {
        audioAmbiance.src = `static/images/background/${database.sceneData.layer.ambiance}`;        
    }
    
}