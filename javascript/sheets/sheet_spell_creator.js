function addSpellCreator(){
    const spellCreateSheet = document.createElement('div');
    spellCreateSheet.classList.add('spell-create-sheet');
    spellCreateSheet.classList.add('box-circular-border');
    spellCreateSheet.classList.add('column');
    spellCreateSheet.classList.add('vertical');
    spellCreateSheet.id ='spell-create-sheet';
    spellCreateSheet.style.maxWidth = '600px';

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

    let forgingSpell = new Spell();

    const nameForm = createStringInput('Name: ', 'create-spell-name')[0];
    nameForm.classList.add('box-circular-border');
    form.appendChild(nameForm);

    const formClasses = createSelectorInput('Classes', Object.values(classType), Object.keys(classType), null, null,'Avaliable Classes: ', 'create-spell-classes')[0];
    formClasses.classList.add('box-circular-border');
    formClasses.style.height = '150px';
    form.appendChild(formClasses);

    const formModifierStat = createSelectorInput('Modifier Stat: ', Object.values(statType), Object.keys(statType), null, null,'Avaliable Classes: ', 'create-spell-classes')[0];
    formModifierStat.classList.add('box-circular-border');
    formModifierStat.style.height = '100px';
    form.appendChild(formModifierStat);

    const baseDamageType = createSelectorInput('Base Damage Type: ', Object.values(damageType), Object.keys(damageType), null, null,null, false)[0];
    baseDamageType.classList.add('box-circular-border');
    baseDamageType.style.height = '30px';
    form.appendChild(baseDamageType);

    const formDescription = createStringInput('Description: ', 'create-spell-name')[0];
    formDescription.classList.add('box-circular-border');
    formDescription.style.height = '150px';
    form.appendChild(formDescription);

    const formTargetEffects = createAdditonalEffectBuildContainer();
    formTargetEffects.classList.add('box-circular-border');
    formTargetEffects.style.height = '150px';
    form.appendChild(formTargetEffects);

    const formSpendManaEffect = createAdditonalEffectBuildContainer();
    formSpendManaEffect.classList.add('box-circular-border');
    formSpendManaEffect.style.height = '150px';
    form.appendChild(formSpendManaEffect);


    new Spell()

    spellCreateSheet.appendChild(title);
    spellCreateSheet.appendChild(outerColumn);

    userInterface.appendChild(spellCreateSheet);
    return spellCreateSheet;
}

function createAdditonalEffectBuildContainer(){
    const additonalEffectsContainer = document.createElement('div');
    additonalEffectsContainer.classList.add('form-group');
    additonalEffectsContainer.classList.add('column');
    additonalEffectsContainer.classList.add('vertical');

    const title = document.createElement('label');
    title.textContent = 'Create a New';

    const row = document.createElement('div');
    row.classList.add('row');
    row.style.gap = '10px';
    row.style.width = '98%';
    row.style.height = '98%';

    const elementsListColumn = document.createElement('div')
    elementsListColumn.classList.add('column');
    elementsListColumn.classList.add('vertical');
    elementsListColumn.classList.add('box-circular-border');
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
        const element = createCustomListElement(null);
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

function createCustomListElement(additionalEffect, edit_icon = userIntarfaceSettings.icon_edit, close_icon= userIntarfaceSettings.ICON_CLOSEBAR) {
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
                break;
            
            case additionalEffectTypes.CAST:
                // Code to run if expression === value3
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
        additionalEffectBuilder(null);
    }

    labeledElement.appendChild(label)
    labeledElement.appendChild(effect);

    listElement.appendChild(labeledElement);
    addSpacer(listElement);
    listElement.appendChild(editButton);
    listElement.appendChild(removeButton);

    return listElement;
}

function additionalEffectBuilder() {
    const additionalEffectBuilderSheet = document.createElement('div');
    additionalEffectBuilderSheet.style.display = 'flex';
    additionalEffectBuilderSheet.classList.add('spell-create-sheet');
    additionalEffectBuilderSheet.classList.add('box-circular-border');
    additionalEffectBuilderSheet.classList.add('column');
    additionalEffectBuilderSheet.classList.add('vertical');
    additionalEffectBuilderSheet.id ='spell-create-sheet';
    additionalEffectBuilderSheet.style.maxWidth = '400px';
    additionalEffectBuilderSheet.style.maxHeight = '400px';


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

    const typeBuilder = document.createElement('div');
    typeBuilder.classList.add('form-group');
    typeBuilder.classList.add('column');
    typeBuilder.classList.add('vertical');
    typeBuilder.style.display = 'flex';
    typeBuilder.style.gap = '10px';
    typeBuilder.style.width = '95%';
    typeBuilder.style.height = '95%';


    const additionalEffectTypeSelector = createSelectorInput('Additional Effect Type:',  Object.values(additionalEffectTypes), Object.keys(additionalEffectTypes), 'select',null,null, false)[0];
    additionalEffectTypeSelector.onchange = function(event){
        typeBuilder.innerHTML = '';
        if(event.target.value == additionalEffectTypes.CAST){
            createCastForm(typeBuilder);
        } else if(event.target.value == additionalEffectTypes.AURA){
            createAuraForm(typeBuilder);
        } else if(event.target.value == additionalEffectTypes.BUFF){
            createBuffForm(typeBuilder);
        }
    }

    additionalEffectBuilderSheet.appendChild(title);
    additionalEffectBuilderSheet.appendChild(additionalEffectTypeSelector);
    additionalEffectBuilderSheet.appendChild(typeBuilder);
    additionalEffectBuilderSheet.appendChild(closeButton);
    userInterface.appendChild(additionalEffectBuilderSheet)
    return additionalEffectBuilderSheet
}

