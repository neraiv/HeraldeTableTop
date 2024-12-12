const formColor = 'rgb(240, 222, 118)'
const creatorSheetColor = 'rgb(118, 240, 173)'

function addSpellCreator(initalSpell = null){

    if(document.getElementById('spell-create-sheet')) return;

    //initalSpell = listSpells[1].Heralde;

    const spellCreateSheet = document.createElement('div');
    spellCreateSheet.classList.add('spell-create-sheet');
    spellCreateSheet.classList.add('box-circular-border');
    spellCreateSheet.classList.add('column');
    spellCreateSheet.classList.add('vertical');
    spellCreateSheet.id ='spell-create-sheet';
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

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Spell';
    saveButton.classList.add('btn');

    let tabNames;
    let tabCount;
    let targetEffectsContainer_later;
    let spendManaEffectsContainer_later;

    if(initalSpell == null){
        initalSpell = new Spell()
        let selectedSpellType = false;
        let selectedSpellLevel = false;
        const rowSpellSelect = document.createElement('div');
        rowSpellSelect.classList.add('row');
        rowSpellSelect.classList.add('vertical');
        rowSpellSelect.classList.add('box-circular-border');
        rowSpellSelect.style.backgroundColor = formColor;
        rowSpellSelect.style.paddingLeft = '15px';
        rowSpellSelect.style.width = '95%';
        rowSpellSelect.style.gap = '10px';

        const selectSpellType = createSelectorInput('Spell Type: ', Object.values(spellTypes), Object.keys(spellTypes), 'select', 'spell-create-spell-type', null, null);
        const spellLevel = createSelectorInput('Spell Level: ', Object.values(gameSettings.includedSpellLevels), Object.keys(gameSettings.includedSpellLevels), 'select', 'spell-create-spell-type', null, null);
        rowSpellSelect.appendChild(selectSpellType);
        
        selectSpellType.querySelector('.input-element').onchange = () => {
            initalSpell.spellType = selectSpellType.querySelector('.input-element').selectedOptions[0].value;
            selectedSpellType = true;
            if(initalSpell.spellType == spellTypes.CANTRIP){
                initalSpell.spellLvl = 0;
                addOtherElements();
                spellLevel.style.display = 'none';
            }else{
                spellLevel.style.display = 'flex';
                if(selectedSpellType && selectedSpellLevel){
                    addOtherElements();
                }
            }
        }
         rowSpellSelect.appendChild(spellLevel);
        spellLevel.querySelector('.input-element').onchange = () => {
            initalSpell.spellLevel = spellLevel.querySelector('.input-element').selectedOptions[0].value;
            selectedSpellLevel = true;
            if(selectedSpellType && selectedSpellLevel){
                addOtherElements();
            }
        }
        outerColumn.appendChild(rowSpellSelect);
    }else{
        title.textContent = `Editing ${getKeyFromMapWithValue(spellTypes, initalSpell.spellType)} "${initalSpell.name}"`
        addOtherElements();
    }

    outerColumn.appendChild(form);

    function addOtherElements(){
        form.innerHTML = '';

        // Assuming initialSpell and gameSettings are already defined
        if (initalSpell.type == spellTypes.CANTRIP) {
            tabNames = ['0'];
        } else if (initalSpell.type == spellTypes.SPELL) {
            tabNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        } else if (initalSpell.type == spellTypes.WEAPON) {
            tabNames = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        }

        // Filter tabNames based on gameSettings.includedSpellLevels
        tabNames = tabNames.filter(tab => gameSettings.includedSpellLevels.includes(tab));

        // Filter out any tabNames lower than initialSpell.spellLvl
        tabNames = tabNames.filter(tab => parseInt(tab) >= parseInt(initalSpell.spellLevel));

        // Update tabCount based on the filtered tabNames
        tabCount = tabNames.length;

        const nameForm = createStringInput('Name: ', 'create-spell-name');
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
        
        // Future damage tipine göre girdi ekle
        const baseDamageType = createSelectorInput('Base Damage Type: ', Object.values(damageTypes), Object.keys(damageTypes), {
            id:  'spell-create-base-damage-type',
            multiple: false,
        });
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
        formTargetEffectsTitle.textContent = 'Target Effects';
        formTargetEffectsTitle.style.fontWeight = 'bold';
        
        const targetEffectsContainer = createTabbedContainer(tabCount, tabNames);
        targetEffectsContainer_later = targetEffectsContainer;
        targetEffectsContainer.style.width = '100%';
        targetEffectsContainer.style.backgroundColor = formColor;
        

        for(let i = 0; i < tabNames.length; i++){
            const index = parseInt(tabNames[i])
            const tabContent = getContentContainer(targetEffectsContainer.querySelector('.tab-container'), tabNames[i])
            tabContent.innerHTML = '';
            const buttonNames = ['Add Previously Created Effect', 'Add New Effect']
            const formTargetEffects = createCustomListContainer(tabContent.id + '-additional-effect-target-effect-list-container',`Spell Mana Effect for Mana: ${i+1}`, buttonNames);
            if(initalSpell.spendManaEffects[index] && initalSpell.spendManaEffects[index].target){
                for(let additionalEffect of initalSpell.spendManaEffects[index].target){
                    const listElement = createAdditionalEffectListElement(formTargetEffects.id, additionalEffect)
                    formTargetEffects.elementsList.appendChild(listElement);
                }
            }
            formTargetEffects.buttons[buttonNames[1]].onclick = () =>{
                const listElement = createAdditionalEffectListElement(formTargetEffects.id, null)
                formTargetEffects.elementsList.appendChild(listElement);
            }
            formTargetEffects.style.height = '150px';
            tabContent.appendChild(formTargetEffects);
        }
        formTargetEffects.appendChild(formTargetEffectsTitle);
        formTargetEffects.appendChild(targetEffectsContainer);
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
        
        const spendManaEffectsContainer = createTabbedContainer(tabCount, tabNames);
        spendManaEffectsContainer_later = spendManaEffectsContainer;
        spendManaEffectsContainer.style.width = '100%';
        spendManaEffectsContainer.style.backgroundColor = formColor;
    
        for(let i = 0; i < spendManaEffectsContainer.length; i++){
            const index = parseInt(tabNames[i])
            const tabContent = getContentContainer(spendManaEffectsContainer.querySelector('.tab-container'), tabNames[i])
            tabContent.innerHTML = '';
            const buttonNames = ['Add Previously Created Effect', 'Add New Effect']
            const formTargetEffects = createCustomListContainer(tabContent.id + '-additional-effect-spend-mana-list-container',`Spell Mana Effect for Mana: ${i+1}`, buttonNames);
            if(initalSpell.spendManaEffects[index] && initalSpell.spendManaEffects[index].caster){
                for(let additionalEffect of initalSpell.spendManaEffects[index].caster){
                    const listElement = createAdditionalEffectListElement(formTargetEffects.id, additionalEffect)
                    formTargetEffects.elementsList.appendChild(listElement);
                }
            }
            formTargetEffects.buttons[buttonNames[1]].onclick = () =>{
                const listElement = createAdditionalEffectListElement(formTargetEffects.id, null)
                formTargetEffects.elementsList.appendChild(listElement);
            }
            formTargetEffects.style.height = '150px';
            tabContent.appendChild(formTargetEffects);
        }
        spendManaEffects.appendChild(spendManaEffectsTitle);
        spendManaEffects.appendChild(spendManaEffectsContainer);
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
    
        const patternSelect = createSelectorInput('Pattern Type: ', Object.values(spellPatterns), Object.keys(spellPatterns),{
            id: 'spell-create-spell-pattern'});
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
    
        const castTypeSelect = createSelectorInput('Pattern Type: ', Object.values(castTypes), Object.keys(castTypes), {id: 'spell-create-cast-type'});
        castTypeSelect.classList.add('box-circular-border');
        castTypeSelect.style.height = '30px';
        patternWindow.appendChild(castTypeSelect);
        form.appendChild(patternWindow);
    
        const durationSelect = createSelectorInput('Cast Duration: ', Object.values(durationTypes), Object.keys(durationTypes),  {id: 'spell-create-duration-type'});
        durationSelect.classList.add('box-circular-border');
        durationSelect.style.backgroundColor = formColor;
        form.appendChild(durationSelect);
    
        const actionTypeSelect = createSelectorInput('Required Action Type: ', Object.values(actionTypes), Object.keys(actionTypes), {id: 'spell-create-action-type'});
        actionTypeSelect.classList.add('box-circular-border');
        actionTypeSelect.style.backgroundColor = formColor;
        form.appendChild(actionTypeSelect);
    
        const casterRollTypesSelect = createSelectorInput('Caster Rolls With: ', Object.values(rollTypes), Object.keys(rollTypes), {id:'spell-create-caster-rolls'});
        casterRollTypesSelect.classList.add('box-circular-border');
        casterRollTypesSelect.style.backgroundColor = formColor;
        form.appendChild(casterRollTypesSelect);
    
        const targetRollTypesSelect = createSelectorInput('Target(s) Rolls With: ', Object.values(rollTypes), Object.keys(rollTypes), {id: 'spell-create-taget-rolls'});
        targetRollTypesSelect.classList.add('box-circular-border');
        targetRollTypesSelect.style.backgroundColor = formColor;
        form.appendChild(targetRollTypesSelect);
    
        const canTarget = createSelectorInput('Can Target: ', Object.values(targetTypes), Object.keys(targetTypes), {id: 'spell-create-taget-list'});
        canTarget.classList.add('box-circular-border');
        canTarget.style.backgroundColor = formColor;
        form.appendChild(canTarget);
    
        saveButton.addEventListener('click', () => {
            
            const newSpell = new Spell();
            // Collect basic spell info
            newSpell.name = nameForm.querySelector('.input-element').value;
            newSpell.classes = getSelectedOptionsWithCheckmark(formClasses.querySelector('.input-element'));
            newSpell.modifierStat = getSelectedOptionsWithCheckmark(formModifierStat.querySelector('.input-element'));
            newSpell.baseDamageType = baseDamageType.querySelector('.input-element').value;
            newSpell.description = formDescription.querySelector('.input-element').value;
    
            // Loop over each tab and retrieve the additional effects
            for (let i = 0; i <= targetEffectsContainer.length; i++) {
                const tabContent = getContentContainer(targetEffectsContainer.querySelector('.tab-container'), tabNames[i]);
                const effects = [];
    
                // Find all list elements within this tab
                const listElements = tabContent.querySelectorAll('.list-element');
    
                listElements.forEach(listElement => {
                    if (listElement.additionalEffect) {
                        effects.push(listElement.additionalEffect);  // Retrieve and store the additionalEffect from each list element
                    }
                });
                if(effects.length > 0) {
                    // Add these effects to the spell's target effects
                    newSpell.targetEffects[i] = effects;
                }

            }
    
            // Similarly, collect mana spend effects from each tab  
            for (let i = 0; i < spendManaEffects.length; i++) {
                const tabContent = getContentContainer(spendManaEffects.tabContainer, tabNames[i]);
                const effects = [];
    
                const listElements = tabContent.querySelectorAll('.list-element'); 
    
                listElements.forEach(listElement => {
                    if (listElement.additionalEffect) {
                        effects.push(listElement.additionalEffect);
                    }
                });

                if(effects.length > 0) {
                    newSpell.spendManaEffects[i].caster = effects;
                }

            }
    
            // Collect other spell attributes (like range, pattern, etc.)
            newSpell.range = spellRange.querySelector('.input-element').value;
            newSpell.area = spellArea.querySelector('.input-element').value;
            newSpell.pattern = patternSelect.querySelector('.input-element').value;
            newSpell.castType = castTypeSelect.querySelector('.input-element').value;
    
            // Log the final spell object for testing
            console.log(newSpell);


            // Optionally, save the spell or send it to the server, etc.
        });
    
    }

    const closeButton = createImageButton(30, {source: uiSettings.folderMenuIcons+'/'+uiSettings.icon_closeBar});
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.addEventListener('click', () => {
        userInterface.removeChild(spellCreateSheet);
    });

    
    spellCreateSheet.appendChild(title);
    spellCreateSheet.appendChild(outerColumn);
    spellCreateSheet.appendChild(saveButton);
    spellCreateSheet.appendChild(closeButton);


    userInterface.appendChild(spellCreateSheet);
    return spellCreateSheet;
}

