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

async function updateLocations(){

    const locations = sceneData.layer.locations

    if(locations.portals){
        for(let portalId of Object.keys(locations.portals)){
            const portalToken = characterLayer.querySelector("#portal-" + portalId)
            if(portalToken){
                //  FUTURE change color of portal
            }else{
                addPortal(portalId, locations.portals[portalId])
            }
        }
    }

    if(locations.chars){
        for(let charId of Object.keys(locations.chars)){
            const charToken = characterLayer.querySelector("#" + charId)
            if(charToken){
                if(charId == player.charId) continue;
                gameBoardMoveToken(charToken, locations.chars[charId].x, locations.chars[charId].y, true)
            }else{
                if(!inGameChars[charId]){
                    await serverGetChar(charId);
                }
        
                const pos = locations.chars[charId]
                const charInfo = inGameChars[charId]
        
                const charToken = characterLayer.querySelector(`#${charInfo.char.id}`);

                addCharacter(charInfo.char, charInfo.width, charInfo.height, pos.x, pos.y, "static/images/character/"+charInfo.img)
            }
        }


        if(locations.npcs){
            for(const npcId of Object.keys(locations.npcs)){
                const npcToken = characterLayer.querySelector(`#${database.npcs[npcId].id}`);
                if(npcToken){
                    gameBoardMoveToken(npcToken, locations.npcs[npcId].x, locations.npcs[npcId].y, true)
                }else{
                    if(!database.npcs[npcId]){
                        await serverGetNpc(npcId);
                    }
        
                    const pos = locations.npcs[npcId]
                    const charInfo = database.npcs[npcId]
        
                    // FUTURE addNPCToken fonksiyonu yap
                    
                    const npcToken = await addCharacter(charInfo.char, charInfo.width, charInfo.height, pos.x, pos.y, "static/images/character/"+charInfo.img)
        
                    npcToken.addEventListener('click', async (event) => {
                        const questList =  createNpcTalkSheet(npcId)
                    })  
                }      
            }
        }
    }


}