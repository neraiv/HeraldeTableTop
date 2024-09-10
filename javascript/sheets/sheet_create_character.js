function addCharacterCreateSheet(parent) {

    const id = `character-create-sheet`;
    const character = new Character(id);

    const characterSheet = document.createElement('div');
    characterSheet.id = id;

    characterSheet.classList.add('character-create-sheet')
    characterSheet.classList.add('box-circular-border')

    const header = document.createElement('h1');
    header.innerText = 'Create Account Sheet';

    const saveButton = document.createElement('button');
    saveButton.style.position = 'absolute';
    saveButton.style.bottom = '10px';
    saveButton.style.right = '10px';
    saveButton.type = 'submit';
    saveButton.innerText = 'Save';
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        save_CharacterSheet(characterSheet.id);
    });

    const closeButton = createImageButton(50, null, `${userIntarfaceSettings.FOLDER_MENUICONS+'/'+userIntarfaceSettings.ICON_CLOSEBAR}`);  
    closeButton.style.paddingRight = '10px';
    closeButton.onclick = () => toggleDisplay_SheetWithId(id, false);

    const topRow = document.createElement('div');
    topRow.classList.add('row');
    topRow.classList.add('centered');
    topRow.style.gap = '10px';
    topRow.style.width = '100%';

    const formTableColumn = document.createElement('div');
    formTableColumn.classList.add('column');
    formTableColumn.classList.add('horizontal');
    formTableColumn.style.width = '100%';
    formTableColumn.style.height = '100%';
    formTableColumn.style.overflowY = 'auto';
    formTableColumn.style.overflowX = 'hidden';

    // Contents
    const formTableRow = document.createElement('div');
    formTableRow.classList.add('row');
    formTableRow.classList.add('horizantal');
    formTableRow.style.position = 'relative';
    formTableRow.style.gap = '10px'
    formTableRow.style.width = '100%';
    formTableRow.style.height = '100%';
    formTableRow.style.overflowY = 'auto';

    addSpacer(formTableRow);
    createCharacterCreateSheet_FirstColumn(formTableRow, characterSheet, character, 400);
    createCharacterCreateSheet_SecondColumn(formTableRow, characterSheet, character, '600px');
    //createCharacterCreateSheet_SecondColumn(formTableRow, characterSheet, '70%');
    addSpacer(formTableRow);

    addSpacer(topRow);
    topRow.appendChild(header);
    addSpacer(topRow);
    topRow.appendChild(saveButton);
    topRow.appendChild(closeButton);
    formTableColumn.appendChild(topRow);
    formTableColumn.appendChild(formTableRow);
    characterSheet.appendChild(formTableColumn);

    parent.appendChild(characterSheet);
}

