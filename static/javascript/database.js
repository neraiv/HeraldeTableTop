const serverUrl = DEBUG_MODE ? "http://localhost:5000/" : godLevelServerDomain ;
let isUpdating = false; // Flag to prevent multiple updates


// async function dbGetUrlForImage(name, location, type) {
//     const params = new URLSearchParams({
//         "key": player.userKey,
//         "name": name,
//         "location": location,
//         "type": type
//     });

//     try {
//         const response = await fetch(`${serverUrl}getUrlForImage?${params.toString()}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//         const data = await response.json();
//         return data.url;
//     } catch (err) {
//         console.error("Error in dbGetUrlForImage: ", err);
//         return null;
//     }
// }

async function dbGetSession(){
    const params = new URLSearchParams({
        "key": player.userKey
    });

    try {
        const response = await fetch(`${serverUrl}getSession?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error in getChar: ", err);
        return null
    }  
}

async function getChat(idx, len) {
    const params = new URLSearchParams({
        "key": player.userKey,
        "idx": idx,
        "len": len
    });

    try {
        const response = await fetch(`${serverUrl}getChat?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data.data
    } catch (err) {
        console.error("Error in getChar: ", err);
        return null
    }
}

async function sendMessage(message) {
    const body = {
        key: player.userKey, // Assuming `player.userKey` is defined elsewhere
        message: message
    };
 
    let ok = false;
    let data = null
    while (!ok) {
        try {
            const response = await fetch(`${serverUrl}sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
    
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
    
            data = await response.json();
        } catch (err) {
            console.error("Error in sendMessage: ", err);
            return null;
        }
    } 

    return data
}

async function dbGetChar(charName) {
    const params = new URLSearchParams({
        "key": player.userKey,
        "char": charName,
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
async function getGameFile(file, isFromSession = true) {
    const params = new URLSearchParams({
        "key": player.userKey,
        "info": file,
        "state": isFromSession
    });

    try {
        const response = await fetch(`${serverUrl}getGameInfo?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        
        if(data === undefined || data.data === undefined) return null; 
        return data.data; // Return the fetched data
    } catch (err) {
        console.error("Error in getGameFile: ", err);
        return null
    }
}




