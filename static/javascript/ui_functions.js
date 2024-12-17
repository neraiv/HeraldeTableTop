
/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// CARACTHER SHEET //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
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

function displaySpellCreate(initalSpell = null) {
    const formColor = 'rgba(255, 255, 255, 0.8)';   
    const backgroundColor = 'rgba(0, 0, 0, 0.8)';

    // random 4 digit number
    const id = Math.floor(Math.random() * 9000) + 1000;

    const spellCreateSheet = document.createElement('div');
    spellCreateSheet.classList.add('spell-create-sheet');
    spellCreateSheet.classList.add('box-circular-border');
    spellCreateSheet.classList.add('column');
    spellCreateSheet.classList.add('vertical');
    spellCreateSheet.id = id;
    spellCreateSheet.spell = initalSpell;
    spellCreateSheet.style.backgroundColor = 'green';

    const topBar = addDraggableRow(spellCreateSheet);

    const spellCreateSheetTitle = document.createElement('h2');
    spellCreateSheetTitle.textContent = 'Create Spell';
    spellCreateSheetTitle.style.textAlign = 'center';
    spellCreateSheetTitle.style.fontFamily = "'Cinzel', serif"; // DnD theme font
    spellCreateSheetTitle.style.fontSize = '20px'; // Larger font size
    spellCreateSheetTitle.style.margin = '0';
    spellCreateSheetTitle.style.padding = '5px';
    spellCreateSheetTitle.style.borderBottom = '1px solid black';
    topBar.appendChild(spellCreateSheetTitle);

    addSpacer(topBar);

    const spellSaveButton = createImageButton('28', {source: 'url(static/images/menu-icons/save.png)', custom_padding: 4});
    spellSaveButton.style.marginRight = '5px';
    spellSaveButton.style.cursor = 'pointer';
    spellSaveButton.onclick = () => {
        const spell = getSpellFromForm();
        if(spell){
            saveSpell(spell);
        }
    };
    topBar.appendChild(spellSaveButton);

    const spellCreateSheetCloseButton = createImageButton('28', {source: 'url(static/images/menu-icons/close.png)', custom_padding: 4});
    spellCreateSheetCloseButton.style.marginRight = '5px';
    spellCreateSheetCloseButton.style.cursor = 'pointer';
    spellCreateSheetCloseButton.onclick = () => {
        spellCreateSheet.remove();
    };
    topBar.appendChild(spellCreateSheetCloseButton);

    const spellCreateSheetContent = document.createElement('div');
    spellCreateSheetContent.style.display = 'block';
    spellCreateSheetContent.style.width = '98%';
    spellCreateSheetContent.style.height = '95%';
    spellCreateSheetContent.style.position = 'relative';
    spellCreateSheetContent.style.overflowY = 'scroll';
    spellCreateSheet.appendChild(spellCreateSheetContent);
    
    const form = document.createElement('div');
    form.classList.add('column');
    form.classList.add('vertical');
    form.style.width = '98%';
    form.style.gap = '10px';
    form.style.padding = '5px';
    spellCreateSheetContent.appendChild(form);

    let maxSpellLevel = Math.max(...serverRules.spells.levels);


    const rowSpellSelect = document.createElement('div');
    rowSpellSelect.classList.add('row');
    rowSpellSelect.classList.add('vertical');
    rowSpellSelect.classList.add('form-group')
    rowSpellSelect.classList.add('box-circular-border');
    rowSpellSelect.style.backgroundColor = formColor;
    rowSpellSelect.style.gap = '10px';
    

    const selectSpellType = createSelectorInput('Spell Type: ', Object.values(spellTypes), Object.keys(spellTypes), {
        id: id + '-type'
    });
    rowSpellSelect.appendChild(selectSpellType);

    const spellLevel = createSelectorInput('Spell Level: ', serverRules.spells.levels, serverRules.spells.levels, {
        id: id +'-level'
    }); 
    rowSpellSelect.appendChild(spellLevel);

    selectSpellType.querySelector('.input-element').onchange = () => {
        spellCreateSheet.spell.spellType = selectSpellType.querySelector('.input-element').selectedOptions[0].value;
        if(spellCreateSheet.spell.spellType == spellTypes.SPELL || spellCreateSheet.spell.spellType == spellTypes.CONJURE){
            maxSpellLevel = serverRules.spells.levels.at(-1);
            updateElements();
        }else if(spellCreateSheet.spell.spellType == spellTypes.CANTRIP){
            maxSpellLevel = 0;
            updateElements();
        }else if(spellCreateSheet.spell.spellType == spellTypes.WEAPON){
            maxSpellLevel = serverRules.spells.levels.at(-1);
            updateElements();
        }
    }

    spellLevel.querySelector('.input-element').onchange = () => {
        spellCreateSheet.spell.spellLevel = spellLevel.querySelector('.input-element').selectedOptions[0].value;
        updateElements();
    }

    form.appendChild(rowSpellSelect);

    const nameForm = createStringInput('Name: ', {id: id + '-name' });
    nameForm.classList.add('box-circular-border');
    nameForm.style.backgroundColor = formColor;
    form.appendChild(nameForm);

    if(initalSpell == null){
        spellCreateSheet.spell = new Spell();
    }else{
        spellCreateSheet.spell = initalSpell;
        spellCreateSheetTitle.textContent = "Editing - " + spellCreateSheet.spell.name
        nameForm.querySelector(".input-element").value = spellCreateSheet.spell.name
    }

    const formClasses = createSelectorInput('Usable By Class:', Object.values(classTypes), Object.keys(classTypes), {
        id:  id +'-clasess',
        multiple: true,
    });

    formClasses.classList.add('box-circular-border');
    formClasses.style.height = '150px';
    formClasses.style.backgroundColor = formColor;
    form.appendChild(formClasses);

    const formModifierStat = createSelectorInput('Modifier Stat: ', Object.values(statTypes), Object.keys(statTypes),{
        id:  id +'-modifier-stats',
        multiple: true,
    });

    formModifierStat.classList.add('box-circular-border');
    formModifierStat.style.height = '100px';
    formModifierStat.style.backgroundColor = formColor;
    form.appendChild(formModifierStat);

    const baseDamageType = createSelectorInput('Base Damage Type: ', Object.values(damageTypes), Object.keys(damageTypes), {
        id:  id +'-base-damage-type',
        multiple: false,
    });
    baseDamageType.classList.add('box-circular-border');
    baseDamageType.style.backgroundColor = formColor;
    form.appendChild(baseDamageType);

    const baseDamage = createDamageInput("Damage: ")
    baseDamage.style.display = "none"
    baseDamageType.appendChild(baseDamage);
    
    baseDamageType.querySelector('.input-element').onchange =  (event) => {
        const value = event.target.value
        if(value != damageTypes.NONE){
            baseDamage.style.display = "flex"
        }else{
            baseDamage.style.display = "none"
        }
    }

    const formDescription = createStringInput('Description: ', {id: 'create-spell-description',isTextArea: true});
    formDescription.classList.add('box-circular-border');
    formDescription.style.height = '150px';
    formDescription.style.backgroundColor = formColor;
    form.appendChild(formDescription);

    function createDurationForm(label = "Duration", id, avaliableDurationTypes = durationTypes){
        
        // extract duration types
        const displayDurationTypes = Object.keys(avaliableDurationTypes).map(key => avaliableDurationTypes[key]);

        const durationSelector = createSelectorInput(label, Object.values(displayDurationTypes), Object.keys(displayDurationTypes), {
            id:  id,
            defaultValue: initalSpell !== null ? [spellCreateSheet.spell.castDuration.type] : null,
        });
        durationSelector.classList.add('box-circular-border');
        durationSelector.style.backgroundColor = formColor;
    
        const durationValue = createNumberInput("Value: ", id+'-value', 50, 1, false, false)
        durationValue.style.display = "none"
        durationSelector.querySelector('.input-element').onchange =  (event) => {     
            displayPart(event.target.value)
        }

        function displayPart(type){
            if(type == durationTypes.TURN_BASED){
                durationValue.style.display = "flex"
            }else{
                durationValue.style.display = "none"
            }
        }

        displayPart(spellCreateSheet.spell.castDuration.type)

        durationValue.querySelector('.input-element').value = spellCreateSheet.spell.castDuration.value //defaultValue
        durationSelector.appendChild(durationValue);
        return durationSelector
    }
    
    const spellDuration = createDurationForm("Cast Duration: ",id +'-duration');
    form.appendChild(spellDuration);

    const spellActionCost = createSelectorInput('Action Cost: ', Object.values(actionTypes), Object.keys(actionTypes),{
        id: 'create-spell-pattern-cast-type',
        defaultValue: initalSpell ?  spellCreateSheet.spell.actionCost : null, 
    })
    spellActionCost.classList.add('box-circular-border');
    spellActionCost.style.backgroundColor = formColor;
    form.appendChild(spellActionCost);

    const selectableSpellLevels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    const formTargetEffects = document.createElement('div');
    formTargetEffects.classList.add('column');
    formTargetEffects.classList.add('vertical');
    formTargetEffects.classList.add('box-circular-border');
    formTargetEffects.style.width = '95%';
    formTargetEffects.style.padding = '5px';
    formTargetEffects.style.gap = '10px';
    formTargetEffects.style.backgroundColor = formColor;
    
    const formTargetEffectsTitle = document.createElement('label');
    formTargetEffectsTitle.textContent = 'Target Effects with Spend Mana';
    formTargetEffectsTitle.style.fontWeight = 'bold';

    const targetEffectsTabbedWindowContainer = createTabbedContainer(selectableSpellLevels.length, selectableSpellLevels);
    targetEffectsTabbedWindowContainer.style.width = '100%';
    targetEffectsTabbedWindowContainer.style.backgroundColor = formColor;

    formTargetEffects.appendChild(formTargetEffectsTitle);
    formTargetEffects.appendChild(targetEffectsTabbedWindowContainer);

    form.appendChild(formTargetEffects);

    for(let i = 0; i < selectableSpellLevels.length; i++){
        const index = parseInt(selectableSpellLevels[i])
        const tabContent = getContentContainer(targetEffectsTabbedWindowContainer, selectableSpellLevels[i])
        tabContent.innerHTML = '';
        const buttonNames = ['Add Previously Created Effect', 'Add New Effect']
        const formTargetEffects = createAdditionalEffectListContainer(tabContent.id + '-additional-effect-target-effect-list-container',`Spell Mana Effect for Mana: ${selectableSpellLevels[i]}`, buttonNames);
        if(initalSpell && spellCreateSheet.spell.spendManaEffects && spellCreateSheet.spell.spendManaEffects[index] && spellCreateSheet.spell.spendManaEffects[index].target){
            for(let additionalEffect of spellCreateSheet.spell.spendManaEffects[index].target){
                const listElement = createAdditionalEffectListElement(additionalEffect)
                formTargetEffects.elementsList.appendChild(listElement);
            }
        }
        formTargetEffects.buttons[buttonNames[1]].onclick = () =>{
            const listElement = createAdditionalEffectListElement()
            formTargetEffects.elementsList.appendChild(listElement);
        }
        formTargetEffects.style.height = '150px';
        tabContent.appendChild(formTargetEffects);
    }

    const casterEffects = document.createElement('div');
    casterEffects.classList.add('column');
    casterEffects.classList.add('vertical');
    casterEffects.classList.add('box-circular-border');
    casterEffects.style.width = '95%';
    casterEffects.style.padding = '5px';
    casterEffects.style.gap = '10px';
    casterEffects.style.backgroundColor = formColor;
    
    const casterEffectsTitle = document.createElement('label');
    casterEffectsTitle.textContent = 'Caster Effects with Spend Mana';
    casterEffectsTitle.style.fontWeight = 'bold';

    const casterEffectsTabbedWindowContainer = createTabbedContainer(selectableSpellLevels.length, selectableSpellLevels);
    casterEffectsTabbedWindowContainer.style.width = '100%';
    casterEffectsTabbedWindowContainer.style.backgroundColor = formColor;

    casterEffects.appendChild(casterEffectsTitle);
    casterEffects.appendChild(casterEffectsTabbedWindowContainer);

    form.appendChild(casterEffects);

    for(let i = 0; i < selectableSpellLevels.length; i++){
        const index = parseInt(selectableSpellLevels[i])
        const tabContent = getContentContainer(casterEffectsTabbedWindowContainer, selectableSpellLevels[i])
        tabContent.innerHTML = '';
        const buttonNames = ['Add Previously Created Effect', 'Add New Effect']
        const casterEffects = createAdditionalEffectListContainer(tabContent.id + '-additional-effect-caster-effect-list-container',`Spell Mana Effect for Mana: ${selectableSpellLevels[i]}`, buttonNames);
        if(initalSpell && spellCreateSheet.spell.spendManaEffects &&spellCreateSheet.spell.spendManaEffects[index] && spellCreateSheet.spell.spendManaEffects[index].caster){
            for(let additionalEffect of spellCreateSheet.spell.spendManaEffects[index].caster){
                const listElement = createAdditionalEffectListElement(additionalEffect)
                casterEffects.elementsList.appendChild(listElement);
            }
        }
        casterEffects.buttons[buttonNames[1]].onclick = () =>{
            const listElement = createAdditionalEffectListElement()
            casterEffects.elementsList.appendChild(listElement);
        }
        casterEffects.style.height = '150px';
        tabContent.appendChild(casterEffects);
    }

    const spellPatternContainer = document.createElement('div');
    spellPatternContainer.classList.add('column');
    spellPatternContainer.classList.add('vertical');
    spellPatternContainer.classList.add('box-circular-border');
    spellPatternContainer.style.width = '95%';
    spellPatternContainer.style.padding = '5px';
    spellPatternContainer.style.gap = '10px';
    spellPatternContainer.style.backgroundColor = formColor;

    const spellPatternTitle = document.createElement('label');
    spellPatternTitle.textContent = 'Spell Pattern';
    spellPatternTitle.style.fontWeight = 'bold';
    spellPatternContainer.appendChild(spellPatternTitle);

    const spellPatternSelect = createSelectorInput('Spell Pattern: ', Object.values(spellPatterns), Object.keys(spellPatterns),{
        id: 'create-spell-pattern-select',
        defaultValue: initalSpell ? [initalSpell.spellPattern.pattern] : null, 
    })
    spellPatternSelect.classList.add('box-circular-border');
    spellPatternSelect.style.backgroundColor = formColor;
    spellPatternContainer.appendChild(spellPatternSelect);

    const spellCastArea = createNumberInput("Cast Range:", "create-spell-pattern-cast-area", 9999, 0, false, false, initalSpell ? initalSpell.spellPattern.range : null)
    spellCastArea.classList.add('box-circular-border');
    spellCastArea.style.backgroundColor = formColor;
    spellPatternContainer.appendChild(spellCastArea);

    const spellCastWidth = createNumberInput("Cast Area:", "create-spell-pattern-cast-area", 500, 0, false, false, initalSpell ? initalSpell.spellPattern.area : null)
    spellCastWidth.classList.add('box-circular-border');
    spellCastWidth.style.backgroundColor = formColor;
    spellPatternContainer.appendChild(spellCastWidth);

    const spellCastType = createSelectorInput('Spell Cast Type: ', Object.values(castTypes), Object.keys(castTypes),{
        id: 'create-spell-pattern-cast-type',
        defaultValue: initalSpell ? [initalSpell.spellPattern.castType] : null, 
    })
    spellCastType.classList.add('box-circular-border');
    spellCastType.style.backgroundColor = formColor;
    spellPatternContainer.appendChild(spellCastType);

    const spellCanTarget = createSelectorInput('Can Target: ', Object.values(targetTypes), Object.keys(targetTypes),{
        id: 'create-spell-pattern-can-target',
        defaultValue: initalSpell ? initalSpell.spellPattern.canTarget : null, 
        multiple: true,
        custom_func: indexedOptionFunctionWithTransperency
    })
    spellCanTarget.classList.add('box-circular-border');
    spellCanTarget.style.backgroundColor = formColor;
    spellPatternContainer.appendChild(spellCanTarget);
    form.appendChild(spellPatternContainer)

    const spellCasterRolls = createSelectorInput('Caster Rolls: ', Object.values(rollTypes), Object.keys(rollTypes),{
        id: 'create-spell-caster-rolls',
        defaultValue: initalSpell ? initalSpell.casterRolls : null, 
        multiple: true,
    })
    spellCasterRolls.classList.add('box-circular-border');
    spellCasterRolls.style.backgroundColor = formColor;
    form.appendChild(spellCasterRolls)

    const spellTargetRolls = createSelectorInput('Target Rolls: ', Object.values(rollTypes), Object.keys(rollTypes),{
        id: 'create-spell-target-rolls',
        defaultValue: initalSpell ? initalSpell.targetRolls : null, 
        multiple: true,
    })
    spellTargetRolls.classList.add('box-circular-border');
    spellTargetRolls.style.backgroundColor = formColor;
    form.appendChild(spellTargetRolls)
    // --------------------------END ------------------------
    updateElements();
    userInterface.appendChild(spellCreateSheet);

    function createAdditionalEffectListContainer(id, titleStr = null, buttonNames = []){
 
        const additionalElementListContainer = document.createElement('div');
        additionalElementListContainer.classList.add('form-group');
        additionalElementListContainer.classList.add('column');
        additionalElementListContainer.classList.add('vertical');
        additionalElementListContainer.id = id;
    
        const title = document.createElement('label');
        title.textContent = titleStr ? titleStr : 'Create a New';
    
        const row = document.createElement('div');
        row.classList.add('row');
        row.style.gap = '10px';
        row.style.width = '98%';
        row.style.height = '98%';
    
        const elementsListColumn = document.createElement('div')
        elementsListColumn.classList.add('column');
        elementsListColumn.classList.add('vertical');
        elementsListColumn.classList.add('box-circular-border');
        elementsListColumn.style.backgroundColor = 'white';
        elementsListColumn.style.paddingTop = '3px'
        elementsListColumn.style.gap = '5px';
        elementsListColumn.style.overflowY = 'scroll';
        elementsListColumn.style.width = '70%';
        elementsListColumn.style.height = '90%';
    
        const buttonsList =document.createElement('div')
        buttonsList.classList.add('column');
        buttonsList.classList.add('horizantal');
        buttonsList.style.gap = '5px';
        buttonsList.style.display = 'flex';
        buttonsList.style.flexGrow = '1';
    
        
        additionalElementListContainer.buttons = {};
        additionalElementListContainer.elementsList = elementsListColumn;
        for(let buttonName of buttonNames) {
            const button = document.createElement('button')
            button.textContent = buttonName;
            button.style.textAlign = 'center';
            button.style.display = 'flex';
            additionalElementListContainer.buttons[buttonName] = button;
            buttonsList.appendChild(button)
        }
    
        row.appendChild(elementsListColumn)
        row.appendChild(buttonsList)
        additionalElementListContainer.appendChild(title);
        additionalElementListContainer.appendChild(row)
    
        return additionalElementListContainer;
    }

    function createAdditionalEffectListElement(additionalEffect, edit_icon = 'edit.png', close_icon = 'close.png'){ 
        
        // Future additnal effect create bağlanacak
        const listElement = document.createElement('div');
        listElement.classList.add('additiona-effect-container');
        listElement.classList.add('list-element'); // 30px 
        listElement.classList.add('box-circular-border');
        listElement.classList.add('row');
        listElement.classList.add('vertical');

        listElement.additionalEffect = additionalEffect ? additionalEffect : new AdditionalEffect()
    
        const labeledElement = document.createElement('div');
        labeledElement.classList.add('row');
        labeledElement.classList.add('centered');
        labeledElement.style.gap = '5px';
    
        const label = document.createElement('label');
        label.style.textAlign = 'center';
        label.style.fontSize = '14px';
        label.style.paddingLeft = '5px';
        label.textContent = "New Additional Effect";
        labeledElement.appendChild(label)
    
        if(additionalEffect){
            label.textContent = additionalEffect.name;
            let effectImageList = new Set();
            for(const effect of additionalEffect.effects){
                switch (effect.type) {
                    case additionalEffectTypes.BUFF:
                        // Code to run if expression === value1
                        effectImageList.add("buff_debuff.png")
                        break;
                    
                    case additionalEffectTypes.AURA:
                        // Code to run if expression === value2
                        effectImageList.add("aura.png");
                        break;
                    
                    case additionalEffectTypes.CAST:
                        // Code to run if expression === value3
                        effectImageList.add("cast.png");
                        break;
                }
            }
            for(const effectImage of effectImageList){
                const effectImg = document.createElement('img');
                effectImg.classList.add('icon');
                effectImg.style.width = '23px';
                effectImg.style.height = '23px';
                effectImg.style.marginRight = '10px';
                effectImg.src = "static/images/menu-icons/" + effectImage;
                labeledElement.appendChild(effectImg);
            }     
        }
    
    
        const removeButton = createImageButton('26', {source: `url(static/images/menu-icons/${close_icon})`, custom_padding: 3});
        removeButton.onclick = () => {
            listElement.remove()
        }
    
    
        const editButton = createImageButton('26', {source: `url(static/images/menu-icons/${edit_icon})`, custom_padding: 3});
        editButton.onclick = () => {
            additionalEffectBuilder(id +'-additional-effect'+ Date.now(), listElement);
        }
    
        listElement.appendChild(labeledElement);
        addSpacer(listElement);
        listElement.appendChild(editButton);
        listElement.appendChild(removeButton);
    
        return listElement;
    }

    function additionalEffectBuilder(id, listElement) {

        const itemId = id;
        const additionalEffect = listElement.additionalEffect 

        const additionalEffectBuildContainer = document.createElement('div');
        additionalEffectBuildContainer.style.position = 'absolute';
        additionalEffectBuildContainer.style.display = 'flex';
        additionalEffectBuildContainer.style.width = '100%';
        additionalEffectBuildContainer.style.height = '100%';
        
    
        const additionalEffectBuilderSheet = document.createElement('div');
        additionalEffectBuilderSheet.style.display = 'flex';
        additionalEffectBuilderSheet.classList.add('aditional-effect-create-sheet');
        additionalEffectBuilderSheet.classList.add('box-circular-border');
        additionalEffectBuilderSheet.classList.add('column');
        additionalEffectBuilderSheet.classList.add('vertical');
        additionalEffectBuilderSheet.style.gap = '10px';
        additionalEffectBuilderSheet.id = itemId;
        additionalEffectBuilderSheet.style.backgroundColor = backgroundColor
    
        const closeButton = createImageButton('28', {source: 'url(static/images/menu-icons/close.png)', custom_padding: 4});
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '5px';
        closeButton.onclick = () => {
            additionalEffectBuilderSheet.remove();
        }
    
        const title = document.createElement('h2');
        title.textContent = additionalEffect.name ? "Editing " + additionalEffect.name:'Create Additional Effect';
        title.style.textAlign = 'center';
    
        const column = document.createElement('div');
        column.classList.add('form-group');
        column.classList.add('column');
        column.classList.add('vertical');
        column.style.display = 'flex';
        column.style.gap = '10px';
        column.style.width = '98%';
        column.style.height = '98%';
        column.style.overflowY = 'scroll';
        column.style.overflowX = 'hidden';
    
        const additionalEffectName = createStringInput('Name: ', {
            id: itemId + '-aditional-effect-name',
            defaultValue: additionalEffect.name
        });

        additionalEffectName.classList.add('box-circular-border');
    
        const triggerActions = createSelectorInput('Triggered With Action:',  Object.values(characterActions), Object.keys(characterActions),{
            nonSelectableDefault: 'select', 
            id: itemId +'-aditional-effect-craracter-actions', 
            multiple: true, 
            defaultValue: additionalEffect.characterAction});
        triggerActions.classList.add('box-circular-border');
        triggerActions.style.minHeight = '100px';
        triggerActions.style.height = '100px';
    
        const descriptionForm = createStringInput('Description: ',{
            id: itemId +'-aditional-effect-description',
            defaultValue: additionalEffect.description,
            isTextArea: true
        });
        
        descriptionForm.classList.add('box-circular-border');
        descriptionForm.style.minHeight = '100px';
        descriptionForm.style.height = '100px';
    
        const additionalEffectDuration = createDurationForm("Effect Duration: ", itemId+'-duration');
        
        function createEffectTab(parent, effect = null){
            const columntElement = document.createElement("div");
            columntElement.classList.add('column');
            columntElement.classList.add('vertical');
            columntElement.style.overflow = 'hidden';
            columntElement.style.width = '95%';
            columntElement.style.height = '95%';
            columntElement.style.gap = '10px';
            columntElement.style.padding = '5px';
            
            const typeBuilder = document.createElement('div');
            typeBuilder.classList.add('type-builder');
            typeBuilder.classList.add('form-group');
            typeBuilder.classList.add('column');
            typeBuilder.classList.add('vertical');
            typeBuilder.style.display = 'flex';
            typeBuilder.style.flexGrow = '1';
            typeBuilder.style.gap = '10px';
            typeBuilder.style.width = '100%';
            typeBuilder.style.height = '100%';
    
            const additionalEffectTypeSelector = createSelectorInput('Additional Effect Type:',  Object.values(additionalEffectTypes), Object.keys(additionalEffectTypes),{
                nonSelectableDefault: 'select', 
                id: itemId +'-aditional-effect-type', 
                defaultValue: effect ? [effect.type] : null
            });

            additionalEffectTypeSelector.classList.add('box-circular-border');
            columntElement.appendChild(additionalEffectTypeSelector)
            columntElement.appendChild(typeBuilder)
    
            function conjureEffectCreator(effect){
                function createCastForm(){
                    const castForm = document.createElement('form');
                    castForm.style.display = 'flex';
                    castForm.classList.add('form-group');
                    castForm.classList.add('column');
                    castForm.classList.add('vertical');
                    castForm.style.gap = '10px';
                    castForm.style.width = '98%';
                    castForm.style.height = '98%';

                    const spellSelectContainer = createSpellSelectContainer(itemId, effect ? effect.spellLevel : null, effect ? effect.spellName: null);
                    castForm.appendChild(spellSelectContainer);

                    const container = document.createElement('div');
                    container.classList.add('form-group');
                    container.classList.add('box-circular-border');
                    container.classList.add('row');
                    container.style.gap = '10px';
                    container.style.width = '95%';
                    
                    const manaInput = createNumberInput('Mana:', itemId+'-mana-input', effect ? effect.mana : null);

                    const spellDescriptionButton = document.createElement('button');
                    spellDescriptionButton.textContent = 'Spell Description';
                    spellDescriptionButton.style.marginLeft = '10px';
                    
                    spellDescriptionButton.onclick = function(event) {
                        event.preventDefault();
                        displaySpellDescription(null, listSpells[spellSelectContainer.spellLevel][spellSelectContainer.spellName], event.x, event.y);
                    }

                    const targetListOrdered = createSelectorInput('Target List Order: ', Object.values(targetTypes), Object.keys(targetTypes), {
                        id: itemId + '-target-list', 
                        multiple: true,
                        custom_func: indexedOptionFunctionWithTransperency, 
                        defaultValue: effect ? effect.targetListInOrder : null}); 
                    targetListOrdered.classList.add('box-circular-border');
                    targetListOrdered.style.display = 'flex';


                    castForm.onchange = () => {
                        parent.effect = {
                            type: additionalEffectTypes.CAST,
                            mana: parseInt(manaInput.querySelector('.input-element').value),
                            spellName: spellSelectContainer.spellName, 
                            spellLevel: spellSelectContainer.spellLevel,
                            targetList: getOrderedSelectedOptions(targetListOrdered.querySelector('.input-element')),
                        }
                    };

                    container.appendChild(manaInput);
                    container.appendChild(spellDescriptionButton);
                    castForm.appendChild(container);
                    castForm.appendChild(targetListOrdered);
                    return castForm
                }
                function createAuraForm() {
                    const itemId = id + '-aura-form';
                    const auraForm = document.createElement('form');
                    auraForm.style.display = 'flex';
                    auraForm.classList.add('form-group');
                    auraForm.classList.add('column');
                    auraForm.classList.add('vertical');
                    auraForm.style.gap = '10px';
                    auraForm.style.width = '98%';
                    auraForm.style.height = '98%';
                
                    const effectType = createSelectorInput('Effect Type:',  Object.values(targetTypes), Object.keys(targetTypes), {
                        id: itemId + '-effect-type',}); 
                
                    auraForm.appendChild(effectType);
                    return auraForm;
                }

                function createBuffForm() {
                    const itemId = id + '-buff-form';
                    const buffForm = document.createElement('form');
                    buffForm.style.display = 'flex';
                    buffForm.classList.add('form-group');
                    buffForm.classList.add('column');
                    buffForm.classList.add('vertical');
                    buffForm.style.gap = '10px';
        
                    const effectTypeSelector = createSelectorInput('Effect Type:',  Object.values(effectTypes), Object.keys(effectTypes), {nonSelectableDefault: 'select', 
                        nonSelectableDefault: 'select',
                        id: itemId +'-effect-type'
                    });
                    buffForm.appendChild(effectTypeSelector);

                    const inputForm = document.createElement('div');
                    inputForm.classList.add('vertical');
                    inputForm.classList.add('column');
                    inputForm.style.display = 'flex';
                    inputForm.style.width = '100%';
                    inputForm.style.height = '100%';
                    inputForm.style.gap = '10px';
                    buffForm.appendChild(inputForm);

                    effectTypeSelector.onchange = function(event){
                        inputForm.innerHTML = '';
                        const value = event.target.value
                        if(value == effectTypes.ATTACK_DAMAGE_BONUS || value == effectTypes.HEAL || value == effectTypes.TAKE_DAMAGE || value == effectTypes.VISION_RANGE_BONUS
                            || value == effectTypes.DEFENSE
                        ){
                            const inputElement = createDamageInput("Value: ", itemId)
                            inputForm.appendChild(inputElement);
                        }else if(value == effectTypes.DICE_CHANGE){
                            const numberInput = createDiceInput("Value: ", itemId)
                            inputForm.appendChild(numberInput);
                        }else if(value == effectTypes.PATTERN_CHANGE){
                            const patternInput = createSelectorInput("New Pattern: ", Object.values(spellPatterns), Object.keys(spellPatterns), {
                                id: itemId
                            })
                            inputForm.appendChild(patternInput);
                        }else if(value == effectTypes.ATTACK_RANGE || value == effectTypes.ATTACK_RADIUS_BONUS || value == effectTypes.ATTACK_RANGE_BONUS){
                            const inputElement = createNumberInput('Value:', itemId, effect.range)
                            inputForm.appendChild(inputElement);
                        }
                    }

                    return buffForm
                }

                if(effect.type == additionalEffectTypes.CAST){
                    const form = createCastForm()
                    typeBuilder.appendChild(form)
                } else if(effect.type == additionalEffectTypes.AURA){
                    const form = createAuraForm();
                    typeBuilder.appendChild(form)
                } else if(effect.type == additionalEffectTypes.BUFF){                    
                    const form = createBuffForm();
                    typeBuilder.appendChild(form)
                }

                additionalEffectTypeSelector.querySelector('.input-element').value = effect.type
            }
            
            if(effect){
                conjureEffectCreator(effect)
            }

            additionalEffectTypeSelector.onchange = function(event){
                typeBuilder.innerHTML = '';
                conjureEffectCreator(event.target.value)
            }
            parent.appendChild(columntElement);
        }

        const tabbedEffectCreator = createTabbedContainer(0, null, itemId +'-aditional-effect-effect-create-tab', true, 'Effect');
        tabbedEffectCreator.classList.add('box-circular-border');
        tabbedEffectCreator.style.width = '98%';
        tabbedEffectCreator.style.backgroundColor = formColor;
        tabbedEffectCreator.style.flexGrow = '1';

        tabbedEffectCreator.addTabButton.textContent = "Add Effect";
        tabbedEffectCreator.addTabButton.addEventListener('click', function() {
            const lastContainer = getContentContainer(tabbedEffectCreator);
            lastContainer.innerHTML = "";
            createEffectTab(lastContainer)  
        });
    
        if(additionalEffect.effects.length > 0){
            for(let effect of additionalEffect.effects){
                addNewTab(tabbedEffectCreator, null, 'Effect')
                const lastContainer = getContentContainer(tabbedEffectCreator);
                lastContainer.innerHTML = "";
                createEffectTab(lastContainer, effect)  
            }
        }
        
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.onclick = () => {
            listElement.additionalEffect.name = additionalEffectName.querySelector('.input-element').value;
            listElement.additionalEffect.characterAction = getSelectedOptionsWithCheckmark(triggerActions.querySelector('.input-element'));
            listElement.additionalEffect.description = descriptionForm.querySelector('.input-element').value;    
            listElement.additionalEffect.duration = durationForm.querySelector('.input-element').value;
            for (let i = 1; i <= tabbedEffectCreator.length; i++) {
                const tabContent = getContentContainer(tabbedEffectCreator, i);
    
                const typeBuilder = tabContent.querySelector('.type-builder'); 
    
                console.log(typeBuilder.effect)
                if(typeBuilder.effect.type == additionalEffectTypes.CAST){
                    listElement.additionalEffect.effects.push(new Cast(typeBuilder.effect.spellName, typeBuilder.effect.spellLevel, 
                                                                typeBuilder.effect.mana, typeBuilder.effect.targetList))
                }else if(typeBuilder.effect.type == additionalEffectTypes.AURA){
                    listElement.additionalEffect.effects.push(new Aura(typeBuilder.effect.area, typeBuilder.effect.value, typeBuilder.effect.targetList, typeBuilder.effect.canSpread))
                }else if(typeBuilder.effect.type == additionalEffectTypes.BUFF){
                    listElement.additionalEffect.effects.push(new Cast(typeBuilder.effect.spellName, typeBuilder.effect.spellLevel, 
                        typeBuilder.effect.mana, typeBuilder.effect.targetList))
                }
            }
            const listElement = createAdditionalEffectListElement(listElement.additionalEffect);
            listElement.parentElement.appendChild(listElement);
            listElement.remove();
        };
    
        addDraggableRow(additionalEffectBuilderSheet);
        additionalEffectBuilderSheet.appendChild(title);
        column.appendChild(additionalEffectName);
        column.appendChild(triggerActions);
        column.appendChild(descriptionForm);
        column.appendChild(additionalEffectDuration);
        column.appendChild(tabbedEffectCreator);
        additionalEffectBuilderSheet.appendChild(column);
        additionalEffectBuilderSheet.appendChild(closeButton);
        additionalEffectBuilderSheet.appendChild(saveButton);
        additionalEffectBuildContainer.appendChild(additionalEffectBuilderSheet)
    
        userInterface.appendChild(additionalEffectBuilderSheet)
    }

    function updateElements(){
        let displayedLevels = serverRules.spells.levels;

        // Filter out any selectableSpellLevels not in serverRules.spells.levels

        // // Filter out any selectableSpellLevels lower than initialSpell.spellLvl
        displayedLevels = displayedLevels.filter(level => (parseInt(level) <= parseInt(maxSpellLevel)));

        serverRules.spells.levels.forEach(level => {
            if(displayedLevels.includes(level)){
                changeVisibiltyOfTab(targetEffectsTabbedWindowContainer, level, true)
                changeVisibiltyOfTab(casterEffectsTabbedWindowContainer, level, true)
            }else{
                changeVisibiltyOfTab(targetEffectsTabbedWindowContainer, level, false)
                changeVisibiltyOfTab(casterEffectsTabbedWindowContainer, level, false)
            }
        })
        activateTab(targetEffectsTabbedWindowContainer, displayedLevels[0])
        activateTab(casterEffectsTabbedWindowContainer, displayedLevels[0])
    }
}

