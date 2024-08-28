function addCharacterSheet(parent, id) {
    const characterSheet = document.createElement('div');
    characterSheet.id = id;
    characterSheet.className = 'character-sheet';

    const newCharButton = document.createElement('button');
    newCharButton.textContent = 'New';

    const characterSheetData = document.createElement('div');
    characterSheetData.id = id + '-data'
    const characterData = new Character(id);
    characterSheetData.dataset.characterData = JSON.stringify(characterData);


    newCharButton.onclick = function(event){
        event.preventDefault();
        selectedCharacterSheetId = characterSheet.id;
        toggleDisplay_SheetWithId("character-create-sheet", true);
    }

    const exitButton = document.createElement('button');
    exitButton.textContent = 'Exit';

    exitButton.onclick = function(event){
        event.preventDefault();
        selectedCharacterSheetId = characterSheet.id;
        toggleDisplay_SheetWithId(characterSheet.id, false);
    }

    characterSheet.appendChild(characterSheetData);
    characterSheet.appendChild(newCharButton);
    characterSheet.appendChild(exitButton);

    parent.appendChild(characterSheet);
}