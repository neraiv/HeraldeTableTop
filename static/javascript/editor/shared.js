async function editTokenShape(token) {
    // Create the pop-up container
    const editPopup = document.createElement("div");
    editPopup.style.position = "fixed";
    editPopup.style.top = "50%";
    editPopup.style.left = "50%";
    editPopup.style.transform = "translate(-50%, -50%)";
    editPopup.style.width = "300px";
    editPopup.style.padding = "20px";
    editPopup.style.backgroundColor = "#fff";
    editPopup.style.borderRadius = "10px";
    editPopup.style.boxShadow = "0px 8px 20px rgba(0, 0, 0, 0.3)";
    editPopup.style.zIndex = "1000";

    // Create input fields for token properties

    function createLabeledInput(labelText, inputType, initialValue) {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.justifyContent = "space-between";
        wrapper.style.marginBottom = "10px";

        const input = document.createElement("input");
        input.type = inputType;
        input.value = initialValue;
        input.style.width = "60%";
        input.style.marginRight = "10px";

        const label = document.createElement("span");
        label.textContent = labelText;
        label.style.fontSize = "0.9em";
        label.style.color = "#555";

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        editPopup.appendChild(wrapper);

        return input;
    }

    const srcInput = createLabeledInput("Image URL", "text", token.style.backgroundImage.replace(/url\((['"])?|(['"])?\)/g, ''));
    const topInput = createLabeledInput("Top (px)", "number", parseInt(token.style.top, 10) || 0);
    const leftInput = createLabeledInput("Left (px)", "number", parseInt(token.style.left, 10) || 0);
    const widthInput = createLabeledInput("Width (px)", "number", parseInt(token.style.width, 10) || 100);
    const heightInput = createLabeledInput("Height (px)", "number", parseInt(token.style.height, 10) || 100);

    // Checkbox for keeping width/height ratio
    const ratioCheckboxWrapper = document.createElement("div");
    ratioCheckboxWrapper.style.display = "flex";
    ratioCheckboxWrapper.style.alignItems = "center";
    ratioCheckboxWrapper.style.marginBottom = "10px";

    const ratioCheckbox = document.createElement("input");
    ratioCheckbox.type = "checkbox";
    ratioCheckbox.id = "keepRatio";
    // Default to checked if a valid image is loaded
    ratioCheckbox.checked = true;
    ratioCheckboxWrapper.appendChild(ratioCheckbox);

    const ratioLabel = document.createElement("label");
    ratioLabel.htmlFor = "keepRatio";
    ratioLabel.textContent = "Keep width/height ratio";
    ratioLabel.style.marginLeft = "5px";
    ratioCheckboxWrapper.appendChild(ratioLabel);

    editPopup.appendChild(ratioCheckboxWrapper);

    // Live preview of changes
    const previewChanges = document.createElement("div");
    previewChanges.style.marginBottom = "10px";
    previewChanges.style.fontSize = "0.9em";
    previewChanges.style.color = "#555";
    editPopup.appendChild(previewChanges);

    // Track the natural aspect ratio of the image
    let aspectRatio = null;
    function updateAspectRatio() {
        const tempImg = new Image();
        tempImg.onload = function () {
            aspectRatio = tempImg.naturalHeight / tempImg.naturalWidth;
            // When the ratio checkbox is enabled, update the height based on current width
            if (ratioCheckbox.checked) {
                const newWidth = parseInt(widthInput.value, 10);
                if (!isNaN(newWidth) && aspectRatio) {
                    heightInput.value = Math.round(newWidth * aspectRatio);
                }
            }
        };
        tempImg.src = srcInput.value;
    }
    // Initial aspect ratio calculation
    updateAspectRatio();

    // Update aspect ratio when the source changes
    srcInput.addEventListener("change", () => {
        updateAspectRatio();
    });

    // If "keep ratio" is checked, update height when width changes
    widthInput.addEventListener("input", () => {
        if (ratioCheckbox.checked && aspectRatio) {
            const newWidth = parseInt(widthInput.value, 10);
            if (!isNaN(newWidth)) {
                heightInput.value = Math.round(newWidth * aspectRatio);
            }
        }
    });

    // When toggling the ratio checkbox, update the height if needed
    ratioCheckbox.addEventListener("change", () => {
        if (ratioCheckbox.checked && aspectRatio) {
            const newWidth = parseInt(widthInput.value, 10);
            if (!isNaN(newWidth)) {
                heightInput.value = Math.round(newWidth * aspectRatio);
            }
        }
    });

    // Create a button to save the changes
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Changes";
    saveButton.style.width = "100%";
    saveButton.style.padding = "10px";
    saveButton.style.marginTop = "10px";
    saveButton.style.backgroundColor = "#4CAF50";
    saveButton.style.color = "#fff";
    saveButton.style.border = "none";
    saveButton.style.borderRadius = "5px";
    saveButton.style.cursor = "pointer";
    editPopup.appendChild(saveButton);

    // Create a button to cancel the edit and close the popup
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.width = "100%";
    cancelButton.style.padding = "10px";
    cancelButton.style.marginTop = "10px";
    cancelButton.style.backgroundColor = "#f44336";
    cancelButton.style.color = "#fff";
    cancelButton.style.border = "none";
    cancelButton.style.borderRadius = "5px";
    cancelButton.style.cursor = "pointer";
    editPopup.appendChild(cancelButton);

    // Append the pop-up to the user interface container (assumed to be defined as 'userInterface')
    userInterface.appendChild(editPopup);

    // Event listener for save button
    saveButton.addEventListener("click", () => {
        token.style.backgroundImage = `url(${srcInput.value})`;
        token.style.top = `${topInput.value}px`;
        token.style.left = `${leftInput.value}px`;
        token.style.width = `${widthInput.value}px`;
        token.style.height = `${heightInput.value}px`;

        // Remove the pop-up
        userInterface.removeChild(editPopup);
    });

    // Event listener for cancel button
    cancelButton.addEventListener("click", () => {
        userInterface.removeChild(editPopup); // Close the pop-up without saving
    });
}

function addUIDefaults(parent){
    const topRow = addDraggableRow(parent);
    topRow.classList.add('row');
    topRow.classList.add("vertical")
    topRow.style.justifyContent = "space-between";
    topRow.style.width = "100%"

    const sheetTitle = document.createElement('h2');
    sheetTitle.style.textAlign = 'center';
    sheetTitle.style.fontFamily = "'Cinzel', serif"; // DnD theme font
    sheetTitle.style.fontSize = '20px'; // Larger font size
    sheetTitle.style.margin = '0';
    sheetTitle.style.padding = '5px';
    sheetTitle.style.borderBottom = '1px solid black';
    topRow.appendChild(sheetTitle);

    const content = document.createElement("div");
    content.style.display = "grid";
    content.style.gridTemplateColumns = "repeat(3, 1fr)"; // Three-column grid
    content.style.gap = "20px";
    content.style.padding = "20px";
    content.style.background = "rgba(0, 0, 0, 0.9)";
    content.style.borderRadius = "16px";
    content.style.boxShadow = "0px 8px 20px rgba(0, 0, 0, 0.3)";
    content.style.overflowY = "auto"; // Enable scrolling
    content.style.maxHeight = "80vh"; // Limit the height of the UI
    parent.appendChild(content)

    const closeButton = createImageButton('28', {source: 'url(static/images/menu-icons/close.png)', custom_padding: 4});
    closeButton.style.marginRight = '5px';
    closeButton.style.cursor = 'pointer';
    topRow.appendChild(closeButton);

    return [topRow, sheetTitle, content, closeButton]
}