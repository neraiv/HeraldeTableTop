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
            spellContent.style.display = spellContent.style.display == 'none' ? 'flex' : 'none';
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
            const classEntry = Object.entries(classTypes).find(([key, val]) => val == cls);
            return classEntry ? classEntry[0] : 'Unknown';
        }).join(', ');
    };

    const getDamageType = () => {
        if (Array.isArray(spell.damage)) {
            return spell.damage.value
        } else if (spell.damage.type) {
            const damageEntry = Object.entries(damageTypes).find(([key, val]) => val == spell.damage.type);
            return damageEntry ? damageEntry[0] : 'Unknown';
        }
        return 'None';
    };

    const getActionCost = () => {
        return spell.actionCost.map(action => {
            const actionEntry = Object.entries(actionTypes).find(([key, val]) => val == action);
            return actionEntry ? actionEntry[0] : 'Unknown';
        }).join(' + ');
    };

    const getPatternInfo = () => {
        if (!spell.spellPattern) return 'N/A';
        
        const patternEntry = Object.entries(spellPatterns).find(([key, val]) => val == spell.spellPattern.pattern);
        const castTypeEntry = Object.entries(castTypes).find(([key, val]) => val == spell.spellPattern.castType);
        
        return `
            ${patternEntry ? patternEntry[0] : 'Unknown'} pattern
            (Range: ${spell.spellPattern.range}ft, 
            Area: ${spell.spellPattern.area}ft, 
            Cast: ${castTypeEntry ? castTypeEntry[0] : 'Unknown'})
        `;
    };

    const getModifiers = () => {
        return spell.modifiers.map(mod => {
            const statEntry = Object.entries(statTypes).find(([key, val]) => val == mod.type);
            return statEntry ? `${statEntry[0]}×${mod.multiplier}` : 'Unknown';
        }).join(' + ');
    };

    function getDuration(duration) {
        return `${duration.value} ${Object.entries(durationTypes).find(([key, val]) => val == duration.type)[0]}`
    }

    function getListValues(list, search_in) {
        return `
        ${list.length > 0 ? `
            ${list.map(action => {
                const found = Object.entries(search_in).find(([key, val]) => val == action);
                return found ? found[0] : 'Unknown';
            }).join(', ')}` : ''
        }
        `
    }

    function getEffectDetails(effect) {
        let effectInfo = ""

        if(effect.type == extraEffectsList.Aura){
            const aura = effect.effect
            effectInfo =  `
            <ul class="effect">
            <strong>Description: </strong>${effect.description}
            </ul>
            <ul class="effect">
            <strong>Area: </strong>${aura.area}
            </ul>
            <ul class="effect">
            <strong>Effect: </strong>${Object.entries(effectTypes).find(([key, val]) => val == aura.effectType)[0]}
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
        } else if (effect.type == extraEffectsList["Buff/Debuff"]) {
            const buffDebuff = effect.effect;
            effectInfo = `
            <ul class="effect">
            <strong>Description: </strong>${effect.description}
            </ul>
            <ul class="effect">
            <strong>Type: </strong>${Object.entries(effectTypes).find(([key, val]) => val == buffDebuff.effectType)[0]}
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
        } else if (effect.type == extraEffectsList.Cast) {
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
        } else if (effect.type == extraEffectsList.Summon) {
            const summon = effect.effect;
            effectInfo = `
            <ul class="effect">
            <strong>Description: </strong>${effect.description}
            </ul>
            <ul class="effect">
            <strong>Summoned Entity: </strong>${summon.id}
            </ul>
            <ul class="effect">
            <strong>Cast Duration: </strong>${getDuration(summon.castDuration)}
            </ul>
            <ul class="effect">
            <strong>Summon Duration: </strong>${getDuration(summon.summonDuration)}
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
        <div class="spell-header ${Object.entries(spellTypes).find(([key, val]) => val == spell.type)[0].toLowerCase()}">
            <div class="row" style="justify-content: space-between;">
                <h2 class="spell-name">${spell.name}</h2> 
                <h4 class="spell-type">${Object.entries(spellTypes).find(([key, val]) => val == spell.type)[0]}</h4>
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
                        <li>${Object.entries(diceTypes).find(([key, val]) => val == roll.diceType)[0]} 
                        ${Object.entries(rollTypes).find(([key, val]) => val == roll.rollType)[0]} 
                        vs DC${roll.target}</li>
                    `).join('')}
                </ul>
            </div>` : ''}
            
            ${spell.targetRolls.length > 0 ? `
            <div class="spell-rolls">
                <h4>Target Rolls:</h4>
                <ul>
                    ${spell.targetRolls.map(roll => `
                        <li>${Object.entries(diceTypes).find(([key, val]) => val == roll.diceType)[0]} 
                        ${Object.entries(rollTypes).find(([key, val]) => val == roll.rollType)[0]} 
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

function displaySpellCreate(initialSpell = spells[2].conjureWorm) {

    // random 4 digit number
    const id = Math.floor(Math.random() * 9000) + 1000;

    const spellCreateSheet = document.createElement('div');
    spellCreateSheet.className = 'spell-create-sheet box-circular-border column vertical';
    spellCreateSheet.id = id;
    spellCreateSheet.style.backgroundColor = 'green';

    // **********************************************************
    // Window topBar
    const topBar = addWinwowTopBar(spellCreateSheet);

    const spellCreateSheetTitle = document.createElement('h2');
    spellCreateSheetTitle.className = 'window-title'
    topBar.appendChild(spellCreateSheetTitle);

    addSpacer(topBar);

    const spellSaveButton = createImageButton('28', {source: 'url(static/images/menu-icons/save.png)', custom_padding: 4});
    spellSaveButton.style.marginRight = '5px';
    spellSaveButton.style.cursor = 'pointer';
    spellSaveButton.onclick = () => {
        const spell = getValue();
        if(spell){
            const selectedSpellLevel = formSpellLevelSelect.getValue()
            console.log(spell);
            spells[selectedSpellLevel][initialSpell ? initialSpell.id : id] = spell;
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
    
    // ---------------------------------------------------------
    // End Window topBar

    // **********************************************************
    // **********************************************************
    // Spell Form
    const formSpell = document.createElement('div');
    formSpell.className = "column vertical"
    formSpell.style.width = '98%';
    formSpell.style.gap = '10px';
    formSpell.style.padding = '5px';
    spellCreateSheetContent.appendChild(formSpell);

    const rowSpellTypeLevel = document.createElement('div');
    rowSpellTypeLevel.className = 'row vertical form-group box-circular-border';
    rowSpellTypeLevel.style.backgroundColor = formColor;
    rowSpellTypeLevel.style.gap = '10px';
    formSpell.appendChild(rowSpellTypeLevel);

    const formSpellTypeSelect = createInputSelector('Spell Type: ', Object.values(spellTypes), Object.keys(spellTypes), {
        id: id + '-type',
        defaultValue: initialSpell ? [initialSpell.type] : spellTypes.SPELL
    });
    formSpellTypeSelect.classList.remove("form-group")
    formSpellTypeSelect.style.width = '100%';
    rowSpellTypeLevel.appendChild(formSpellTypeSelect);

    const serverRulesSpellsRange = [];
    for (let level = database.serverRules.spells.min; level < database.serverRules.spells.max; level++){
        serverRulesSpellsRange.push(level);
    }
    const formSpellLevelSelect = createInputSelector('Spell Level: ', serverRulesSpellsRange, serverRulesSpellsRange, {
        id: id +'-level',
        defaultValue: initialSpell ? [initialSpell.level] : database.serverRules.spells.min
    }); 
    formSpellLevelSelect.classList.remove("form-group")
    formSpellLevelSelect.style.width = '100%';
    rowSpellTypeLevel.appendChild(formSpellLevelSelect);

    const spellTypeConfirmation = createImageButton(40, {icon: "check_circle_outline"});
    spellTypeConfirmation.id = "ui-spellbook-close-button";
    spellTypeConfirmation.style.fontFamily = 'Material Icons Outlined';
    spellTypeConfirmation.style.backgroundColor = "green"
    rowSpellTypeLevel.appendChild(spellTypeConfirmation);

    spellTypeConfirmation.onclick = () => {
        userAskQuestion("Careful?", "Are you sure you want to change the spell type and level? This may cause lost of previous changes.",{
            buttons: ['Yes', 'No'],
            callback: (buttonText) => {
                if(buttonText == 'Yes'){
                    changeVisibilty();
                }
            }}
        )

    }

    const formName = createInputString('Name: ', id + '-name', {
        defaultValue: initialSpell ? initialSpell.name : null
    });
    formName.classList.add('box-circular-border');
    formName.style.backgroundColor = formColor;
    formSpell.appendChild(formName);

    if(initialSpell){
        spellCreateSheetTitle.textContent = "Editing - " + initialSpell.name
        formName.querySelector(".input-element").value = initialSpell.name
    }

    const formClasses = createInputSelector('Usable By Class:', Object.values(classTypes), Object.keys(classTypes), {
        id:  id +'-clasess',
        multiple: true,
        custom_func: selectorChekmarkOptionFunction,
        defaultValue: initialSpell ? initialSpell.classess : null
    });

    formClasses.classList.add('box-circular-border');
    formClasses.style.height = '150px';
    formClasses.style.backgroundColor = formColor;
    formSpell.appendChild(formClasses);

    const formModifierStat = createInputModifier("Spell Modifiers", id+"-modifier", statTypes, {
        defaultValue: initialSpell ? initialSpell.modifiers : null
    })
    formModifierStat.style.backgroundColor = formColor;
    formSpell.appendChild(formModifierStat);

    const formDamage = document.createElement("div");
    formDamage.className = "column vertical form-group box-circular-border"
    formDamage.style.gap = '1rem';
    formDamage.style.backgroundColor = formColor;
    formSpell.appendChild(formDamage);

    const formBaseDamageType = createInputSelector('Damage Type: ', Object.values(damageTypes), Object.keys(damageTypes), {
        id:  id +'-damage-type',
        defaultValue: initialSpell ? [initialSpell.damage.type] : damageTypes.NONE
    });
    formBaseDamageType.classList.remove('form-group');
    formBaseDamageType.style.width = "100%"
    formDamage.appendChild(formBaseDamageType);

    const formBaseDamage = createInputDamage("Damage: ", id+ '-base-damage', {
        defaultValue: initialSpell ? initialSpell.damage.value : null
    })
    formBaseDamage.classList.remove('form-group');
    formBaseDamage.style.width = "100%"
    formBaseDamage.style.display = "none"
    formDamage.appendChild(formBaseDamage);
    
    formBaseDamageType.selectElement.onchange =  (event) => {
        const value = event.target.value
        if(value != damageTypes.NONE){
            formBaseDamage.style.display = "flex"
        }else{
            formBaseDamage.style.display = "none"
        }
    }

    const formDescription = createInputString('Description: ', id + '-description', {
        isTextArea: true, 
        defaultValue: initialSpell ? initialSpell.description : null
    });
    formDescription.classList.add('box-circular-border');
    formDescription.style.height = '150px';
    formDescription.style.backgroundColor = formColor; 
    formSpell.appendChild(formDescription);
 
    const formSpellCastDuration = createInputDuration("Cast Duration: ",id +'-duration', {
        defaultValue: initialSpell ? initialSpell.castDuration : null
    });
    formSpell.appendChild(formSpellCastDuration);

    const formActionCost = createInputSelector('Action Cost: ', Object.values(actionTypes), Object.keys(actionTypes),{
        id: 'create-spell-pattern-cast-type',
        defaultValue: initialSpell ?  initialSpell.actionCost : null, 
        multiple: true
    })
    formActionCost.classList.add('box-circular-border');
    formActionCost.style.backgroundColor = formColor;
    formSpell.appendChild(formActionCost);

    let selectableSpellLevels = []
    let displayedSpellManaLevels = []

    for(let i = database.serverRules.spells.min; i <= database.serverRules.spells.max; i++){
        selectableSpellLevels.push(`${i}`)
    }

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

    formSpell.appendChild(formTargetEffects);

    for(let i = 0; i < selectableSpellLevels.length; i++){
        const index = selectableSpellLevels[i]
        const tabContent = getContentContainer(targetEffectsTabbedWindowContainer, parseInt(selectableSpellLevels[i]))
        tabContent.innerHTML = '';
        const formTargetEffects = createeffectListContainer(
            tabContent.id + '-target-effects',
            `Spell Mana Effect for Mana: ${selectableSpellLevels[i]}`,
            initialSpell && initialSpell.spendManaEffects[index] && initialSpell.spendManaEffects[index].target ? initialSpell.spendManaEffects[index].target : null
        );
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

    formSpell.appendChild(casterEffects);

    for(let i = 0; i < selectableSpellLevels.length; i++){
        const index = parseInt(selectableSpellLevels[i])
        const tabContent = getContentContainer(casterEffectsTabbedWindowContainer, selectableSpellLevels[i])
        tabContent.innerHTML = '';
        const casterEffects = createeffectListContainer(
            tabContent.id + '-ext-ef',
            `Spell Mana Effect for Mana: ${selectableSpellLevels[i]}`, 
            initialSpell && initialSpell.spendManaEffects[index] && initialSpell.spendManaEffects[index].caster ? initialSpell.spendManaEffects[index].caster : null
        );
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
        defaultValue: initialSpell ? [initialSpell.spellPattern.pattern] : null, 
    })
    spellPatternSelect.classList.add('box-circular-border');
    spellPatternSelect.style.backgroundColor = formColor;
    formCastPatternContainer.appendChild(spellPatternSelect);

    const spellCastRange = createInputNumber("Cast Range:", id + "-pattern-area",{ 
        maxValue: 9999, 
        minValue: 0, 
        defaultValue: initialSpell ? initialSpell.spellPattern.range : null
    })
    spellCastRange.classList.add('box-circular-border');
    spellCastRange.style.backgroundColor = formColor;
    formCastPatternContainer.appendChild(spellCastRange);

    const spellCastArea = createInputNumber("Cast Area:", id + "-pattern-area",{ 
        maxValue: 9999, 
        minValue: 0, 
        defaultValue: initialSpell ? initialSpell.spellPattern.area : null
    })
    spellCastArea.classList.add('box-circular-border');
    spellCastArea.style.backgroundColor = formColor;
    formCastPatternContainer.appendChild(spellCastArea);

    const spellCastType = createInputSelector('Spell Cast Type: ', Object.values(castTypes), Object.keys(castTypes),{
        id: 'create-spell-pattern-cast-type',
        defaultValue: initialSpell ? [initialSpell.spellPattern.castType] : null, 
    })
    spellCastType.classList.add('box-circular-border');
    spellCastType.style.backgroundColor = formColor;
    formCastPatternContainer.appendChild(spellCastType);

    const spellCanTarget = createInputSelector('Can Target: ', Object.values(targetTypes), Object.keys(targetTypes),{
        id: 'create-spell-pattern-can-target',
        defaultValue: initialSpell ? initialSpell.spellPattern.canTarget : null, 
        multiple: true,
        custom_func: selectorChekmarkOptionFunction
    })
    spellCanTarget.classList.add('box-circular-border');
    spellCanTarget.style.backgroundColor = formColor;
    formCastPatternContainer.appendChild(spellCanTarget);
    formSpell.appendChild(formCastPatternContainer)

    const spellCasterRolls = createInputSelector('Caster Rolls: ', Object.values(rollTypes), Object.keys(rollTypes),{
        id: 'create-spell-caster-rolls',
        defaultValue: initialSpell ? initialSpell.casterRolls : null, 
        multiple: true,
    })
    spellCasterRolls.classList.add('box-circular-border');
    spellCasterRolls.style.backgroundColor = formColor;
    formSpell.appendChild(spellCasterRolls)

    const spellTargetRolls = createInputSelector('Target Rolls: ', Object.values(rollTypes), Object.keys(rollTypes),{
        id: 'create-spell-target-rolls',
        defaultValue: initialSpell ? initialSpell.targetRolls : null, 
        multiple: true,
    })
    spellTargetRolls.classList.add('box-circular-border');
    spellTargetRolls.style.backgroundColor = formColor;
    formSpell.appendChild(spellTargetRolls)
    // --------------------------END ------------------------
    userInterface.appendChild(spellCreateSheet);

    function getValue(){
        const spell = new Spell();
        spell.name = formName.getValue()
        spell.classess = formClasses.getValue();
        spell.modifiers = formModifierStat.getValue();
        spell.damage = new Damage({type: formBaseDamageType.getValue(), value: formBaseDamage.getValue()});
        spell.description = formDescription.getValue();
        spell.castDuration = formSpellCastDuration.getValue();
        spell.actionCost = formActionCost.getValue();
        spell.spendManaEffects = {};
        for(let i = 0; i < selectableSpellLevels.length; i++){
            const index = parseInt(selectableSpellLevels[i])
            let target = [];
            let caster = [];

            const targetEffectList = casterEffectsTabbedWindowContainer.querySelector('.exf-container');
            const casterEffectList = targetEffectsTabbedWindowContainer.querySelector('.exf-container');
            
            for(let listElement of targetEffectList.elementsList.children){
                target.push(new Effect(listElement.effect))
            }
            for(let listElement of casterEffectList.elementsList.children){
                caster.push(new Effect(listElement.effect))
            }
            if(target.length > 0 || caster.length > 0){
                spell.spendManaEffects[index] = {target, caster}
            }
        }
        spell.spellPattern = new SpellPattern({
            pattern: spellPatternSelect.getValue(),
            range: spellCastRange.getValue(),
            area: spellCastArea.getValue(),
            castType: spellCastType.getValue(),
            canTarget: spellCanTarget.getValue(),
        })
        spell.casterRolls = spellCasterRolls.getValue();
        spell.targetRolls = spellTargetRolls.getValue();
        return spell;
    }


    function changeVisibilty(){ //Future seviye görünümleri değiştirielcek
        const spellType = formSpellTypeSelect.selectElement.value;
        const spellLevel = parseInt(formSpellLevelSelect.selectElement.value);

        // Spell Type Related
        if(spellType == spellTypes.CANTRIP){
            displayedSpellManaLevels = [0]
        }else{
            formCastPatternContainer.style.display = 'flex';
            formBaseDamageType.style.display = 'flex';
            formBaseDamage.style.display = 'flex';
            formModifierStat.style.display = 'flex';

            for(let i = spellLevel; i < database.serverRules.spells.max; i++){
                displayedSpellManaLevels.push(i)
            }
    
            // // Filter out any selectableSpellLevels lower than initialSpell.spellLvl
            displayedSpellManaLevels = displayedSpellManaLevels.filter(level => (parseInt(level) <= parseInt(database.serverRules.spells.max)));
        }

        // Spell Level Related
        for (let level = database.serverRules.spells.min; level < database.serverRules.spells.max; level++){
            changeVisibiltyOfTab(targetEffectsTabbedWindowContainer, level, displayedSpellManaLevels.includes(level))
            changeVisibiltyOfTab(casterEffectsTabbedWindowContainer, level, displayedSpellManaLevels.includes(level))
        }

        // Set the first tab as active
        activateTab(targetEffectsTabbedWindowContainer, displayedSpellManaLevels[0])
        activateTab(casterEffectsTabbedWindowContainer, displayedSpellManaLevels[0])
    }
    
    changeVisibilty()
}

function createeffectListContainer(id, titleStr = null, spendManaEffects){
 
    const additionalElementListContainer = document.createElement('div');
    additionalElementListContainer.classList.add('exf-container');
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

    function populate(effect = null){
        const listElement = createeffectListElement(effect)
        elementsListColumn.appendChild(listElement);
    }

    const buttonAddNew = document.createElement('button')
    buttonAddNew.textContent = 'Add New Effect';
    buttonAddNew.style.textAlign = 'center';
    buttonAddNew.style.display = 'flex';
    buttonsList.appendChild(buttonAddNew);
    buttonAddNew.onclick = () => {
        populate()
    }

    if (spendManaEffects){
        for(let effect of spendManaEffects){
            populate(effect)
        }
    }

    row.appendChild(elementsListColumn)
    row.appendChild(buttonsList)
    additionalElementListContainer.appendChild(title);
    additionalElementListContainer.appendChild(row)

    return additionalElementListContainer;
}

function createeffectListElement(initalEffect = null){ 
    
    // Future additnal effect create bağlanacak
    const listElement = document.createElement('div');
    listElement.classList.add('additiona-effect-container');
    listElement.classList.add('list-element'); // 30px 
    listElement.classList.add('box-circular-border');
    listElement.classList.add('row');
    listElement.classList.add('vertical');

    listElement.effect = initalEffect 

    const label = document.createElement('label');
    label.style.textAlign = 'center';
    label.style.fontSize = '14px';
    label.style.paddingLeft = '5px';
    label.textContent = "New Additional Effect";
    listElement.appendChild(label)

    const effectIcons = document.createElement('div');
    effectIcons.classList.add('row');
    effectIcons.classList.add('centered');
    effectIcons.style.gap = '5px';
    listElement.appendChild(effectIcons);

    addSpacer(listElement);

    const editButton = createImageButton('26', {source: `url(static/images/menu-icons/edit.png)`, custom_padding: 3});
    listElement.appendChild(editButton);
    editButton.onclick = () => {
        effectBuilder(Date.now(), listElement.effect, listElement);
    }
    

    const removeButton = createImageButton('26', {source: `url(static/images/menu-icons/close.png)`, custom_padding: 3});
    listElement.appendChild(removeButton);
    removeButton.onclick = () => {
        listElement.remove()
    }

    listElement.getValue = () => {
        return listElement.effect
    }

    listElement.setValue = (effect) => {
        if(effect){    

            listElement.effect = effect

            label.textContent = effect.name;

            effectIcons.innerHTML = '';

            Object.values(extraEffectsList).forEach((value) => {
                if (value == effect.type) {
                    const effectImg = document.createElement('img');
                    effectImg.classList.add('icon');
                    effectImg.style.width = '23px';
                    effectImg.style.height = '23px';
                    effectImg.style.marginRight = '10px';
                    effectImg.src = "static/images/menu-icons/" + value.toLowerCase() + ".png";
                    effectIcons.appendChild(effectImg);
                    return;
                }
            });   
        }
    }

    if (initalEffect){
        listElement.setValue(initalEffect)
    }
    return listElement;
}

function effectBuilder(id, initial = null, parentElement = null) {

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
    
    const topBar = addWinwowTopBar(effectBuildSheet);
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
        const changes = effectBuildSheet.getValue();
        if(changes){
            parentElement.effect = changes
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
    
    const formName = createInputString('Name: ', itemId + '-name', {
        placeholder: 'New Effect'
    });
    formName.classList.add('box-circular-border');
    formName.style.backgroundColor = formColor;
    effectBuilderForm.appendChild(formName);

    const formDescription = createInputString('Description: ', itemId + '-description', {isTextArea: true});
    formDescription.classList.add('box-circular-border');
    formDescription.style.height = '150px';
    formDescription.style.backgroundColor = formColor;
    effectBuilderForm.appendChild(formDescription);

    const formType = createInputSelector("Effect Type: ", Object.values(extraEffectsList), Object.keys(extraEffectsList), {
        id: itemId + "-type",
        defaultValue: initial ? [initial.effect.type] : [extraEffectsList.BuffDebuff],
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

    let extraEffectContainer = null;
    let blockChangeEvent = false
    
    function abortChange(){
        blockChangeEvent = true
        formType.selectElement.value = previousFormTypeValue;
        blockChangeEvent = false
    }

    async function createExtraEffectForm(type, initial = null) {
        if (type == extraEffectsList["Buff/Debuff"]) {
            extraEffectContainer = createBuffDebuffForm(itemId, initial);
        } else if (type == extraEffectsList.Aura) {
            extraEffectContainer = createAuraForm(itemId, initial);
        } else if (type == extraEffectsList.Cast) {
            extraEffectContainer = createCastForm(itemId, initial);
        } else if (type == extraEffectsList.Summon) {
            extraEffectContainer = await createSummonForm(itemId, initial);
        }

        if (extraEffectContainer == null) userWarn("Please select valid type")
        else {
            effectData.innerHTML = "";
            effectData.appendChild(extraEffectContainer);
            previousFormTypeValue = type;
        }
    }
    
    formType.selectElement.addEventListener("change", async (event) => {
        if (blockChangeEvent) return;
        if (effectData.innerHTML !== "") {
            const data = await userAskQuestion(
                "Careful!",
                "Changing the type of the spell may remove already set effects. Create a new one if needed!",
                {
                    buttons: ["Continue", "Abort"],
                    blocking: true
                }
            );
    
            if (data.buttonText == "Abort") {
                return abortChange()
            }
        }
        
        extraEffectContainer = createExtraEffectForm(event.target.value, initial ? initial.effect : null);

        if (effectData.innerHTML != "") {
            return abortChange()
        }
    });
    
    let previousFormTypeValue = formType.selectElement.value;    

    effectBuildSheet.getValue = () => {
        const effect = new Effect();
        effect.name = formName.getValue();
        effect.description = formDescription.getValue();
        effect.type = formType.getValue();
        if (effectData.innerHTML != ""){
            effect.effect = extraEffectContainer.getValue();
        }else{
            userWarn("Please select and create effect.")
            effect.effect = null
        }
        return effect;
    }

    effectBuildSheet.setValue = (effect) => {
        if(effect){
            blockChangeEvent = true
            formName.setValue(effect.name)
            formDescription.setValue(effect.description)
            formType.setValue(effect.type)
            createExtraEffectForm(effect.type, effect.effect)
            blockChangeEvent = false
        }
    }

    if (initial) {
        effectBuildSheet.setValue(initial);
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
        id: parentId +'-aditional-effect-buff-type',
        defaultValue: initial ? [initial.effectType] : [effectTypes.BUFF]
    });
    effectTypeSelector.classList.add('box-circular-border');
    form.appendChild(effectTypeSelector);

    const effectValue = createInputDamage("Value :", parentId + "-value", {
        defaultValue: initial ? initial.value : "1d1",
    })
    effectValue.classList.add('box-circular-border');
    form.appendChild(effectValue);

    const effectDuration = createInputDuration("Duration: ", parentId + '-aditional-effect-buff-duration', {
        defaultValue: initial ? initial.duration : new Duration({type: durationTypes.TURN, value: 5})
    })
    form.appendChild(effectDuration);

    const effectTrigerActions = createInputSelector("Trigger Actions:", Object.values(characterActions), Object.keys(characterActions), {
        multiple: true,
        custom_func: selectorChekmarkOptionFunction,
        defaultValue: initial ? initial.triggerActions : null,
    })
    effectTrigerActions.classList.add('box-circular-border');
    form.appendChild(effectTrigerActions)

    form.getValue = () => {
        const buffDebuff = new BuffDebuff({
            effectType: effectTypeSelector.getValue(),
            value: effectValue.getValue(),
            duration: effectDuration.getValue(),
            triggerActions: effectTrigerActions.getValue()
        })

        return buffDebuff
    }

    form.setValue = (buffDebuff) => {
        if(buffDebuff){
            effectTypeSelector.setValue(buffDebuff.effectType)
            effectValue.setValue(buffDebuff.value)
            effectDuration.setValue(buffDebuff.duration)
            effectTrigerActions.setValue(buffDebuff.triggerActions)
        }
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
        initalDuration: new Duration({type: durationTypes.TURN, value: 5})
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

    form.getValue = () => {
        const aura = new Aura({
            area: effectArea.getValue(),
            duration: effectDuration.getValue(),
            effectType: effectTypeSelector.getValue(),
            value: effectValue.getValue(),
            targetList: effectTargetSelector.getValue(),
            canSpread: effectCanSpread.getValue()
        })
        return aura
    }
    
    form.setValue = (aura) => {
        if(aura){
            effectArea.setValue(aura.area)
            effectDuration.setValue(aura.duration)
            effectTypeSelector.setValue(aura.effectType)
            effectValue.setValue(aura.value)
            effectTargetSelector.setValue(aura.targetList)
            effectCanSpread.setValue(aura.canSpread)
        }
    }

    return form
}

function createCastForm(parentId, intial = null){
    const form = document.createElement("div")
    form.classList.add('column');
    form.classList.add('vertical');
    form.classList.add('form-group');
    form.style.width = "100%"
    form.style.gap = "1rem"
    form.style.backgroundColor = formColor;

    const effectSpellSelect = createInputSpellSelect(parentId + '-aditional-effect-cast-spell-name', {
        initalLevel: database.serverRules.spells.min
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

    form.getValue = () => {
        const makeCast = new Cast({
            spell: effectSpellSelect.getValue(),
            targetList: effectTargetList.getValue()
        })
        return makeCast
    }

    form.setValue = (makeCast) => {
        if(makeCast){
            effectSpellSelect.setValue({mana: makeCast.mana, spellName: makeCast.spellName})
            effectTargetList.setValue(makeCast.targetList)
        }
    }

    return form
}

async function createSummonForm(parentId, initial = null){
    const form = document.createElement("div")
    form.classList.add('column');
    form.classList.add('vertical');
    form.classList.add('form-group');
    form.style.width = "100%"
    form.style.gap = "1rem"
    form.style.backgroundColor = formColor;

    const summonables = await sendRequest({type: "get", payload: {type: "summonables_id"}})

    if (summonables.success == false){
        userWarn("Summonables not found in database. Contant DM!")
        return null
    }

    const formSelectSummontId = createInputSelector('Summon Source:', Object.values(summonables.data), Object.keys(summonables.data), {
        id: parentId + '-summon-source',
        defaultValue: initial ? [initial.summonSource] : null
    });
    formSelectSummontId.classList.add('box-circular-border');
    form.appendChild(formSelectSummontId);

    const formSummonCastDuration = createInputDuration("Cast Duration: ", parentId + '-duration', {
        defaultValue: initial ? initial.castDuration : new Duration({type: durationTypes.INSTANT})
    });
    formSummonCastDuration.classList.add('box-circular-border');
    form.appendChild(formSummonCastDuration);

    const formSummonLocation = createInputSelector('Summon Location:', Object.values(summonLocations), Object.keys(summonLocations), {
        id: parentId + '-summon-location',
        defaultValue: initial ? [initial.summonLocation] : null
    })
    formSummonLocation.classList.add('box-circular-border');
    form.appendChild(formSummonLocation);

    const formSummonDuration = createInputDuration("Summon Duration: ", parentId + '-summon-duration', {
        defaultValue: initial ? initial.summonDuration : new Duration({type: durationTypes.NEXT_LONG_REST})
    });
    formSummonDuration.classList.add('box-circular-border');
    form.appendChild(formSummonDuration);

    const formSummonQuantitiy = createInputNumber("Summon Quantity: ", parentId + '-summon-quantity', {
        maxValue: 9999,
        minValue: 1,
        addIncrementButtons: true,
        defaultValue: initial ? initial.quantity : 1
    })
    formSummonQuantitiy.classList.add('box-circular-border');
    form.appendChild(formSummonQuantitiy);

    form.getValue = () => {
        const summon = new Summon({
            id: formSelectSummontId.getValue(),
            castDuration: formSummonCastDuration.getValue(),
            duration: formSummonDuration.getValue(),
            quantity: formSummonQuantitiy.getValue()
        })
        return summon
    }

    form.setValue = (summon) => {
        if(summon){
            formSelectSummontId.setValue(summon.id)
            formSummonCastDuration.setValue(summon.castDuration)
            formSummonDuration.setValue(summon.duration)
            formSummonQuantitiy.setValue(summon.quantity)
        }
    }

    return form
};