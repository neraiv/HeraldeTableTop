const serverUrl = DEBUG_MODE ? "http://localhost:5000/" : godLevelServerDomain ;

function saveSpells(){
    fetch(serverUrl + 'saveSpells', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(listSpells),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => console.error('Error:', error));
}

async function fetchAvailableSpells() {
    await fetch( serverUrl + 'avaliableSpells') // Make sure the URL matches the Flask endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Available Spells:', data);
            // Process the available spells here
            // Example: displaying the spells in a list
            databaseListSpells = data
        })
        .catch(error => console.error('Error fetching available spells:', error));
    return
}

function fetchSpell(spellLevel, spellName) {
    fetch( serverUrl + `getSpell/${spellLevel}/${spellName}`) // Ensure the URL matches the Flask endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            listSpells[spellLevel] 
            console.log('Fetched Spell:', data);
            addSpell(spellLevel, spellName, data)
            // Process the fetched spell data here
        })
        .catch(error => console.error('Error fetching spell:', error));
}

async function fetchSpellWait(spellLevel, spellName) {
    try {
        const response = await fetch( serverUrl + `getSpell/${spellLevel}/${spellName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched Spell:', data);
        
        // Assuming listSpells is a global or accessible object
        addSpell(spellLevel, spellName, data); // Process the fetched spell data here
        return data;
    } catch (error) {
        console.error('Error fetching spell:', error);
        return null; // Return a default spell object in case of error
    }
}

async function fetchGetFilePaths(user_id, password){
    try {
        const fullURL = serverUrl + `getPaths?user_id=${user_id}&password=${password}`;
        const response = await fetch(fullURL);
        const result = await response.json();

        console.log(result);

        if (response.ok) {      
            return result;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return null;
    }
}

async function getGameFile(file){
    const params = new URLSearchParams({
        key: userKey,
        info: file,
    });
    
    fetch(`${serverUrl}getGameInfo?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        return data;
    })
}

function startSyncTimer() {
    
    let cnt = 0;
    async function update() {
        cnt++;
        await getGameFile("game_elements.json")
    }
    setInterval(update, 1000); // Update every second
}

