// Get spell by ID (e.g., "fireBolt")
function getSpellById(spellId) {
    for (const level in database.spells) {
        if (database.spells[level][spellId]) {
            return database.spells[level][spellId];
        }
    }
    return null;
}

function populateFunction(spells, parent){
    for(const spellLevel of Object.keys(spells)){
        const spellContainer = document.createElement('div');
    
        const spellHeader = document.createElement('h3');
        spellHeader.style.background = "chocolate"
        spellHeader.textContent = `Level ${spellLevel} (${Object.keys(database.spells[spellLevel]).length})`;
        spellContainer.appendChild(spellHeader);
    
        const spellContent = document.createElement('div');
        spellContent.classList.add('spell-content');
        spellContent.style.display = 'none'; // Initially hidden
    
        for (const spellId of Object.keys(database.spells[spellLevel])) {
            const spell = database.spells[spellLevel][spellId];
            const spellCard = createSpellCard(spell)
            spellCard.classList.add("active")
            spellContent.appendChild(spellCard);
        }
    
        spellContainer.appendChild(spellContent);
        parent.appendChild(spellContainer);
    
        spellHeader.addEventListener('click', () => {
            spellContent.style.display = spellContent.style.display === 'none' ? 'flex' : 'none';
        });
    }
}

function populateSpellBook(){ 
    // Get all spells for a character based on learnedSpells
    function getCharacterSpells(knownSpells) {
        const characterSpells = {};
        
        for (const level in knownSpells) {
            characterSpells[level] = {};
            
            for (const spellId of knownSpells[level]) {
                const spell = getSpellById(spellId);
                if (spell) {
                    characterSpells[level][spellId] = spell;
                }
            }
        }
        
        return characterSpells;
    }

    contentAllSpells.innerHTML = ''; // Clear previous content
    populateFunction(database.spells, contentAllSpells);

    contentYourSpells.innerHTML = ''; // Clear previous content
    populateFunction(getCharacterSpells(database.chars[player.charId].char.learnedSpells), contentYourSpells);  
}

