function setupPIXI(){
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODE.LINEAR;
}


document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    player.userKey = urlParams.get("key")
    player.userName = urlParams.get("userName")
    player.charId = urlParams.get("charId")
    
    await app.init({width: 1000, height: 1000, background: '#1099bb'});
    app.stage.sortableChildren = true;
    gameboardContent.appendChild(app.canvas);

    await initGameBoard(50, 1000, 1000)
    await initGameBoardFunctions()

    await conjureCharToken(player.charId)
    await conjureGroundToken(player.charId)
})

