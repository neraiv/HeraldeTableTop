function createCharacterCreateSheet_FirstColumn(parent, characterSheet, width){
    let characterCreateSettings = JSON.parse(characterSheet.dataset.characterSettings);

    const form = document.createElement('form');
    form.className = 'character-sheet-form';
    form.classList.add('box-circular-border');
    form.style.width  = width;
    form.style.height = "100%";
    form.style.flexGrow = "1";

    const column = document.createElement('div');
    column.classList.add('column');
    column.classList.add('centered');
    column.style.height = "100%";
    column.style.gap = '10px';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    imageContainer.style.backgroundColor = getRandomColor();
    imageContainer.style.width = '200px';
    
    const image = document.createElement('img')
    image.src = `${tokenPaths.DEFAULT_CHAR_PROFILE}`

    imageContainer.appendChild(image);

    column.appendChild(imageContainer);

    function createFormGroup(id, label, type = 'text', isReadOnly = false) {

        if(id == "spacer"){
            const spacer = document.createElement('div');
            spacer.className = 'spacer';
            return spacer;
        }

        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', id);
        labelElement.textContent = label;
        formGroup.appendChild(labelElement);

        const inputElement = document.createElement('input');
        inputElement.type = type;
        inputElement.id = id;
        inputElement.name = id;

        if (isReadOnly) {
            inputElement.readOnly = true;
        }
        formGroup.appendChild(inputElement);

        if(id.includes('name')){
            inputElement.style.width = '150px';
        }
        else if (['class', 'race'].some(key => id.includes(key))) {
            inputElement.style.width = '150px';

            const selectButton = document.createElement('button');
            selectButton.className = 'image-button';
            selectButton.appendChild(document.createTextNode('\u25BC'));
            selectButton.onclick = (event) => {
                event.preventDefault();
                id.includes('class') ? open_ClassSelectSheet(characterSheet.id) : open_RaceSelectSheet(characterSheet.id);
            };
            formGroup.appendChild(selectButton);
        }
        else if (id.includes('stat') || id.includes('level')) {
            const controls = document.createElement('div');
            controls.className = 'number-controls';

            const max = id.includes('level') ? characterCreateSettings.MAX_CHARACTER_LVL  : characterCreateSettings.MAX_STAT_POINT ;
            const min = id.includes('level') ? characterCreateSettings.MIN_CHARACTER_LVL  : characterCreateSettings.MIN_STAT_POINT;

            inputElement.value = min;
            
            const size = labelElement.getBoundingClientRect();
            const buttonUp = createImageButton(`${12}px`, '&#9650;');  
            buttonUp.onclick = function(event) {
                event.preventDefault();
                incrementWithId(id, 1);
                keepNumberInLimits(id, max, min);
            };

            const buttonDown = createImageButton(`${12}px`, '&#9660;');  
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
        { id: `spacer`},
        { id: `character-create-stat-strength`, label: 'Strength:', type: 'number' },
        { id: `spacer`},
        { id: `character-create-stat-dexterity`, label: 'Dexterity:', type: 'number' },
        { id: `spacer`},
        { id: `character-create-stat-constitution`, label: 'Constitution:', type: 'number' },
        { id: `spacer`},
        { id: `character-create-stat-intelligence`, label: 'Intelligence:', type: 'number' },
        { id: `spacer`},
        { id: `character-create-stat-wisdom`, label: 'Wisdom:', type: 'number' },
        { id: `spacer`},
        { id: `character-create-stat-charisma`, label: 'Charisma:', type: 'number' }
    ];

    formGroups.forEach(group => column.appendChild(createFormGroup(group.id, group.label, group.type, group.isReadOnly)));

    form.appendChild(column);
    parent.appendChild(form);
}

function createCharacterCreateSheet_SecondColumn(parent, characterSheet, width){

    let characterCreateSettings = JSON.parse(characterSheet.dataset.characterSettings);
   
    const column = document.createElement('div');
    column.classList.add('column');
    column.classList.add('centered');
    column.style.height = "100%";

    const form = document.createElement('form');
    form.classList.add('character-sheet-form');
    form.style.overflowY = 'auto';

    function createFormGroup(id, label, type = 'text', isReadOnly = false) {

        if(id == "spacer"){
            const spacer = document.createElement('div');
            spacer.className = 'spacer';
            return spacer;
        }
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', id);
        labelElement.textContent = label;
        formGroup.appendChild(labelElement);

        const inputElement = document.createElement('input');
        inputElement.type = type;
        inputElement.id = id;
        inputElement.name = id;

        if (isReadOnly) {
            inputElement.readOnly = true;
        }
        formGroup.appendChild(inputElement);

        if (id.includes('stat') || id.includes('level')) {
            const controls = document.createElement('div');
            controls.className = 'number-controls';

            const max = id.includes('level') ? characterCreateSettings.MAX_CHARACTER_LVL  : characterCreateSettings.MAX_STAT_POINT ;
            const min = id.includes('level') ? characterCreateSettings.MIN_CHARACTER_LVL  : characterCreateSettings.MIN_STAT_POINT;

            inputElement.value = min;
            
            const size = labelElement.getBoundingClientRect();
            const buttonUp = createImageButton(`${12}px`, '&#9650;');  
            buttonUp.onclick = function(event) {
                event.preventDefault();
                incrementWithId(id, 1);
                keepNumberInLimits(id, max, min);
            };

            const buttonDown = createImageButton(`${12}px`, '&#9660;');  
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
        { id: `character-create-level`, label: 'Level:', type: 'number' },
        { id: `spacer`},
        { id: `character-create-stat-strength`, label: 'Strength:', type: 'number' },
        { id: `spacer`},
        { id: `character-create-stat-dexterity`, label: 'Dexterity:', type: 'number' },
        { id: `spacer`},
        { id: `character-create-stat-constitution`, label: 'Constitution:', type: 'number' },
        { id: `spacer`},
        { id: `character-create-stat-intelligence`, label: 'Intelligence:', type: 'number' },
        { id: `spacer`},
        { id: `character-create-stat-wisdom`, label: 'Wisdom:', type: 'number' },
        { id: `spacer`},
        { id: `character-create-stat-charisma`, label: 'Charisma:', type: 'number' }
    ];

    formGroups.forEach(group => {
        column.appendChild(createFormGroup(group.id, group.label, group.type, group.isReadOnly));
    });

    form.appendChild(column);
    parent.appendChild(form);
}

function createCharacterCreateSheet_ThirdColumn(parent, characterSheet, width){

    let characterCreateSettings = JSON.parse(characterSheet.dataset.characterSettings);

    const form = document.createElement('form');
    form.classList.add('character-sheet-form');
    form.classList.add('box-circular-border');
    form.style.width  = width;
    form.style.height = "100%";

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

    let selectedSpellLevelList = level1_spell_list;

    const learnedSpells = characterCreateSettings.LEARNED_SPELLS;

    // Iterate through AVAILABLE_SPELL_LEVELS and append "/ known" if it's in LEARNED_SPELLS
    const spellList = selectedSpellLevelList.map(spell => {
        if (learnedSpells.includes(spell.name)) {
            return `${spell.name} / known`;
        }
        return spell.name;
    });

    const levelSelect = createSelector(Object.keys(characterCreateSettings.AVAILABLE_SPELL_LEVELS), Object.keys(characterCreateSettings.AVAILABLE_SPELL_LEVELS), null);
    levelSelect.style.width = '5%';
    levelSelect.style.minWidth = '50px'
    levelSelect.style.maxWidth = '90px'
    levelSelect.addEventListener('change', function(event) {
        event.preventDefault();
        let valueList;
        let textList;
        if(event.target.value == '1'){
            valueList = level1_spell_list.map(spell => spell.name);
            textList = level1_spell_list.map(spell => spell.name);
            selectedSpellLevelList = level1_spell_list;
        }
        else if(event.target.value == '2'){
            valueList = level2_spell_list.map(spell => spell.name);
            textList = level2_spell_list.map(spell => spell.name);
            selectedSpellLevelList = level2_spell_list;
        }
        updateSelector(valueList, textList, 'select',characterSheet+'-spell-select');
    });

    const select = createSelector(selectedSpellLevelList.map(spell => spell.name), spellList, 'select', characterSheet+'-spell-select');
    select.style.width = '50%';
    select.style.maxWidth = '320px'
    const imageButton = createImageButton(24,'➕');

    imageButton.onclick = function(event){
        event.preventDefault();
        const currentSelectedSpell = select.value;
        createSpellContainer(spellColumn, selectedSpellLevelList, currentSelectedSpell, characterSheet);
    }

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

function createSpellContainer(parent, spellList, spellName = null, characterSheet) {

    let characterSettings = JSON.parse(characterSheet.dataset.characterSettings);
    
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

function addCharacterCreateSheet(parent) {
    const characterSheet = document.createElement('div');
    characterSheet.id = `character-create-sheet`;
    characterSheet.className = 'character-create-sheet';

    const characterCreateSettings = new Character(characterSheet.id);
    characterSheet.dataset.characterSettings = JSON.stringify(characterCreateSettings);

    const characterSheetContent = document.createElement('div');
    characterSheetContent.classList.add('character-sheet-content')
    characterSheetContent.classList.add('box-circular-border')
    characterSheetContent.style.overflowY = 'auto';

    const closeButton = createImageButton(24, null, `${userIntarfaceSettings.FOLDER_MENUICONS+'/'+userIntarfaceSettings.ICON_CLOSEBAR}`);  
    closeButton.style.position= 'absolute';
    closeButton.style.right= '10px';
    closeButton.style.top= '10px';
    closeButton.onclick = () => toggleDisplay_SheetWithId(characterSheet.id, false);

    const column = document.createElement('div');
    column.classList.add('column');
    column.classList.add('centered');
    column.style.width = '100%';

    const header = document.createElement('h1');
    header.innerText = 'Create Account Sheet';

    const saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.innerText = 'Save';
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        save_CharacterSheet(characterSheet.id);
    });

    // Contents
    const columnRow = document.createElement('div');
    columnRow.className = 'row';
    column.classList.add('centered');
    columnRow.style.width = '100%';

    addSpacer(columnRow);
    createCharacterCreateSheet_FirstColumn(columnRow, characterSheet, '30%');
    addSpacer(columnRow);
    //createCharacterCreateSheet_SecondColumn(columnRow, characterSheet, '70%');
    createCharacterCreateSheet_ThirdColumn(columnRow, characterSheet, '60%');
    addSpacer(columnRow);
    
    characterSheetContent.appendChild(closeButton);
    column.appendChild(header);
    column.appendChild(columnRow);
    characterSheetContent.appendChild(column);

    characterSheet.appendChild(characterSheetContent);
    parent.appendChild(characterSheet);
}

