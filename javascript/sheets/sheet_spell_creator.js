function addSpellCreator(){
    const spellCreateSheet = document.createElement('div');
    spellCreateSheet.classList.add('spell-create-sheet');
    spellCreateSheet.classList.add('box-circular-border');
    spellCreateSheet.classList.add('column');
    spellCreateSheet.classList.add('vertical');
    spellCreateSheet.id ='spell-create-sheet';
    spellCreateSheet.style.maxWidth = '600px';

    const outerColumn = document.createElement('div');
    outerColumn.classList.add('column');
    outerColumn.classList.add('vertical');
    outerColumn.style.display = 'block';
    outerColumn.style.padding = '5px';
    outerColumn.style.gap = '10px';
    outerColumn.style.width = '95%';

    const innerColumn = document.createElement('div');
    innerColumn.classList.add('column');
    innerColumn.classList.add('vertical');
    innerColumn.style.padding = '5px';
    innerColumn.style.gap = '10px';
    innerColumn.style.width = '95%';
    innerColumn.style.height = '95%';
    innerColumn.style.overflowY = 'auto';

    const title = document.createElement('h3');
    title.textContent = 'Create a New';


    //new Spell(,,,,)
    //Name
    const nameForm = createStringInput('Name: ', 'create-spell-name')[0];
    nameForm.classList.add('box-circular-border');
    outerColumn.appendChild(nameForm);

    //Classess
    const classes = createSelectorInput(Object.values(classType), Object.keys(classType), null, null,'Avaliable Classes: ', 'create-spell-classes');
    classes.style.height = '400px';
    classes.classList.add('box-circular-border');
    innerColumn.appendChild(classes);

    //Used with stats
    const stats = createSelectorInput(Object.values(statType), Object.keys(statType), null, null, 'Used with: ', 'create-spell-stats');
    stats.classList.add('box-circular-border');
    innerColumn.appendChild(stats);

    // Damage types
    const damage_types = createSelectorInput(Object.values(damageType), Object.keys(damageType), null, null, 'Damage Types: ', 'create-spell-damage-types');
    damage_types.classList.add('box-circular-border');
    innerColumn.appendChild(damage_types);

    
    // Description
    const descriptionContainer = createStringInput('Description: ', 'create-spell-name', false, true);
    descriptionContainer[0].classList.add('box-circular-border');
    descriptionContainer[0].style.height = '100px';
    descriptionContainer[1][0].style.width = '70%';
    innerColumn.appendChild(descriptionContainer[0]);

    // Target Effects
    const target_effects = createAdditonalEffectBuildContainer('target');
    target_effects.classList.add('box-circular-border');
    innerColumn.appendChild(target_effects)

    // Addtional Effect
    const additional_effect = createAdditonalEffectBuildContainer('effect');
    additional_effect.classList.add('box-circular-border');
    innerColumn.appendChild(additional_effect);

    outerColumn.appendChild(innerColumn);

    spellCreateSheet.appendChild(title);
    spellCreateSheet.appendChild(outerColumn);

    userInterface.appendChild(spellCreateSheet);
    return spellCreateSheet;
}

function createAdditonalEffectBuildContainer(id){
    let effectList = {};
    const targetEffectContainer = document.createElement('div');
    targetEffectContainer.classList.add('row');
    targetEffectContainer.classList.add('centered');
    targetEffectContainer.style.width = '98%';

    const addedEffects = createSelector(Object.values(effectList), Object.values(effectList), null, 'spell-create-target-effects');
    addedEffects.multiple = true;
    addedEffects.style.width = '35%'

    const column1 = document.createElement('div');
    column1.classList.add('column');
    column1.classList.add('centered');
    column1.style.gap = '10px';
    column1.style.display = 'flex';

    column1.appendChild(createSelectorInput(Object.values(characterActions), Object.keys(characterActions), null, 'Action: ', 'create-spell-damage-types-'+id, false))
    column1.appendChild(createSelectorInput(Object.values(effectTypes), Object.keys(effectTypes), null, 'Action: ', 'create-spell-effect-'+id, false))

    const column2 = document.createElement('div');
    column2.classList.add('column');
    column2.classList.add('centered');
    column2.style.gap = '10px';
    column2.style.display = 'flex';

    
    const descriptionContainer = createStringInput('Description: ', 'create-spell-name', false, true);
    descriptionContainer[0].style.height = '100px';
    descriptionContainer[1][0].style.width = '70%';
    column2.appendChild(descriptionContainer[0]);
    //Name
    column2.appendChild(createNumberInput('Value: ', 'create-spell-value')[0]);

    targetEffectContainer.appendChild(addedEffects);
    targetEffectContainer.appendChild(column1);
    targetEffectContainer.appendChild(column2);
    return targetEffectContainer;
}