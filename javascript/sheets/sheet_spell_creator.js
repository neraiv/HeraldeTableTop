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
    formTargetEffectsTitle.textContent = 'Target Effects';
    formTargetEffectsTitle.style.fontWeight = 'bold';

    const targetEffectsContainer = createTabbedContainer(selectableSpellLevels.length, selectableSpellLevels);
    targetEffectsContainer.style.width = '100%';
    targetEffectsContainer.style.backgroundColor = formColor;

    formTargetEffects.appendChild(formTargetEffectsTitle);
    formTargetEffects.appendChild(targetEffectsContainer);

    form.appendChild(formTargetEffects);

    for(let i = 0; i < selectableSpellLevels.length; i++){
        const index = parseInt(selectableSpellLevels[i])
        const tabContent = getContentContainer(targetEffectsContainer, selectableSpellLevels[i])
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

    updateElements();

    userInterface.appendChild(spellCreateSheet);
    
    function spellTypeSelectionContainer(){
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
        rowSpellSelect.appendChild(spellLevel);

        selectSpellType.querySelector('.input-element').onchange = () => {
            initalSpell.spellType = selectSpellType.querySelector('.input-element').selectedOptions[0].value;
        }

        spellLevel.querySelector('.input-element').onchange = () => {
            initalSpell.spellLevel = spellLevel.querySelector('.input-element').selectedOptions[0].value;
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
        let hideLevels;
        hideLevels = selectableSpellLevels.filter(tab => !gameSettings.includedSpellLevels.includes(tab));

        // Filter out any selectableSpellLevels lower than initialSpell.spellLvl
        hideLevels = selectableSpellLevels.filter(tab => parseInt(tab) < parseInt(initalSpell.spellLevel));

        selectableSpellLevels.forEach(level => {
            if(level == hideLevels){
                changeVisibiltyOfTab(targetEffectsContainer, level, false)
            }else{
                changeVisibiltyOfTab(targetEffectsContainer, level, true)
            }
        })
    }
}

