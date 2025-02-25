async function getQuestData(questId) {
    if (database.quests[questId]) {
        return database.quests[questId];
    } else {
        const questData = await sendRequest({ type: "quest", payload: { type: "get", id: questId } });

        if (questData.success === true) {
            database.quests[questId] = questData.data;
            return questData.data;
        } else {
            alert(questData.reason);
            return null;
        }
    }
}

async function createQuestSheet(questId) {
    const data = await getQuestData(questId);

    if (data) {
        const questSheet = document.createElement("div");
        questSheet.classList.add("quest-container");
        questSheet.style.backgroundImage = questPaperImgSrc;
        questSheet.style.zIndex = uiZIndex;

        const status = {
            badge: "",
            text: ""
        }
        
        if (data.status.disabled){
            status.badge = "disabled";
            status.text = "Disabled"
        }
        else if (data.status.completed){
            status.badge = "completed";
            status.text = "Completed"
        }else{
            status.badge = "in-progress";
            status.text = "In progress"
        }

        questSheet.innerHTML = `
            <div class="quest-id">ID: ${data.id}</div>
            <div class="quest-badge  ${status.badge}">${status.text}</div>
            <h2 class="quest-title">${data.title}</h2>
            <div class="quest-content">
                <p>${data.description}</p>
                <div> 
                    <h3>Objectives</h3>
                    <ul> 
                        ${data.objectives.map(element => `<li>${element}</li>`).join('')}
                    </ul>
                </div>
                <div> 
                    <h3>Rewards</h3>
                    <ul> 
                        ${Object.keys(data.rewards).map(key => `<li>${data.rewards[key]}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="quest-options">
                <button class="quest-button">Accept</button>
                <button class="quest-button">Decline</button>
                <button class="quest-button quest-close-button">Close</button>
            </div>`;

        // Close button event listener
        const closeButton = questSheet.querySelector(".quest-close-button");
        closeButton.addEventListener("click", () => {
            questSheet.remove(); // Removes the quest sheet from the DOM
        });

        return questSheet;
    }
}
