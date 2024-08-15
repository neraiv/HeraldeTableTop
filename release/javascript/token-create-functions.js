function createCharacterSheet(parent) {
    const characterSheet = document.createElement('div');
    characterSheet.id = `${parent.id}-character-sheet`;
    characterSheet.className = 'character-sheet';

    const button = document.createElement('button');
    button.textContent = 'New';

    button.onclick = function(event){
        event.preventDefault();
        selectedCharacterSheetId = characterSheet.id;
        open_CharacterCreatePage();
    }
    const exitButton = document.createElement('button');
    exitButton.textContent = 'Exit';

    exitButton.onclick = function(event){
        event.preventDefault();
        selectedCharacterSheetId = characterSheet.id;
        close_CharacterSheet(selectedCharacterSheetId);
    }

    characterSheet.appendChild(button);
    characterSheet.appendChild(exitButton);

    parent.appendChild(characterSheet);
}

function createCharacterCreateSheet_FirstColumn(parent, characterSheet){

    let characterCreateSettings = JSON.parse(characterSheet.dataset.characterSettings);
   
    const column = document.createElement('div');
    column.className = 'column';

    const form = document.createElement('form');
    form.className = 'character-sheet-form-1';

    function createFormGroup(id, label, type = 'text', isReadOnly = false) {
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
        else if (id.includes('level') || id.includes('stat')) {
            const controls = document.createElement('div');
            controls.className = 'number-controls';

            const max = id.includes('level') ? characterCreateSettings.MAX_CHARACTER_LVL  : characterCreateSettings.MAX_STAT_POINT ;
            const min = id.includes('level') ? characterCreateSettings.MIN_CHARACTER_LVL  : characterCreateSettings.MIN_STAT_POINT;

            inputElement.value = min;
            
            const buttonUp = document.createElement('button');
            buttonUp.innerHTML = '&#9650;';
            buttonUp.onclick = function(event) {
                event.preventDefault();
                incrementWithId(id, 1);
                keepNumberInLimits(id, max, min);
            };

            const buttonDown = document.createElement('button');
            buttonDown.innerHTML = '&#9660;';
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

    formGroups.forEach(group => column.appendChild(createFormGroup(group.id, group.label, group.type, group.isReadOnly)));

    form.appendChild(column);
    parent.appendChild(form);
}

function createCharacterCreateSheet_SecondColumn(parent, characterSheet){
    const form = document.createElement('form');
    form.className = 'character-sheet-spell-form';


    const column = document.createElement('div');
    column.className = 'column';
    column.style.height = '100%';
    column.style.width  = '95%'

    const row = document.createElement('div');
    row.className = 'row';
    row.style.width  = '95%'


    const select = createSelector(level2_spell_list.map(spell => spell.name), level2_spell_list.map(spell => spell.name), 'select');
    const imageButton = createImageButton(24,'➕');

    imageButton.onclick = function(event){
        event.preventDefault();
        const currentSelectedSpell = select.value;
        createSpellContainer(column, level2_spell_list, currentSelectedSpell, characterSheet);
    }

    row.appendChild(select);
    row.appendChild(imageButton);

    form.appendChild(row);
    form.appendChild(column);


    parent.appendChild(form);
}

function createCharacterCreateSheet(parent) {
    const characterSheet = document.createElement('div');
    characterSheet.id = `character-create-sheet`;
    characterSheet.className = 'character-create-sheet';

    const characterCreateSettings = new Character(characterSheet.id);
    characterSheet.dataset.characterSettings = JSON.stringify(characterCreateSettings);

    const characterSheetContent = document.createElement('div');
    characterSheetContent.className = 'character-sheet-content';

    const closeButton = createImageButton(24, '✕');
    Object.assign(closeButton.style, {
        position: 'absolute',
        right: '10px',
        top: '10px'
    });

    closeButton.onclick = () => close_CharacterSheet(characterSheet.id);

    const header = document.createElement('h1');
    header.innerText = 'Create Character Sheet';

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

    createCharacterCreateSheet_FirstColumn(columnRow, characterSheet);
    createCharacterCreateSheet_SecondColumn(columnRow, characterSheet);
    
    characterSheetContent.appendChild(closeButton);
    characterSheetContent.appendChild(header);
    characterSheetContent.appendChild(columnRow);

    characterSheet.appendChild(characterSheetContent);
    parent.appendChild(characterSheet);
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

        effectsElement.innerHTML = `<strong>Additional Effects:</strong><br>${characterSettings.AVALIABLE_SPELL_LEVELS.map(level => {  
            return spell.additionalEffects.getManaEffects(level);
        }).join('<br>')}`;

        // Append all parts to the spell container
        spellDiv.appendChild(headerDiv);
        spellDiv.appendChild(descriptionElement);
        spellDiv.appendChild(effectsElement);
        
        parent.appendChild(spellDiv);
    };
}