function createSpellCard(spell) {
    // Create the spell card container
    const spellCard = document.createElement('div');
    spellCard.classList.add('spell-card');
    spellCard.style.display = 'flex';
    spellCard.style.flexDirection = 'column';
    spellCard.style.gap = '5px';
    spellCard.style.padding = '10px';
    spellCard.style.border = '1px solid black';
    spellCard.style.borderRadius = '8px';
    spellCard.style.backgroundColor = '#f0f0f0';
    spellCard.style.overflow = 'auto';
    spellCard.style.width = '100%';

    // Create the spell card header
    const spellCardHeader = document.createElement('div');
    spellCardHeader.classList.add('spell-card-header');
    spellCardHeader.style.display = 'flex';
    spellCardHeader.style.justifyContent = 'space-between';
    spellCardHeader.style.alignItems = 'center';
    spellCard.appendChild(spellCardHeader);
    
    // Create the spell card name
    const spellCardName = document.createElement('h3');
    spellCardName.textContent = spell.name;
    spellCardName.style.margin = '0';
    spellCardName.style.fontFamily = "'Cinzel', serif"; // DnD theme font
    spellCardName.style.fontSize = '16px'; // Larger font size
    spellCardHeader.appendChild(spellCardName);
}

spellBookButton.onclick = () => {
    const spellBook = document.getElementById("ui-spellbook");
    if (spellBook.style.display === "none") {
        spellBook.style.display = "flex";
    } else {
        spellBook.style.display = "none";
    }
}

