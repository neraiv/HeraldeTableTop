document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    player.userKey = urlParams.get("key")
    player.userName = urlParams.get("userName")
    player.charId = urlParams.get("charId")
    
    await app.init({background: '#1099bb', resizeTo: gameboardContent });
    app.stage.sortableChildren = true;
    gameboardContent.appendChild(app.canvas);

    await initGameBoard(50, 1000, 1000)
    await initGameBoardFunctions()

    await conjureCharToken(player.charId)
    await conjureGroundToken(player.charId)
})

