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

    const locations = database.sceneData.layer.locations

    const portalCompare = compareWithDb(gameSceneData.portals.map((portal) => portal.id),
                                        Object.keys(locations.portals))

    if(portalCompare.updateStatus === true){
        for(let portalId of portalCompare.removed){
            characterLayer.querySelector(`#${portalId}`).remove()
            gameSceneData.portals = gameSceneData.portals.filter((portal) => portal.id!== portalId)
        }
        for(let portalId of portalCompare.missing){
            addPortal(portalId, locations.portals[portalId])
        }
    }

    const charCompare = compareWithDb(gameSceneData.chars.map((char) => char.id), 
                                        Object.keys(locations.chars))

    if(charCompare.updateStatus === true){

        for(let charId of charCompare.removed){
            characterLayer.querySelector(`#${charId}`).remove()
            gameSceneData.chars = gameSceneData.chars.filter((char) => char.id!== charId)
        }

        for(let charId of charCompare.missing){
            if(!database.chars[charId]){
                await serverGetChar(charId);
            }
        
            const charInfo = database.chars[charId]
        
            addCharacter(charInfo.char, charInfo.width, charInfo.height, locations.chars[charId].x, locations.chars[charId].y, "static/images/character/"+charInfo.img)
        }
    }

    const npcCompare = compareWithDb(gameSceneData.npcs.map((npc) => npc.id), 
                                        Object.keys(locations.npcs))

    if(npcCompare.updateStatus === true){
        for(let npcId of npcCompare.removed){
            characterLayer.querySelector(`#${database.npcs[npcId].id}`).remove()
            gameSceneData.npcs = gameSceneData.npcs.filter((npc) => npc.id!== npcId)
        }
        for(let npcId of npcCompare.missing){
            if(!database.npcs[npcId]){
                await serverGetNpc(npcId);
            }
            const pos = locations.npcs[npcId]
            const charInfo = database.npcs[npcId]
            const charToken = await addCharacter(charInfo.char, charInfo.width, charInfo.height, pos.x, pos.y, "static/images/character/"+charInfo.img)
            npcToken.addEventListener('click', async (event) => {
                const questList =  createNpcTalkSheet(npcId)
            })
        }
    }   
}

async function updateFog(){
    // 1. Initialize fog layer (fully black canvas)
    const fogCtx = fogCanvas.getContext('2d');

    fogCanvas.width = parseInt(database.sceneData.width);  // Actual pixel dimensions
    fogCanvas.height = parseInt(database.sceneData.height); // (not CSS size)

    // 2. Fill fog layer with solid black
    fogCtx.fillStyle = 'black';
    fogCtx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);

    // 3. Define your shape data
    // 4. Draw visible areas (holes in the fog)
    fogCtx.globalCompositeOperation = 'destination-out'; // Erase from fog

    database.sceneData.visibleAreas.forEach(shape => {
        if (shape.shape === 'circle') {
            // Create radial gradient for soft edges
            const gradient = fogCtx.createRadialGradient(
                shape.x, shape.y, 0,
                shape.x, shape.y, shape.radius
            );
            
            // Use RGBA to control alpha: fully erase at center, no erase at edge
            gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            fogCtx.fillStyle = gradient;
            fogCtx.beginPath();
            fogCtx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
            fogCtx.fill();
        }
    });

    // 5. Reset composite mode
    fogCtx.globalCompositeOperation = 'source-over';
}