createSpellButton.onclick = () => {
    displaySpellCreate()
}

// Player's Character Sheet
playerCharSheetButton.onclick = () => {
    displayCharaterSheet(player.charId)
}

function userAskQuestion({type = "int", message = null}) {
    if (type === "int") {
        const question = prompt(message + " ", "Please enter a number:");
        return parseInt(question, 10);
    }
    if (type === "string") {
        return prompt(message + " ", "Please enter a string:");
    }
    if (type === "bool") {
        const question = prompt(message + " ", "Please enter true or false:");
        return question === "true";
    }
    if (type === "float"){
        const question = prompt(message + " ", "Please enter a number:");
        return parseFloat(question);
    }
}

// Game Board -----------------------------------------------------------------------
function getCharScene(char_id){
    return sessionInfo.charLocations.find(charLocation => charLocation.charId === char_id).currentScene
}

function setCharScene(char_id, scene){
    sessionInfo.charLocations.find(charLocation => charLocation.charId === char_id).currentScene = scene
}

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

// Background -----------------------------------------------------------------------
async function addBackground(width, height, x, y, img = null){
    const backgroundToken = document.createElement("div")
    backgroundToken.classList.add("background")
    backgroundToken.style.left = `${x}px`
    backgroundToken.style.top = `${y}px`
    backgroundToken.style.width = `${width}px`
    backgroundToken.style.height = `${height}px`
    backgroundToken.draggable = true

    if(img){
        // if image loading fails retry after 1 second
        backgroundToken.style.backgroundImage = `url(${img})` 
        backgroundToken.style.backgroundSize = "cover"
        backgroundToken.style.backgroundPosition = "center"
    }

    backgroundLayer.appendChild(backgroundToken)

    gameBoardPan(1000 - x,  1000 - y) 

    return backgroundToken
}