function createCustomListContainer(id, titleStr = null, buttonNames = []){
 
    const customListContainer = document.createElement('div');
    customListContainer.classList.add('form-group');
    customListContainer.classList.add('column');
    customListContainer.classList.add('vertical');
    customListContainer.id = id;

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

    
    customListContainer.buttons = {};
    customListContainer.elementsList = elementsListColumn;
    for(let buttonName of buttonNames) {
        const button = document.createElement('button')
        button.textContent = buttonName;
        button.style.textAlign = 'center';
        button.style.display = 'flex';
        customListContainer.buttons[buttonName] = button;
        buttonsList.appendChild(button)
    }

    row.appendChild(elementsListColumn)
    row.appendChild(buttonsList)
    customListContainer.appendChild(title);
    customListContainer.appendChild(row)

    return customListContainer;
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


function additionalEffectBuilder(id, additionalEffect, listParent) {

    const itemId = id + '-additional-effect-builder'
    
    const additionalEffectBuildContainer = document.createElement('div');
    additionalEffectBuildContainer.style.position = 'absolute';
    additionalEffectBuildContainer.style.display = 'flex';
    additionalEffectBuildContainer.style.width = '100%';
    additionalEffectBuildContainer.style.height = '100%';

    const additionalEffectBuilderSheet = document.createElement('div');
    additionalEffectBuilderSheet.style.display = 'flex';
    additionalEffectBuilderSheet.classList.add('spell-create-sheet');
    additionalEffectBuilderSheet.classList.add('box-circular-border');
    additionalEffectBuilderSheet.classList.add('column');
    additionalEffectBuilderSheet.classList.add('vertical');
    additionalEffectBuilderSheet.style.overflowX = 'hidden';
    additionalEffectBuilderSheet.id = itemId;
    additionalEffectBuilderSheet.style.maxWidth = '420px';
    additionalEffectBuilderSheet.style.maxHeight = '650px';
    additionalEffectBuilderSheet.style.gap = '10px';
    additionalEffectBuilderSheet.style.width = '95%';
    additionalEffectBuilderSheet.style.height = '95%';
    

    const closeButton = createImageButton(30, {source: uiSettings.folderMenuIcons + '/' + uiSettings.icon_closeBar});
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

    const additionalEffectName = createStringInput('Name: ', itemId +'-aditional-effect-name', additionalEffect.name);
    additionalEffectName.classList.add('box-circular-border');

    const triggerActions = createSelectorInput('Triggered With Action:',  Object.values(characterActions), Object.keys(characterActions),{
        nonSelectableDefault: 'select', 
        id: itemId +'-aditional-effect-craracter-actions', 
        multiple: true, 
        defaultValue: additionalEffect.characterAction});
    triggerActions.classList.add('box-circular-border');
    triggerActions.style.minHeight = '100px';
    triggerActions.style.height = '100px';

    const descriptionForm = createStringInput('Description: ', itemId +'-aditional-effect-description', additionalEffect.description);
    descriptionForm.classList.add('box-circular-border');
    descriptionForm.style.minHeight = '100px';
    descriptionForm.style.height = '100px';

    const durationForm = createSelectorInput('Duration:',  Object.values(durationTypes), Object.keys(durationTypes),{
        nonSelectableDefault: 'select', 
        id:  itemId +'-aditional-effect-duration', 
        defaultValue: [additionalEffect.duration]});
    durationForm.classList.add('box-circular-border');
    durationForm.style.minHeight = '40px';
    durationForm.style.height = '40px';


    const tabbedEffectCreator = createTabbedContainer(0, null, itemId +'-aditional-effect-effect-create-tab', true, 'Effect');
    tabbedEffectCreator.classList.add('box-circular-border');
    tabbedEffectCreator.style.width = '98%';
    tabbedEffectCreator.style.backgroundColor = formColor;
    tabbedEffectCreator.style.flexGrow = '1';

    const tabContainerEffectCreator =  tabbedEffectCreator.querySelector(".tab-container");
    const contentContainerEffectCreator = tabbedEffectCreator.querySelector(".tab-content-container");


    function effectCreateTabCreator(parent, effect = null){
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
            defaultValue: effect? [effect.type+1] : null});
        additionalEffectTypeSelector.classList.add('box-circular-border');

        function conjureEffectCreator(effectType){
            if(effectType == additionalEffectTypes.CAST){
                createCastForm(effect, itemId, typeBuilder);
            } else if(effectType == additionalEffectTypes.AURA){
                createAuraForm(effect, itemId, typeBuilder);
            } else if(effectType == additionalEffectTypes.BUFF){
                createBuffForm(effect, itemId, typeBuilder);
            }
        }

        additionalEffectTypeSelector.onchange = function(event){
            typeBuilder.innerHTML = '';
            conjureEffectCreator(event.target.value)
        }

        columntElement.appendChild(additionalEffectTypeSelector)
        columntElement.appendChild(typeBuilder)
        parent.appendChild(columntElement);
    }

    tabbedEffectCreator.addTabButton.textContent = "Add Effect";
    tabbedEffectCreator.addTabButton.addEventListener('click', function() {
        const lastContainer = getContentContainer(tabContainerEffectCreator);
        lastContainer.innerHTML = "";
        effectCreateTabCreator(lastContainer)  
    });

    if(additionalEffect.effects.length > 0){
        for(let effect of additionalEffect.effects){
            addNewTab(tabContainerEffectCreator, tabContainerEffectCreator, null, 'Effect')
            const lastContainer = getContentContainer(contentContainerEffectCreator);
            lastContainer.innerHTML = "";
            effectCreateTabCreator(lastContainer, effect)  
        }
    }

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = () => {
        listParent.additionalEffect.name = additionalEffectName.querySelector('.input-element').value;
        listParent.additionalEffect.characterAction = getSelectedOptionsWithCheckmark(triggerActions.querySelector('.input-element'));
        listParent.additionalEffect.description = descriptionForm.querySelector('.input-element').value;    
        listParent.additionalEffect.duration = durationForm.querySelector('.input-element').value;
        for (let i = 1; i <= tabbedEffectCreator.length; i++) {
            const tabContent = getContentContainer(tabContainerEffectCreator, i);

            const typeBuilder = tabContent.querySelector('.type-builder'); 

            console.log(typeBuilder.effect)
            if(typeBuilder.effect.type == additionalEffectTypes.CAST){
                listParent.additionalEffect.effects.push(new Cast(typeBuilder.effect.spellName, typeBuilder.effect.spellLevel, 
                                                            typeBuilder.effect.mana, typeBuilder.effect.targetList))
            }else if(typeBuilder.effect.type == additionalEffectTypes.AURA){

            }else if(typeBuilder.effect.type == additionalEffectTypes.BUFF){

            }
        }
        const listElement = createAdditionalEffectListElement(id, listParent.additionalEffect);
        listParent.parentElement.appendChild(listElement);
        listParent.remove();
    };

    addDraggableRow(additionalEffectBuilderSheet);
    additionalEffectBuilderSheet.appendChild(title);
    column.appendChild(additionalEffectName);
    column.appendChild(triggerActions);
    column.appendChild(descriptionForm);
    column.appendChild(durationForm);
    column.appendChild(tabbedEffectCreator);
    additionalEffectBuilderSheet.appendChild(column);
    additionalEffectBuilderSheet.appendChild(closeButton);
    additionalEffectBuilderSheet.appendChild(saveButton);
    additionalEffectBuildContainer.appendChild(additionalEffectBuilderSheet)

    userInterface.appendChild(additionalEffectBuilderSheet)
}

