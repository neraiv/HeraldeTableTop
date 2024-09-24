const formColor = 'rgb(240, 222, 118)'
const creatorSheetColor = 'rgb(118, 240, 173)'

function addSpellCreator(){

    let newSpell = new Spell();

    newSpell = listSpells[1].Heralde
    
    const spellCreateSheet = document.createElement('div');
    spellCreateSheet.classList.add('spell-create-sheet');
    spellCreateSheet.classList.add('box-circular-border');
    spellCreateSheet.classList.add('column');
    spellCreateSheet.classList.add('vertical');
    spellCreateSheet.id ='spell-create-sheet';
    spellCreateSheet.style.maxWidth = '600px';
    spellCreateSheet.style.backgroundColor = creatorSheetColor

    const title = document.createElement('h3');
    title.textContent = 'Create a New';

    const outerColumn = document.createElement('div');
    outerColumn.style.display = 'block';
    outerColumn.style.width = '95%';
    outerColumn.style.height = '95%';
    outerColumn.style.position = 'relative';
    outerColumn.style.overflowY = 'scroll';

    const form = document.createElement('div');
    form.classList.add('column');
    form.classList.add('vertical');
    form.style.width = '98%';
    form.style.gap = '10px';
    form.style.padding = '5px';
    outerColumn.appendChild(form);

    const nameForm = createStringInput('Name: ', 'create-spell-name');
    nameForm.classList.add('box-circular-border');
    nameForm.style.backgroundColor = formColor;
    form.appendChild(nameForm);

    const formClasses = createSelectorInput('Classes', Object.values(classType), Object.keys(classType), null, 'spell-create-clasess', null, true);
    formClasses.classList.add('box-circular-border');
    formClasses.style.height = '150px';
    formClasses.style.backgroundColor = formColor;
    form.appendChild(formClasses);

    const formModifierStat = createSelectorInput('Modifier Stat: ', Object.values(statType), Object.keys(statType), null, 'spell-create-modifier-stats', null, true);
    formModifierStat.classList.add('box-circular-border');
    formModifierStat.style.height = '100px';
    formModifierStat.style.backgroundColor = formColor;
    form.appendChild(formModifierStat);

    const baseDamageType = createSelectorInput('Base Damage Type: ', Object.values(damageType), Object.keys(damageType), null, 'spell-create-base-damage-type', null, false);
    baseDamageType.classList.add('box-circular-border');
    baseDamageType.style.height = '30px';
    baseDamageType.style.backgroundColor = formColor;
    form.appendChild(baseDamageType);

    const formDescription = createStringInput('Description: ', 'create-spell-description');
    formDescription.classList.add('box-circular-border');
    formDescription.style.height = '150px';
    formDescription.style.backgroundColor = formColor;
    form.appendChild(formDescription);

    const formTargetEffects = document.createElement('div');
    formTargetEffects.classList.add('column');
    formTargetEffects.classList.add('vertical');
    formTargetEffects.classList.add('box-circular-border');
    formTargetEffects.style.width = '95%';
    formTargetEffects.style.padding = '5px';
    formTargetEffects.style.gap = '10px';
    formTargetEffects.style.backgroundColor = formColor;
    
    const formTargetEffectsTitle = document.createElement('label');
    formTargetEffectsTitle.textContent = 'Spend Mana Effects';
    formTargetEffectsTitle.style.fontWeight = 'bold';

    const tabNamesTargetEffects = ['Cantrip','1', '2', '3', '4', '5', '6', '7', '8', '9']
    const tabbedWindowContainerTargetEffects = createTabbedContainer(10, tabNamesTargetEffects);
    tabbedWindowContainerTargetEffects.style.width = '100%';
    tabbedWindowContainerTargetEffects.style.backgroundColor = formColor;

    for(let i = 0; i < tabNamesTargetEffects.length; i++){
        const tabContent = getContentContainer(tabbedWindowContainerTargetEffects.tabContainer, tabNamesTargetEffects[i])
        tabContent.innerHTML = '';
        const formTargetEffects = createAdditonalEffectListBuildContainer(newSpell.targetEffects[i], `Spell Mana Effect for Mana: ${i+1}`);
        formTargetEffects.style.height = '150px';
        tabContent.appendChild(formTargetEffects);
    }
    formTargetEffects.appendChild(formTargetEffectsTitle);
    formTargetEffects.appendChild(tabbedWindowContainerTargetEffects);
    form.appendChild(formTargetEffects);


    const spendManaEffects = document.createElement('div');
    spendManaEffects.classList.add('column');
    spendManaEffects.classList.add('vertical');
    spendManaEffects.classList.add('box-circular-border');
    spendManaEffects.style.width = '95%';
    spendManaEffects.style.padding = '5px';
    spendManaEffects.style.gap = '10px';
    spendManaEffects.style.backgroundColor = formColor;
    
    const spendManaEffectsTitle = document.createElement('label');
    spendManaEffectsTitle.textContent = 'Spend Mana Effects';
    spendManaEffectsTitle.style.fontWeight = 'bold';

    const tabNames = ['Cantrip','1', '2', '3', '4', '5', '6', '7', '8', '9']
    const tabbedWindowContainer = createTabbedContainer(10, tabNames);
    tabbedWindowContainer.style.width = '100%';
    tabbedWindowContainer.style.backgroundColor = formColor;

    for(let i = 0; i < tabNames.length; i++){
        const tabContent = getContentContainer(tabbedWindowContainer.tabContainer, tabNames[i])
        tabContent.innerHTML = '';
        const formTargetEffects = createAdditonalEffectListBuildContainer(newSpell.spendManaEffects[i], `Spell Mana Effect for Mana: ${i+1}`);
        formTargetEffects.style.height = '150px';
        tabContent.appendChild(formTargetEffects);
    }
    spendManaEffects.appendChild(spendManaEffectsTitle);
    spendManaEffects.appendChild(tabbedWindowContainer);
    form.appendChild(spendManaEffects);

    const patternWindow = document.createElement('div');
    patternWindow.classList.add('column');
    patternWindow.classList.add('vertical');
    patternWindow.classList.add('box-circular-border');
    patternWindow.style.width = '95%';
    patternWindow.style.padding = '5px';
    patternWindow.style.gap = '10px';
    patternWindow.style.backgroundColor = formColor;

    const patternWindowTitle = document.createElement('label');
    patternWindowTitle.textContent = 'Spell Pattern';
    patternWindowTitle.style.fontWeight = 'bold';
    patternWindow.appendChild(patternWindowTitle);

    const patternSelect = createSelectorInput('Pattern Type: ', Object.values(spellPatterns), Object.keys(spellPatterns), null, 'spell-create-spell-pattern',null, false);
    patternSelect.classList.add('box-circular-border');
    patternSelect.style.height = '30px';
    patternWindow.appendChild(patternSelect);

    const spellRange = createNumberInput('Range:');
    spellRange.classList.add('box-circular-border');
    spellRange.style.height = '30px';
    patternWindow.appendChild(spellRange);

    const spellArea = createNumberInput('Area:');
    spellArea.classList.add('box-circular-border');
    spellArea.style.height = '30px';
    patternWindow.appendChild(spellArea);

    const castTypeSelect = createSelectorInput('Pattern Type: ', Object.values(castType), Object.keys(castType), null, 'spell-create-cast-type',null, false);
    castTypeSelect.classList.add('box-circular-border');
    castTypeSelect.style.height = '30px';
    patternWindow.appendChild(castTypeSelect);
    form.appendChild(patternWindow);

    const durationSelect = createSelectorInput('Duration: ', Object.values(durationTypes), Object.keys(durationTypes), null, 'spell-create-duration-type', null, false);
    durationSelect.classList.add('box-circular-border');
    durationSelect.style.backgroundColor = formColor;
    form.appendChild(durationSelect);

    const actionTypeSelect = createSelectorInput('Required Action Type: ', Object.values(actionType), Object.keys(actionType), null, 'spell-create-action-type', null, false);
    actionTypeSelect.classList.add('box-circular-border');
    actionTypeSelect.style.backgroundColor = formColor;
    form.appendChild(actionTypeSelect);

    const casterRollTypesSelect = createSelectorInput('Caster Rolls With: ', Object.values(rollTypes), Object.keys(rollTypes), null, 'spell-create-caster-rolls', null);
    casterRollTypesSelect.classList.add('box-circular-border');
    casterRollTypesSelect.style.backgroundColor = formColor;
    form.appendChild(casterRollTypesSelect);

    const targetRollTypesSelect = createSelectorInput('Target(s) Rolls With: ', Object.values(rollTypes), Object.keys(rollTypes), null, 'spell-create-taget-rolls', null);
    targetRollTypesSelect.classList.add('box-circular-border');
    targetRollTypesSelect.style.backgroundColor = formColor;
    form.appendChild(targetRollTypesSelect);

    const canTarget = createSelectorInput('Can Target: ', Object.values(targetTypes), Object.keys(targetTypes), null, 'spell-create-taget-list', null);
    canTarget.classList.add('box-circular-border');
    canTarget.style.backgroundColor = formColor;
    form.appendChild(canTarget);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Spell';
    saveButton.classList.add('btn');
    saveButton.addEventListener('click', () => {
        console.log(nameForm.inputElement.value);
        console.log(getSelectedOptionsWithCheckmark(formClasses.inputElement))
        console.log(getSelectedOptionsWithCheckmark(formModifierStat.inputElement))
        console.log(baseDamageType.inputElement.value)
        console.log(formDescription.inputElement.value)

    });

    spellCreateSheet.appendChild(title);
    spellCreateSheet.appendChild(outerColumn);
    spellCreateSheet.appendChild(saveButton);

    userInterface.appendChild(spellCreateSheet);
    return spellCreateSheet;
}