// Portal -----------------------------------------------------------------------
async function portalDisplayName(portalToken){
    const portalName = portalToken.firstChild
    portalName.style.display = "block"
}

async function portalHideName(portalToken){
    const portalName = portalToken.firstChild
    portalName.style.display = "none"
}

async function addPortal(portal, parent){
    const portalToken = document.createElement("div")
    portalToken.classList.add("portal")
    portalToken.classList.add("type-"+portal.type)
    portalToken.style.left = `${portal.x}px`
    portalToken.style.top = `${portal.y}px`
    portalToken.style.width = `${portal.width}px`
    portalToken.style.height = `${portal.height}px`
    portalToken.to = portal.to
    portalToken.type = portal.type
    parent.appendChild(portalToken)

    const portalName = document.createElement("div")
    portalName.classList.add("portal-name")
    if(portal.type == "layer"){ // FUTURE: Check for valid url
        portalName.textContent = "Layer " + portal.to
    }else if(portal.type == "scene"){
        portalName.textContent = portal.to
    }
    portalName.style.marginBottom = `${portal.height+5}px`
    portalToken.appendChild(portalName)

    if(portal.type == "layer"){ // FUTURE: Check for valid url
        portalToken.style.backgroundImage = `url("static/images/portal/blue.png")` 
    }else if(portal.type == "scene"){
        portalToken.style.backgroundImage = `url("static/images/portal/green.png")` 
    }

    portalToken.addEventListener("mouseenter", async function(){
        portalDisplayName(portalToken)
    })

    portalToken.addEventListener("mouseleave", async function(){
        portalHideName(portalToken)
    })

    portalToken.addEventListener("click", async function(){
        if(portalToken.type == "layer"){
            if(sceneInfo.layers[portalToken.to]){
                getCharScene(player.charId).layer = portalToken.to
                initLayer()
            }else{
                alert("Layer does not exist")
            }
        }else if(portalToken.type == "scene"){
            if(scenes[portalToken.to]){
                sceneInfo = scenes[portalToken.to]
                getCharScene(player.charId).name = portalToken.to
                getCharScene(player.charId).layer = 1
                initScene()
            }else{
                alert("Scene does not exist")
            }
        }
    })
    


    return portalToken
}

