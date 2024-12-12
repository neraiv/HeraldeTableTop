function getTokenShape(rect, tokenShapeType){
    if(tokenShapeType == tokenShapeTypes.BOX){
        return getBoxFromRect(rect);
    } else if(tokenShapeType == tokenShapeTypes.HEXAGON){
        return getHexagonFromRect(rect);
    }
}

function getObjectPosition(id){
    if (objectsPositions.get(id)) {
        return objectsPositions.get(id)[1];
    } else {
        console.error(`Object with id ${id} not found in objectsPositions.`);
        return null;
    }
}

function isSpellUsable(char, spell, mana=null) {
    // Check if the character has enough spell slots
    return char.spellSlots[mana ? mana : spell.spellLevel][1] > 0
}


function getMousePositionOnGameboard(event) {
    const gameboardRect = gameboardContent.getBoundingClientRect(); // Get the bounding rectangle of the gameboard

    // Calculate the mouse position relative to the gameboard
    const mouseX = (event.clientX - gameboardRect.left) / scale;
    const mouseY = (event.clientY - gameboardRect.top) / scale;

    return { x: mouseX, y: mouseY };
}

function moveObject(element, newX, newY){
    element.style.left = `${newX}px`;
    element.style.top = `${newY}px`;

    const elementRect = objectsPositions.get(element.id);
    elementRect.x = newX;
    elementRect.y = newY;

    console.log("hello")
}

function addObjectToBoard(src, layer, x, y, z_index = null) {
    if (layer == layers["character-layer"]){
        if(objectsPositions.has(src.id)) return;
        const token = createCharacterToken(src, x, y);
        layers["character-layer"].appendChild(token);     
    } else if (layer == layers["background-layer"]) {
        if(objectsPositions.has(src.id)) return;
        const parts = src.src.split('/'); // Split the path into an array
        const secondToLastItem = parts[parts.length - 2]; // Access the second-to-last item
        const list = listBackgroundFiles[secondToLastItem].LIGHT_FILES.concat(listBackgroundFiles[secondToLastItem].DARK_FILES);
        // Example usage
        askForListSelect(list).then(selectedValue => {
            const token = createBackgroundToken(src, x, y);
            layers["background-layer"].appendChild(token);
        });
    }
}

function getBoxFromRect(rect){
    const shape = [
        {x: rect.left, y: rect.top},
        {x: rect.left + rect.width, y: rect.top},
        {x: rect.left + rect.width, y: rect.top + rect.height},
        {x: rect.left, y: rect.top + rect.height}
    ]
    return shape;
}

function getHexagonFromRect(rect){
    const { x, y, width, height } = rect;

    // Calculate the center of the DOMRect
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    // Radius of the hexagon - we use half the smaller dimension for fitting
    const radius = Math.min(width, height) / 2;

    // Create an array to store the points of the hexagon
    const hexagonPoints = [];

    // Calculate the 6 corner points using trigonometry
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;  // 60 degrees in radians for each vertex
        const pointX = centerX + radius * Math.cos(angle);
        const pointY = centerY + radius * Math.sin(angle);
        hexagonPoints.push({ x: pointX, y: pointY });
    }

    return hexagonPoints;  
}

function changeCharacterFaction(id, target){
    //FUTURE
}
function moveToEnemyAlly(id, to_enemy) {
    let allyIndex = listAllies.findIndex(ally => ally.id === id);
    let enemyIndex = listEnemies.findIndex(enemy => enemy.id === id);

    if(to_enemy && allyIndex !== -1) { // Moving from allies to enemies
        let ally = listAllies.splice(allyIndex, 1)[0]; // Remove from allies
        listEnemies.push(ally); // Add to enemies
    } else if (!to_enemy && enemyIndex !== -1) { // Moving from enemies to allies
        let enemy = listEnemies.splice(enemyIndex, 1)[0]; // Remove from enemies
        listAllies.push(enemy); // Add to allies
    }
}

function roll(rollList, bonuses = 0, rollTime = 1) {

    // Iterate through each roll in the rollList
    let result = 0;
    for (let i = 0; i < rollTime; i++) {
        let total = 0;
        for (let roll of rollList) {
            // Parse the roll string (e.g., '3d6')
            const [numDice, diceSides] = roll.split('d').map(Number);
            
            // Roll the dice and sum the results
            let rollTotal = 0;
            for (let i = 0; i < numDice; i++) {
                rollTotal += Math.floor(Math.random() * diceSides) + 1;
            }""

            // Add bonuses if any
            rollTotal += bonuses;

            // Add to the total
            total += rollTotal;

            // Log each roll for reference (optional)
            console.log(`Rolled ${numDice}d${diceSides}: ${rollTotal}`);
        }
        result = Math.max(result, total);
    }

    // Return the total roll result
    return result;
}