function createAdditonalEffectListBuildContainer(additionalEffectList, id, titleStr = null){

    if(!additionalEffectList || additionalEffectList == spellNormalCast) additionalEffectList = [];
    

    const additonalEffectsContainer = document.createElement('div');
    additonalEffectsContainer.classList.add('form-group');
    additonalEffectsContainer.classList.add('column');
    additonalEffectsContainer.classList.add('vertical');

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

    const buttonPreviouslyCreated = document.createElement('button')
    buttonPreviouslyCreated.textContent = 'Add Perviusly Created';
    buttonPreviouslyCreated.style.textAlign = 'center';
    buttonPreviouslyCreated.style.display = 'flex';


    const buttonCreateNew = document.createElement('button')
    buttonCreateNew.textContent = 'Create New';
    buttonCreateNew.style.textAlign = 'center';
    buttonCreateNew.style.display = 'flex';

    buttonCreateNew.onclick = () => {
        const element = createCustomListElement(id, null);
        elementsListColumn.appendChild(element)
    }

    for(const additionalEffect of additionalEffectList){
        const element = createCustomListElement(id, additionalEffect);
        elementsListColumn.appendChild(element)
    }

    buttonsList.appendChild(buttonPreviouslyCreated)
    buttonsList.appendChild(buttonCreateNew)
    row.appendChild(elementsListColumn)
    row.appendChild(buttonsList)
    additonalEffectsContainer.appendChild(title);
    additonalEffectsContainer.appendChild(row)

    return additonalEffectsContainer;
}

