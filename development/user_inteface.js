const userInterface = document.getElementById('user-interface');

const leftSideBar = document.createElement('div');
leftSideBar.classList.add('column');
leftSideBar.classList.add('vertical')
leftSideBar.style.position = 'absolute';
leftSideBar.style.backgroundColor = '#d3dae2';
leftSideBar.style.top = '0px';
leftSideBar.style.left = '0px';
leftSideBar.style.width = "50px";
leftSideBar.style.height = "100%";
leftSideBar.style.paddingTop = "5px";
leftSideBar.style.gap = "5px";
userInterface.appendChild(leftSideBar);

const settingsButton = createImageButton(40, {icon: "settings"})
settingsButton.id = "ui-settings-button"
settingsButton.style.fontFamily = 'Material Icons Outlined'
leftSideBar.appendChild(settingsButton);

const separator1 = document.createElement('div');
separator1.style.width = "100%";
separator1.style.height = "1px";
separator1.style.backgroundColor = 'red';
leftSideBar.appendChild(separator1);

const databaseButton = createImageButton(40, {icon: "storage"})
databaseButton.id = "ui-storage-button"
databaseButton.style.fontFamily = 'Material Icons Outlined'
leftSideBar.appendChild(databaseButton);

const spellBook = createImageButton(40, {icon: "menu_book"})
spellBook.id = "ui-spellbook-button"
spellBook.style.fontFamily = 'Material Icons Outlined'
leftSideBar.appendChild(spellBook);

const accountButton = createImageButton(40, {icon: "account_circle"})
accountButton.id = "ui-account-button"
accountButton.style.fontFamily = 'Material Icons Outlined'
leftSideBar.appendChild(accountButton);

const rightSideBar = document.createElement('div');
rightSideBar.classList.add('row');
rightSideBar.classList.add('vertical');
rightSideBar.style.justifyContent = "right";
rightSideBar.style.position = 'absolute';
rightSideBar.style.height = "40px";
rightSideBar.style.width = "100%";
rightSideBar.style.gap = "1px";
rightSideBar.style.bottom = '5px';
rightSideBar.style.right = '5px';
userInterface.appendChild(rightSideBar)


const chatButton = createImageButton(40, {icon: "chat"})
chatButton.id = "ui-chat-button"
chatButton.style.fontFamily = 'Material Icons Outlined'
rightSideBar.appendChild(chatButton);


