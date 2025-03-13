async function  createAddNpcUI() {
    const reply = await getNpcs();

    if (reply.success === false) {
        alert("Can't get backgrounds data.")
    }

    const avaliableCharacters = reply.data

    uiAddNpc.style.display = 'block';

    const [uiAddNpcTopRow, uiAddNpcSheetTitle, uiAddNpcContent, uiAddNpcCloseButton] = addUIDefaults(uiAddNpc)
    
    uiAddNpcContent.innerHTML = ""; // Clear previous content
    uiAddNpcSheetTitle.textContent = uiSelections.selected;

    Object.entries(avaliableCharacters).forEach(([charId, details]) => {
        // Card container for each background
        const card = document.createElement("div");
        card.style.width = "250px";
        card.style.height = "auto";
        card.style.borderRadius = "12px";
        card.style.overflow = "hidden";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.alignItems = "center";
        card.style.justifyContent = "space-between";
        card.style.background = "#222";
        card.style.color = "white";
        card.style.padding = "10px";
        card.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";
        card.style.transition = "all 0.3s ease-in-out";

        // Background image (first layer by default)
        const image = document.createElement("img");
        image.src = `static/images/character/${charId}/${details[0]}`; // Fallback
        image.style.width = "100%";
        image.style.height = "200px";
        image.style.objectFit = "cover";
        image.style.borderRadius = "8px";
        image.draggable = false;

        // Title for the background
        const title = document.createElement("h3");
        title.textContent = charId;
        title.style.margin = "10px 0";

        // Append image, title, and layer container to card
        card.appendChild(image);
        card.appendChild(title);

        // Append the card to the UI adder
        uiAddNpcContent.appendChild(card);
    });

    uiAddNpcCloseButton.onclick = () => {
        uiAddNpc.style.display = 'none';
    }
}