// Character -----------------------------------------------------------------------
function charDisplayHoverButtons({token = null, char_id = null}) {
    let charToken = token;
    if (char_id) {
        charToken = document.getElementById(char_id);
    }
    if (charToken) {
        const hoverButtons = charToken.getElementsByClassName("hover-button");
        for (const button of hoverButtons) {
            button.style.display = 'flex'; // Hides the button after the transition
            button.style.transitionDelay = ''; 
            button.style.left = `${button.dataset.finalX}px`;
            button.style.top = `${button.dataset.finalY}px`;
        }
    }
}

function charHideHoverButtons({token = null, char_id = null}) {
    let charToken = token;
    if (char_id) {
        charToken = document.getElementById(char_id);
    }
    if (charToken) {
        const hoverButtons = charToken.getElementsByClassName("hover-button");
        for (const button of hoverButtons) {
            button.style.transitionDelay = '0.5s'; 
            const width = parseInt(charToken.style.width, 10);
            const height = parseInt(charToken.style.height, 10);
            const resetX = width / 2 - button.offsetWidth / 2;
            const resetY = height / 2 - button.offsetHeight / 2;
            button.style.left = `${resetX}px`;
            button.style.top = `${resetY}px`;

            // FUTURE: Hide buttons after transition
            // button.addEventListener('transitionend', () => {
            //     if(button.style.left === `${resetX}px` && button.style.top === `${resetY}px`){
            //         button.style.display = 'none'; // Hides the button after the transition
            //     }   
            // }, {once: true});
        }
    }
}