function createCustomListElement(id, additionalEffect, edit_icon = userIntarfaceSettings.icon_edit, close_icon= userIntarfaceSettings.ICON_CLOSEBAR) {

    if(additionalEffect == null) additionalEffect = new AdditionalEffect();

    const listElement = document.createElement('div');
    listElement.classList.add('list-element'); // 30px 
    listElement.classList.add('box-circular-border');
    listElement.classList.add('row');
    listElement.classList.add('vertical');

    let effectImage = userIntarfaceSettings.icon_buffDebuff;
    let name = "No name";

    if(additionalEffect){
        name = additionalEffect.name;
        switch (additionalEffect.additionalEffectType) {
            case additionalEffectTypes.BUFF:
                // Code to run if expression === value1
                effectImage = userIntarfaceSettings.icon_buffDebuff;
                break;
            
            case additionalEffectTypes.AURA:
                // Code to run if expression === value2
                effectImage = userIntarfaceSettings.icon_aura;
                break;
            
            case additionalEffectTypes.CAST:
                // Code to run if expression === value3
                effectImage = userIntarfaceSettings.icon_cast;
                break;
        }
    }

    const labeledElement = document.createElement('div');
    labeledElement.classList.add('row');
    labeledElement.classList.add('centered');
    labeledElement.style.gap = '5px';

    const label = document.createElement('label');
    label.style.textAlign = 'center';
    label.style.fontSize = '14px';
    label.style.paddingLeft = '5px';
    label.textContent = name;

    const effect = document.createElement('img');
    effect.classList.add('icon');
    effect.style.width = '23px';
    effect.style.height = '23px';
    effect.style.marginRight = '10px';
    effect.src = userIntarfaceSettings.FOLDER_MENUICONS + '/' + effectImage;

    const removeButton = createImageButton('26', null, userIntarfaceSettings.FOLDER_MENUICONS + '/' + close_icon, 3);
    removeButton.onclick = () => {
        listElement.remove()
    }


    const editButton = createImageButton('26', null, userIntarfaceSettings.FOLDER_MENUICONS + '/' + edit_icon, 3);
    editButton.onclick = () => {
        additionalEffectBuilder(id, null, listElement);
    }

    labeledElement.appendChild(label)
    labeledElement.appendChild(effect);

    listElement.appendChild(labeledElement);
    addSpacer(listElement);
    listElement.appendChild(editButton);
    listElement.appendChild(removeButton);

    return listElement;
}


