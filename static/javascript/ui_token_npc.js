function displayDialog(dialogId) {
    const dialogData = database.dialogs[dialogId];
    let dialog = document.getElementById(dialogId);

    // Create dialog if it doesn't exist
    if (!dialog) {
        dialog = document.createElement('div');
        dialog.id = dialogId;
        dialog.classList.add('dialog');
        document.body.appendChild(dialog);
    }

    // Clear previous content
    dialog.innerHTML = '';

    // Create dialog content
    const content = document.createElement('div');
    content.classList.add('dialog-content');
    content.textContent = dialogData.content;
    dialog.appendChild(content);

    // Create options
    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('dialog-options');
    
    dialogData.options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option.text;
        btn.classList.add('dialog-option');
        
        btn.addEventListener('click', () => {
            dialog.style.display = 'none';
            if (option.nextDialog) displayDialog(option.nextDialog);
            if (option.onSelect) option.onSelect();
        });
        
        optionsContainer.appendChild(btn);
    });

    dialog.appendChild(optionsContainer);
    dialog.style.display = 'block';
}

function createTalkSheetElement(index, title, dialogId, iconName = 'chat') {
    const container = document.createElement('div');
    container.classList.add('talk-sheet-element', 'row');
    container.dataset.dialogId = dialogId;

    // Index
    const indexSpan = document.createElement('span');
    indexSpan.textContent = index;
    indexSpan.style.minWidth = '20px';

    // Icon
    const icon = document.createElement('span');
    icon.classList.add('material-icon');
    icon.textContent = iconName;

    // Title
    const titleSpan = document.createElement('span');
    titleSpan.textContent = title;

    // Event Listener
    container.addEventListener('click', () => displayDialog(dialogId));

    container.append(indexSpan, icon, titleSpan);
    return container;
}

function createNpcTalkSheet(npcId) {
    const npcData = database.npcs[npcId];
    const talkSheet = document.createElement('div');
    talkSheet.id = `talk-sheet-${npcId}`;
    talkSheet.classList.add('talk-sheet', 'column', 'vertical');

    // Header
    const header = document.createElement('div');
    header.classList.add('row', 'space-between');
    
    const title = document.createElement('h2');
    title.textContent = npcData.name;
    header.appendChild(title);
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.onclick = () => talkSheet.remove();
    header.appendChild(closeBtn);

    // Content
    const content = document.createElement('div');
    content.classList.add('column', 'vertical', 'gap-10');

    // Dialogs
    // npcData.dialogs.forEach((dialog, index) => {
    //     content.appendChild(
    //         createTalkSheetElement(
    //             index + 1,
    //             dialog.title,
    //             dialog.id,
    //             'forum'
    //         )
    //     );
    // });

    // Quests

    for (const quest of Object.values(npcData.quests)){
        const element = createTalkSheetElement(
            npcData.dialogs.length + index + 1,
            quest.id,
            quest.introDialogId,
            'assignment'
        );
        element.style.color = quest.completed ? '#00aa00' : '#aa0000';
        content.appendChild(element);
    }


    talkSheet.append(header, content);
    userInterface.appendChild(talkSheet);
    
    // Add draggable functionality here
    // addDraggable(talkSheet, header);
}