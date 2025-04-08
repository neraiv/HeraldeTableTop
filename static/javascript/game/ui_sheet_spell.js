function displaySpellCreate(spell = new Spell()) {

    const isInitialSpellGivenFlag = spell.name != ""

    // random 4 digit number
    const id = Math.floor(Math.random() * 9000) + 1000;

    const spellCreateSheet = document.createElement('div');
    spellCreateSheet.classList.add('spell-create-sheet');
    spellCreateSheet.classList.add('box-circular-border');
    spellCreateSheet.classList.add('column');
    spellCreateSheet.classList.add('vertical');
    spellCreateSheet.id = id;
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
        const spell = getSpellChanges();
        if(spell){
            console.log(spell);
        }
    };
    topBar.appendChild(spellSaveButton);

    function getSpellChanges(){
        const spell = new Spell();
        spell.name = formName.inputElement.value;
        spell.availableClasses = selectorGetOptionsWithCheckmark(formClasses.inputElement);
        spell.modifierStats = selectorGetOptionsWithCheckmark(formModifierStat.inputElement);
        spell.baseDamageType = formBaseDamageType.inputElement.selectedOptions[0].value;
        spell.baseDamage = getDamageValue(formBaseDamage.inputElement);
        spell.description = formDescription.inputElement.value;
        spell.castDuration = getDurationValue(formSpellCastDuration.inputElement);
        spell.actionCost = formActionCost.inputElement.selectedOptions[0].value;
        spell.spendManaEffects = {};
        for(let i = 0; i < selectableSpellLevels.length; i++){
            const index = parseInt(selectableSpellLevels[i])
            let target = [];
            let caster = [];

            const targetEffectList = casterEffectsTabbedWindowContainer.querySelector('.additional-effect-list-container');
            const casterEffectList = targetEffectsTabbedWindowContainer.querySelector('.additional-effect-list-container');
            
            for(let targetEffect of targetEffectList.elementsList.children){
                target.push(new Effect(targetEffect.effect))
            }
            for(let casterEffect of casterEffectList.elementsList.children){
                caster.push(new Effect(casterEffect.effect))
            }
            if(target.length > 0 || caster.length > 0){
                spell.spendManaEffects[index] = {target, caster}
            }
        }
        spell.spellPattern = new SpellPattern({
            pattern: spellPatternSelect.inputElement.selectedOptions[0].value,
            range: spellCastArea.inputElement.value,
            area: spellCastWidth.inputElement.value,
            castType: spellCastType.inputElement.selectedOptions[0].value,
            canTarget: getOrderedSelectedOptions(spellCanTarget.inputElement),
        })
        spell.casterRolls = selectorGetOptionsWithCheckmark(spellCasterRolls.inputElement);
        spell.targetRolls = selectorGetOptionsWithCheckmark(spellTargetRolls.inputElement);
        return spell;
    }

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

    let maxSpellLevel = serverRules.spells.max;

    const rowSpellTypeLevel = document.createElement('div');
    rowSpellTypeLevel.classList.add('row');
    rowSpellTypeLevel.classList.add('vertical');
    rowSpellTypeLevel.classList.add('form-group')
    rowSpellTypeLevel.classList.add('box-circular-border');
    rowSpellTypeLevel.style.backgroundColor = formColor;
    rowSpellTypeLevel.style.gap = '10px';
    form.appendChild(rowSpellTypeLevel);

    const selectSpellType = createInputSelector('Spell Type: ', Object.values(spellTypes), Object.keys(spellTypes), {
        id: id + '-type',
        defaultValue: isInitialSpellGivenFlag ? spell.type : null
    });
    selectSpellType.classList.remove("form-group")
    selectSpellType.style.width = '100%';
    rowSpellTypeLevel.appendChild(selectSpellType);

    const serverRulesSpellsRange = [];
    for (let level = serverRules.spells.min; level < serverRules.spells.max; level++){
        serverRulesSpellsRange.push(level);
    }
    const selectSpellLevel = createInputSelector('Spell Level: ', serverRulesSpellsRange, serverRulesSpellsRange, {
        id: id +'-level',
        defaultValue: isInitialSpellGivenFlag ? spell.level : null
    }); 
    selectSpellLevel.classList.remove("form-group")
    selectSpellLevel.style.width = '100%';
    rowSpellTypeLevel.appendChild(selectSpellLevel);

    const spellTypeConfirmation = createImageButton(40, {icon: "check_circle_outline"});
    spellTypeConfirmation.id = "ui-spellbook-close-button";
    spellTypeConfirmation.style.fontFamily = 'Material Icons Outlined';
    spellTypeConfirmation.style.backgroundColor = "green"
    rowSpellTypeLevel.appendChild(spellTypeConfirmation);

    spellTypeConfirmation.onclick = () => {
        userAskQuestion("Careful?", "Are you sure you want to change the spell type and level? This may cause lost of previous changes.",{
            buttons: ['Yes', 'No'],
            callback: (buttonText) => {
                if(buttonText === 'Yes'){
                    updateElements();
                }
            }}
        )

    }

    const formName = createInputString('Name: ', id + '-name', {
        defaultValue: isInitialSpellGivenFlag ? spell.name : null
    });
    formName.classList.add('box-circular-border');
    formName.style.backgroundColor = formColor;
    form.appendChild(formName);

    if(isInitialSpellGivenFlag){
        spellCreateSheetTitle.textContent = "Editing - " + spell.name
        formName.querySelector(".input-element").value = spell.name
    }

    const formClasses = createInputSelector('Usable By Class:', Object.values(classTypes), Object.keys(classTypes), {
        id:  id +'-clasess',
        multiple: true,
        custom_func: selectorChekmarkOptionFunction,
        defaultValue: isInitialSpellGivenFlag ? spell.classess : null
    });

    formClasses.classList.add('box-circular-border');
    formClasses.style.height = '150px';
    formClasses.style.backgroundColor = formColor;
    form.appendChild(formClasses);

    const formModifierStat = createInputModifier("Spell Modifiers", id+"-modifier", Object.values(statTypes), Object.keys(statTypes), {
        defaultValue: isInitialSpellGivenFlag ? spell.modifiers : null
    })
    formModifierStat.style.backgroundColor = formColor;
    form.appendChild(formModifierStat);

    const formDamage = document.createElement("div");
    formDamage.classList.add('column');
    formDamage.classList.add('vertical');
    formDamage.classList.add('form-group');
    formDamage.classList.add("box-circular-border")
    formDamage.style.gap = '1rem';
    formDamage.style.backgroundColor = formColor;
    form.appendChild(formDamage);

    const formBaseDamageType = createInputSelector('Damage Type: ', Object.values(damageTypes), Object.keys(damageTypes), {
        id:  id +'-damage-type',
        multiple: false,
        defaultValue: isInitialSpellGivenFlag ? spell.damage.type : null
    });
    formBaseDamageType.classList.remove('form-group');
    formBaseDamageType.style.width = "100%"
    formDamage.appendChild(formBaseDamageType);

    const formBaseDamage = createInputDamage("Damage: ", id+ '-base-damage', {
        defaultValue: isInitialSpellGivenFlag ? spell.damage : null
    })
    formBaseDamage.classList.remove('form-group');
    formBaseDamage.style.width = "100%"
    formBaseDamage.style.display = "none"
    formDamage.appendChild(formBaseDamage);
    
    formBaseDamageType.inputElement.onchange =  (event) => {
        const value = event.target.value
        if(value != damageElements.NONE){
            formBaseDamage.style.display = "flex"
        }else{
            formBaseDamage.style.display = "none"
        }
    }

    const formDescription = createInputString('Description: ', {
        id: 'create-spell-description',
        isTextArea: true, 
        defaultValue: isInitialSpellGivenFlag ? spell.description : null
    });
    formDescription.classList.add('box-circular-border');
    formDescription.style.height = '150px';
    formDescription.style.backgroundColor = formColor;
    form.appendChild(formDescription);
 
    const formSpellCastDuration = createInputDuration("Cast Duration: ",id +'-duration', {
        defaultValue: isInitialSpellGivenFlag ? spell.castDuration : null
    });
    form.appendChild(formSpellCastDuration);

    const formActionCost = createInputSelector('Action Cost: ', Object.values(actionTypes), Object.keys(actionTypes),{
        id: 'create-spell-pattern-cast-type',
        defaultValue: isInitialSpellGivenFlag ?  spell.actionCost : null, 
        multiple: true
    })
    formActionCost.classList.add('box-circular-border');
    formActionCost.style.backgroundColor = formColor;
    form.appendChild(formActionCost);

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
        const index = selectableSpellLevels[i]
        const tabContent = getContentContainer(targetEffectsTabbedWindowContainer, parseInt(selectableSpellLevels[i]))
        tabContent.innerHTML = '';
        const buttonNames = ['Add Previously Created Effect', 'Add New Effect']
        const formTargetEffects = createeffectListContainer(tabContent.id + '-additional-effect-target-effect-list-container',
            `Spell Mana Effect for Mana: ${selectableSpellLevels[i]}`, buttonNames);
        if(spell && spell.spendManaEffects && spell.spendManaEffects[index] && spell.spendManaEffects[index].target){
            for(let effect of spell.spendManaEffects[index].target){
                const listElement = createeffectListElement(effect)
                formTargetEffects.elementsList.appendChild(listElement);
            }
        }
        formTargetEffects.buttons[buttonNames[1]].onclick = () =>{
            const listElement = createeffectListElement()
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
        const casterEffects = createeffectListContainer(tabContent.id + '-additional-effect-caster-effect-list-container',`Spell Mana Effect for Mana: ${selectableSpellLevels[i]}`, buttonNames);
        if(spell && spell.spendManaEffects &&spell.spendManaEffects[index] && spell.spendManaEffects[index].caster){
            for(let effect of spell.spendManaEffects[index].caster){
                const listElement = createeffectListElement(effect)
                casterEffects.elementsList.appendChild(listElement);
            }
        }
        casterEffects.buttons[buttonNames[1]].onclick = () =>{
            const listElement = createeffectListElement()
            casterEffects.elementsList.appendChild(listElement);
        }
        casterEffects.style.height = '150px';
        tabContent.appendChild(casterEffects);
    }

    const formCastPatternContainer = document.createElement('div');
    formCastPatternContainer.classList.add('column');
    formCastPatternContainer.classList.add('vertical');
    formCastPatternContainer.classList.add('box-circular-border');
    formCastPatternContainer.style.width = '95%';
    formCastPatternContainer.style.padding = '5px';
    formCastPatternContainer.style.gap = '10px';
    formCastPatternContainer.style.backgroundColor = formColor;

    const spellPatternTitle = document.createElement('label');
    spellPatternTitle.textContent = 'Spell Pattern';
    spellPatternTitle.style.fontWeight = 'bold';
    formCastPatternContainer.appendChild(spellPatternTitle);

    const spellPatternSelect = createInputSelector('Spell Pattern: ', Object.values(spellPatterns), Object.keys(spellPatterns),{
        id: 'create-spell-pattern-select',
        defaultValue: spell ? [spell.spellPattern.pattern] : null, 
    })
    spellPatternSelect.classList.add('box-circular-border');
    spellPatternSelect.style.backgroundColor = formColor;
    formCastPatternContainer.appendChild(spellPatternSelect);

    const spellCastArea = createInputNumber("Cast Range:", "create-spell-pattern-cast-area", 9999, 0, false, false, spell ? spell.spellPattern.range : null)
    spellCastArea.classList.add('box-circular-border');
    spellCastArea.style.backgroundColor = formColor;
    formCastPatternContainer.appendChild(spellCastArea);

    const spellCastWidth = createInputNumber("Cast Area:", "create-spell-pattern-cast-area", 500, 0, false, false, spell ? spell.spellPattern.area : null)
    spellCastWidth.classList.add('box-circular-border');
    spellCastWidth.style.backgroundColor = formColor;
    formCastPatternContainer.appendChild(spellCastWidth);

    const spellCastType = createInputSelector('Spell Cast Type: ', Object.values(castTypes), Object.keys(castTypes),{
        id: 'create-spell-pattern-cast-type',
        defaultValue: spell ? [spell.spellPattern.castType] : null, 
    })
    spellCastType.classList.add('box-circular-border');
    spellCastType.style.backgroundColor = formColor;
    formCastPatternContainer.appendChild(spellCastType);

    const spellCanTarget = createInputSelector('Can Target: ', Object.values(targetTypes), Object.keys(targetTypes),{
        id: 'create-spell-pattern-can-target',
        defaultValue: spell ? spell.spellPattern.canTarget : null, 
        multiple: true,
        custom_func: selectorChekmarkOptionFunction
    })
    spellCanTarget.classList.add('box-circular-border');
    spellCanTarget.style.backgroundColor = formColor;
    formCastPatternContainer.appendChild(spellCanTarget);
    form.appendChild(formCastPatternContainer)

    const spellCasterRolls = createInputSelector('Caster Rolls: ', Object.values(rollTypes), Object.keys(rollTypes),{
        id: 'create-spell-caster-rolls',
        defaultValue: spell ? spell.casterRolls : null, 
        multiple: true,
    })
    spellCasterRolls.classList.add('box-circular-border');
    spellCasterRolls.style.backgroundColor = formColor;
    form.appendChild(spellCasterRolls)

    const spellTargetRolls = createInputSelector('Target Rolls: ', Object.values(rollTypes), Object.keys(rollTypes),{
        id: 'create-spell-target-rolls',
        defaultValue: spell ? spell.targetRolls : null, 
        multiple: true,
    })
    spellTargetRolls.classList.add('box-circular-border');
    spellTargetRolls.style.backgroundColor = formColor;
    form.appendChild(spellTargetRolls)
    // --------------------------END ------------------------
    updateElements();
    userInterface.appendChild(spellCreateSheet);

    function updateElements(){ //Future seviye görünümleri değiştirielcek
        const spellType = selectSpellType.inputElement.selectedOptions[0].value;
        const spellLevel = parseInt(selectSpellLevel.inputElement.selectedOptions[0].value);
        
        // Spell Type Related
        if(spellType == spellTypes.CONJURE){
            formCastPatternContainer.style.display = 'none';
            formBaseDamageType.style.display = 'none';
            formBaseDamage.style.display = 'none';
            formModifierStat.style.display = 'none';
        }else{
            formCastPatternContainer.style.display = 'flex';
            formBaseDamageType.style.display = 'flex';
            formBaseDamage.style.display = 'flex';
            formModifierStat.style.display = 'flex';
        }

        // Spell Level Related
        let displayedLevels = []

        for(let i = spellLevel; i < serverRules.spells.max; i++){
            displayedLevels.push(i)
        }

        // // Filter out any selectableSpellLevels lower than initialSpell.spellLvl
        displayedLevels = displayedLevels.filter(level => (parseInt(level) <= parseInt(maxSpellLevel)));

        for (let level = serverRules.spells.min; level < serverRules.spells.max; level++){
            if(displayedLevels.includes(level)){
                changeVisibiltyOfTab(targetEffectsTabbedWindowContainer, level, true)
                changeVisibiltyOfTab(casterEffectsTabbedWindowContainer, level, true)
            }else{
                changeVisibiltyOfTab(targetEffectsTabbedWindowContainer, level, false)
                changeVisibiltyOfTab(casterEffectsTabbedWindowContainer, level, false)
            }
        }
        activateTab(targetEffectsTabbedWindowContainer, displayedLevels[0])
        activateTab(casterEffectsTabbedWindowContainer, displayedLevels[0])
    }
}

