function save_CharacterSheet(id) {
    console.log(`saving characterSheet ${id}`);
}

function open_CharacterSheet(id) {
    const characterSheet = document.getElementById(id);
    if (characterSheet) {
        characterSheet.style.display = 'flex';
    }
}

// Function to close characterSheet
function close_CharacterSheet(id) {
    const characterSheet = document.getElementById(id);
    if (characterSheet) {
        characterSheet.style.display = 'none';
    }
}

function export_CharacterSheet(id) {
    console.log(`export characterSheet ${id}`);
}

function import_CharacterSheet(id) {
    console.log(`import characterSheet ${id}`);
}

function remove_CharacterSheet(id) {
    console.log(`removing characterSheet ${id}`);
    id.remove()
}

function open_CharacterCreatePage() {
    const characterCreateSheet = document.getElementById('character-create-sheet');
    characterCreateSheet.style.display = 'flex';
}

function open_ScreenWithId(id) {
    document.getElementById(id).style.left = '0';
}

function close_ScreenWithId(id) {
    document.getElementById(id).style.left = '-100%';
}