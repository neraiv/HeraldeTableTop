function createCharacterSheet(parent) {

    if (!parent) {
        console.error('Parent element not found');
        return;
    }

    // Create the character sheet container
    const characterSheet = document.createElement('div');
    characterSheet.id = `${parent.id}-character-sheet`;
    characterSheet.className = 'character-sheet';

    // Create the content container
    const content = document.createElement('div');
    content.className = 'character-sheet-content';

    // Create the close button
    const closeButton = document.createElement('span');
    closeButton.className = 'close-btn';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => close_characterSheet(characterSheet.id);

    // Create the heading
    const heading = document.createElement('h1');
    heading.textContent = 'Character Sheet';

    // Create the form
    const form = document.createElement('form');
    form.id = 'character-sheet-form';

    // Function to create form groups
    function createFormGroup(id, label) {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', id);
        labelElement.textContent = label;
        formGroup.appendChild(labelElement);

        const inputElement = document.createElement('input');
        inputElement.type = 'number';
        inputElement.id = id;
        inputElement.name = id;
        formGroup.appendChild(inputElement);

        const controls = document.createElement('div');
        controls.className = 'number-controls';
        controls.innerHTML = `
            <button type="button" onclick="changeValue('${id}', 1)">&#9650;</button>
            <button type="button" onclick="changeValue('${id}', -1)">&#9660;</button>
        `;
        formGroup.appendChild(controls);

        return formGroup;
    }

    // Add form groups for character attributes
    form.appendChild(createFormGroup('character-name', 'Character Name:'));
    form.appendChild(createFormGroup('character-class', 'Class:'));
    form.appendChild(createFormGroup('character-race', 'Race:'));
    form.appendChild(createFormGroup('character-level', 'Level:'));
    form.appendChild(createFormGroup('character-strength', 'Strength:'));
    form.appendChild(createFormGroup('character-dexterity', 'Dexterity:'));
    form.appendChild(createFormGroup('character-constitution', 'Constitution:'));
    form.appendChild(createFormGroup('character-intelligence', 'Intelligence:'));
    form.appendChild(createFormGroup('character-wisdom', 'Wisdom:'));
    form.appendChild(createFormGroup('character-charisma', 'Charisma:'));

    // Create the save button
    const saveButton = createImageButton(24, '⬇️');
    saveButton.type = 'submit';
    saveButton.innerText = 'Save';

    saveButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default form submission
        save_characterSheet(characterSheet.id)
    });
    form.appendChild(saveButton);

    // Append the form to the content container
    content.appendChild(closeButton);
    content.appendChild(heading);
    content.appendChild(form);

    // Append the content container to the character sheet
    characterSheet.appendChild(content);

    // Append the character sheet to the parent element
    parent.appendChild(characterSheet);
}