personButton.onclick = () => {
    changeSettings("showOutlines", settings.showOutlines, !settings.showOutlines)
    if(settings.showOutlines){
        personButton.classList.add("active");
    } else {
        personButton.classList.remove("active");
    }
}



function changeSettings(key, value, newState) {
    if(key == "showOutlines"){
        gameBoardShowOutline(newState);
    }

    settings[key] = newState;
}
