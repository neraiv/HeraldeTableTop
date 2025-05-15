function setupPIXI() {
    // Set up PIXI rendering settings
    app.stage.addChild(gameLayer);
    app.stage.addChild(uiLayer);
    
    // Ensure UI layer is on top and interactive
    uiLayer.zIndex = 1000;
    uiLayer.interactive = true;
    uiLayer.interactiveChildren = true;
    
    // Position UI layer to cover the entire canvas
    uiLayer.position.set(0, 0);
    uiLayer.width = app.screen.width;
    uiLayer.height = app.screen.height;

    // Initialize game layer settings
    gameLayer.zIndex = 0;
    gameLayer.interactive = true;
    gameLayer.interactiveChildren = true;
    gameLayer.sortableChildren = true;
    
    // Position game layer to cover the entire canvas
    gameLayer.position.set(0, 0);
    gameLayer.width = app.screen.width;
    gameLayer.height = app.screen.height;
}

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    player.userKey = urlParams.get("key")
    player.userName = urlParams.get("userName")
    player.charId = urlParams.get("charId")
    player.gameId = urlParams.get("gameId")
    
    await sendRequest({event: "sync", payload: {scene: true}}).then((data) => {
        if(data.success){
            database.sceneData = data.scene
        }
    })
    
    await app.init({
        background: '#1099bb',
        width: database.sceneData.width,
        height: database.sceneData.height,
        autoDensity: true
    });
    app.stage.sortableChildren = true;
    gameboardContent.appendChild(app.canvas);

    setupPIXI()

    await initGameBoard(database.sceneData.grid_size, database.sceneData.width, database.sceneData.height)

    gameBoardPan(1000, 1000, 1)

    await initGameBoardFunctions()

    await initScene()
})