function createSpellCard(spell) {
    // Helper functions
    const getClassNames = () => {
        return spell.classess.map(cls => {
            const classEntry = Object.entries(classTypes).find(([key, val]) => val === cls);
            return classEntry ? classEntry[0] : 'Unknown';
        }).join(', ');
    };

    const getDamageType = () => {
        if (Array.isArray(spell.damage)) {
            return spell.damage.value
        } else if (spell.damage.type) {
            const damageEntry = Object.entries(damageTypes).find(([key, val]) => val === spell.damage.type);
            return damageEntry ? damageEntry[0] : 'Unknown';
        }
        return 'None';
    };

    const getActionCost = () => {
        return spell.actionCost.map(action => {
            const actionEntry = Object.entries(actionTypes).find(([key, val]) => val === action);
            return actionEntry ? actionEntry[0] : 'Unknown';
        }).join(' + ');
    };

    const getPatternInfo = () => {
        if (!spell.spellPattern) return 'N/A';
        
        const patternEntry = Object.entries(spellPatterns).find(([key, val]) => val === spell.spellPattern.pattern);
        const castTypeEntry = Object.entries(castTypes).find(([key, val]) => val === spell.spellPattern.castType);
        
        return `
            ${patternEntry ? patternEntry[0] : 'Unknown'} pattern
            (Range: ${spell.spellPattern.range}ft, 
            Area: ${spell.spellPattern.area}ft, 
            Cast: ${castTypeEntry ? castTypeEntry[0] : 'Unknown'})
        `;
    };

    const getModifiers = () => {
        return spell.modifiers.map(mod => {
            const statEntry = Object.entries(statTypes).find(([key, val]) => val === mod.type);
            return statEntry ? `${statEntry[0]}×${mod.multiplier}` : 'Unknown';
        }).join(' + ');
    };

    function getDuration(duration) {
        return `${duration.value} ${Object.entries(durationTypes).find(([key, val]) => val === duration.type)[0]}`
    }

    function getListValues(list, search_in) {
        return `
        ${list.length > 0 ? `
            ${list.map(action => {
                const found = Object.entries(search_in).find(([key, val]) => val === action);
                return found ? found[0] : 'Unknown';
            }).join(', ')}` : ''
        }
        `
    }

    function getEffectDetails(effect) {
        let effectInfo = ""

        if(effect.type === extraEffectsList.Aura){
            const aura = effect.effect
            effectInfo =  `
            <ul class="effect">
            <strong>Description: </strong>${effect.description}
            </ul>
            <ul class="effect">
            <strong>Area: </strong>${aura.area}
            </ul>
            <ul class="effect">
            <strong>Effect: </strong>${Object.entries(effectTypes).find(([key, val]) => val === aura.effectType)[0]}
            </ul>
            <ul class="effect">
            <strong>Value: </strong>${aura.value.value}
            </ul>
            <ul class="effect">
            <strong>Duration: </strong>${getDuration(aura.duration)}
            </ul>
            <ul class="effect">
            <strong>Triggered With: </strong>${getListValues(aura.triggerActions, characterActions)}
            </ul>
            <ul class="effect">
            <strong>Target: </strong>${getListValues(aura.targetList, targetTypes)}
            </ul>
            <ul class="effect">
            <strong>Can Spread: </strong>${aura.canSpread ? 'Yes' : 'No'}
            </ul>  
           `
        } else if (effect.type === extraEffectsList["Buff/Debuff"]) {
            const buffDebuff = effect.effect;
            effectInfo = `
            <ul class="effect">
            <strong>Description: </strong>${effect.description}
            </ul>
            <ul class="effect">
            <strong>Type: </strong>${Object.entries(effectTypes).find(([key, val]) => val === buffDebuff.effectType)[0]}
            </ul>
            <ul class="effect">
            <strong>Value: </strong>${buffDebuff.value.value}
            </ul>
            <ul class="effect">
            <strong>Duration: </strong>${getDuration(buffDebuff.duration)}
            </ul>
            <ul class="effect">
            <strong>Triggered With: </strong>${getListValues(buffDebuff.triggerActions, characterActions)}
            </ul>

            `;
        } else if (effect.type === extraEffectsList.Cast) {
            const cast = effect.effect;
            effectInfo = `
            <ul class="effect">
            <strong>Description: </strong>${effect.description}
            </ul>
            <ul class="effect">
            <strong>Spell: </strong>${cast.spell}
            </ul>
            <ul class="effect">
            <strong>Target List: </strong>${getListValues(cast.targetListInOrder, targetOrderList)}
            </ul>
            `;
        } else if (effect.type === extraEffectsList.Summon) {
            const summon = effect.effect;
            effectInfo = `
            <ul class="effect">
            <strong>Description: </strong>${effect.description}
            </ul>
            <ul class="effect">
            <strong>Summoned Entity: </strong>${summon.id}
            </ul>
            <ul class="effect">
            <strong>Duration: </strong>${getDuration(summon.duration)}
            </ul>
            <ul class="effect">
            <strong>Quantity: </strong>${summon.quantity}
            </ul>
            `;
        }


        return `
            <ul class="column">
                <li class="effect">
                    <strong>${effect.name}</strong>
                </li>
                ${effectInfo}
            </ul>
        `
    }

    // Create the card element
    const card = document.createElement('div');
    card.className = 'spell-card';
    card.dataset.spellName = spell.name; // Set the spell ID as a data attribute
    card.innerHTML = `
        <div class="spell-header ${Object.entries(spellTypes).find(([key, val]) => val === spell.type)[0].toLowerCase()}">
            <div class="row" style="justify-content: space-between;">
                <h2 class="spell-name">${spell.name}</h2> 
                <h4 class="spell-type">${Object.entries(spellTypes).find(([key, val]) => val === spell.type)[0]}</h4>
            </div>
            <span>${getClassNames()}</span>
        </div>
        
        <div class="spell-body">
            <div class="spell-description">${spell.description}</div>
            
            <div class="spell-stats">
                <div class="stat-row">
                    <span class="stat-label">Casting Time:</span>
                    <span class="stat-value">${getActionCost()}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Duration:</span>
                    <span class="stat-value">${getDuration(spell.castDuration)}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Damage:</span>
                    <span class="stat-value">${spell.damage.value || 'N/A'} ${getDamageType()} (${getModifiers()})</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Pattern:</span>
                    <span class="stat-value">${getPatternInfo()}</span>
                </div>
            </div>
            
            ${spell.casterRolls.length > 0 ? `
            <div class="spell-rolls">
                <h4>Caster Rolls:</h4>
                <ul>
                    ${spell.casterRolls.map(roll => `
                        <li>${Object.entries(diceTypes).find(([key, val]) => val === roll.diceType)[0]} 
                        ${Object.entries(rollTypes).find(([key, val]) => val === roll.rollType)[0]} 
                        vs DC${roll.target}</li>
                    `).join('')}
                </ul>
            </div>` : ''}
            
            ${spell.targetRolls.length > 0 ? `
            <div class="spell-rolls">
                <h4>Target Rolls:</h4>
                <ul>
                    ${spell.targetRolls.map(roll => `
                        <li>${Object.entries(diceTypes).find(([key, val]) => val === roll.diceType)[0]} 
                        ${Object.entries(rollTypes).find(([key, val]) => val === roll.rollType)[0]} 
                        vs DC${roll.target}</li>
                    `).join('')}
                </ul>
            </div>` : ''}
            
            ${Object.keys(spell.spendManaEffects).length > 0 ? `
            <div class="spell-mana-effects">
                <h4>Mana Effects:</h4>
                ${Object.entries(spell.spendManaEffects).map(([level, effects]) => `
                    <div class="mana-effect-level">
                        <h4>Level ${level}:</h4>
                        ${effects.caster ? `
                        <div class="effect-group">
                            <h4>Caster Effects:</h4>
                            ${effects.caster.map(effect => 
                                getEffectDetails(effect)
                            ).join('')}
                        </div>` : ''}
                        ${effects.target ? `
                        <div class="effect-group">
                            <h4>Target Effects:</h4>
                            ${effects.target.map(effect => 
                                getEffectDetails(effect)
                            ).join('')}
                        </div>` : ''}
                    </div>
                `).join('')}
            </div>` : ''}
        </div>
    `;

    return card;
}

