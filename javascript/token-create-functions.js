function createDriveImageContainer(fileName, classNamePrefix, imageFolder, targetElement) {
    // const container = document.createElement('div');
    // container.className = 'image-container';

    // Create image element
    const imageName = fileName.split('.')[0];
    // Create image element

    if (document.getElementById(`drive-${imageName}`)) {
        return
    }

    // Create a div to hold the image and buttons
    const imageAndButtonsContainer = document.createElement('div');
    imageAndButtonsContainer.id = `drive-${imageName}`
    imageAndButtonsContainer.className = 'image-and-buttons-container';

    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';
    targetElement.appendChild(imgContainer);

    const img = document.createElement('img');
    img.src = `${imageFolder}${fileName}`;
    img.className = `drive-${classNamePrefix}-image`;
    img.id = imageName;
    img.dataset.filename = imageName;
    img.draggable = true;

    // img.addEventListener('load', function() {
    //     // Set image size based on scaling factor and preserve aspect ratio
    //     const scalingFactor = getScalingFactor(targetElement, 80);
    //     setImageSize(img, scalingFactor.widthFactor, scalingFactor.heightFactor);
    // });

    img.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.filename);
        event.dataTransfer.effectAllowed = 'move';
    });

    // Append image to the container
    imgContainer.appendChild(img)
    imageAndButtonsContainer.appendChild(imgContainer);

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    // Create and append buttons with icons
    const defaultButton = createImageButton(24, '📄');
    if (classNamePrefix == 'character') {
        defaultButton.onclick = () => open_CharacterSheet(`${imageAndButtonsContainer.id}-character-sheet`);
    } else {
        defaultButton.onclick = () => open_BackgroundSheet(`${imageAndButtonsContainer.id}-character-sheet`);
    }
    buttonContainer.appendChild(defaultButton);

    const exportButton = createImageButton(24, '⬇️');
    if (classNamePrefix == 'character') {
        exportButton.onclick = () => export_CharacterSheet(`${imageAndButtonsContainer.id}-character-sheet`);
    } else {
        exportButton.onclick = () => export_BackgroundSheet(`${imageAndButtonsContainer.id}-character-sheet`);
    }
    buttonContainer.appendChild(exportButton);

    const importButton = createImageButton(24, '⬆️');
    if (classNamePrefix == 'character') {
        importButton.onclick = () => import_CharacterSheet(`${imageAndButtonsContainer.id}-character-sheet`);
    } else {
        importButton.onclick = () => import_BackgroundSheet(`${imageAndButtonsContainer.id}-character-sheet`);
    }
    buttonContainer.appendChild(importButton);

    const removeButton = createImageButton(24, '❌');
    if (classNamePrefix == 'character') {
        removeButton.onclick = () => remove_CharacterSheet(imageAndButtonsContainer);
    } else {
        removeButton.onclick = () => remove_BackgroundSheet(imageAndButtonsContainer);
    }
    buttonContainer.appendChild(removeButton);


    // Append button container to the main container
    imageAndButtonsContainer.appendChild(buttonContainer);

    if (classNamePrefix == 'character'){
        createCharacterSheet(imageAndButtonsContainer);
        //createCharacterCreateSheet(imageAndButtonsContainer);
    }
    
    // Append the main container to the target element
    targetElement.appendChild(imageAndButtonsContainer);
}


function createCharacterSheet(parent) {
    const characterSheet = document.createElement('div');
    characterSheet.id = `${parent.id}-character-sheet`;
    characterSheet.className = 'character-sheet';

    const button = document.createElement('button');
    button.textContent = 'Save';

    button.onclick = function(event){
        event.preventDefault();
        selectedCharacterSheetId = characterSheet.id;
        open_CharacterCreatePage();
    }

    characterSheet.appendChild(button);

    parent.appendChild(characterSheet);
}

