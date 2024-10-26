function saveSpells(){
    fetch('http://localhost:5000/saveSpells', {
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
    await fetch('http://localhost:5000/avaliableSpells') // Make sure the URL matches the Flask endpoint
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
    fetch(`http://localhost:5000/getSpell/${spellLevel}/${spellName}`) // Ensure the URL matches the Flask endpoint
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
        const response = await fetch(`http://localhost:5000/getSpell/${spellLevel}/${spellName}`);
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

async function fetchLogin(user_id, password) {
    try {
        const response = await fetch(`http://localhost:5000/getUser?user_id=${user_id}&password=${password}`);
        const result = await response.json();

        if (response.ok) {
            user = result;
            console.log(user);
            alert('User created or logged in successfully!');
            return user;
        } else {
            alert(result.error);
            return null;
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('There was an error with the login process.', error);
        return null;
    }
}

async function getServerInfo(){
    try {
        const response = await fetch('http://localhost:5000/getServerInfo');
        const serverData = await response.json();

        if (response.ok && serverData.server_time) {

            // Display the server info on the UI
            console.log(serverData);
            serverInfo = serverData
            return serverData;
        } else {
            console.error('Failed to fetch server information');
            return null
        }
    } catch (error) {
        console.error('Error fetching server information:', error);
        return null
    }
}
async function updateServerInfo() {
    try {   
        serverInfo.isUpdating = true;    
        console.log("Sending server info update:", serverInfo); // Log before sending

        serverInfo.inGameChars = Object.fromEntries(inGameChars)
        const response = await fetch('http://localhost:5000/updateServerInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serverInfo),
        });

        if (!response.ok) {
            serverInfo.isUpdating = false;   
            throw new Error('Failed to update server info: ' + response.statusText);
        }

        serverInfo.isUpdating = false; 
    } catch (error) {
        alert('Error updating server info: ' + error.message);
        serverInfo.isUpdating = false; 
    }
}


async function startSyncTimer() {
    let isUpdating = false; // Flag to track ongoing updates

    async function update() {
        if (serverInfo.isUpdating) return;
        serverInfo = await getServerInfo();
        if (!serverInfo) {
            alert("Can't connect to server!");
            isUpdating = false; // Reset the flag on error
            return;
        }
    }

    setInterval(update, 1000); // Update every second
}

function addSpell(level, spellName, spellData) {
    // Check if the level exists in listSpells
    if (listSpells[level]) {
        // Remove "No Spell" if it exists
        if (listSpells[level]["No Spell"]) {
            delete listSpells[level]["No Spell"];
        }
        // Add the new spell to the specified level
        listSpells[level][spellName] = spellData;
    } else {
        console.error("Invalid spell level");
    }
}

