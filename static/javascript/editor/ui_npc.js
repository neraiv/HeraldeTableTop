async function  createAddNpcUI() {
    const reply = await getNpcs();

    if (reply.success === false) {
        alert("Can't get backgrounds data.")
    }

    const avaliableCharacters = reply.data

    uiAddNpc.style.display = 'block';

    const [uiAddNpcTopRow, uiAddNpcSheetTitle, uiAddNpcContent, uiAddNpcCloseButton] = addUIDefaults(uiAddNpc)
    
    uiAddNpcContent.innerHTML = ""; // Clear previous content
    uiAddNpcSheetTitle.textContent = userInteractionData.selected;

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
        image.style.objectFit = "contain";
        image.style.borderRadius = "8px";
        image.draggable = false;

        // Title for the background
        const title = document.createElement("h3");
        title.textContent = charId;
        title.style.margin = "10px 0";

        // Append image, title, and layer container to card
        card.appendChild(image);
        card.appendChild(title);

        card.onclick = () => {
            if(document.getElementById(charId)){
                uiAddNpc.style.display = "none";
                userAskQuestion(
                    "Character is already in scene!",
                    "Would you like to add this character with different Id? This will create another character in database!",
                    {
                        buttons: ["Add With Different Id", "Dont Add"],
                        blocking: true,
                        callback: (buttonText) => {
                            if(buttonText === "Add With Different Id"){
                                userAskQuestion(
                                    "Id of new character.",
                                    "Enter new id",
                                    {
                                        inputType: "text",
                                        defaultValue: charId + "_copy",
                                    }
                                ).then((data) => {
                                    addNpcToken({
                                        id: data.value,
                                        src: image.src
                                    })  
                                })
                            }
                        }
                    }
                )
            }else{
                uiAddNpc.style.display = "none";
                addNpcToken({
                    id: charId,
                    src: image.src
                })  
            }
        }

        // Append the card to the UI adder
        uiAddNpcContent.appendChild(card);
    });

    uiAddNpcCloseButton.onclick = () => {
        uiAddNpc.style.display = 'none';
    }
}

async function addNpcToken({id, src}){
    const charToken = document.createElement("div")
    charToken.classList.add("character")
    charToken.id = id
    charToken.style.left = `${sceneData.width/2}px`
    charToken.style.top = `${sceneData.height/2}px`
    charToken.style.width = `${sceneData.grid_size}px`
    charToken.style.height = `${sceneData.grid_size}px`
    charToken.draggable = true

    charToken.style.backgroundImage = `url(${src})`;

    characterLayer.appendChild(charToken)

    editTokenShape(charToken)

    const [editShapeButton, editStatsButton, editQuestsButton, editDialogsButton, editEventsButton] = createEditButtons(
        charToken, 
        ["Shape", "Stats", "Quests", "Dialogs", "Events"]
    );

    editShapeButton.onclick = () => {
        editTokenShape(charToken);
    }

    editStatsButton.onclick = () => {
        editCharacterStats(charToken);
    }

    editQuestsButton.onclick = () => {
        editCharacterQuests(charToken);
    }

    editDialogsButton.onclick = () => {
        editCharacterDialogs(charToken);
    }

    editEventsButton.onclick = () => {
        editCharacterEvents(charToken);
    }
}