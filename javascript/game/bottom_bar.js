function addBottomBar(){
    const row = document.createElement('div');
    row.classList.add('row');
    row.classList.add('centered');
    row.classList.add('box-circular-border')
    row.style.backgroundColor = '#ddd';
    row.style.padding = '4px';
    row.style.gap = '5px';
    
    const openDriveImageBar = createImageButton(32, '💽');
    openDriveImageBar.addEventListener('click', () => {
        toggleSliding_SheetWithId(driveImagesBar.id);
    });

    const openChat = createImageButton(32, '💬');
    
    row.appendChild(openDriveImageBar);
    row.appendChild(openChat);

    bottomMenuBar.appendChild(row);
}