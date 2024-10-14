const formColor = 'rgb(240, 222, 118)'
const creatorSheetColor = 'rgb(118, 240, 173)'

function addSpellCreator(initalSpell = null){

    if(document.getElementById('spell-create-sheet')) return;

    const spellCreateSheet = document.createElement('div');
    spellCreateSheet.classList.add('spell-create-sheet');
    spellCreateSheet.classList.add('box-circular-border');
    spellCreateSheet.classList.add('column');
    spellCreateSheet.classList.add('vertical');
    spellCreateSheet.id ='spell-create-sheet';
    spellCreateSheet.style.backgroundColor = creatorSheetColor

    addDraggableRow(spellCreateSheet);

    const title = document.createElement('h1');
    title.textContent = 'Create a New';
    title.classList.add('box-circular-border');
    title.style.padding = "5px"
    title.style.margin = "10px"
    title.style.backgroundColor = "rgba(255, 255, 255)"
    spellCreateSheet.appendChild(title);

    const columnContainer = document.createElement('div');
    columnContainer.style.display = 'block';
    columnContainer.style.width = '98%';
    columnContainer.style.height = '95%';
    columnContainer.style.position = 'relative';
    columnContainer.style.overflowY = 'scroll';

    spellCreateSheet.appendChild(columnContainer);

    const buttonsRow = document.createElement('div');
    buttonsRow.classList.add('row')
    buttonsRow.style.margin = '5px'
    spellCreateSheet.appendChild(buttonsRow)

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Spell';
    buttonsRow.appendChild(saveButton);
    
    const form = document.createElement('div');
    form.classList.add('column');
    form.classList.add('vertical');
    form.style.width = '98%';
    form.style.gap = '10px';
    form.style.padding = '5px';
    columnContainer.appendChild(form);

    let maxSpellLevel = gameSettings.includedSpellLevels.at(-1);

    if(initalSpell == null){
        initalSpell = new Spell();
        spellTypeSelectionContainer()
    }else{
        editedSpellTypeInfo(initalSpell.type, initalSpell.spellLevel)
    }

    const nameForm = createStringInput('Name: ', {id: 'create-spell-name'});
    nameForm.classList.add('box-circular-border');
    nameForm.style.backgroundColor = formColor;
    form.appendChild(nameForm);

    const formClasses = createSelectorInput('Classes', Object.values(classTypes), Object.keys(classTypes), {
        id:  'spell-create-clasess',
        multiple: true,
    });
    formClasses.classList.add('box-circular-border');
    formClasses.style.height = '150px';
    formClasses.style.backgroundColor = formColor;
    form.appendChild(formClasses);

    const formModifierStat = createSelectorInput('Modifier Stat: ', Object.values(statTypes), Object.keys(statTypes),{
        id:  'spell-create-modifier-stats',
        multiple: true,
    });
    formModifierStat.classList.add('box-circular-border');
    formModifierStat.style.height = '100px';
    formModifierStat.style.backgroundColor = formColor;
    form.appendChild(formModifierStat);

    const baseDamageType = createSelectorInput('Base Damage Type: ', Object.values(damageTypes), Object.keys(damageTypes), {
        id:  'spell-create-base-damage-type',
        multiple: false,
    });
    baseDamageType.classList.add('box-circular-border');
    baseDamageType.style.backgroundColor = formColor;

    const baseDamage = createDamageInput("Damage: ")
    baseDamage.style.display = "none"
    baseDamageType.appendChild(baseDamage);
    
    form.appendChild(baseDamageType);

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

    const spellDuration = createSelectorInput('Cast Duration: ', Object.values(durationTypes), Object.keys(durationTypes), {
        id:  'spell-create-base-damage-type',
        defaultValue: [durationTypes.INSTANT]
    });
    spellDuration.classList.add('box-circular-border');
    spellDuration.style.backgroundColor = formColor;

    const spellDurationValue = createNumberInput("Value: ", 'create-spell-duration-value', 50, 1, false, false)
    spellDurationValue.style.display = "none"
    spellDuration.querySelector('.input-element').onchange =  (event) => {
        const value = event.target.value
        if(value == durationTypes.TURN_BASED){
            spellDurationValue.style.display = "flex"
        }else{
            spellDurationValue.style.display = "none"
        }
    }
    spellDuration.appendChild(spellDurationValue);
    form.appendChild(spellDuration);

    const spellActionCost = createSelectorInput('Action Cost: ', Object.values(actionTypes), Object.keys(actionTypes),{
        id: 'create-spell-pattern-cast-type',
        defaultValue: [actionTypes.MAIN], 
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
        if(initalSpell.spendManaEffects[index] && initalSpell.spendManaEffects[index].target){
            for(let additionalEffect of initalSpell.spendManaEffects[index].target){
                const listElement = createAdditionalEffectListElement()
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
        if(initalSpell.spendManaEffects[index] && initalSpell.spendManaEffects[index].caster){
            for(let additionalEffect of initalSpell.spendManaEffects[index].caster){
                const listElement = createAdditionalEffectListElement()
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
        defaultValue: 'select', 
    })
    spellPatternSelect.classList.add('box-circular-border');
    spellPatternSelect.style.backgroundColor = formColor;
    spellPatternContainer.appendChild(spellPatternSelect);

    const spellCastArea = createNumberInput("Cast Area:", "create-spell-pattern-cast-area", 9999, 0, false, false)
    spellCastArea.classList.add('box-circular-border');
    spellCastArea.style.backgroundColor = formColor;
    spellPatternContainer.appendChild(spellCastArea);

    const spellCastWidth = createNumberInput("Cast Area:", "create-spell-pattern-cast-area", 500, 0, false, false)
    spellCastWidth.classList.add('box-circular-border');
    spellCastWidth.style.backgroundColor = formColor;
    spellPatternContainer.appendChild(spellCastWidth);

    const spellCastType = createSelectorInput('Spell Cast Type: ', Object.values(castTypes), Object.keys(castTypes),{
        id: 'create-spell-pattern-cast-type',
        defaultValue: getKeyFromMapWithValue(castTypes, castTypes.ON_LOCATION), 
    })
    spellCastType.classList.add('box-circular-border');
    spellCastType.style.backgroundColor = formColor;
    spellPatternContainer.appendChild(spellCastType);

    const spellCanTarget = createSelectorInput('Can Target: ', Object.values(targetTypes), Object.keys(targetTypes),{
        id: 'create-spell-pattern-can-target',
        defaultValue: [targetTypes.ANY], 
        multiple: true,
        custom_func: indexedOptionFunctionWithTransperency
    })
    spellCanTarget.classList.add('box-circular-border');
    spellCanTarget.style.backgroundColor = formColor;
    spellPatternContainer.appendChild(spellCanTarget);
    form.appendChild(spellPatternContainer)

    const spellCasterRolls = createSelectorInput('Caster Rolls: ', Object.values(rollTypes), Object.keys(rollTypes),{
        id: 'create-spell-caster-rolls',
        defaultValue: [rollTypes.ABILITY_THROW], 
        multiple: true,
    })
    spellCasterRolls.classList.add('box-circular-border');
    spellCasterRolls.style.backgroundColor = formColor;
    form.appendChild(spellCasterRolls)

    const spellTargetRolls = createSelectorInput('Target Rolls: ', Object.values(rollTypes), Object.keys(rollTypes),{
        id: 'create-spell-target-rolls',
        defaultValue: [rollTypes.SAVING_THROW], 
        multiple: true,
    })
    spellTargetRolls.classList.add('box-circular-border');
    spellTargetRolls.style.backgroundColor = formColor;
    form.appendChild(spellTargetRolls)
    // --------------------------END ------------------------
    updateElements();
    userInterface.appendChild(spellCreateSheet);
    function spellTypeSelectionContainer(){
        const rowSpellSelect = document.createElement('div');
        rowSpellSelect.classList.add('row');
        rowSpellSelect.classList.add('vertical');
        rowSpellSelect.classList.add('form-group')
        rowSpellSelect.classList.add('box-circular-border');
        rowSpellSelect.style.backgroundColor = formColor;
        rowSpellSelect.style.gap = '10px';
        
        const selectSpellType = createSelectorInput('Spell Type: ', Object.values(spellTypes), Object.keys(spellTypes), 'select', 'spell-create-spell-type', null, null);
        const spellLevel = createSelectorInput('Spell Level: ', Object.values(gameSettings.includedSpellLevels), Object.keys(gameSettings.includedSpellLevels), 'select', 'spell-create-spell-type', null, null);
        rowSpellSelect.appendChild(selectSpellType);
        rowSpellSelect.appendChild(spellLevel);

        selectSpellType.querySelector('.input-element').onchange = () => {
            //const oldSpellType = initalSpell.spellType
            initalSpell.spellType = selectSpellType.querySelector('.input-element').selectedOptions[0].value;
            //if(oldSpellType  == spellTypes.SPELL && initalSpell.spellType == spell)
            if(initalSpell.spellType == spellTypes.SPELL || initalSpell.spellType == spellTypes.CONJURE){
                initalSpell.spellLevel = 1
                maxSpellLevel = gameSettings.includedSpellLevels.at(-1);
                updateElements();
            }else if(initalSpell.spellType == spellTypes.CANTRIP){
                initalSpell.spellLevel = 0
                maxSpellLevel = 0;
                updateElements();
            }else if(initalSpell.spellType == spellTypes.WEAPON){
                initalSpell.spellLevel = 0
                maxSpellLevel = gameSettings.includedSpellLevels.at(-1);
                updateElements();
            }
        }

        spellLevel.querySelector('.input-element').onchange = () => {
            initalSpell.spellLevel = spellLevel.querySelector('.input-element').selectedOptions[0].value;
            updateElements();
        }

        form.appendChild(rowSpellSelect);
    }

    function editedSpellTypeInfo(spellType, spellLevel) {
        const rowSpellSelect = document.createElement('div');
        rowSpellSelect.classList.add('row');
        rowSpellSelect.classList.add('vertical');
        rowSpellSelect.classList.add('box-circular-border');
        rowSpellSelect.style.backgroundColor = formColor;
        rowSpellSelect.style.paddingLeft = '15px';
        rowSpellSelect.style.width = '95%';
        rowSpellSelect.style.gap = '10px';

        const selectSpellType = createSelectorInput('Spell Type: ', [spellType], [Object.keys(spellTypes).find(key => spellTypes[key] === spellType)]);
        const selectSpellLevel = createSelectorInput('Spell Level: ', [spellLevel], [spellLevel]);
        rowSpellSelect.appendChild(selectSpellType);
        rowSpellSelect.appendChild(selectSpellLevel);

        form.appendChild(rowSpellSelect);
    }

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

    function createAdditionalEffectListElement(id, additionalEffect, edit_icon = uiSettings.icon_edit, close_icon= uiSettings.icon_closeBar) {

        if(additionalEffect == null) additionalEffect = new AdditionalEffect();
    
        const listElement = document.createElement('div');
        listElement.classList.add('additiona-effect-container');
        listElement.classList.add('list-element'); // 30px 
        listElement.classList.add('box-circular-border');
        listElement.classList.add('row');
        listElement.classList.add('vertical');
    
        const labeledElement = document.createElement('div');
        labeledElement.classList.add('row');
        labeledElement.classList.add('centered');
        labeledElement.style.gap = '5px';
    
        const label = document.createElement('label');
        label.style.textAlign = 'center';
        label.style.fontSize = '14px';
        label.style.paddingLeft = '5px';
        label.textContent = additionalEffect.name;
        labeledElement.appendChild(label)
    
    
            
    
        if(additionalEffect){
            additionalEffect.name;
            let effectImageList = new Set();
            for(const effect of additionalEffect.effects){
                switch (effect.type) {
                    case additionalEffectTypes.BUFF:
                        // Code to run if expression === value1
                        effectImageList.add(uiSettings.icon_buffDebuff)
                        break;
                    
                    case additionalEffectTypes.AURA:
                        // Code to run if expression === value2
                        effectImageList.add(uiSettings.icon_aura);
                        break;
                    
                    case additionalEffectTypes.CAST:
                        // Code to run if expression === value3
                        effectImageList.add(uiSettings.icon_cast);
                        break;
                }
            }
            for(const effectImage of effectImageList){
                const effectImg = document.createElement('img');
                effectImg.classList.add('icon');
                effectImg.style.width = '23px';
                effectImg.style.height = '23px';
                effectImg.style.marginRight = '10px';
                effectImg.src = uiSettings.folderMenuIcons + '/' + effectImage;
                labeledElement.appendChild(effectImg);
            }     
        }
    
    
        const removeButton = createImageButton('26', {source: uiSettings.folderMenuIcons + '/' + close_icon, custom_padding: 3});
        removeButton.onclick = () => {
            listElement.remove()
        }
    
    
        const editButton = createImageButton('26', {source: uiSettings.folderMenuIcons + '/' + edit_icon, custom_padding: 3});
        editButton.onclick = () => {
            additionalEffectBuilder(id, additionalEffect, listElement);
        }
    
        listElement.appendChild(labeledElement);
        addSpacer(listElement);
        listElement.appendChild(editButton);
        listElement.appendChild(removeButton);
    
        listElement.additionalEffect = additionalEffect;
        return listElement;
    }

    function updateElements(){
        let displayedLevels;
        displayedLevels = selectableSpellLevels.filter(level => gameSettings.includedSpellLevels.includes(level));

        // Filter out any selectableSpellLevels lower than initialSpell.spellLvl
        displayedLevels = displayedLevels.filter(level => (parseInt(level) >= parseInt(initalSpell.spellLevel) && parseInt(level) <= parseInt(maxSpellLevel)));

        selectableSpellLevels.forEach(level => {
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

