function toggleSliding_SheetWithId(id, open= null) {
    const page = document.getElementById(id);
    if(open == null){
        if(page.classList.contains('active')){
            page.classList.remove('active');
            page.classList.add('closed');
        }else{
            page.classList.remove('closed');
            page.classList.add('active');
        }
    }else{
        if(open){
            page.classList.remove('closed');
            page.classList.add('active');
        } else {
            page.classList.remove('active');
            page.classList.add('closed');
        }
    } 
}

function toggleDisplay_SheetWithId(id, open= null) {
    const page = document.getElementById(id);
    if(open == null){
        if(page.style.display == 'none'){
            page.style.display = 'flex';
        }else{
            page.style.display = 'none';
        }
    }else{
        if(open){
            page.style.display = 'flex';
        } else {
            page.style.display = 'none';
        }
    } 
}

function createSelector(valueList, textList, defaultValue, id) {
    // Create the select element
    const selector = document.createElement('select');
    selector.id = id;
    selector.className = 'token-selector-combobox';


    // Create and add the default option
    if(defaultValue != null){
        const defaultOption = document.createElement('option');
        defaultOption.value = ''; // Empty value for default
        defaultOption.textContent = defaultValue; 
        defaultOption.disabled = true; // Make it non-selectable
        defaultOption.selected = true; // Set as the default selected option
        selector.appendChild(defaultOption);
    }

    // Add options based on valueList and textList
    valueList.forEach((value, index) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = textList[index] || value; // Use value if textList is shorter
        selector.appendChild(option);
    });

    return selector;
}