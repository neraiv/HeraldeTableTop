const serverUrl = DEBUG_MODE ? "http://localhost:5000/" : godLevelServerDomain ;

function saveSpells(){
    const creadaantials = `user_id=${user_id}&password=${password}`
    fetch(serverUrl + 'saveSpells?' + creadaantials, {
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

async function fetchLogin(user_id, password) {
    try {
        const creadaantials = `user_id=${user_id}&password=${password}`
        const fullURL = serverUrl + `getUser?`+ creadaantials;
        const response = await fetch(fullURL);
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

async function fetchUserSync(user_id, password) {
    try {
        const fullURL = serverUrl + `userSync?user_id=${user_id}&password=${password}`;
        const response = await fetch(fullURL);
        const result = await response.json();

        if (response.ok) {      
            return result;
        } else {
            console.log(result);
            return null;
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return null;
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

async function startSyncTimer() {

    async function update() {
        const result = await fetchUserSync(userName, userPassword);

        if(result.update_status == "true"){
            let paths = null;
            while(paths == null){
                paths = await fetchGetFilePaths(userName, userPassword)
            }
            allFilePaths = new Program_FilePathsHolder({
                listCharacter: paths["character_list"],
                listNPC: paths["npc_list"],
                listClassIcons: paths["class_icon_list"],
                listSounds: paths["general_sounds_list"],
                listBackground: paths["background_list"],
            })
        }
    }

    setInterval(update, 1000); // Update every second
}