function createCharacterCreateSheet_FirstColumn(parent){
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

            const buttonUp = document.createElement('button');
            buttonUp.innerHTML = '&#9650;';
            buttonUp.onclick = function(event) {
                event.preventDefault();
                inrementWithId(id, 1);
                const max = id.includes('level') ? MAX_CHARACTER_LVL : MAX_STAT_POINT;
                const min = id.includes('level') ? MIN_CHARACTER_LVL : MIN_STAT_POINT;
                keepNumberInLimits(document.getElementById(id), max, min);
            };

            const buttonDown = document.createElement('button');
            buttonDown.innerHTML = '&#9660;';
            buttonDown.onclick = function(event) {
                event.preventDefault();
                inrementWithId(id, -1);
                const max = id.includes('level') ? MAX_CHARACTER_LVL : MAX_STAT_POINT;
                const min = id.includes('level') ? MIN_CHARACTER_LVL : MIN_STAT_POINT;
                keepNumberInLimits(document.getElementById(id), max, min);
            };

            controls.appendChild(buttonUp);
            controls.appendChild(buttonDown);
            formGroup.appendChild(controls);

            if (id.includes('level')) {
                inputElement.oninput = function() {
                    keepNumberInLimits(this, MAX_CHARACTER_LVL, MIN_CHARACTER_LVL);
                };
            } else {
                inputElement.oninput = function() {
                    keepNumberInLimits(this, MAX_STAT_POINT, MIN_STAT_POINT);
                };
            }
        }

        return formGroup;
    }

    const formGroups = [
        { id: `${parent.id}-character-name`, label: 'Character Name:'},
        { id: `${parent.id}-character-class`, label: 'Class:' , isReadOnly: true},
        { id: `${parent.id}-character-sub-class`, label: 'Sub Class(s):', type: 'text', isReadOnly: true},
        { id: `${parent.id}-character-race`, label: 'Race:', isReadOnly: true},
        { id: `${parent.id}-character-level`, label: 'Level:', type: 'number' },
        { id: `${parent.id}-character-stat-strength`, label: 'Strength:', type: 'number' },
        { id: `${parent.id}-character-stat-dexterity`, label: 'Dexterity:', type: 'number' },
        { id: `${parent.id}-character-stat-constitution`, label: 'Constitution:', type: 'number' },
        { id: `${parent.id}-character-stat-intelligence`, label: 'Intelligence:', type: 'number' },
        { id: `${parent.id}-character-stat-wisdom`, label: 'Wisdom:', type: 'number' },
        { id: `${parent.id}-character-stat-charisma`, label: 'Charisma:', type: 'number' }
    ];

    formGroups.forEach(group => column.appendChild(createFormGroup(group.id, group.label, group.type, group.isReadOnly)));

    form.appendChild(column);
    parent.appendChild(form);
}

function createCharacterCreateSheet_SecondColumn(parent){
    const form = document.createElement('form');
    form.className = 'character-sheet-spell-form';

    const column = document.createElement('div');
    column.className = 'column';
    column.style.height = '100%';
    column.style.alignItems = 'flex-start'

    const row = document.createElement('div');
    row.className = 'row';
    row.style.alignItems = 'flex-start'

    const select = createSelector(spells_list.map(spell => spell.name), spells_list.map(spell => spell.name), 'select');
    select.id = 'spell-list';
    const imageButton = createImageButton(24,'➕');

    imageButton.onclick = function(event){
        event.preventDefault();
        const currentSelectedSpell = document.getElementById('spell-list').value;
        createSpellContainer(column, spells_list, currentSelectedSpell);
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
    characterSheet.className = 'character-sheet';

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

    createCharacterCreateSheet_FirstColumn(columnRow);
    createCharacterCreateSheet_SecondColumn(columnRow);

    characterSheetContent.appendChild(closeButton);
    characterSheetContent.appendChild(header);
    characterSheetContent.appendChild(columnRow);

    characterSheet.appendChild(characterSheetContent);
    parent.appendChild(characterSheet);
}

function createSpellContainer(parent, spellList, spellName = null) {

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

        effectsElement.innerHTML = `<strong>Additional Effects:</strong><br>${allLevels.map(level => {  
            return spell.additionalEffects.getManaEffects(level);
        }).join('<br>')}`;

        // Append all parts to the spell container
        spellDiv.appendChild(headerDiv);
        spellDiv.appendChild(descriptionElement);
        spellDiv.appendChild(effectsElement);
        
        parent.appendChild(spellDiv);
    };
}