function createBuffForm(parent) {
    const buffForm = document.createElement('form');
    buffForm.style.display = 'flex';
    buffForm.classList.add('form-group');
    buffForm.classList.add('column');
    buffForm.classList.add('vertical');
    buffForm.style.gap = '10px';


    const effectTypeSelector = createSelectorInput('Effect Type:',  Object.values(effectTypes), Object.keys(effectTypes), 'select',null,null, false)[0];
    effectTypeSelector.onchange = function(event){
        if(event.target.value == effectTypes.ATTACK_DAMAGE_BONUS){
            conjureDamageInput()
        }else{
            const numberInput = createNumberInput("Value: ")[0]
            buffForm.appendChild(numberInput);
        }
    }

    buffForm.appendChild(effectTypeSelector);
    parent.appendChild(buffForm);
}

function createAuraForm(parent) {
    const AuraForm = document.createElement('form');
    AuraForm.style.display = 'flex';
    AuraForm.classList.add('form-group');
    AuraForm.classList.add('column');
    AuraForm.classList.add('vertical');
    AuraForm.style.gap = '10px';
    AuraForm.style.width = '98%';
    AuraForm.style.height = '98%';

    const effectType = createSelectorInput('Effect Type:',  Object.values(targetTypes), Object.keys(targetTypes), null,null,null, false)[0];

    AuraForm.appendChild(effectType);
    
    parent.appendChild(AuraForm);
}

function createCastForm(parent) {
    const CastForm = document.createElement('form');
    CastForm.style.display = 'flex';
    CastForm.classList.add('form-group');
    CastForm.classList.add('column');
    CastForm.classList.add('vertical');
    CastForm.style.gap = '10px';
    CastForm.style.width = '98%';
    CastForm.style.height = '98%';

    const spellSelect = spellSelectContainer();

    const manaInput = createNumberInput('Mana:')[0];
    manaInput.classList.add('box-circular-border');

    const targetListOrdered = createSelectorInput('Target List Order: ', Object.values(targetTypes), Object.keys(targetTypes), null, null, null, true, false, orederedOpitonFunction)[0];
    targetListOrdered.classList.add('box-circular-border');
    targetListOrdered.style.display = 'flex';

    CastForm.appendChild(spellSelect);
    CastForm.appendChild(manaInput);
    CastForm.appendChild(targetListOrdered);
    
    parent.appendChild(CastForm);
}

function spellSelectContainer(){
    const spellSelectContainer = document.createElement('div');
    spellSelectContainer.classList.add('form-group');
    spellSelectContainer.classList.add('box-circular-border');
    spellSelectContainer.classList.add('row');
    spellSelectContainer.classList.add('vertical');

    let selectedSpellLevelList = 1;
    const spellLevelSelector_created = createSelectorInput('Spell Level:', gameSettings.includedSpellLevels, gameSettings.includedSpellLevels, 'select', null,null, false);
    const spellLevelSelectorForm = spellLevelSelector_created[0]
    const spellLevelSelector = spellLevelSelector_created[1]
    
    const spellSelect_ = createSelectorInput('Spell:', Object.keys(listSpells[selectedSpellLevelList]), Object.keys(listSpells[selectedSpellLevelList]), 'select', null,null, false);
    const spellSelectForm = spellSelect_[0]
    const spellSelect =spellSelect_[1]

    spellLevelSelector.onchange = function(event){
        selectedSpellLevelList = event.target.value;
        updateSelector(Object.keys(listSpells[selectedSpellLevelList]), Object.keys(listSpells[selectedSpellLevelList]),spellSelect, null, 'select');
    }

    spellSelectContainer.appendChild(spellLevelSelectorForm);
    spellSelectContainer.appendChild(spellSelectForm);

    return spellSelectContainer;
}

function orederedOpitonFunction(event){
    const option = event.target;
    const select = option.parentElement;
    
    if(!select.dataset.index) // future
    const index = parseInt();
    // Add tick emoji if selected
    
    const arr = option.textContent.split('-')
    if(arr.length > 1){
        arr[1] = index + 1;
    }else{
        arr.push(index + 1);
    }
    select.dataset.index = index + 1;
    option.textContent = arr.join('- ');
}