function additionalEffectBuilder(id, additionalEffect, parent) {

    if (additionalEffect == null) additionalEffect = new AdditionalEffect();

    const itemId = id + '-additional-effect-builder'
    const additionalEffectBuilderSheet = document.createElement('div');
    additionalEffectBuilderSheet.style.display = 'flex';
    additionalEffectBuilderSheet.classList.add('spell-create-sheet');
    additionalEffectBuilderSheet.classList.add('box-circular-border');
    additionalEffectBuilderSheet.classList.add('column');
    additionalEffectBuilderSheet.classList.add('vertical');
    additionalEffectBuilderSheet.id = itemId;
    additionalEffectBuilderSheet.style.maxWidth = '420px';
    additionalEffectBuilderSheet.style.maxHeight = '650px';
    additionalEffectBuilderSheet.style.gap = '10px';
    additionalEffectBuilderSheet.style.width = '95%';
    additionalEffectBuilderSheet.style.height = '95%';


    const closeButton = createImageButton(30, null, userIntarfaceSettings.FOLDER_MENUICONS + '/' + userIntarfaceSettings.ICON_CLOSEBAR);
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.onclick = () => {
        additionalEffectBuilderSheet.remove();
    }

    const title = document.createElement('h2');
    title.textContent = 'Create Additional Effect';
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

    const additionalEffectName = createStringInput('Name: ', itemId +'-aditional-effect-name');
    additionalEffectName.classList.add('box-circular-border');

    const triggerActions = createSelectorInput('Additional Effect Type:',  Object.values(characterActions), Object.keys(characterActions), 'select', itemId +'-aditional-effect-craracter-actions',null, true);
    triggerActions.classList.add('box-circular-border');
    triggerActions.style.minHeight = '100px';
    triggerActions.style.height = '100px';

    const descriptionForm = createStringInput('Description: ', itemId +'-aditional-effect-description');
    descriptionForm.classList.add('box-circular-border');
    descriptionForm.style.minHeight = '100px';
    descriptionForm.style.height = '100px';

    const durationForm = createSelectorInput('Duration:',  Object.values(durationTypes), Object.keys(durationTypes), 'select', itemId +'-aditional-effect-duration',null, false);
    durationForm.classList.add('box-circular-border');
    durationForm.style.minHeight = '40px';
    durationForm.style.height = '40px';

    const effectSourceTypeForm = createSelectorInput('EffectSource:',  Object.values(effectSourceTypes), Object.keys(effectSourceTypes), null, itemId +'-aditional-effect-source',null, false);
    effectSourceTypeForm.classList.add('box-circular-border');
    effectSourceTypeForm.style.minHeight = '40px';
    effectSourceTypeForm.style.height = '40px';

    const tabbedEffectCreator = createTabbedContainer(1, null, itemId +'-aditional-effect-effect-create-tab', true, 'Effect');
    tabbedEffectCreator.classList.add('box-circular-border');
    tabbedEffectCreator.style.width = '98%';
    tabbedEffectCreator.style.backgroundColor = formColor;
    tabbedEffectCreator.style.flexGrow = '1';

    function effectCreateTabCreator(parent){
        const columntElement = document.createElement("div");
        columntElement.classList.add('column');
        columntElement.classList.add('vertical');
        columntElement.style.width = '95%';
        columntElement.style.height = '95%';
        columntElement.style.gap = '10px';
        columntElement.style.padding = '5px';
        
        const typeBuilder = document.createElement('div');
        typeBuilder.classList.add('form-group');
        typeBuilder.classList.add('column');
        typeBuilder.classList.add('vertical');
        typeBuilder.style.display = 'flex';
        typeBuilder.style.flexGrow = '1';
        typeBuilder.style.gap = '10px';
        typeBuilder.style.width = '100%';
        typeBuilder.style.height = '100%';

        const additionalEffectTypeSelector = createSelectorInput('Additional Effect Type:',  Object.values(additionalEffectTypes), Object.keys(additionalEffectTypes), 'select', itemId +'-aditional-effect-type',null, false);
        additionalEffectTypeSelector.classList.add('box-circular-border');
        additionalEffectTypeSelector.onchange = function(event){
            typeBuilder.innerHTML = '';
            if(event.target.value == additionalEffectTypes.CAST){
                createCastForm(itemId, typeBuilder);
            } else if(event.target.value == additionalEffectTypes.AURA){
                createAuraForm(itemId, typeBuilder);
            } else if(event.target.value == additionalEffectTypes.BUFF){
                createBuffForm(itemId, typeBuilder);
            }
        }

        columntElement.appendChild(additionalEffectTypeSelector)
        columntElement.appendChild(typeBuilder)
        parent.appendChild(columntElement);
    }

    if(true){
        const lastContainer = getContentContainer(tabbedEffectCreator.tabContainer);
        lastContainer.innerHTML = "";
        effectCreateTabCreator(lastContainer)  
    }
    
    tabbedEffectCreator.addTabButton.addEventListener('click', function() {
        const lastContainer = getContentContainer(tabbedEffectCreator.tabContainer);
        lastContainer.innerHTML = "";
        effectCreateTabCreator(lastContainer)  
    });

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = () => {

    };

    additionalEffectBuilderSheet.appendChild(title);
    column.appendChild(additionalEffectName);
    column.appendChild(triggerActions);
    column.appendChild(descriptionForm);
    column.appendChild(durationForm);
    column.appendChild(effectSourceTypeForm);
    column.appendChild(tabbedEffectCreator);
    additionalEffectBuilderSheet.appendChild(column);
    additionalEffectBuilderSheet.appendChild(closeButton);
    userInterface.appendChild(additionalEffectBuilderSheet)

    parent.additionalEffect = additionalEffect;
    return additionalEffectBuilderSheet
}