function createeffectListContainer(id, titleStr = null, buttonNames = []){
 
    const additionalElementListContainer = document.createElement('div');
    additionalElementListContainer.classList.add('additional-effect-list-container');
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

function createeffectListElement(effect, edit_icon = 'edit.png', close_icon = 'close.png'){ 
    
    // Future additnal effect create bağlanacak
    const listElement = document.createElement('div');
    listElement.classList.add('additiona-effect-container');
    listElement.classList.add('list-element'); // 30px 
    listElement.classList.add('box-circular-border');
    listElement.classList.add('row');
    listElement.classList.add('vertical');

    listElement.effect = effect ? effect : new Effect()

    const labeledElement = document.createElement('div');
    labeledElement.classList.add('row');
    labeledElement.classList.add('centered');
    labeledElement.style.gap = '5px';
    listElement.appendChild(labeledElement);

    addSpacer(listElement);

    const label = document.createElement('label');
    label.style.textAlign = 'center';
    label.style.fontSize = '14px';
    label.style.paddingLeft = '5px';
    label.textContent = "New Additional Effect";
    labeledElement.appendChild(label)

    if(effect){
        label.textContent = effect.name;
        let effectImageList = new Set();
        for(const effect of effect.effects){
            switch (effect.type) {
                case effectTypes.BUFF:
                    // Code to run if expression === value1
                    effectImageList.add("buff_debuff.png")
                    break;
                
                case effectTypes.AURA:
                    // Code to run if expression === value2
                    effectImageList.add("aura.png");
                    break;
                
                case effectTypes.CAST:
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

    const editButton = createImageButton('26', {source: `url(static/images/menu-icons/${edit_icon})`, custom_padding: 3});
    listElement.appendChild(editButton);
    editButton.onclick = () => {
        effectBuilder(Date.now(), listElement);
    }
    

    const removeButton = createImageButton('26', {source: `url(static/images/menu-icons/${close_icon})`, custom_padding: 3});
    listElement.appendChild(removeButton);
    removeButton.onclick = () => {
        listElement.remove()
    }

    return listElement;
}

function effectBuilder(id, initalEffect = null) {

    const itemId = id;

    const effectBuildSheet = document.createElement('div');
    effectBuildSheet.style.display = 'flex';
    effectBuildSheet.classList.add('aditional-effect-create-sheet');
    effectBuildSheet.classList.add('box-circular-border');
    effectBuildSheet.classList.add('column');
    effectBuildSheet.classList.add('vertical');
    effectBuildSheet.style.gap = '10px';
    effectBuildSheet.id = itemId;
    effectBuildSheet.style.backgroundColor = backgroundColor
    userInterface.appendChild(effectBuildSheet);
    
    const topBar = addDraggableRow(effectBuildSheet);
    topBar.classList.add('row');
    topBar.classList.add("vertical");
    topBar.style.justifyContent = "space-between";
    topBar.style.width = "100%"

    const effectBuildTitle = document.createElement('h2');
    effectBuildTitle.textContent = name ? "Editing " + name : 'Create Additional Effect';
    effectBuildTitle.style.textAlign = 'center';
    topBar.appendChild(effectBuildTitle);

    addSpacer(topBar);

    const effectSaveButton = createImageButton('28', {source: 'url(static/images/menu-icons/save.png)', custom_padding: 4});
    effectSaveButton.style.marginRight = '5px';
    effectSaveButton.style.cursor = 'pointer';
    topBar.appendChild(effectSaveButton);

    effectSaveButton.onclick = () => {
        const effect = getEffectChanges();
        if(effect){
            console.log(effect);
        }
    }

    const effectCloseButton = createImageButton('28', {source: 'url(static/images/menu-icons/close.png)', custom_padding: 4});
    effectCloseButton.style.marginRight = '5px';
    effectCloseButton.style.cursor = 'pointer';
    topBar.appendChild(effectCloseButton);
    effectCloseButton.onclick = () => {
        effectBuildSheet.remove();
    }

    const effectBuilderForm = document.createElement('div');
    effectBuilderForm.classList.add('column');
    effectBuilderForm.classList.add('vertical');
    effectBuilderForm.style.width = '100%';
    effectBuilderForm.style.height = '100%';
    effectBuilderForm.style.backgroundColor = formColor;
    effectBuilderForm.style.overflowY = 'scroll';
    effectBuilderForm.style.gap = '5px';
    effectBuildSheet.appendChild(effectBuilderForm);
    
    const formName = createInputString('Name: ', itemId + '-name');
    formName.classList.add('box-circular-border');
    formName.style.backgroundColor = formColor;
    effectBuilderForm.appendChild(formName);

    const formDescription = createInputString('Description: ', itemId + '-description', {isTextArea: true});
    formDescription.classList.add('box-circular-border');
    formDescription.style.height = '150px';
    formDescription.style.backgroundColor = formColor;
    effectBuilderForm.appendChild(formDescription);

    const effectTypeSelections = ["Aura", "Buff or Debuff", "Make Cast"]
    const formType = createInputSelector("Effect Type: ", effectTypeSelections, effectTypeSelections, {
        id: itemId + "-type"
    })
    formType.classList.add('box-circular-border');
    formType.style.backgroundColor = formColor;
    effectBuilderForm.appendChild(formType)

    const effectContainer = document.createElement('div');
    effectContainer.classList.add('column');
    effectContainer.classList.add('vertical');
    effectContainer.classList.add('box-circular-border');
    effectContainer.classList.add('form-group');
    effectContainer.style.backgroundColor = formColor;
    effectBuilderForm.appendChild(effectContainer);

    const effectTitle = document.createElement('label');
    effectTitle.textContent = 'Effect Settings';
    effectTitle.style.fontWeight = 'bold';
    effectContainer.appendChild(effectTitle);

    const effectData = document.createElement('div');
    effectData.classList.add('column');
    effectData.classList.add('vertical');
    effectData.style.width = "100%"
    effectData.style.backgroundColor = formColor;
    effectContainer.appendChild(effectData);

    const formTypeChangeHandler = async (event) => {
        if (effectData.innerHTML !== "") {
            const data = await userAskQuestion(
                "Careful!",
                "Changing the type of the spell may remove already set effects. Create a new one if needed!",
                {
                    buttons: ["Continue", "Abort"],
                    blocking: true
                }
            );
    
            if (data.buttonText === "Abort") {
                // ⛔ Temporarily remove listener
                formType.inputElement.removeEventListener("change", formTypeChangeHandler);
    
                // 🧠 Set old value without triggering handler again
                formType.inputElement.value = previousFormTypeValue;
    
                // ✅ Re-attach listener after a short delay
                setTimeout(() => {
                    formType.inputElement.addEventListener("change", formTypeChangeHandler);
                }, 0);
    
                return;
            }
        }
    
        // Save new value as previous
        previousFormTypeValue = event.target.value;
    
        // Replace content
        effectData.innerHTML = "";
    
        let newContent;
        if (event.target.value === "Buff or Debuff") {
            newContent = createBuffDebuffForm(itemId);
        } else if (event.target.value === "Aura") {
            newContent = createAuraForm(itemId);
        } else if (event.target.value === "Make Cast") {
            newContent = createMakeCastForm(itemId);
        }
    
        if (newContent) {
            effectData.appendChild(newContent);
        }
    };
    
    // 👇 Attach once
    formType.inputElement.addEventListener("change", formTypeChangeHandler);
    
    let previousFormTypeValue = formType.inputElement.value;    

    function getEffectChanges(){
        const contentAddtiionalEffect = new Effect();
        contentAddtiionalEffect.name = formName.inputElement.value;
        contentAddtiionalEffect.description = formDescription.inputElement.value;
        contentAddtiionalEffect.characterAction = getOrderedSelectedOptions(triggerActions.inputElement);
        contentAddtiionalEffect.effects = [];
        for(let i = 0; i < effectsTabWindow.tabList.length; i++){
            const tabContent = getContentContainer(effectsTabWindow, effectsTabWindow.tabList[i]);
            const effectType = tabContent.inputElement.effectType.inputElement.selectedOptions[0].value;
            let effectProperties = {}
            let contenteEffect = null;
            if(effectType == effectTypes.BUFF){
                effectProperties = {
                    type: tabContent.inputElement.effectProperties.inputElement.type.inputElement.selectedOptions[0].value,
                    value: tabContent.inputElement.effectProperties.inputElement.value.inputElement.value,
                    duration: tabContent.inputElement.effectProperties.inputElement.duration.inputElement.value
                }
                contenteEffect = new BuffDebuff(effectProperties)
            }else if(effectType == effectTypes.AURA){
                effectProperties = {
                    area: tabContent.inputElement.effectProperties.inputElement.area.inputElement.value,
                    duration: tabContent.inputElement.effectProperties.inputElement.duration.inputElement.value,
                    auraType: tabContent.inputElement.effectProperties.inputElement.type.inputElement.selectedOptions[0].value,
                    value: tabContent.inputElement.effectProperties.inputElement.value.inputElement.value,
                    target: tabContent.inputElement.effectProperties.inputElement.target.inputElement.selectedOptions[0].value,
                    canSpread: tabContent.inputElement.effectProperties.inputElement.canSpread.inputElement.checked
                }
                contenteEffect = new Aura(effectProperties)
            }else if(effectType == effectTypes.CAST){
                effectProperties = {
                    spell: tabContent.inputElement.effectProperties.inputElement.spell.inputElement.selectedOptions[0].value,
                    targetList: getOrderedSelectedOptions(tabContent.inputElement.effectProperties.inputElement.targetList.inputElement)
                }
                contenteEffect = new Cast(effectProperties)
            }
                  
            contentAddtiionalEffect.effects.push(contenteEffect)
        }
        return contentAddtiionalEffect;
    }
}

function createBuffDebuffForm(parentId, initial = null){
    const form = document.createElement("div")
    form.classList.add('column');
    form.classList.add('vertical');
    form.classList.add('form-group');
    form.style.gap = "1rem"
    form.style.backgroundColor = formColor;

    const effectTypeSelector = createInputSelector('Effect Type:',  Object.values(effectTypes), Object.keys(effectTypes),{
        nonSelectableDefault: 'select',
        id: parentId +'-aditional-effect-buff-type'
    });
    effectTypeSelector.classList.add('box-circular-border');
    form.appendChild(effectTypeSelector);

    const effectValue = createInputDamage("Value :", parentId + "-value", {
        defaultValue: "1d1"
    })
    effectValue.classList.add('box-circular-border');
    form.appendChild(effectValue);

    const effectDuration = createInputDuration("Duration: ", parentId + '-aditional-effect-buff-duration')
    form.appendChild(effectDuration);

    const effectTrigerActions = createInputSelector("Trigger Actions:", Object.values(characterActions), Object.keys(characterActions), {
        multiple: true,
        custom_func: selectorChekmarkOptionFunction
    })
    form.appendChild(effectTrigerActions)

    form.inputElement = {
        type: effectTypeSelector,
        value: effectValue,
        duration: effectDuration,
        triggerActions : effectTrigerActions
    }

    return form
}

function createAuraForm(parentId, initial = null) {
    const form = document.createElement("div")
    form.classList.add('column');
    form.classList.add('vertical');
    form.classList.add('form-group');
    form.style.gap = "1rem"

    const effectArea = createInputNumber("Area: ", parentId + '-aditional-effect-aura-area', 500, 0, false, false, effect ? effect.area : null)
    form.appendChild(effectArea);

    const effectDuration = createInputDuration("Duration: ", parentId + '-aditional-effect-aura-duration')
    form.appendChild(effectDuration);

    const effectTypeSelector = createInputSelector('Effect Type:',  Object.values(effectTypes), Object.keys(effectTypes),{
        nonSelectableDefault: 'select',
        id: parentId +'-aditional-effect-aura-type',
        defaultValue: effect ? [effect.auraType] : null
    });
    effectTypeSelector.classList.add('box-circular-border');
    form.appendChild(effectTypeSelector);

    const effectValue = createInputNumber("Value: ", parentId + '-aditional-effect-aura-value', 50, 1, false, false, effect ? effect.value : null)   
    form.appendChild(effectValue);

    const effectTargetSelector = createInputSelector('Target Type:',  Object.values(targetTypes), Object.keys(targetTypes),{
        nonSelectableDefault: 'select',
        id: parentId +'-aditional-effect-aura-target',
        defaultValue: effect ? [effect.target] : null
    });
    effectTargetSelector.classList.add('box-circular-border');
    form.appendChild(effectTargetSelector);

    const effectCanSpread = createInputBoolean("Can Spread: ", parentId + '-aditional-effect-aura-spread', effect ? effect.canSpread : null)
    form.appendChild(effectCanSpread);

    form.inputElement = {
        area: effectArea,
        duration: effectDuration,
        type: effectTypeSelector,
        value: effectValue,
        target: effectTargetSelector,
        canSpread: effectCanSpread
    }

    return form
}

function createMakeCastForm(parentId, intial = null){
    const form = document.createElement("div")
    form.classList.add('column');
    form.classList.add('vertical');
    form.classList.add('form-group');
    form.style.width = "100%"
    form.style.gap = "1rem"
    form.style.backgroundColor = formColor;

    const effectSpellSelect = createInputSpellSelect(parentId + '-aditional-effect-cast-spell-name', {
        initalLevel: serverRules.spells.min
    })
    effectSpellSelect.classList.add('box-circular-border');
    form.appendChild(effectSpellSelect);
    
    const effectTargetList = createInputSelector('Target List:',  Object.values(targetOrderList), Object.keys(targetOrderList),{
        nonSelectableDefault: 'select',
        id: parentId +'-aditional-effect-cast-target-list',
        multiple: true,
        custom_func : selectorIndexedOptionFunctionWithTransparency
    });
    effectTargetList.classList.add('box-circular-border');
    form.appendChild(effectTargetList);  
    
    form.inputElement = {
        spell: effectSpellSelect,
        targetList: effectTargetList
    }

    return form
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

function displaySpellDescription(spell){
    console.log(spell)
}

createSpellButton.onclick = () => {
    displaySpellCreate()
}