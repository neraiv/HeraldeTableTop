const serverUrl = DEBUG_MODE ? "http://localhost:5000/" : godLevelServerDomain ;
let isUpdating = false; // Flag to prevent multiple updates


async function getChar(char) {
    const params = new URLSearchParams({
        key: userKey,
        char: char,
    });

    try {
        const response = await fetch(`${serverUrl}getChar?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data.char; // Return the fetched character data
    } catch (err) {
        console.error("Error in getChar: ", err);
        throw err; // Throw the error to handle it in the caller
    }
}
async function getGameFile(file) {
    const params = new URLSearchParams({
        key: userKey,
        info: file,
    });

    try {
        const response = await fetch(`${serverUrl}getGameInfo?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        
        if(data === undefined || data.data === undefined || data.data.inGameChars === undefined) return; 

        const charDiff = compareWithDb(Object.keys(inGameChars), data.data.inGameChars);

        if (charDiff.updateStatus) {
            isUpdating = true
            if (charDiff.missing.length > 0) {
                for (let char of charDiff.missing) {
                    const charStats = await getChar(char); // Await here works now
                    console.log("New character added: ", char, charStats);
                    inGameChars[char] = charStats; // Add the fetched charStats to the array
                }
            }
            if(charDiff.removed.length > 0) {
                for (let char of charDiff.removed) {
                    console.log("Char removed: ", char);
                    delete inGameChars[char]; // Add the fetched charStats to the array
                }
            }
            isUpdating = false
        }

        return data; // Return the fetched data
    } catch (err) {
        console.error("Error in getGameFile: ", err);
        throw err; // Throw the error to handle it in the caller
    }
}


function startSyncTimer() {
    
    let cnt = 0;
    async function update() {
        cnt++;
        if(isUpdating === false){
            await getGameFile("game_elements.json")
        }
    }
    setInterval(update, 1000); // Update every second
}