function createCharacterCreateSheet_FirstColumn(parent, characterSheet, character, width) {

    const formElementsPadding = 5;
    const form = document.createElement('div');
    form.style.width  = `${width + formElementsPadding}px`;
    form.style.display = 'block';

    const formElements = document.createElement('div');
    formElements.classList.add('box-circular-border');
    formElements.classList.add('column');
    formElements.classList.add('centered');
    formElements.style.gap = '5px';
    formElements.style.padding = `${formElementsPadding}px`;

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    imageContainer.style.backgroundColor = getRandomColor();
    imageContainer.style.width = '200px';
    imageContainer.style.height = '200px';
    
    const image = document.createElement('img')
    image.src = `${tokenPaths.DEFAULT_CHAR_PROFILE}`

    imageContainer.appendChild(image);

    function createFormGroup(id, label, type = 'text', isReadOnly = false) {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', id);
        labelElement.textContent = label;
        formGroup.appendChild(labelElement);
        addSpacer(formGroup);
        const inputElement = document.createElement('input');
        inputElement.type = type;
        inputElement.id = id;
        inputElement.name = id;

        if (isReadOnly) {
            inputElement.readOnly = true;
        }
        formGroup.appendChild(inputElement);

        if (['class', 'race'].some(key => id.includes(key))) {

            const selectButton = createImageButton(19, '\u25BC');  
            selectButton.onclick = (event) => {
                event.preventDefault();
                id.includes('class') ? open_ClassSelectSheet(characterSheet.id) : open_RaceSelectSheet(characterSheet.id);
            };
            formGroup.appendChild(selectButton);
        }
        else if (id.includes('stat') || id.includes('level')) {
            const controls = document.createElement('div');
            controls.className = 'number-controls';

            const max = id.includes('level') ? character.MAX_CHARACTER_LVL  : character.MAX_STAT_POINT ;
            const min = id.includes('level') ? character.MIN_CHARACTER_LVL  : character.MIN_STAT_POINT;

            inputElement.value = min;
            
            const size = labelElement.getBoundingClientRect();
            const buttonUp = createImageButton(19, '&#9650;');  
            buttonUp.onclick = function(event) {
                event.preventDefault();
                incrementWithId(id, 1);
                keepNumberInLimits(id, max, min);
            };

            const buttonDown = createImageButton(19, '&#9660;');  
            buttonDown.onclick = function(event) {
                event.preventDefault();
                incrementWithId(id, -1);
                keepNumberInLimits(id, max, min);
            };

            controls.appendChild(buttonUp);
            controls.appendChild(buttonDown);
            formGroup.appendChild(controls);

            if (id.includes('level')) {
                inputElement.oninput = function() {
                    keepNumberInLimits(id, max, min);
                };
            } else {
                inputElement.oninput = function() {
                    keepNumberInLimits(id, max, min);
                };
            }
        }

        return formGroup;
    }

    const formGroups = [
        { id: `character-create-name`, label: 'Character Name:'},
        { id: `character-create-class`, label: 'Class:' , isReadOnly: true},
        { id: `character-create-sub-class`, label: 'Sub Class(s):', type: 'text', isReadOnly: true},
        { id: `character-create-race`, label: 'Race:', isReadOnly: true},
        { id: `character-create-level`, label: 'Level:', type: 'number' },
        { id: `character-create-stat-strength`, label: 'Strength:', type: 'number' },
        { id: `character-create-stat-dexterity`, label: 'Dexterity:', type: 'number' },
        { id: `character-create-stat-constitution`, label: 'Constitution:', type: 'number' },
        { id: `character-create-stat-intelligence`, label: 'Intelligence:', type: 'number' },
        { id: `character-create-stat-wisdom`, label: 'Wisdom:', type: 'number' },
        { id: `character-create-stat-charisma`, label: 'Charisma:', type: 'number' }

    ];

    
    formElements.appendChild(imageContainer);
    formGroups.forEach(group => formElements.appendChild(createFormGroup(group.id, group.label, group.type, group.isReadOnly)));
    form.appendChild(formElements);
    parent.appendChild(form);
}

function createCharacterCreateSheet_SecondColumn(parent, characterSheet, character, width){

    const form = document.createElement('form');
    form.style.width  = width;
    form.classList.add('column');
    form.classList.add('box-circular-border');
    form.style.display = 'block';

    const column = document.createElement('div');
    column.className = 'column';
    column.style.overflowY = 'fixed';

    const spellColumn = document.createElement('div');
    spellColumn.className = 'column';
    spellColumn.style.overflowY = 'auto';
    spellColumn.style.maxHeight = '80%';

    const row = document.createElement('div');
    row.classList.add('row');
    row.classList.add('centered');
    row.style.minHeight = "20%"
    row.position = 'fixed';

    let selectedSpellLevel = 1;

    spellList = character.getKnownSpells(selectedSpellLevel);

    // Iterate through AVAILABLE_SPELL_LEVELS and append "/ known" if it's in LEARNED_SPELLS
    const levelSelect = createSelector(gameSettings.includedSpellLevels, gameSettings.includedSpellLevels);
    levelSelect.style.width = '5%';
    levelSelect.style.minWidth = '50px'
    levelSelect.style.maxWidth = '90px'
 
    const select = createSelector(spellList, spellList, 'select', characterSheet+'-spell-select', knownSpellString);
    select.style.width = '50%';
    select.style.maxWidth = '320px'
    const imageButton = createImageButton(24,'➕');

    imageButton.onclick = function(event){
        event.preventDefault();
        const currentSelectedSpell = select.value;
        createSpellContainer(spellColumn, selectedSpellLevelList, currentSelectedSpell, character);
    }

    levelSelect.addEventListener('change', function(event) {
        event.preventDefault();
        selectedSpellLevel = event.target.value;
        spellList = character.getKnownSpells(selectedSpellLevel);
        updateSelector(spellList, spellList, select, null, 'select', knownSpellString);
    });

    addSpacer(row);
    row.appendChild(levelSelect);
    addSpacer(row);
    row.appendChild(select);
    addSpacer(row);
    row.appendChild(imageButton);
    addSpacer(row);

    form.appendChild(row);
    form.appendChild(spellColumn);


    parent.appendChild(form);
}