function createBuffForm(id, parent) {
    const itemId = id + '-buff-form';
    const buffForm = document.createElement('form');
    buffForm.style.display = 'flex';
    buffForm.classList.add('form-group');
    buffForm.classList.add('column');
    buffForm.classList.add('vertical');
    buffForm.style.gap = '10px';


    const effectTypeSelector = createSelectorInput('Effect Type:',  Object.values(effectTypes), Object.keys(effectTypes), 'select',itemId + '-effect-type',null, false);
    effectTypeSelector.onchange = function(event){
        if(event.target.value == effectTypes.ATTACK_DAMAGE_BONUS){
            conjureDamageInput(itemId)
        }else{
            const numberInput = createNumberInput("Value: ")
            buffForm.appendChild(numberInput);
        }
    }

    buffForm.appendChild(effectTypeSelector);
    parent.appendChild(buffForm);
}

function createAuraForm(id, parent) {
    const itemId = id + '-aura-form';
    const AuraForm = document.createElement('form');
    AuraForm.style.display = 'flex';
    AuraForm.classList.add('form-group');
    AuraForm.classList.add('column');
    AuraForm.classList.add('vertical');
    AuraForm.style.gap = '10px';
    AuraForm.style.width = '98%';
    AuraForm.style.height = '98%';

    const effectType = createSelectorInput('Effect Type:',  Object.values(targetTypes), Object.keys(targetTypes), null, itemId + '-effect-type',null, false);

    AuraForm.appendChild(effectType);
    
    parent.appendChild(AuraForm);
}