function displaySpellDescription(spell){
    console.log(spell)
}

createSpellButton.onclick = () => {
    displaySpellCreate()
}

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
        spell.name = formName.getValue()
        spell.availableClasses = formClasses.getValue();
        spell.modifierStats = formModifierStat.getValue();
        spell.baseDamageType = formBaseDamageType.getValue();
        spell.baseDamage = formBaseDamage.getValue();
        spell.description = formDescription.getValue();
        spell.castDuration = formSpellCastDuration.getValue();
        spell.actionCost = formActionCost.getValue();
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
            pattern: spellPatternSelect.getValue(),
            range: spellCastArea.getValue(),
            area: spellCastWidth.getValue(),
            castType: spellCastType.getValue(),
            canTarget: spellCanTarget.getValue(),
        })
        spell.casterRolls = spellCasterRolls.getValue();
        spell.targetRolls = spellTargetRolls.getValue();
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
    
    formBaseDamageType.selectElement.onchange =  (event) => {
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
        const spellType = selectSpellType.selectElement.selectedOptions[0].value;
        const spellLevel = parseInt(selectSpellLevel.selectElement.selectedOptions[0].value);
        
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

    const effectBuilderContent = document.createElement("div")
    effectBuilderContent.style.display = "block"
    effectBuilderContent.style.width = "100%"
    effectBuilderContent.style.height = "100%"
    effectBuilderContent.style.overflow = "scroll"
    effectBuildSheet.appendChild(effectBuilderContent)

    const effectBuilderForm = document.createElement('div');
    effectBuilderForm.classList.add('column');
    effectBuilderForm.classList.add('vertical');
    effectBuilderForm.style.backgroundColor = formColor;
    effectBuilderForm.style.gap = '5px';
    effectBuilderContent.appendChild(effectBuilderForm);
    
    const formName = createInputString('Name: ', itemId + '-name');
    formName.classList.add('box-circular-border');
    formName.style.backgroundColor = formColor;
    effectBuilderForm.appendChild(formName);

    const formDescription = createInputString('Description: ', itemId + '-description', {isTextArea: true});
    formDescription.classList.add('box-circular-border');
    formDescription.style.height = '150px';
    formDescription.style.backgroundColor = formColor;
    effectBuilderForm.appendChild(formDescription);

    const formType = createInputSelector("Effect Type: ", Object.values(extraEffectsList, Object.keys(extraEffectsList)), {
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
            const effectType = tabContent.inputElement.effectType.selectElement.selectedOptions[0].value;
            let effectProperties = {}
            let contenteEffect = null;
            if(effectType == effectTypes.BUFF){
                effectProperties = {
                    type: tabContent.inputElement.effectProperties.inputElement.type.selectElement.selectedOptions[0].value,
                    value: tabContent.inputElement.effectProperties.inputElement.value.inputElement.value,
                    duration: tabContent.inputElement.effectProperties.inputElement.duration.inputElement.value
                }
                contenteEffect = new BuffDebuff(effectProperties)
            }else if(effectType == effectTypes.AURA){
                effectProperties = {
                    area: tabContent.inputElement.effectProperties.inputElement.area.inputElement.value,
                    duration: tabContent.inputElement.effectProperties.inputElement.duration.inputElement.value,
                    auraType: tabContent.inputElement.effectProperties.inputElement.type.selectElement.selectedOptions[0].value,
                    value: tabContent.inputElement.effectProperties.inputElement.value.inputElement.value,
                    target: tabContent.inputElement.effectProperties.inputElement.target.selectElement.selectedOptions[0].value,
                    canSpread: tabContent.inputElement.effectProperties.inputElement.canSpread.inputElement.checked
                }
                contenteEffect = new Aura(effectProperties)
            }else if(effectType == effectTypes.CAST){
                effectProperties = {
                    spell: tabContent.inputElement.effectProperties.inputElement.spell.selectElement.selectedOptions[0].value,
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
    effectTrigerActions.classList.add('box-circular-border');
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

    const itemId = parentId + "-effect-"

    const effectArea = createInputNumber("Area: ", itemId + 'area', {
        maxValue: 9999,
        minValue: 1,
        addIncrementButtons: true,
        defaultValue: 200
    })
    effectArea.classList.add("box-circular-border")
    form.appendChild(effectArea);

    const effectDuration = createInputDuration("Duration: ", itemId + "duration", {
        initalDuration: new Duration({type: durationTypes.TURN_BASED, value: 5})
    })
    effectDuration.classList.add("box-circular-border")
    form.appendChild(effectDuration);

    const effectTypeSelector = createInputSelector('Effect Type:',  Object.values(effectTypes), Object.keys(effectTypes),{
        id: itemId + "type"
    });
    effectTypeSelector.classList.add('box-circular-border');
    form.appendChild(effectTypeSelector);

    const effectValue = createInputDamage("Value: ", itemId + "value", {
        defaultValue: "1d1"
    })   
    effectValue.classList.add("box-circular-border")
    form.appendChild(effectValue);

    const effectTargetSelector = createInputSelector('Target Type:',  Object.values(targetTypes), Object.keys(targetTypes),{
        id: itemId + "target",
        multiple: true,
        custom_func: selectorChekmarkOptionFunction
    });
    effectTargetSelector.classList.add('box-circular-border');
    form.appendChild(effectTargetSelector);

    const effectCanSpread = createInputBoolean("Can Spread: ", itemId + "spread")
    effectCanSpread.classList.add("box-circular-border")
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