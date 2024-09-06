function createBackgroundToken(img_src_element, x, y) {

}


function askForListSelect(list) {
    return new Promise((resolve) => {
        // Create a container div to hold the selector and button
        const selectorContainer = document.createElement('div');
        selectorContainer.id = 'selector-container';
        selectorContainer.style.position = 'fixed';
        selectorContainer.style.top = '50%';
        selectorContainer.style.left = '50%';
        selectorContainer.style.transform = 'translate(-50%, -50%)';
        selectorContainer.style.width = '300px';
        selectorContainer.style.height = '200px';
        selectorContainer.style.backgroundColor = '#fff';
        selectorContainer.style.border = '2px solid #ccc';
        selectorContainer.style.borderRadius = '10px';
        selectorContainer.style.display = 'flex';
        selectorContainer.style.flexDirection = 'column';
        selectorContainer.style.alignItems = 'center';
        selectorContainer.style.justifyContent = 'space-between';
        selectorContainer.style.padding = '20px';
        selectorContainer.style.zIndex = '1500';
        document.body.appendChild(selectorContainer);

        // Create the selector (dropdown) and append it to the container
        const selector = createSelector(list, list, null, 'list-selector');
        selector.style.width = '100%';
        selector.style.height = '40px';
        selector.style.fontSize = '16px';
        selectorContainer.appendChild(selector);    

        // Create the submit button and append it to the container
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.id = 'submit-button';
        submitButton.style.width = '100px';
        submitButton.style.height = '40px';
        submitButton.style.fontSize = '16px';
        submitButton.style.marginTop = '10px';
        selectorContainer.appendChild(submitButton);

        // Add event listener to the button
        submitButton.addEventListener('click', () => {
            const selectedValue = document.getElementById('list-selector').value;

            // Resolve the promise with the selected value
            resolve(selectedValue);

            // Remove the selector container and button from the document after selection
            document.body.removeChild(selectorContainer);
        });
    });
}