function createCastForm(id, parent) {
    const itemId = id + '-cast-form';
    const CastForm = document.createElement('form');

    CastForm.style.display = 'flex';
    CastForm.classList.add('form-group');
    CastForm.classList.add('column');
    CastForm.classList.add('vertical');
    CastForm.style.gap = '10px';
    CastForm.style.width = '98%';
    CastForm.style.height = '98%';

    const spellSelectElements = createSpellSelectContainer(itemId);
    const spellSelectContainer = spellSelectElements;
    const spellSelect = spellSelectElements[1];
    const spellLevelSelector = spellSelectElements[2];

    const container = document.createElement('div');
    container.classList.add('form-group');
    container.classList.add('box-circular-border');
    container.classList.add('row');
    container.style.gap = '10px';
    container.style.width = '95%';
    
    const manaInput = createNumberInput('Mana:', itemId+'-mana-input');

    const spellDescriptionButton = document.createElement('button');
    spellDescriptionButton.textContent = 'Spell Description';
    spellDescriptionButton.style.marginLeft = '10px';
    
    spellDescriptionButton.onclick = function(event) {
        event.preventDefault();
        displaySpellDescription(null, listSpells[spellLevelSelector.selectedOptions.value][spellSelect.selectedOptions.value], event.x, event.y);
    }

    const targetListOrdered = createSelectorInput('Target List Order: ', Object.values(targetTypes), Object.keys(targetTypes), null, itemId + '-target-list', null, true, false, indexedOptionFunction);
    targetListOrdered.classList.add('box-circular-border');
    targetListOrdered.style.display = 'flex';
    targetListOrdered.style.flexGrow = '1';

    const saveButton = document.createElement('button');
    saveButton.style.width = '100%';
    saveButton.style.marginTop = '10px';
    saveButton.style.marginBottom = '10px';
    saveButton.style.textAlign = 'center';
    saveButton.style.fontWeight = 'bold';
    saveButton.textContent = 'Save';
    saveButton.onclick = (event) => {
        // save the cast
        event.preventDefault();
    };

    CastForm.appendChild(spellSelectContainer);
    container.appendChild(manaInput);
    container.appendChild(spellDescriptionButton);
    CastForm.appendChild(container);
    CastForm.appendChild(targetListOrdered);
    CastForm.appendChild(saveButton);
    
    parent.appendChild(CastForm);
}

function createSpellSelectContainer(id){
    const itemId = id + '-spell-select-container';
    const spellSelectContainer = document.createElement('div');
    spellSelectContainer.classList.add('form-group');
    spellSelectContainer.classList.add('box-circular-border');
    spellSelectContainer.classList.add('row');
    spellSelectContainer.classList.add('vertical');

    let selectedSpellLevelList = 1;
    const spellLevelSelector = createSelectorInput('Spell Level:', gameSettings.includedSpellLevels, gameSettings.includedSpellLevels, 'select', itemId + '-spell-level',null, false);
    
    const spellSelect = createSelectorInput('Spell:', Object.keys(listSpells[selectedSpellLevelList]), Object.keys(listSpells[selectedSpellLevelList]), 'select', itemId + '-spell',null, false);

    spellLevelSelector.inputElement.onchange = function(event){
        selectedSpellLevelList = event.target.value;
        updateSelector(Object.keys(listSpells[selectedSpellLevelList]), Object.keys(listSpells[selectedSpellLevelList]),spellSelect.inputElement, null, 'select');
    }

    spellSelectContainer.appendChild(spellLevelSelector);
    spellSelectContainer.appendChild(spellSelect);

    return spellSelectContainer;
}

function indexedOptionFunction(event) {
    const option = event.target;
    const select = option.parentElement;
    
    if (!select.dataset.index) select.dataset.index = 0;

    const index = parseInt(select.dataset.index);

    // Check if the option is already indexed (if it has a number after a hyphen)
    if (!/\-\s\d+$/.test(option.textContent)) {
        const arr = option.textContent.split('-');
        
        if (arr.length > 1) {
            arr[1] = index + 1;
        } else {
            arr.push(index + 1);
        }

        option.textContent = arr.join('- ');
        select.dataset.index = index + 1;

        // Apply gradient background based on index
        const transparency = 0.6;
        const red = 255;
        const green = 160 + (index * 15);  // Gradually increasing toward skin tone
        const blue = 122 + (index * 10);   // Gradually increasing toward skin tone
        option.style.backgroundColor = `rgba(${red}, ${green}, ${blue}, ${transparency})`;
    }
}

function getSelectedIndexedOptions() {
    const select = document.getElementById('mySelect');
    const selectedOptions = select.selectedOptions;
    const indexedOptions = [];

    for (let i = 0; i < selectedOptions.length; i++) {
        indexedOptions.push(selectedOptions[i].value);
    }

    return indexedOptions;
}
