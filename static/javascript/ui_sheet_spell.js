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
                target.push(new AdditionalEffect(targetEffect.additionalEffect))
            }
            for(let casterEffect of casterEffectList.elementsList.children){
                caster.push(new AdditionalEffect(casterEffect.additionalEffect))
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

    const rowSpellSelect = document.createElement('div');
    rowSpellSelect.classList.add('row');
    rowSpellSelect.classList.add('vertical');
    rowSpellSelect.classList.add('form-group')
    rowSpellSelect.classList.add('box-circular-border');
    rowSpellSelect.style.backgroundColor = formColor;
    rowSpellSelect.style.gap = '10px';
    form.appendChild(rowSpellSelect);

    const selectSpellType = createInputSelector('Spell Type: ', Object.values(spellTypes), Object.keys(spellTypes), {
        id: id + '-type'
    });
    selectSpellType.style.backgroundColor = "transparent";
    rowSpellSelect.appendChild(selectSpellType);

    const serverRulesSpellsRange = [];
    for (let level = serverRules.spells.min; level < serverRules.spells.max; level++){
        serverRulesSpellsRange.push(level);
    }
    const selectSpellLevel = createInputSelector('Spell Level: ', serverRulesSpellsRange, serverRulesSpellsRange, {
        id: id +'-level'
    }); 

    selectSpellLevel.style.backgroundColor = "transparent";
    rowSpellSelect.appendChild(selectSpellLevel);

    const spellTypeConfirmation = createImageButton(40, {icon: "check_circle_outline"});
    spellTypeConfirmation.id = "ui-spellbook-close-button";
    spellTypeConfirmation.style.fontFamily = 'Material Icons Outlined';
    spellTypeConfirmation.style.backgroundColor = "green"
    rowSpellSelect.appendChild(spellTypeConfirmation);

    spellTypeConfirmation.onclick = () => {
        userAskQuestion("Careful?", "Are you sure you want to change the spell type and level?",{
            buttons: ['Yes', 'No'],
            callback: (buttonText) => {
                if(buttonText === 'Yes'){
                    updateElements();
                }
            }}
        )

    }

    const formName = createInputString('Name: ', id + '-name' );
    formName.classList.add('box-circular-border');
    formName.style.backgroundColor = formColor;
    form.appendChild(formName);

    if(initalSpell == null){
        spellCreateSheet.spell = new Spell();
    }else{
        spellCreateSheet.spell = initalSpell;
        spellCreateSheetTitle.textContent = "Editing - " + spellCreateSheet.spell.name
        formName.querySelector(".input-element").value = spellCreateSheet.spell.name
    }

    const formClasses = createInputSelector('Usable By Class:', Object.values(classTypes), Object.keys(classTypes), {
        id:  id +'-clasess',
        multiple: true,
        custom_func: selectorChekmarkOptionFunction
    });

    formClasses.classList.add('box-circular-border');
    formClasses.style.height = '150px';
    formClasses.style.backgroundColor = formColor;
    form.appendChild(formClasses);

    const formModifierStat = createInputSelector('Modifier Stat: ', Object.values(statTypes), Object.keys(statTypes),{
        id:  id +'-modifier-stats',
        multiple: true,
    });

    formModifierStat.classList.add('box-circular-border');
    formModifierStat.style.height = '100px';
    formModifierStat.style.backgroundColor = formColor;
    form.appendChild(formModifierStat);

    const formBaseDamageType = createInputSelector('Base Damage Type: ', Object.values(damageTypes), Object.keys(damageTypes), {
        id:  id +'-base-damage-type',
        multiple: false,
    });
    formBaseDamageType.classList.add('box-circular-border');
    formBaseDamageType.style.backgroundColor = formColor;
    form.appendChild(formBaseDamageType);

    const formBaseDamage = createInputDamage("Damage: ", id+ '-base-damage')
    formBaseDamage.style.display = "none"
    formBaseDamage.classList.add('box-circular-border');
    formBaseDamage.style.backgroundColor = formColor;
    form.appendChild(formBaseDamage);
    
    formBaseDamageType.inputElement.onchange =  (event) => {
        const value = event.target.value
        if(value != damageTypes.NONE){
            formBaseDamage.style.display = "flex"
        }else{
            formBaseDamage.style.display = "none"
        }
    }

    const formDescription = createInputString('Description: ', {id: 'create-spell-description',isTextArea: true});
    formDescription.classList.add('box-circular-border');
    formDescription.style.height = '150px';
    formDescription.style.backgroundColor = formColor;
    form.appendChild(formDescription);
 
    const formSpellCastDuration = createInputDuration("Cast Duration: ",id +'-duration');
    form.appendChild(formSpellCastDuration);

    const formActionCost = createInputSelector('Action Cost: ', Object.values(actionTypes), Object.keys(actionTypes),{
        id: 'create-spell-pattern-cast-type',
        defaultValue: initalSpell ?  spellCreateSheet.spell.actionCost : null, 
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
        defaultValue: initalSpell ? [initalSpell.spellPattern.pattern] : null, 
    })
    spellPatternSelect.classList.add('box-circular-border');
    spellPatternSelect.style.backgroundColor = formColor;
    formCastPatternContainer.appendChild(spellPatternSelect);

    const spellCastArea = createInputNumber("Cast Range:", "create-spell-pattern-cast-area", 9999, 0, false, false, initalSpell ? initalSpell.spellPattern.range : null)
    spellCastArea.classList.add('box-circular-border');
    spellCastArea.style.backgroundColor = formColor;
    formCastPatternContainer.appendChild(spellCastArea);

    const spellCastWidth = createInputNumber("Cast Area:", "create-spell-pattern-cast-area", 500, 0, false, false, initalSpell ? initalSpell.spellPattern.area : null)
    spellCastWidth.classList.add('box-circular-border');
    spellCastWidth.style.backgroundColor = formColor;
    formCastPatternContainer.appendChild(spellCastWidth);

    const spellCastType = createInputSelector('Spell Cast Type: ', Object.values(castTypes), Object.keys(castTypes),{
        id: 'create-spell-pattern-cast-type',
        defaultValue: initalSpell ? [initalSpell.spellPattern.castType] : null, 
    })
    spellCastType.classList.add('box-circular-border');
    spellCastType.style.backgroundColor = formColor;
    formCastPatternContainer.appendChild(spellCastType);

    const spellCanTarget = createInputSelector('Can Target: ', Object.values(targetTypes), Object.keys(targetTypes),{
        id: 'create-spell-pattern-can-target',
        defaultValue: initalSpell ? initalSpell.spellPattern.canTarget : null, 
        multiple: true,
        custom_func: selectorIndexedOptionFunctionWithTransparency
    })
    spellCanTarget.classList.add('box-circular-border');
    spellCanTarget.style.backgroundColor = formColor;
    formCastPatternContainer.appendChild(spellCanTarget);
    form.appendChild(formCastPatternContainer)

    const spellCasterRolls = createInputSelector('Caster Rolls: ', Object.values(rollTypes), Object.keys(rollTypes),{
        id: 'create-spell-caster-rolls',
        defaultValue: initalSpell ? initalSpell.casterRolls : null, 
        multiple: true,
    })
    spellCasterRolls.classList.add('box-circular-border');
    spellCasterRolls.style.backgroundColor = formColor;
    form.appendChild(spellCasterRolls)

    const spellTargetRolls = createInputSelector('Target Rolls: ', Object.values(rollTypes), Object.keys(rollTypes),{
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
        listElement.appendChild(labeledElement);

        addSpacer(listElement);

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
    
        const editButton = createImageButton('26', {source: `url(static/images/menu-icons/${edit_icon})`, custom_padding: 3});
        listElement.appendChild(editButton);
        editButton.onclick = () => {
            additionalEffectBuilder(Date.now(), listElement);
        }
        

        const removeButton = createImageButton('26', {source: `url(static/images/menu-icons/${close_icon})`, custom_padding: 3});
        listElement.appendChild(removeButton);
        removeButton.onclick = () => {
            listElement.remove()
        }

        return listElement;
    }

    function additionalEffectBuilder(id, listElement) {

        const itemId = id;

        const additionalEffectBuildSheet = document.createElement('div');
        additionalEffectBuildSheet.style.display = 'flex';
        additionalEffectBuildSheet.classList.add('aditional-effect-create-sheet');
        additionalEffectBuildSheet.classList.add('box-circular-border');
        additionalEffectBuildSheet.classList.add('column');
        additionalEffectBuildSheet.classList.add('vertical');
        additionalEffectBuildSheet.style.gap = '10px';
        additionalEffectBuildSheet.id = itemId;
        additionalEffectBuildSheet.style.backgroundColor = backgroundColor
        userInterface.appendChild(additionalEffectBuildSheet);
        
        const topBar = addDraggableRow(additionalEffectBuildSheet);
        topBar.classList.add('row');
        topBar.classList.add("vertical");
        topBar.style.justifyContent = "space-between";
        topBar.style.width = "100%"

        const additionalEffectBuildTitle = document.createElement('h2');
        additionalEffectBuildTitle.textContent = listElement.additionalEffect.name ? "Editing " + listElement.additionalEffect.name : 'Create Additional Effect';
        additionalEffectBuildTitle.style.textAlign = 'center';
        topBar.appendChild(additionalEffectBuildTitle);

        addSpacer(topBar);

        const additionalEffectSaveButton = createImageButton('28', {source: 'url(static/images/menu-icons/save.png)', custom_padding: 4});
        additionalEffectSaveButton.style.marginRight = '5px';
        additionalEffectSaveButton.style.cursor = 'pointer';
        topBar.appendChild(additionalEffectSaveButton);
        additionalEffectSaveButton.onclick = () => {
            const additionalEffect = getEffectChanges();
            if(additionalEffect){
                console.log(additionalEffect);
                listElement.additionalEffect = additionalEffect;
            }
        }

        const additionalEffectCloseButton = createImageButton('28', {source: 'url(static/images/menu-icons/close.png)', custom_padding: 4});
        additionalEffectCloseButton.style.marginRight = '5px';
        additionalEffectCloseButton.style.cursor = 'pointer';
        topBar.appendChild(additionalEffectCloseButton);
        additionalEffectCloseButton.onclick = () => {
            additionalEffectBuildSheet.remove();
        }

        const additionalEffectBuilderForm = document.createElement('div');
        additionalEffectBuilderForm.classList.add('column');
        additionalEffectBuilderForm.classList.add('vertical');
        additionalEffectBuilderForm.style.width = '100%';
        additionalEffectBuilderForm.style.height = '100%';
        additionalEffectBuilderForm.style.backgroundColor = formColor;
        additionalEffectBuilderForm.style.overflowY = 'scroll';
        additionalEffectBuilderForm.style.gap = '5px';
        additionalEffectBuildSheet.appendChild(additionalEffectBuilderForm);
        
        const nameForm = createInputString('Name: ', itemId + '-name');
        nameForm.classList.add('box-circular-border');
        nameForm.style.backgroundColor = formColor;
        additionalEffectBuilderForm.appendChild(nameForm);
        const formDescription = createInputString('Description: ', itemId + '-description', {isTextArea: true});
        formDescription.classList.add('box-circular-border');
        formDescription.style.height = '150px';
        formDescription.style.backgroundColor = formColor;
        additionalEffectBuilderForm.appendChild(formDescription);
        
        const triggerActions = createInputSelector('Triggered With Action:',  Object.values(characterActions), Object.keys(characterActions),{
            nonSelectableDefault: 'select', 
            id: itemId +'-aditional-effect-craracter-actions', 
            multiple: true, 
            defaultValue: listElement.characterAction
        });
        triggerActions.classList.add('box-circular-border');
        triggerActions.style.minHeight = '100px';
        triggerActions.style.height = '100px';
        triggerActions.style.backgroundColor = formColor;
        additionalEffectBuilderForm.appendChild(triggerActions);
        
        const effectsContainer = document.createElement('div');
        effectsContainer.classList.add('column');
        effectsContainer.classList.add('vertical');
        effectsContainer.classList.add('box-circular-border');
        effectsContainer.style.width = '95%';
        effectsContainer.style.padding = '5px';
        effectsContainer.style.gap = '10px';
        effectsContainer.style.backgroundColor = formColor;
        additionalEffectBuilderForm.appendChild(effectsContainer);

        const effectsTitle = document.createElement('label');
        effectsTitle.textContent = 'Effects';
        effectsTitle.style.fontWeight = 'bold';
        effectsContainer.appendChild(effectsTitle);

        const effectsTabWindow = createTabbedContainer(0, [], Date.now(), true, "Effect");
        effectsTabWindow.style.width = '100%';
        effectsTabWindow.style.backgroundColor = formColor;
        effectsContainer.appendChild(effectsTabWindow);
        
        function createEffectContainer(id, effect = null){
            const itemId = id;
            
            const effectContainerSheet = document.createElement('div');
            effectContainerSheet.classList.add('effect-container');
            effectContainerSheet.classList.add('box-circular-border');
            effectContainerSheet.classList.add('column');
            effectContainerSheet.classList.add('vertical');
            effectContainerSheet.style.width = '95%';
            effectContainerSheet.style.padding = '5px';

            const effectTypeSelector = createInputSelector('Additional Effect Type:',  Object.values(additionalEffectTypes), Object.keys(additionalEffectTypes),{
                nonSelectableDefault: 'select', 
                id: itemId +'-aditional-effect-type', 
                defaultValue: effect ? [effect.type] : null
            });
            effectTypeSelector.classList.add('box-circular-border');
            effectTypeSelector.style.backgroundColor = formColor;
            effectContainerSheet.appendChild(effectTypeSelector);
            
            const effectPropertiesContainer = document.createElement('div');
            effectPropertiesContainer.classList.add('column');
            effectPropertiesContainer.classList.add('vertical');
            effectPropertiesContainer.style.width = '100%';
            effectPropertiesContainer.style.height = '100%';
            effectPropertiesContainer.style.gap = '5px';
            effectPropertiesContainer.style.backgroundColor = formColor;
            effectContainerSheet.appendChild(effectPropertiesContainer);

            effectTypeSelector.onchange = function(event){
                effectPropertiesContainer.innerHTML = '';
                const effectContainer = conjureEffectCreator(event.target.value)
                effectPropertiesContainer.appendChild(effectContainer)
            }

            function conjureEffectCreator(type){
                const effectContainer = document.createElement('div');
                effectContainer.classList.add('effect-container');
                effectContainer.classList.add('box-circular-border');
                effectContainer.classList.add('column');
                effectContainer.classList.add('vertical');
                effectContainer.style.width = '95%';
                effectContainer.style.padding = '5px';
                effectContainer.style.backgroundColor = formColor;

                if(type == additionalEffectTypes.BUFF){
                    const effectTypeSelector = createInputSelector('Effect Type:',  Object.values(effectTypes), Object.keys(effectTypes),{
                        nonSelectableDefault: 'select',
                        id: itemId +'-aditional-effect-buff-type',
                        defaultValue: effect ? [effect.effectType] : null
                    });
                    effectTypeSelector.classList.add('box-circular-border');
                    effectTypeSelector.style.backgroundColor = formColor;
                    effectContainer.appendChild(effectTypeSelector);

                    const effectValue = createInputNumber("Value: ", itemId + '-aditional-effect-buff-value', 50, 1, false, false, effect ? effect.value : null)
                    effectContainer.appendChild(effectValue);

                    const effectDuration = createInputDuration("Duration: ", itemId + '-aditional-effect-buff-duration')
                    effectContainer.appendChild(effectDuration);

                    effectContainer.inputElement = {
                        type: effectTypeSelector,
                        value: effectValue,
                        duration: effectDuration
                    }

                }else if(type == additionalEffectTypes.AURA){
                    const effectArea = createInputNumber("Area: ", itemId + '-aditional-effect-aura-area', 500, 0, false, false, effect ? effect.area : null)
                    effectContainer.appendChild(effectArea);

                    const effectDuration = createInputDuration("Duration: ", itemId + '-aditional-effect-aura-duration')
                    effectContainer.appendChild(effectDuration);

                    const effectTypeSelector = createInputSelector('Effect Type:',  Object.values(effectTypes), Object.keys(effectTypes),{
                        nonSelectableDefault: 'select',
                        id: itemId +'-aditional-effect-aura-type',
                        defaultValue: effect ? [effect.auraType] : null
                    });
                    effectTypeSelector.classList.add('box-circular-border');
                    effectTypeSelector.style.backgroundColor = formColor;
                    effectContainer.appendChild(effectTypeSelector);

                    const effectValue = createInputNumber("Value: ", itemId + '-aditional-effect-aura-value', 50, 1, false, false, effect ? effect.value : null)   
                    effectContainer.appendChild(effectValue);

                    const effectTargetSelector = createInputSelector('Target Type:',  Object.values(targetTypes), Object.keys(targetTypes),{
                        nonSelectableDefault: 'select',
                        id: itemId +'-aditional-effect-aura-target',
                        defaultValue: effect ? [effect.target] : null
                    });
                    effectTargetSelector.classList.add('box-circular-border');
                    effectTargetSelector.style.backgroundColor = formColor;
                    effectContainer.appendChild(effectTargetSelector);

                    const effectCanSpread = createInputBoolean("Can Spread: ", itemId + '-aditional-effect-aura-spread', effect ? effect.canSpread : null)
                    effectContainer.appendChild(effectCanSpread);

                    effectContainer.inputElement = {
                        area: effectArea,
                        duration: effectDuration,
                        type: effectTypeSelector,
                        value: effectValue,
                        target: effectTargetSelector,
                        canSpread: effectCanSpread
                    }
                    
                }else if(type == additionalEffectTypes.CAST){
                    const effectSpellSelect = createInputSpellSelect(itemId + '-aditional-effect-cast-spell-name', serverRules.spells.min, null)
                    effectContainer.appendChild(effectSpellSelect);
                    
                    const effectTargetList = createInputSelector('Target List:',  Object.values(targetTypes), Object.keys(targetTypes),{
                        nonSelectableDefault: 'select',
                        id: itemId +'-aditional-effect-cast-target-list',
                        multiple: true,
                        defaultValue: effect ? effect.targetList : null,
                        custom_func : selectorIndexedOptionFunctionWithTransparency
                    });
                    effectTargetList.classList.add('box-circular-border');
                    effectTargetList.style.backgroundColor = formColor;
                    effectContainer.appendChild(effectTargetList);  
                    
                    effectContainer.inputElement = {
                        spell: effectSpellSelect,
                        targetList: effectTargetList
                    }
                }

                return effectContainer
            }

            effectContainerSheet.inputElement = {
                effectType: effectTypeSelector,
                effectProperties: effectPropertiesContainer
            }

            return effectContainerSheet
        }


        listElement.additionalEffect.effects.forEach((effect, index) => {
            const contentContainer = createEffectContainer(Date.now(), effect)
            const newTabContent =  addNewTab(effectsTabWindow, `Effect ${index + 1}`)
            contentContainer.innerHTML = ""
            contentContainer.appendChild(newTabContent)
        });
        
        effectsTabWindow.addEventListener('onNewTabAdded', (e) => {
            const contentContainer = getContentContainer(effectsTabWindow, e.detail.tabId);
            const effectContainer = createEffectContainer(Date.now(), null);
            contentContainer.innerHTML = ""
            contentContainer.appendChild(effectContainer)
        });

        function getEffectChanges(){
            const contentAddtiionalEffect = new AdditionalEffect();
            contentAddtiionalEffect.name = nameForm.inputElement.value;
            contentAddtiionalEffect.description = formDescription.inputElement.value;
            contentAddtiionalEffect.characterAction = getOrderedSelectedOptions(triggerActions.inputElement);
            contentAddtiionalEffect.effects = [];
            for(let i = 0; i < effectsTabWindow.tabList.length; i++){
                const tabContent = getContentContainer(effectsTabWindow, effectsTabWindow.tabList[i]);
                const effectType = tabContent.inputElement.effectType.inputElement.selectedOptions[0].value;
                let effectProperties = {}
                let contenteEffect = null;
                if(effectType == additionalEffectTypes.BUFF){
                    effectProperties = {
                        type: tabContent.inputElement.effectProperties.inputElement.type.inputElement.selectedOptions[0].value,
                        value: tabContent.inputElement.effectProperties.inputElement.value.inputElement.value,
                        duration: tabContent.inputElement.effectProperties.inputElement.duration.inputElement.value
                    }
                    contenteEffect = new BuffDebuff(effectProperties)
                }else if(effectType == additionalEffectTypes.AURA){
                    effectProperties = {
                        area: tabContent.inputElement.effectProperties.inputElement.area.inputElement.value,
                        duration: tabContent.inputElement.effectProperties.inputElement.duration.inputElement.value,
                        auraType: tabContent.inputElement.effectProperties.inputElement.type.inputElement.selectedOptions[0].value,
                        value: tabContent.inputElement.effectProperties.inputElement.value.inputElement.value,
                        target: tabContent.inputElement.effectProperties.inputElement.target.inputElement.selectedOptions[0].value,
                        canSpread: tabContent.inputElement.effectProperties.inputElement.canSpread.inputElement.checked
                    }
                    contenteEffect = new Aura(effectProperties)
                }else if(effectType == additionalEffectTypes.CAST){
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
            displayedLevels.push(i.toString())
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

createSpellButton.onclick = () => {
    displaySpellCreate()
}