function createSpellContainer(parent, spellList, spellName = null, character) {

    for (let spell of spellList){
        if(spellName != null){
            if(spell.name != spellName){
                continue;
            }
        }

        // Create elements
        const spellDiv = document.createElement('div');
        spellDiv.classList.add('spell');
        
        // Create the header
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('spell-header');

        const nameElement = document.createElement('div');
        nameElement.classList.add('spell-name');
        nameElement.textContent = spell.name;

        const classesElement = document.createElement('div');
        classesElement.classList.add('spell-classes');
        classesElement.textContent = `Available Classes: ${spell.availableClasses.join(', ')}`;
        
        headerDiv.appendChild(nameElement);
        headerDiv.appendChild(classesElement);

        const descriptionElement = document.createElement('div');
        descriptionElement.classList.add('spell-description');
        descriptionElement.textContent = `Description: ${spell.description}`;

        // Create the additional effects
        const effectsElement = document.createElement('div');
        effectsElement.classList.add('spell-effects');

        effectsElement.innerHTML = `<strong>Additional Effects:</strong><br>${Object.keys(characterSettings.AVAILABLE_SPELL_LEVELS).map(level => {  
            return spell.additionalEffects.getManaEffects(level);
        }).join('<br>')}`;

        // Append all parts to the spell container
        spellDiv.appendChild(headerDiv);
        spellDiv.appendChild(descriptionElement);
        spellDiv.appendChild(effectsElement);
        
        parent.appendChild(spellDiv);
    };
}







// function createCharacterCreateSheet_SecondColumn(parent, characterSheet, width){

//     let characterCreateSettings = JSON.parse(characterSheet.dataset.characterSettings);
   
//     const column = document.createElement('div');
//     column.classList.add('column');
//     column.classList.add('centered');
//     column.style.height = "100%";

//     const form = document.createElement('form');
//     form.classList.add('character-sheet-form');
//     form.style.overflowY = 'auto';

//     function createFormGroup(id, label, type = 'text', isReadOnly = false) {

//         if(id == "spacer"){
//             const spacer = document.createElement('div');
//             spacer.className = 'spacer';
//             return spacer;
//         }
//         const formGroup = document.createElement('div');
//         formGroup.className = 'form-group';

//         const labelElement = document.createElement('label');
//         labelElement.setAttribute('for', id);
//         labelElement.textContent = label;
//         formGroup.appendChild(labelElement);

//         const inputElement = document.createElement('input');
//         inputElement.type = type;
//         inputElement.id = id;
//         inputElement.name = id;

//         if (isReadOnly) {
//             inputElement.readOnly = true;
//         }
//         formGroup.appendChild(inputElement);

//         if (id.includes('stat') || id.includes('level')) {
//             const controls = document.createElement('div');
//             controls.className = 'number-controls';

//             const max = id.includes('level') ? characterCreateSettings.MAX_CHARACTER_LVL  : characterCreateSettings.MAX_STAT_POINT ;
//             const min = id.includes('level') ? characterCreateSettings.MIN_CHARACTER_LVL  : characterCreateSettings.MIN_STAT_POINT;

//             inputElement.value = min;
            
//             const size = labelElement.getBoundingClientRect();
//             const buttonUp = createImageButton(`${12}px`, '&#9650;');  
//             buttonUp.onclick = function(event) {
//                 event.preventDefault();
//                 incrementWithId(id, 1);
//                 keepNumberInLimits(id, max, min);
//             };

//             const buttonDown = createImageButton(`${12}px`, '&#9660;');  
//             buttonDown.onclick = function(event) {
//                 event.preventDefault();
//                 incrementWithId(id, -1);
//                 keepNumberInLimits(id, max, min);
//             };

//             controls.appendChild(buttonUp);
//             controls.appendChild(buttonDown);
//             formGroup.appendChild(controls);

//             if (id.includes('level')) {
//                 inputElement.oninput = function() {
//                     keepNumberInLimits(id, max, min);
//                 };
//             } else {
//                 inputElement.oninput = function() {
//                     keepNumberInLimits(id, max, min);
//                 };
//             }
//         }

//         return formGroup;
//     }

//     const formGroups = [
//         { id: `character-create-level`, label: 'Level:', type: 'number' },
//         { id: `spacer`},
//         { id: `character-create-stat-strength`, label: 'Strength:', type: 'number' },
//         { id: `spacer`},
//         { id: `character-create-stat-dexterity`, label: 'Dexterity:', type: 'number' },
//         { id: `spacer`},
//         { id: `character-create-stat-constitution`, label: 'Constitution:', type: 'number' },
//         { id: `spacer`},
//         { id: `character-create-stat-intelligence`, label: 'Intelligence:', type: 'number' },
//         { id: `spacer`},
//         { id: `character-create-stat-wisdom`, label: 'Wisdom:', type: 'number' },
//         { id: `spacer`},
//         { id: `character-create-stat-charisma`, label: 'Charisma:', type: 'number' }
//     ];

//     formGroups.forEach(group => {
//         column.appendChild(createFormGroup(group.id, group.label, group.type, group.isReadOnly));
//     });

//     form.appendChild(column);
//     parent.appendChild(form);
// }
