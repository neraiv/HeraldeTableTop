const serverUrl = DEBUG_MODE ? "http://localhost:5000/" : godLevelServerDomain ;
let isUpdating = false; // Flag to prevent multiple updates

const socket = io(serverUrl);

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', (reason) => {
    console.warn('Disconnected:', reason);
});

socket.on('change', async (data) => {
    const typeParts = data.type.split('_')

    if (typeParts[0] === "chat") {
        updates.chat.requires = true;
    }
    else if (typeParts[0] === "reinit"){
        if(typeParts[1] === "scene"){
            updates.reinit = {
                board: true,
                layer: true
            }
        }else if (typeParts[1] === "layer"){
            updates.reinit = {
                board: false,
                layer: true
            }
        }
    }
    else if(typeParts[0] === "change"){
        if(typeParts[1] === "scene") {
            updates.scene.data.push({
                where: typeParts.slice(2),
                data: data.data
            })
        }
    }
    else if(typeParts[0] === "turn") {
        updates.turnStatus.data = {
            type: typeParts[1],
            data: data.data
        }
    }

    if(data.prior === 0){
        await updateRequired()
    }
});


async function sendRequest({ type = "", payload = {}, timeout = 5000, event = "request"}) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error(`Request timed out after ${timeout}ms for type: ${type} and payload: ${payload}`));
        }, timeout);

        socket.emit( event, {
            key: player.userKey,
            type: type,
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

async function serverGetChar(charId){
    if (!database.chars[charId]){
        const _charData =  await sendRequest({type: "get", payload: {type: "char", id: charId}})

        if(_charData.success === true){
            database.chars[_charData.data.char.id] = {
                char : new Character(_charData.data.char), 
                width: _charData.data.width, 
                height: _charData.data.height,
                img: _charData.data.img
            }
        }else{
            console.log("Character not found", charId, ". Retrying in 1 second")
            return setTimeout(serverGetChar, 1000, charId)
        }
    }
}


async function serverGetNpc(npcId){
    if (!database.npcs[npcId]){
        const _npcData =  await sendRequest({type: "get", payload: {type: "npc", id: npcId}})

        if(_npcData.success === true){
            database.npcs[npcId] = _npcData.data
            
        }else{
            console.log("Character not found", npcId, ". Retrying in 1 second")
            return setTimeout(serverGetChar, 1000, npcId)
        }
    }
}

async function serverGetSpell(spellId){
    if (!database.npcs[spellId]){
        const spellData =  await sendRequest({type: "get", payload: {type: "spell", id: spellId}})

        if(spellData.success === true){
            database.spells[spellId] = spellData.data
            
        }else{
            console.log("Spell not found", spellId, ". Retrying in 1 second")
            return setTimeout(serverGetChar, 1000, spellId)
        }
    }else{
        return database.spells[spellId]
    }
}

