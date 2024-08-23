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
    form.className = 'character-sheet-form';
    form.style.overflowY = 'auto';
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    imageContainer.style.backgroundColor = getRandomColor();
    imageContainer.style.width = '200px';
    
    const image = document.createElement('img')
    image.className = `drive-image`;
    image.src = `${charImagesFolder}/${charImageFilesList[0]}`

    imageContainer.appendChild(image);

    column.appendChild(imageContainer);

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

        return formGroup;
    }

    const formGroups = [
        { id: `character-create-name`, label: 'Character Name:'},
        { id: `character-create-class`, label: 'Class:' , isReadOnly: true},
        { id: `character-create-sub-class`, label: 'Sub Class(s):', type: 'text', isReadOnly: true},
        { id: `character-create-race`, label: 'Race:', isReadOnly: true},
    ];

    formGroups.forEach(group => column.appendChild(createFormGroup(group.id, group.label, group.type, group.isReadOnly)));

    form.appendChild(column);
    parent.appendChild(form);
}

function createCharacterCreateSheet_SecondColumn(parent, characterSheet){

    let characterCreateSettings = JSON.parse(characterSheet.dataset.characterSettings);
   
    const column = document.createElement('div');
    column.className = 'column';

    const form = document.createElement('form');
    form.className = 'character-sheet-form';
    form.style.overflowY = 'auto';

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

        if (id.includes('stat') || id.includes('level')) {
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

function createCharacterCreateSheet_ThirdColumn(parent, characterSheet){

    let characterCreateSettings = JSON.parse(characterSheet.dataset.characterSettings);

    const form = document.createElement('form');
    form.className = 'character-sheet-form';

    const column = document.createElement('div');
    column.className = 'column';
    column.style.overflowY = 'auto';
    column.style.maxHeight = '100%';

    const row = document.createElement('div');
    row.className = 'row';
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
        createSpellContainer(column, selectedSpellLevelList, currentSelectedSpell, characterSheet);
    }

    row.appendChild(levelSelect);
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
    closeButton.style.position= 'absolute';
    closeButton.style.right= '10px';
    closeButton.style.top= '10px';

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
    createCharacterCreateSheet_ThirdColumn(columnRow, characterSheet);
    
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

function createTopBar() {
    const topBar = document.getElementById('drive-images-bar-top-bar');
    topBar.className = 'row';
    topBar.style.width = '95%'
    topBar.style.border = '2px solid';
    topBar.style.borderRadius = '10px';
    topBar.style.backgroundColor = 'gold';

    const label = document.createElement('div');
    label.innerText = 'Drive Images Bar';
    label.style.fontSize = '24px';
    label.style.paddingLeft = '10px';

    const closeButton = createImageButton(24, `<img src="${iconsFolder+icon_closeBar}" width="24" height="24">`);
    closeButton.onclick = () =>{
        togglePage('drive-images-bar', false);
    };

    const spacer1 = document.createElement('div');
    spacer1.className = 'spacer';

    topBar.appendChild(label);
    topBar.appendChild(spacer1);
    topBar.appendChild(closeButton);
}

function createBottomBar() {
    const bottomBarPageSelect = document.getElementById('bottom-bar-page-select');
    bottomBarPageSelect.className = 'row';

    const button1column = document.createElement('div');
    button1column.innerText = "Chars";
    button1column.className = 'column';
    button1column.style.gap = "3px";
    button1column.style.border = '2px solid';
    button1column.style.borderRadius = '10px';
    button1column.style.backgroundColor = 'gold';

    const button2column = document.createElement('div');
    button2column.innerText = "Log";
    button2column.className = 'column';
    button2column.style.gap = "3px";
    button2column.style.border = '2px solid';
    button2column.style.borderRadius = '10px';
    button2column.style.backgroundColor = 'gold';

    const button3column = document.createElement('div');
    button3column.innerText = "Some"
    button3column.className = 'column';
    button3column.style.gap = "3px";
    button3column.style.border = '2px solid';
    button3column.style.borderRadius = '10px';
    button3column.style.backgroundColor = 'gold';

    const characterPageButton = createImageButton(24, `<img src="${iconsFolder+icon_closeBar}" width="24" height="24" alt="Close">`);
    characterPageButton.style.paddingRight = '10px';
    characterPageButton.style.paddingLeft = '10px';
    characterPageButton.onclick = () => togglePage('drive-images-bar');
    button1column.appendChild(characterPageButton);

    const combatLogPageButton = createImageButton(24, `<img src="${iconsFolder+icon_closeBar}" width="24" height="24" alt="Close">`);
    combatLogPageButton.style.paddingRight = '10px';
    combatLogPageButton.style.paddingLeft = '10px';
    combatLogPageButton.onclick = () => togglePage(id);
    button2column.appendChild(combatLogPageButton);

    const someButton = createImageButton(24, `<img src="${iconsFolder+icon_closeBar}" width="24" height="24" alt="Close">`); 
    someButton.style.paddingRight = '10px';   
    someButton.style.paddingLeft = '10px';                 
    someButton.onclick = () => togglePage(id);
    button3column.appendChild(someButton);

    bottomBarPageSelect.appendChild(button1column);
    bottomBarPageSelect.appendChild(button2column);
    bottomBarPageSelect.appendChild(button3column);   
}

function togglePage(id, open= null) {
    const page = document.getElementById(id);
    if(open != null){
        if(open){
            page.style.left = '0%';
        }else{
            page.style.left = '-100%';
        }
        return;
    }

    if(page.style.left == '-100%'){
        page.style.left = '0%'; // Slide in the screen
    }else {
        page.style.left = '-100%'; // Slide out the screen
    }
}

function createGameBoardImage(parent, src, x, y){
    if (!document.getElementById(`token-${src.id}`)) {
        const img = document.createElement('img');
        img.src = src.src;
        img.id = `token-${src.id}`;
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
        img.className = src.className.replace("drive", "token");
        img.draggable = true;

        const image_size = 100
        
        if(layer.id == 'character-layer') {
            img.addEventListener('load', function() {
                // Set image size based on scaling factor and preserve aspect ratio
                setImageSize(img, image_size, image_size);
            });
        }

        const pageButton = document.createElement('button');
        const angle = 30* Math.PI / 180;
        const x = centerX + radius * Math.cos(angle) - 25; // 25 is half of button width/height
        const y = centerY + radius * Math.sin(angle) - 25;

        img.addEventListener('dragstart', function (event) {
            event.dataTransfer.setData("text/plain", event.target.id);
            event.dataTransfer.effectAllowed = "move";
        });

        img.addEventListener('dragend', function (event) {
            event.dataTransfer.setData("text/plain", event.target.id);
        });
        
        img.addEventListener("hover", function (event) {
            event.preventDefault();
        });

        parent.appendChild(img);

        // Store original positions
        objectsPositions.set(img.id, { x: x, y: y });
    }
}