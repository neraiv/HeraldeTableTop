const storage = document.getElementById("ui-storage");

const menuBar = document.createElement("div");
menuBar.classList.add("menu-bar")
storage.appendChild(menuBar);

const menuName = document.createElement("div");
menuName.textContent = "Storage"; 
menuName.classList.add("menu-name")
menuBar.appendChild(menuName);

const closeButton = createImageButton(40, {icon: "arrow_circle_left"});
closeButton.id = "ui-storage-close-button";
closeButton.style.fontFamily = 'Material Icons Outlined';
menuBar.appendChild(closeButton);

const tabbedContainer = createTabbedContainer(3, ["Chars", "Env", "NPC"], "ui-storage-tabbed-container", false)
tabbedContainer.style.width = "96%";
tabbedContainer.style.height= "100%";
tabbedContainer.style.position = "relative"
tabbedContainer.style.top = "60px"
storage.appendChild(tabbedContainer);

const contentChars = getContentContainer(tabbedContainer, "Chars")
contentChars.innerHTML = ""
const contentEnv   = getContentContainer(tabbedContainer, "Env")
contentEnv.innerHTML = ""
const contentNPC    = getContentContainer(tabbedContainer, "NPC")
contentNPC.innerHTML = ""



// ACTIVE ----------------------------------------------------------------------------
storageButton.onclick = () => {
    if (storage.style.left !== "50px") {
        storage.style.left = "50px";
    } else {
        storage.style.left = "-330px";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    userKey = urlParams.get("key")

    startSyncTimer();
})