async function charDisplayInventory({id = null, inventory = null}, x, y) {
    const char = inGameChars[id].char;
    if (char) {
        isCharInventory = false;

        if(inventory === null){
            inventory = char.inventory;
            isCharInventory = true
        }
        
        // Create the inventory sheet container
        const inventorySheet = document.createElement('div');
        inventorySheet.classList.add('inventory-sheet');
        inventorySheet.style.position = 'fixed'; // Ensure the inventory sheet is positioned relative to the viewport
        inventorySheet.style.left = `${x}px`;
        inventorySheet.style.top = `${y}px`;
        userInterface.appendChild(inventorySheet);
        
        const topRow = addDraggableRow(inventorySheet)
        topRow.classList.add('row');
        topRow.classList.add('centered');
        
        const title = document.createElement('h2');
        if (isCharInventory) {
            title.textContent = char.name + "'s Inventory";
        } else {
            title.textContent = "Inventory";
        }
        title.style.margin = '0';
        title.style.fontSize = '1.5em';
        title.style.color = '#333';
        topRow.appendChild(title);

        const closeButton = createImageButton('26', {source: "url(static/images/menu-icons/close.png)", custom_padding: 2});
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
            inventorySheet.remove();
        };
        topRow.appendChild(closeButton);

        // Create the inventory table container
        const inventoryTable = document.createElement('div');
        inventoryTable.classList.add('column');
        inventoryTable.classList.add('horizontal');
        inventoryTable.style.height = '90%';
        inventoryTable.style.gap = '10px';
        inventoryTable.style.marginTop = '10px';

        let selectedItem = null;

        const buttonDict = {
            'Use Item': true,
            'Send To': true,
            'Description': true,
        };

        const dropdownMenu = createDropdownMenu(buttonDict);
        dropdownMenu.style.overflow = "unset";
        inventorySheet.appendChild(dropdownMenu);

        // Create the dropdown menu for the 'Send To' button
        const sendToButtons = {}
        const sendToButtonCharIds = []
        Object.keys(inGameChars).forEach(charId => {
            if (isCharInventory && charId === id) return;
            sendToButtons[`${inGameChars[charId].char.name} (${charId})`] = true;
            sendToButtonCharIds.push(charId);
        });
        const sendToDropDownMenu = createDropdownMenu(sendToButtons);
        sendToDropDownMenu.style.left = '105%';
        sendToDropDownMenu.style.top = '5%';
        dropdownMenu.appendChild(sendToDropDownMenu);
        
        sendToDropDownMenu.lastChild.onclick = function(){
            sendToDropDownMenu.style.display = 'none';
        }

        for(let i = 0; i < Object.keys(inGameChars).length-1; i++){
            sendToDropDownMenu.who = sendToButtonCharIds[i]
            sendToDropDownMenu.children[i].onclick = function(){
                console.log('Send To action clicked', selectedItem, sendToDropDownMenu.children[i].textContent);
                let inputValue = userAskQuestion({type: "int", "Message": "How many?"});
                if (inputValue) {
                    if (selectedItem.quantity < inputValue) {
                        console.log('Not enough items to send')
                        inputValue = selectedItem.quantity;
                    }
                    inGameChars[sendToDropDownMenu.who].char.inventory.addItem(selectedItem, value);
                    inventory.removeItem(selectedItem.name, inputValue);
                    console.log('Sent', inputValue, selectedItem.name, 'to', sendToDropDownMenu.children[i].textContent);
                }
            }
        };

        dropdownMenu.children[0].onclick = function(){
            console.log('Use action clicked', selectedItem);
        }
        dropdownMenu.children[1].onclick = function(){
            console.log('Send To action clicked',  selectedItem);
            sendToDropDownMenu.style.display = 'flex';
        }
        dropdownMenu.children[2].onclick = function(event){
            console.log('Description clicked',  selectedItem);
            //displayItemDescription(selectedItem, event.clientX, event.clientY);
        }

        // Add items to the inventory table
        inventory.items.forEach(item => {
            const itemButton = document.createElement('button');
            itemButton.textContent = `${item.name} x${inventory.getQuantity(item.name)}`;
            itemButton.classList.add('inventory-button'); 

            itemButton.onclick = function (event) {
                selectedItem = item;
                dropdownMenu.style.display = 'block';
                // Calculate position for dropdown menu
                const rect = inventorySheet.getBoundingClientRect();
                dropdownMenu.style.left = `${event.clientX - rect.left}px`;
                dropdownMenu.style.top = `${event.clientY - rect.top}px`;
            };
            
            inventoryTable.appendChild(itemButton);
        });

        const currencyTab = document.createElement('div');
        currencyTab.classList.add('currency-tab');
        
        function createCurrency(imgSrc, value){
            const currency = document.createElement('div');
            currency.classList.add('box-circular-border');
            currency.classList.add('currency');
            currency.style.display = 'flex';
            currency.style.alignItems = 'center'; // Align image and text vertically
            currency.style.gap = '5px'; // Space between image and text
            const img = document.createElement('div');
            img.style.backgroundImage = `url(${imgSrc})`;
            img.style.backgroundSize = 'cover';
            img.style.paddingLeft = '3px'
            img.style.width = '24px'; // Set image size
            img.style.height = '24px';
            const text = document.createElement('span');
            text.textContent = `: ${value}`;
            text.style.fontSize = '1.1em';
            text.style.margin = '5px'
            currency.appendChild(img);
            currency.appendChild(text);
            return currency
        }
        
        // Append all currency elements to the currency tab
        currencyTab.appendChild(createCurrency("static/images/menu-icons/gold.png", inventory.currency.gold));
        currencyTab.appendChild(createCurrency("static/images/menu-icons/silver.png", inventory.currency.silver));
        currencyTab.appendChild(createCurrency("static/images/menu-icons/bronze.png", inventory.currency.bronze));

        // Assemble the components
        topRow.appendChild(title);
        addSpacer(topRow);
        topRow.appendChild(closeButton);

        inventorySheet.appendChild(topRow);
        inventorySheet.appendChild(inventoryTable);
        inventorySheet.appendChild(currencyTab);
    }
}

function charCalculateHoverButtonLocation(buttonSize, radius, angle){
    const finalX = (radius * 2) * Math.cos((angle * Math.PI) / 180) + radius - buttonSize / 2;
    const finalY = -(radius * 2) * Math.sin((angle * Math.PI) / 180) + radius - buttonSize / 2;
    return {finalX, finalY}
}


