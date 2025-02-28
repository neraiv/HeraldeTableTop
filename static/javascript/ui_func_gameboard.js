function gameBoardPan(x = null, y = null, scale = null) {
    x = x ?? boardEvent.panX;
    y = y ?? boardEvent.panY;
    scale = scale ?? boardEvent.scale;
    
    gameboardContent.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

    // Update the pan values
    boardEvent.panX = x;
    boardEvent.panY = y;
    boardEvent.scale = scale;
}


function gameBoardMoveToken(element, x, y, no_request= false){
    if(element.classList.contains("character")){
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        if(no_request === true) return
        sendRequest({type: "action", payload: {action: "move", id: element.id, x: x, y: y}});
    }
}