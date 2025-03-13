async function displayCharaterSheet(charId) {
    const char = inGameChars[charId].char;

    const characterSheet = document.createElement("div");
    characterSheet.classList.add("character-sheet");
    characterSheet.classList.add("column")
    characterSheet.classList.add("vertical")
    characterSheet.style.gap = "10px";
    characterSheet.id = "character-sheet-" + charId;
    userInterface.appendChild(characterSheet);

    const topRow = addDraggableRow(characterSheet);
    topRow.classList.add('row');
    topRow.classList.add("vertical")
    topRow.style.justifyContent = "space-between";
    topRow.style.width = "100%"
    
    const charName = document.createElement("h2");
    charName.textContent = char.name;
    charName.style.textAlign = "center";
    charName.style.fontFamily = "'Cinzel', serif"; // DnD theme font
    charName.style.fontSize = "20px"; // Larger font size
    charName.style.margin = "0px"; // No margin
    charName.style.padding = "5px"; // Padding to keep text off the edges
    charName.style.borderBottom = "1px solid black";
    charName.style.marginLeft = "5px";
    topRow.appendChild(charName);

    const closeButton = createImageButton('28', {source: "url(static/images/menu-icons/close.png)", custom_padding: 4});
    closeButton.style.marginRight = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
        characterSheet.remove();
    };
    topRow.appendChild(closeButton);
    
    const infoContainer = document.createElement("div");
    infoContainer.style.display = "block";
    infoContainer.style.width = "100%";
    infoContainer.style.height = "100%";
    infoContainer.style.gap = "10px";
    infoContainer.style.backgroundColor = "red";
    infoContainer.style.overflow = "auto";
    characterSheet.appendChild(infoContainer);

    const charInfo = document.createElement("div");
    charInfo.classList.add("row");
    charInfo.style.justifyContent = "space-between";
    charInfo.style.padding = "10px";
    charInfo.style.gap = "5px";
    infoContainer.appendChild(charInfo);

    const charStats = document.createElement("div");
    charStats.classList.add("column");
    charStats.classList.add("vertical");
    charStats.classList.add("box-circular-border");
    charStats.style.padding = "10px";
    charStats.style.gap = "5px";
    charStats.style.width = "30%";
    charInfo.style.backgroundColor = "flex";
    charInfo.appendChild(charStats);

    const charImageAndClassContainer =  document.createElement("div");
    charImageAndClassContainer.classList.add("row");
    charImageAndClassContainer.classList.add("box-circular-border")
    charImageAndClassContainer.style.justifyContent = "space-between";  
    charImageAndClassContainer.style.alignItems = "center";
    charImageAndClassContainer.style.height = "100%";
    charImageAndClassContainer.style.width = "100%";
    charStats.appendChild(charImageAndClassContainer);

    const charImage = document.createElement("div");
    charImage.style.backgroundImage = `url(static/images/character/${inGameChars[charId].img})`;
    charImage.style.backgroundSize = "contain"; // Ensures the entire image fits without cropping
    charImage.style.backgroundRepeat = "no-repeat"; // Prevents tiling
    charImage.style.backgroundPosition = "center"; // Centers the image
    charImage.style.height = "100px";
    charImage.style.width = "100px";
    charImageAndClassContainer.appendChild(charImage);

    const charClass = document.createElement("div");  
    charClass.style.gridTemplateRows = "repeat(2,auto)"
    charClass.style.display = "grid";
    charClass.style.padding = "10px"
    charImageAndClassContainer.appendChild(charClass);

    if(char.classess){
        char.classess.forEach(class_ => {
            const classContainer = document.createElement("div")
            classContainer.style.backgroundImage = `url(static/images/class-icons/${class_}.png)`
            classContainer.style.backgroundSize = "cover"
            classContainer.style.height = "50px"
            classContainer.style.width = "50px"
            charClass.appendChild(classContainer)
        });
    }

    const charStatsContainer = document.createElement("div");
    charStatsContainer.classList.add("column");
    charStatsContainer.classList.add("vertical");
    charStatsContainer.style.gap = "5px";
    charStatsContainer.style.width = "100%";
    charStats.appendChild(charStatsContainer);

    const charStatsTitle = document.createElement("h3");
    charStatsTitle.textContent = "Stats";
    charStatsTitle.style.textAlign = "center";
    charStatsTitle.style.fontFamily = "'Cinzel', serif"; // DnD theme font
    charStatsTitle.style.fontSize = "16px"; // Larger font size
    charStatsTitle.style.margin = "0px"; // No margin
    charStatsTitle.style.padding = "5px"; // Padding to keep text off the edges
    charStatsTitle.style.borderBottom = "1px solid black";
    charStatsContainer.appendChild(charStatsTitle);

    const charStatsTable = document.createElement("table");
    charStatsTable.style.width = "100%";
    charStatsTable.style.borderCollapse = "collapse";
    charStatsTable.style.border = "1px solid black";
    charStatsTable.style.borderRadius = "8px";
    charStatsTable.style.overflow = "auto";
    charStatsContainer.appendChild(charStatsTable);

    const charStatsTableHead = document.createElement("thead");
    charStatsTable.appendChild(charStatsTableHead);
    
    const charStatsTableHeadRow = document.createElement("tr");
    charStatsTableHead.appendChild(charStatsTableHeadRow);

    const charStatsTableHeadName = document.createElement("th");
    charStatsTableHeadName.textContent = "Stat";
    charStatsTable.style.width = "100%";

    const charStatsTableHeadValue = document.createElement("th");
    charStatsTableHeadValue.textContent = "Value";
    
    charStatsTableHeadRow.appendChild(charStatsTableHeadName);
    charStatsTableHeadRow.appendChild(charStatsTableHeadValue);

    const charStatsTableBody = document.createElement("tbody");
    charStatsTable.appendChild(charStatsTableBody);
    
    const searchStasts = ["str", "dex", "con", "int", "wis", "cha"]
    searchStasts.forEach(stat => {
        const row = document.createElement("tr");
        const name = document.createElement("td");
        name.textContent = stat.toUpperCase();
        const statValue = document.createElement("td");
        statValue.textContent = char[stat];
        row.appendChild(name);
        row.appendChild(statValue);
        charStatsTableBody.appendChild(row);
    });


    const charSpells = document.createElement("div");
    charSpells.classList.add("column");

    function createSpellContainer(spellInfo){
        // Create elements
        const spellDiv = document.createElement('div');
        spellDiv.classList.add('spell');
        
        // Create the header
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('spell-header');

        const nameElement = document.createElement('div');
        nameElement.classList.add('spell-name');
        nameElement.textContent = spell.name;

        const classesElement = document.createElement('div');
        classesElement.classList.add('spell-classes');
        classesElement.textContent = `Available Classes: ${spell.availableClasses.join(', ')}`;
        
        headerDiv.appendChild(nameElement);
        headerDiv.appendChild(classesElement);

        const descriptionElement = document.createElement('div');
        descriptionElement.classList.add('spell-description');
        descriptionElement.textContent = `Description: ${spell.description}`;

        // Create the additional effects
        const effectsElement = document.createElement('div');
        effectsElement.classList.add('spell-effects');

        // effectsElement.innerHTML = `<strong>Additional Effects:</strong><br>${Object.keys(characterSettings.AVAILABLE_SPELL_LEVELS).map(level => {  
        //     return spell.additionalEffects.getManaEffects(level);
        // }).join('<br>')}`;

        // Append all parts to the spell container
        spellDiv.appendChild(headerDiv);
        spellDiv.appendChild(descriptionElement);
        spellDiv.appendChild(effectsElement)

        return spellDiv;
    }
}  