async function addCharacter(char, width, height, x, y, img = null){
    const charToken = document.createElement("div")
    charToken.classList.add("character")
    charToken.id = char.id
    charToken.style.left = `${x}px`
    charToken.style.top = `${y}px`
    charToken.style.width = `${width}px`
    charToken.style.height = `${height}px`
    charToken.draggable = true
    characterLayer.appendChild(charToken)

    const playerName = document.createElement("div")
    playerName.classList.add("player-name")
    playerName.style.marginTop = `${height+5}px`
    charToken.appendChild(playerName)
    

    if(char.controlledBy){
        playerName.textContent = char.name
    }

    if(img){
        charToken.style.backgroundImage = `url(${img})`
        charToken.style.backgroundSize = "cover"
        charToken.style.backgroundPosition = "center"
        charToken.style.backgroundColor = "transparent"
    }

    const buttonSize = 40
    const radius = width / 2
    let angle = 0
    function initButton(button){
        button.classList.add("hover-button")
        let {finalX, finalY} = charCalculateHoverButtonLocation(buttonSize, radius, angle)
        button.dataset.finalX = finalX;
        button.dataset.finalY = finalY;
    }

    // Inventory button -----------------------------------------------------------------------
    angle = 45
    const charTokenInventoryButton = createImageButton(buttonSize, {source: "url(static/images/menu-icons/inventory.png)"})
    charTokenInventoryButton.classList.add("inventory-button")
    charToken.appendChild(charTokenInventoryButton)
    initButton(charTokenInventoryButton)
    charTokenInventoryButton.onclick = function(event){
        charDisplayInventory({id :char.id}, event.clientX, event.clientY)
    }

    // Spellbook button -----------------------------------------------------------------------
    angle = 90
    const characterSpellbookButton = createImageButton(buttonSize, {source: "url(static/images/menu-icons/spellbook.png)"})
    characterSpellbookButton.classList.add("spellbook-button")
    charToken.appendChild(characterSpellbookButton)
    initButton(characterSpellbookButton)

    // Weapon button -----------------------------------------------------------------------
    angle = 135
    const characterWeaponButton = createImageButton(buttonSize, {source: "url(static/images/menu-icons/sword.png)"})
    characterWeaponButton.classList.add("weapon-button")
    charToken.appendChild(characterWeaponButton)
    initButton(characterWeaponButton)

    // Add event listeners
    if( serverRules.visible_inventories || char.controlledBy === player.userName){ // FUTURE: Check from rules "visible_inventories"
        charToken.addEventListener('mouseenter', () => {
            charDisplayHoverButtons({token: charToken})
        });
    
        charToken.addEventListener('mouseleave', () => {
            charHideHoverButtons({token: charToken})
        });
    }

    charToken.addEventListener('dragstart', (event) => {
        const hoverButtons = charToken.getElementsByClassName("hover-button");
        for (const button of hoverButtons) {
            button.style.display = 'none';
        }
    });

    charToken.addEventListener('dragend', (event) => {
        const hoverButtons = charToken.getElementsByClassName("hover-button");
        for (const button of hoverButtons) {
            button.style.display = 'flex';
        }
    });

    return charToken
}

async function addPouch(inventory, x, y){
    const pouch = document.createElement("div")
    pouch.classList.add("pouch")
    pouch.style.left = `${x}px`
    pouch.style.top = `${y}px`
    pouch.style.backgroundImage = "url(static/images/general/pouch.png)"

    pouch.inventory = inventory

    pouch.addEventListener("click", function(){
        charDisplayInventory({id : player.charId, inventory : inventory}, x, y)
    })

    characterLayer.appendChild(pouch)
}

function dropInventory(charId) {
    if(inGameChars[charId]){
        const charInfo = inGameChars[charId]
        const charLoaction = sessionInfo.charLocations.find(charLocation => charLocation.charId === charId)
        addPouch(new Inventory(charInfo.char.inventory), charLoaction.x + charInfo.width / 2 - 12.5, charLoaction.y + charInfo.height / 2 - 12.5) // -12.5 is half of the pouch size
        charInfo.char.inventory.clear()
    }else{
        alert("Character not found")
    }
}

function charOnDie(charToken){
    inGameChars[charToken.id].char.hp = 0
    charToken.style.filter = "grayscale(100%)" // FUTURE: Add animation
}


async function initLayer(){
    if (sceneInfo.discovered == false){
        const newSceneData = await dbGetScene(getCharScene(player.charId).name)
        if(newSceneData){
            sceneInfo = newSceneData
            scenes[getCharScene(player.charId).name] = sceneInfo
            sceneInfo.discovered = true
        }else{
            alert("Scene not found")
        }
    }

    if(!sceneInfo.layers) return alert("No layers found in the scene")

    // future get image  width and heigh with scale factor
    backgroundLayer.innerHTML = "" // FUTURE we may keep old layer in case of fast returning
    characterLayer.innerHTML = "" // FUTURE we may keep old layer in case of fast returning
    audioAmbiance.pause()

    const layer = sceneInfo.layers[getCharScene(player.charId).layer]

    if(!layer) return alert("Layer not found in the scene")

    topBarLayerName.textContent = "Layer " + getCharScene(player.charId).layer

    const background = await addBackground(layer.width, layer.height, layer.x, layer.y, "static/images/background/"+layer.img)
    
    if(layer.portals){
        for(let portal of Object.values(layer.portals)){
            addPortal(portal, background)
        }
    }

    async function addCharFromDb(charLocation){

        if (!inGameChars[charLocation.charId]){
            const charInfo =  await dbGetChar(charLocation.charId)

            if(charInfo){
                inGameChars[charInfo.char.id] = {
                    char : new Character(charInfo.char), 
                    width: charInfo.width, 
                    height: charInfo.height,
                    img: charInfo.img
                }
            }else{
                console.log("Character not found", charLocation.charId, ". Retrying in 1 second")
                return setTimeout(addCharFromDb, 1000, charLocation)
            }
        }
        
        const charInfo = inGameChars[charLocation.charId]

        if(charInfo.char.id === player.charId){
            inGameChars[charInfo.char.id].char.inventory.addItem(new Item("Potion", itemTypes.CONSUMABLE), 4)
            inGameChars[charInfo.char.id].char.inventory.addItem(new Item("Sword", itemTypes.WEAPON), 1)
        }

        addCharacter(charInfo.char, charInfo.width, charInfo.height, charLocation.x, charLocation.y, "static/images/character/"+charInfo.img)

    }

    if(sessionInfo.charLocations){
        for(const char of Object.values(sessionInfo.charLocations)){
            addCharFromDb(char)
        }
    }

    if (layer.ambiance) {
        audioAmbiance.src = `static/images/background/${layer.ambiance}`;
        
        // Function to play ambiance audio
        const playAmbiance = () => {
            audioAmbiance.play().catch(error => {
                console.error("Failed to play ambiance audio:", error, "Source:", audioAmbiance.src);
            });
        };

            // Add an event listener to play the audio on the first user interaction
            const userInteractionHandler = () => {
                playAmbiance();
                document.removeEventListener('click', userInteractionHandler);
                document.removeEventListener('keydown', userInteractionHandler);
            };
            document.addEventListener('click', userInteractionHandler);
            document.addEventListener('keydown', userInteractionHandler);
        
    }
}

async function initScene(){
    const gridSize = sceneInfo.grid_size
    const width = sceneInfo.width
    const height = sceneInfo.height

    gridBackground.style.backgroundSize = `${gridSize}px ${gridSize}px`;

    gameboardContent.style.width = `${width}px`
    gameboardContent.style.height = `${height}px`;
    gameboardContent.style.top = `${-height/2}px`
    gameboardContent.style.left = `${-width/2}px`;

    gameboardContent.style.transform = `translate(0px, 0px) scale(1)`;

    topBarSceneName.textContent = getCharScene(player.charId).name
    initLayer()
}

async function initGameBoard() {
    const newSessionData = await dbGetSession()

    let isOk = false    

    async function initGameBoardFunctions(){
        const maxZoomOut = 0.6 // If its lower grids dissaper
        const maxZoomIn = 5 // it can be higher
        gameboardContent.addEventListener('mousedown', (event) => {
            if (event.button === 0 && gameboardContent.style.cursor === 'move') { // Middle mouse button
                boardEvent.isPanning = true;
                boardEvent.startX = event.clientX - boardEvent.panX;
                boardEvent.startY = event.clientY - boardEvent.panY;
            }
            if (event.button === 1 && gameboardContent.style.cursor !== 'move') { // Middle mouse button
                boardEvent.isPanning = true;
                boardEvent.startX = event.clientX - boardEvent.panX;
                boardEvent.startY = event.clientY - boardEvent.panY;
                gameboardContent.style.cursor = 'grabbing';
            }
        });
    
        gameboardContent.addEventListener('mouseup', (event) => {
            boardEvent.isPanning = false;
            if (event.button === 1 && gameboardContent.style.cursor !== 'move') gameboardContent.style.cursor = 'auto';
        });
    
        gameboardContent.addEventListener('mousemove', (event) => {
            if (!boardEvent.isPanning) return;
            boardEvent.panX = event.clientX - boardEvent.startX;
            boardEvent.panY = event.clientY - boardEvent.startY;
            
            gameboardContent.style.transform = `translate(${boardEvent.panX}px, ${boardEvent.panY}px) scale(${boardEvent.scale})`;
        });
    
        gameboardContent.addEventListener('wheel', (event) => {
            event.preventDefault();
            const scaleAmount = -event.deltaY * 0.001;
            boardEvent.scale = Math.min(Math.max(maxZoomOut, boardEvent.scale + scaleAmount), maxZoomIn);
            gameboardContent.style.transform = `translate(${boardEvent.panX}px, ${boardEvent.panY}px) scale(${boardEvent.scale})`;
        });

        gameboardContent.addEventListener('dragStart', (event) => {
            boardEvent.dragStartX = event.clientX;
            boardEvent.dragStartY = event.clientY;
            // Which element is being dragged
            const element = event.target;
            if(element.classList.contains("background")){

            }
        })
    }
    
    if(newSessionData){
        if(newSessionData.session){
            sessionInfo = newSessionData.session
        
            console.log(sessionInfo)
            isOk = true;
        }

        if (newSessionData.scenes){
            scenes = newSessionData.scenes
            
            let playerCharScene = getCharScene(player.charId)
            if(!playerCharScene){
                alert("Character not found in the session.")
            }else{
                sceneInfo = scenes[playerCharScene.name]
                console.log(newSessionData.scenes)
                initScene()
                initGameBoardFunctions()
            }
            
        }else if(isOk) isOk = false;
    }

    if(!isOk) return setTimeout(initGameBoard(), 500);
}


