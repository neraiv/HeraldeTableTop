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

function createTalkSheetElement(index, title, id, type= "quest") {
    const container = document.createElement('div');
    container.classList.add('talk-sheet-element', 'row');

    // Index
    const indexSpan = document.createElement('span');
    indexSpan.textContent = index;
    indexSpan.style.minWidth = '20px';

    // Icon
    const iconName = type === "quest"? "book" : "chat";

    const icon = document.createElement('span');
    icon.classList.add('material-icon');
    icon.textContent = iconName;

    // Title
    const titleSpan = document.createElement('span');
    titleSpan.textContent = title;

    // Event Listener
    container.addEventListener('click', async (event) => {
        if(type === "quest"){
            const questSheet = await createQuestSheet(id)
            questSheet.style.left = event.clientX + "px";
            questSheet.style.top = event.clientY + "px";
            userInterface.appendChild(questSheet)
        }else if(type === "dialog"){
            displayDialog(id)
        } 
    });

    container.append(indexSpan, icon, titleSpan);
    return container;
}

function createNpcTalkSheet(npcId) {

    let talkSheet = document.getElementById(`talk-sheet-${npcId}`)

    if(talkSheet){
        talkSheet.style.top = "50%"
        talkSheet.style.left = "50%"
    }else{
        const npcData = database.npcs[npcId];
        talkSheet = document.createElement('div');
        talkSheet.id = `talk-sheet-${npcId}`;
        talkSheet.classList.add('talk-sheet', 'column', 'vertical');
        talkSheet.style.zIndex = uiZIndex;

        const topRow = addWinwowTopBar(talkSheet)
        topRow.style.justifyContent = "space-between";
        
        // Header
        const header = document.createElement('div');
        header.classList.add('row', 'space-between');
        
        const title = document.createElement('h2');
        title.textContent = npcData.name;
        topRow.appendChild(title);
        
        const closeBtn = createImageButton('28', {source: "url(static/images/menu-icons/close.png)", custom_padding: 4})
        closeBtn.onclick = () => talkSheet.remove();
        topRow.appendChild(closeBtn);
        
        // Content
        const content = document.createElement('div');
        content.classList.add('column', 'vertical', 'gap-10');
        talkSheet.appendChild(content)


        let optionNumber = 1;

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
                optionNumber++,
                quest.title,
                quest.id,
                'quest'
            );
            element.style.color = quest.completed ? '#00aa00' : '#aa0000';
            content.appendChild(element);
        }

        
        userInterface.appendChild(talkSheet);
    }

    return talkSheet
}