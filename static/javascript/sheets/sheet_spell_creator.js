const formColor = 'rgb(240, 222, 118)'
const creatorSheetColor = 'rgb(118, 240, 173)'

async function addEditSpell(spellLevel, spellName){
    const initalSpell = await fetchSpellWait(spellLevel, spellName);
    addSpellCreator(initalSpell)
}
function addSpellCreator(initalSpell = null){

    const spellCreateSheet = document.createElement('div');
    spellCreateSheet.classList.add('spell-create-sheet');
    spellCreateSheet.classList.add('box-circular-border');
    spellCreateSheet.classList.add('column');
    spellCreateSheet.classList.add('vertical');
    spellCreateSheet.id ='spell-create-sheet';
    spellCreateSheet.style.backgroundColor = creatorSheetColor

    addDraggableRow(spellCreateSheet);

    const spellCreateSheetCloseButton = createImageButton(30, {source: uiSettings.folderMenuIcons + '/' + uiSettings.icon_closeBar});
    spellCreateSheetCloseButton.style.position = 'absolute';
    spellCreateSheetCloseButton.style.top = '10px';
    spellCreateSheetCloseButton.style.right = '5px';
    spellCreateSheetCloseButton.onclick = () => {
        spellCreateSheet.remove();
    }
    spellCreateSheet.appendChild(spellCreateSheetCloseButton)

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

    const rowSpellSelect = document.createElement('div');
    rowSpellSelect.classList.add('row');
    rowSpellSelect.classList.add('vertical');
    rowSpellSelect.classList.add('form-group')
    rowSpellSelect.classList.add('box-circular-border');
    rowSpellSelect.style.backgroundColor = formColor;
    rowSpellSelect.style.gap = '10px';
    
    const selectSpellType = createSelectorInput('Spell Type: ', Object.values(spellTypes), Object.keys(spellTypes), {
        defaultValue: [initalSpell.type],
        id: 'spell-create-spell-type'
    });
    const spellLevel = createSelectorInput('Spell Level: ', gameSettings.includedSpellLevels, gameSettings.includedSpellLevels, {
        defaultValue: [initalSpell.spellLevel],
        id: 'spell-create-spell-level'
    }); 
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

    const nameForm = createStringInput('Name: ', {id: 'create-spell-name' });
    nameForm.classList.add('box-circular-border');
    nameForm.style.backgroundColor = formColor;
    form.appendChild(nameForm);

    if(initalSpell == null){
        initalSpell = new Spell();
    }else{
        title.textContent = "Editing " + initalSpell.name
        nameForm.querySelector(".input-element").value = initalSpell.name
    }

    // }else{
    //     title.textContent = "Editing " + initalSpell.name
    //     editedSpellTypeInfo(initalSpell.type, initalSpell.spellLevel)
    // }

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

    function createDurationForm(label = "Duration",id){
        const Duration = createSelectorInput(label, Object.values(durationTypes), Object.keys(durationTypes), {
            id:  id,
            defaultValue: [initalSpell.castDuration.type],
        });
        Duration.classList.add('box-circular-border');
        Duration.style.backgroundColor = formColor;
    
        const DurationValue = createNumberInput("Value: ", id+'-value', 50, 1, false, false)
        DurationValue.style.display = "none"
        Duration.querySelector('.input-element').onchange =  (event) => {     
            displayPart(event.target.value)
        }
        function displayPart(value){
            if(value == durationTypes.TURN_BASED){
                DurationValue.style.display = "flex"
            }else{
                DurationValue.style.display = "none"
            }
        }
        displayPart(initalSpell.castDuration.type)
        DurationValue.querySelector('.input-element').value = initalSpell.castDuration.value //defaultValue
        Duration.appendChild(DurationValue);
        return Duration
    }
    
    const spellDuration = createDurationForm("Cast Duration: ",'spell-create-duration');
    form.appendChild(spellDuration);

    const spellActionCost = createSelectorInput('Action Cost: ', Object.values(actionTypes), Object.keys(actionTypes),{
        id: 'create-spell-pattern-cast-type',
        defaultValue: initalSpell.actionCost, 
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
        if(initalSpell.spendManaEffects[index] && initalSpell.spendManaEffects[index].caster){
            for(let additionalEffect of initalSpell.spendManaEffects[index].caster){
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
        defaultValue: [initalSpell.spellPattern.pattern], 
    })
    spellPatternSelect.classList.add('box-circular-border');
    spellPatternSelect.style.backgroundColor = formColor;
    spellPatternContainer.appendChild(spellPatternSelect);

    const spellCastArea = createNumberInput("Cast Range:", "create-spell-pattern-cast-area", 9999, 0, false, false, initalSpell.spellPattern.range)
    spellCastArea.classList.add('box-circular-border');
    spellCastArea.style.backgroundColor = formColor;
    spellPatternContainer.appendChild(spellCastArea);

    const spellCastWidth = createNumberInput("Cast Area:", "create-spell-pattern-cast-area", 500, 0, false, false, initalSpell.spellPattern.area)
    spellCastWidth.classList.add('box-circular-border');
    spellCastWidth.style.backgroundColor = formColor;
    spellPatternContainer.appendChild(spellCastWidth);

    const spellCastType = createSelectorInput('Spell Cast Type: ', Object.values(castTypes), Object.keys(castTypes),{
        id: 'create-spell-pattern-cast-type',
        defaultValue: [initalSpell.spellPattern.castType], 
    })
    spellCastType.classList.add('box-circular-border');
    spellCastType.style.backgroundColor = formColor;
    spellPatternContainer.appendChild(spellCastType);

    const spellCanTarget = createSelectorInput('Can Target: ', Object.values(targetTypes), Object.keys(targetTypes),{
        id: 'create-spell-pattern-can-target',
        defaultValue: initalSpell.spellPattern.canTarget, 
        multiple: true,
        custom_func: indexedOptionFunctionWithTransperency
    })
    spellCanTarget.classList.add('box-circular-border');
    spellCanTarget.style.backgroundColor = formColor;
    spellPatternContainer.appendChild(spellCanTarget);
    form.appendChild(spellPatternContainer)

    const spellCasterRolls = createSelectorInput('Caster Rolls: ', Object.values(rollTypes), Object.keys(rollTypes),{
        id: 'create-spell-caster-rolls',
        defaultValue: initalSpell.casterRolls, 
        multiple: true,
    })
    spellCasterRolls.classList.add('box-circular-border');
    spellCasterRolls.style.backgroundColor = formColor;
    form.appendChild(spellCasterRolls)

    const spellTargetRolls = createSelectorInput('Target Rolls: ', Object.values(rollTypes), Object.keys(rollTypes),{
        id: 'create-spell-target-rolls',
        defaultValue: initalSpell.targetRolls, 
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

    function createAdditionalEffectListElement(additionalEffect, edit_icon = uiSettings.icon_edit, close_icon= uiSettings.icon_closeBar) {
        
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
            additionalEffectBuilder('spell-create-additional-effect'+ Date.now(), listElement);
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
        additionalEffectBuilderSheet.style.backgroundColor = creatorSheetColor
    
        const closeButton = createImageButton(30, {source: uiSettings.folderMenuIcons + '/' + uiSettings.icon_closeBar});
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