function createBuffForm(effect=null, id, parent) {
    const itemId = id + '-buff-form';
    const buffForm = document.createElement('form');
    buffForm.style.display = 'flex';
    buffForm.classList.add('form-group');
    buffForm.classList.add('column');
    buffForm.classList.add('vertical');
    buffForm.style.gap = '10px';


    const effectTypeSelector = createSelectorInput('Effect Type:',  Object.values(effectTypes), Object.keys(effectTypes), {nonSelectableDefault: 'select', 
        nonSelectableDefault: 'select',
        id: itemId +'-effect-type'}); 
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

function createAuraForm(effect=null, id, parent) {
    const itemId = id + '-aura-form';
    const AuraForm = document.createElement('form');
    AuraForm.style.display = 'flex';
    AuraForm.classList.add('form-group');
    AuraForm.classList.add('column');
    AuraForm.classList.add('vertical');
    AuraForm.style.gap = '10px';
    AuraForm.style.width = '98%';
    AuraForm.style.height = '98%';

    const effectType = createSelectorInput('Effect Type:',  Object.values(targetTypes), Object.keys(targetTypes), {
        id: itemId + '-effect-type',}); 

    AuraForm.appendChild(effectType);
    
    parent.appendChild(AuraForm);
}

function createCastForm(effect=null, id, parent) {
    const itemId = id + '-cast-form';
    const CastForm = document.createElement('form');
    parent.appendChild(CastForm);

    CastForm.style.display = 'flex';
    CastForm.classList.add('form-group');
    CastForm.classList.add('column');
    CastForm.classList.add('vertical');
    CastForm.style.gap = '10px';
    CastForm.style.width = '98%';
    CastForm.style.height = '98%';

    const spellSelectContainer = createSpellSelectContainer(itemId, effect ? effect.spellLevel : null, effect ? effect.spellName: null);
    CastForm.appendChild(spellSelectContainer);

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
        custom_func: indexedOptionFunction, 
        defaultValue: effect ? effect.targetListInOrder : null}); 
    targetListOrdered.classList.add('box-circular-border');
    targetListOrdered.style.display = 'flex';


    CastForm.onchange = () => {
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
    CastForm.appendChild(container);
    CastForm.appendChild(targetListOrdered);
}