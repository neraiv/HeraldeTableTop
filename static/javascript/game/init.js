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
    
    await app.init({
        background: '#1099bb',
        width: 1940,
        height: 1080,
        autoDensity: true
    });
    app.stage.sortableChildren = true;
    gameboardContent.appendChild(app.canvas);

    setupPIXI()
    
    await initGameBoard(50, 1940, 1080)
    await initGameBoardFunctions()

    await conjureCharToken(player.charId)
    await conjureGroundToken(player.charId)
})