// ACTIVE ----------------------------------------------------------------------------
function addMessageToChat(chatMessage, senderName, timestamp) {
    const testMessage = document.createElement("div");
    testMessage.classList.add('chat-message');
    
    // Add classes based on whether the message is sent by the user
    if (senderName === player.userName) {
        testMessage.classList.add('self');
        senderName = "You";
    } else {
        testMessage.classList.add('other');
    }

    // Create the header (name and time)
    const header = document.createElement("div");
    header.classList.add('header');

    const nameSpan = document.createElement("span");
    nameSpan.classList.add('name');
    nameSpan.textContent = senderName;

    const timeSpan = document.createElement("span");
    timeSpan.classList.add('time');
    const date = new Date(timestamp);
    timeSpan.textContent = date.toUTCString().split(' ')[4].slice(0, -3); // Extract HH:MM from UTC time

    header.appendChild(nameSpan);
    header.appendChild(timeSpan);

    // Add the header to the message
    testMessage.appendChild(header);

    // Add the message content
    const content = document.createElement("div");
    content.classList.add('content');
    content.textContent = chatMessage;

    testMessage.appendChild(content);

    // Append the message to the chat container
    chatMessages.appendChild(testMessage);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;

    
}

sendButton.addEventListener("click", async function() {
    const chatMessage = chatWriteInput.value;
    const state = await sendMessage(chatMessage)
    if(state.success === null){
        alert("Failed to send message")
    }else{
        chatWriteInput.value = '';
    }
})

chatWriteArea.addEventListener("keydown", async function(event) {
    if (event.key === 'Enter') {
        const chatMessage = chatWriteInput.value;
        chatWriteInput.value = '';
        const state = await sendMessage(chatMessage)
        if(state.success === null){
            alert("Failed to send message")
        }else{
            chatWriteInput.value = '';
        }
    }
})

storageButton.onclick = () => {
    if (storage.style.left !== "50px") {
        storage.style.left = "50px";
    } else {
        storage.style.left = "-330px";
    }
};

chatButton.onclick = async () => {
    if(chat.style.right !== "0px") {
        chat.style.right = "0px";
    }else{
        chat.style.right = "-330px";
    }
    
}

function startSyncTimer() {
    
    let cnt = 0;
    async function update() {
        cnt++;
        if(isUpdating === false){
            serverInfo = await getGameFile("server_info")
            await getGameFile("game_elements")
        }
    }
    setInterval(update, 1000); // Update every second
}

async function  initDatabase(initStates){
    try {
        // Fetch server info
        const newServerInfo = await getGameFile("server_info", false);

        // Ensure server info is valid
        if (!newServerInfo || newServerInfo.server_status !== "online") {
            return false; 
        }

        if(initStates.isChatOk == false){
            // Ensure chat_idx exists
            if (newServerInfo.chat_idx) {
                serverInfo = newServerInfo; // Update global serverInfo variable

                // Fetch chat data based on the latest index
                const chatData = await getChat(serverInfo.chat_idx, 10);

                // Process and add chat messages
                for (const data of chatData) {
                    addMessageToChat(data.message, data.user, data.timestamp);
                }

                // Update chat last index
                chat.last_idx = serverInfo.chat_idx;

                initStates.isChatOk = true;
            }else {
                alert("Chat index is missing in the server info.");
            }
        } 
        if(initStates.isRulesOk == false){
            // Fetch game elements
            const rules = await getGameFile("rules");

            // Ensure game elements are valid
            if (rules) {
                serverRules = rules; // Update global serverRules variable
                initStates.isRulesOk = true;
            } else {
                alert("Failed to fetch game elements.");
            }
        }
    } catch (error) {
        // Handle unexpected errors
        return false
    }

    // Wait for all tasks to complete before returning
    if (Object.values(initStates).every(state => state === true)) {
        console.log("Chat synchronization started successfully.");
        return true;
    } else {
        console.warn("Failed to start chat synchronization.");
        return false;
    }
}

async function loadSpells(){
    const spellData = await getGameFile("spells")
    if(spellData){
        // check spell data correctness
        spells = spellData
        
        for(const spellLevel of Object.keys(spells)){
            const spellContainer = document.createElement('div');
            spellContainer.classList.add('spell-container');
        
            const spellHeader = document.createElement('h3');
            spellHeader.classList.add('spell-header');
            spellHeader.textContent = `Level ${spellLevel}`;
            spellContainer.appendChild(spellHeader);
        
            const spellContent = document.createElement('div');
            spellContent.classList.add('spell-content');
            spellContent.style.display = 'none'; // Initially hidden
        
            for (const spellName of Object.keys(spells[spellLevel])) {
                const spell = spells[spellLevel][spellName];
                const spellInfo = document.createElement('div');
                spellInfo.classList.add('spell-info');
                spellInfo.innerHTML = `
                    <h4>${spell.name}</h4>
                    <p>${spell.description}</p>
                    ${spell.damage ? `<p>Damage: ${spell.damage}</p>` : ''}
                    ${spell.heal ? `<p>Heal: ${spell.heal}</p>` : ''}
                    ${spell.additionals ? `<p>Additional: ${spell.additionals.join(', ')}</p>` : ''}
                `;
                spellContent.appendChild(spellInfo);
            }
        
            spellContainer.appendChild(spellContent);
            contentYourSpells.appendChild(spellContainer);
        
            spellHeader.addEventListener('click', () => {
                spellContent.style.display = spellContent.style.display === 'none' ? 'block' : 'none';
            });
        }
    }else{
        return loadSpells()
    }
}   

function startSyncTimer() {
    
    let cnt = 0;
    async function update() {
        cnt++;
        if(isUpdating === false){
            const newServerInfo = await getGameFile("server_info")
            if(newServerInfo){
                if(newServerInfo.chat_idx !== chat.last_idx){
                    const diff = parseInt(newServerInfo.chat_idx, 10) - parseInt(chat.last_idx, 10) - 1 ;
                    const chatData = await getChat(serverInfo.chat_idx, diff)
                    for (const data of chatData) {
                        addMessageToChat(data.message, data.user, data.timestamp)
                    }
                    chat.last_idx = newServerInfo.chat_idx;
                }
            }

            isUpdating = false
        }
    }
    setInterval(update, 1000); // Update every second
}

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    player.userKey = urlParams.get("key")
    player.userName = urlParams.get("userName")
    player.charId = urlParams.get("charId")

    let isUpdating = false;
    let initErrorCounter = 0

    let initStates = {
        isChatOk: false,
        isRulesOk: false,
    }
    const intervalId = setInterval(async function () {
        if(isUpdating == false){
            isUpdating = true;
            if(initErrorCounter == 10){
                alert("Server is offline or server info could not be fetched. Retrying... In 5 seconds");
                initErrorCounter++;
            }else if(initErrorCounter > 20){
                initErrorCounter = 0;
            }
            else{

                    const initResponse = await initDatabase(initStates) 
                    if(initResponse == false) initErrorCounter += 1
                    else{
                        initGameBoard()
                        loadSpells()
                        startSyncTimer();
                        clearInterval(intervalId);
                    }
            
            }
            isUpdating = false;
        }
    }, 500)
})