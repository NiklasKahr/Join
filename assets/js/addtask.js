async function loadAddTask() { // Initializes and loads the view for adding tasks.
    await init();
    renderCategory();
    renderContactsAddTask();
    rightMenuAddTask();
    CategoryScroll();
}


async function deleteTask(i) { // Deletes task from array and save it to backend
    tasks.splice(i, 1);
    await deleteTaskState(i);
    updateHTML();
    let allTasksAsString = JSON.stringify(tasks);
    await backend.setItem("tasks", allTasksAsString);
}


async function deleteTaskState(i) { // Deletes task from the state of the task
    for (let j = 0; j < taskStates.length; j++) {
        let subtask = `subtask-${i}-${j}`;
        for (let k = 0; k < taskStates.length; k++) {
            if (taskStates[k].taskId.includes(subtask)) {
                taskStates.splice(k, 1);
            }
        }
    }
    await pushtaskStatesToBackend(taskStates);
}


async function addToTask() { // Adds a new task by gathering data from the form, sending the data to the backend, and displaying successful message.
    if (checkFormValid() == true) {
        let task = gatherFormData();
        tasks.push(task);

        await pushTasksToBackend(tasks);
        showSuccessMessage();
        clearFormData();
        renderCategory();
        renderContacts();
    }
}


function checkFormValid() {
    return checkingEmptyValues() == true;
}


function gatherFormData() { // Gathers data from the form to create a task object.
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let contact = selectedContacts;
    let date = document.getElementById('date').value;
    let subtasks = gatherSubtasks();
    return {
        taskTitle: title, taskDescription: description, taskCategoryName: currentCategoryName,
        taskCategoryColor: currentCategoryColor, taskContact: contact, taskDate: date,
        taskPrio: selectedPrio, taskSubtask: subtasks, processing_state: "todoTable"
    };
}


function gatherSubtasks() { // Collects all selected subtasks from the form.
    let subtaskCheckboxes = document.querySelectorAll(".sub-checkbox");
    let subtasks = [];
    for (let i = 0; i < subtaskCheckboxes.length; i++) {
        if (subtaskCheckboxes[i].checked) {
            let subtaskLabel = subtaskCheckboxes[i].nextElementSibling;
            subtasks.push(subtaskLabel.innerHTML);
        }
    }
    return subtasks;
}


function clearTasks() { // Clears all values from the form.
    title.value = '';
    description.value = '';
    category.value = 'Select task category';
    contact.value = 'Select contacts to assign';
    date.value = '';
    subtask.value = '';
    selectedPrio = '';
}


function checkingEmptyValues() { // Check if any of the input values are empty and return the validity status
    let isValid = true;
    if (!checkTitle()) { isValid = false; }
    else if (!checkDescription()) { isValid = false; }
    else if (!checkCategory()) { isValid = false; }
    else if (!checkContacts()) { isValid = false; }
    else if (!checkDate()) { isValid = false; }
    else if (!checkPrio()) { isValid = false; }
    return isValid;
}


// --------------------------------Category--------------------------------

function renderCategory() { // Render the task categories in the UI
    document.getElementById('categoryContainer').innerHTML = '';
    document.getElementById('categoryContainer').innerHTML += generateCategory(); // Add the updated categories to the category container
}


function categorySelector() { // toggle visibility of category list and selector, then render selected category
    document.getElementById('category').classList.toggle('display-none');
    document.getElementById('selector').classList.toggle('display-none');
    document.getElementById('contact').classList.add('display-none');
    renderSelectedCategory();
}


function renderSelectedCategory() { // Renders available task categories for selection
    document.getElementById("category").innerHTML = '';
    categories.forEach(({ name, color }, id) => { // Render each category with name and color
        document.getElementById("category").innerHTML += /*html*/`
    <div onclick="selectedCategory(${id})" class="selected-font category-hover">${name}<div class="${color} circle"></div></div>`;
    });
}


function selectedCategory(id) { // Function to set selected category 
    document.getElementById("categorySelector").innerHTML = generateSelectedCategory(id); // Update the innerHTML of the "categorySelector" element with the selected category information 
    currentCategoryName = categories[id].name;
    currentCategoryColor = categories[id].color;
    document.getElementById('category').classList.toggle('display-none');
    document.getElementById('selector').classList.toggle('display-none');
}


async function addNewCategory() { // Adds a new category to the categories array and pushes the changes to the backend
    const newCategoryName = document.getElementById('newCategoryInput').value;
    const newCategoryColor = selectedColor;
    if (!selectedColor) {
        document.getElementById('chooseAColor').classList.remove('display-none');
    } else if (!newCategoryName.length) {
        document.getElementById('fillNewCategory').classList.remove('display-none');
    } else {
        await pushCategory(newCategoryName, newCategoryColor);
    }
}


async function pushCategory(newCategoryName, newCategoryColor) {
    categories.push({
        name: newCategoryName,
        color: newCategoryColor,
    });
    await pushCategoryToBackend(categories);
    renderCategory();
}


function colorSelector() {
    document.getElementById('color').classList.toggle('display-none');
    document.getElementById('categorySelector').classList.toggle('display-none');
}

const colors = ['blue', 'red', 'green', 'orange', 'purple', 'yellow'];

function addNewColor(id) { // Select a new color for a task category
    selectedColor = colors[id - 1];
    colors.forEach((color, i) => {
        if (i === id - 1) {
            document.getElementById(color).classList.add('color-selected');
        } else {
            document.getElementById(color).classList.remove('color-selected');
        }
    });
}

// --------------------------------Contacts---------------------------------

function renderContactsAddTask() { // Function to render the contact options for adding a task
    const contactContainer = document.getElementById('contactContainer');
    contactContainer.innerHTML = generateContacts();
}


function contactSelector() { // Function to toggle display of contact selector and render selected contacts
    const contact = document.getElementById('contact');
    contact.classList.toggle('display-none');
    document.getElementById('category').classList.add('display-none');
    document.getElementById('selector').classList.add('display-none');
    renderSelectedContacts();
}


function renderSelectedContacts() { // Toggles the selection of a contact, called when clicking on a contact in the contact selection.
    const contactSelection = document.getElementById("contactSelection");
    contactSelection.innerHTML = '';
    contacts.forEach((contact, id) => {
        contactSelection.innerHTML += /*html*/`
        <div onclick="toggleSelectedContact(${id})" class="display-flex space-between align-center category-hover">
                        <div id="contact${id}" class="selected-font">${contact.name}</div>
                        <input id="checkbox${id}" class="mr-20 unchecked" type="checkbox" ${selectedContacts.includes(contact.name) ? 'checked' : ''}>
            `;
    });
}


function toggleSelectedContact(contactId) { // Selects the selected contact and paste it at the top of the box.
    const selectedContact = contacts[contactId];
    const contactIndex = selectedContacts.indexOf(selectedContact.name);
    if (contactIndex === -1) {
        selectedContacts.push(selectedContact.name);
    } else {
        selectedContacts.splice(contactIndex, 1);
    }
    const selectedContactDisplay = document.querySelector('.selected-contact');
    selectedContactDisplay.innerHTML = selectedContacts.join(", ");
    renderSelectedContacts();
}


async function addNewContact() { // Adds a new contact and also creates it on the contact page, but only the name, the other information must be entered later.
    let newContactName = document.getElementById('newContactInput').value;
    if (newContactName.length >= 1) {
        contacts.push({
            name: newContactName,
            picture: '../img/contacts/' + getRandomColorImage(),
            email: '',
            phone: ''
        });
        await pushContactToBackend(contacts);
        renderContactsAddTask();
    }
}


function getRandomColorImage() { //return random color for contact picture
    let colorImages = ['blue.png', 'green.png', 'orange.png', 'pink.png', 'purple.png', 'red.png'];
    let colorImage = colorImages[Math.floor(Math.random() * colorImages.length)];
    return colorImage;
}


function newContact() {
    document.getElementById('newContact1').classList.toggle('display-none');
    document.getElementById('newContact2').classList.toggle('display-none');
}


// --------------------------------Prio---------------------------------


function changePrio(id) { // Changes the specification of which priority the task should have.
    const prios = ['Urgent', 'Medium', 'Low'];
    selectedPrio = prios[id];
    for (let i = 0; i < prios.length; i++) {
        document.getElementById(prios[i].toLowerCase()).classList.remove('display-none');
        document.getElementById(prios[i].toLowerCase() + 'Clicked').classList.add('display-none');
    }
    document.getElementById(prios[id].toLowerCase()).classList.toggle('display-none');
    document.getElementById(prios[id].toLowerCase() + 'Clicked').classList.toggle('display-none');
}


// --------------------------------SubTasks---------------------------------
function addSubTask() { // Can separate individual subtasks into small checkboxes and select them individually.
    let subtasksContainer = document.getElementById('subtasks');
    let newSubTask = document.getElementById("subtask").value;
    if (newSubTask) {
        handleNewSubTask(newSubTask, subtasksContainer);
    }
    document.getElementById("subtask").value = "";
}


function handleNewSubTask(newSubTask, subtasksContainer) {
    let newCheckbox = document.createElement("input");
    newCheckbox.className = "sub-checkbox";
    newCheckbox.type = "checkbox";
    let newLabel = document.createElement("p");
    newLabel.className = "sub-text";
    newLabel.innerHTML = newSubTask;
    let newDiv = document.createElement("div");
    newDiv.className = "checkbox-container";
    newDiv.appendChild(newCheckbox);
    newDiv.appendChild(newLabel);
    subtasksContainer.appendChild(newDiv);
}


// --------------------------------extra-functions--------------------------------
function showSuccessMessage() {
    ShowAddedToBoard();
    setTimeout(openBoard, 3000);
}


function clearFormData() {
    clearTasks();
    renderContactsAddTask();
}


function ShowAddedToBoard() {
    document.getElementById('taskAddedToBoard').classList.remove('display-none');
}


function openBoard() {
    window.location.href = 'board.html';
}


// --------------------------------checking-Values--------------------------------
function checkTitle() {
    if (document.getElementById("title").value.length < 1) {
        document.getElementById('missingTitle').innerHTML = `Please give it a title!`;
        return false;
    } else {
        document.getElementById('missingTitle').innerHTML = ``;
        return true;
    }
}

function checkDescription() {
    if (document.getElementById("description").value.length < 1) {
        document.getElementById('missingDescription').innerHTML = `Please give it a description!`;
        return false;
    } else {
        document.getElementById('missingDescription').innerHTML = ``;
        return true;
    }
}


function checkCategory() {
    if (currentCategoryName === undefined) {
        document.getElementById('missingCategory').innerHTML = `Please give it a category!`;
        return false;
    } else {
        document.getElementById('missingCategory').innerHTML = ``;
        return true;
    }
}


function checkContacts() {
    if (selectedContacts.length < 1) {
        document.getElementById('missingContacts').innerHTML = `Please select a contact!`;
        return false;
    } else {
        document.getElementById('missingContacts').innerHTML = ``;
        return true;
    }
}


function checkDate() {
    let dateValue = document.getElementById("date").value;
    if (dateValue.length < 1) {
        document.getElementById('missingDate').innerHTML = `Please select a date!`;
        return false;
    } else {
        if (isDateOfPast(dateValue)) {
            return true;
        } else {
            return false;
        }
    }
}


function isDateOfPast(dateValue) {
    let selectedDate = new Date(dateValue);
    let today = new Date();
    if (selectedDate < today) {
        document.getElementById('missingDate').innerHTML = `Please select a date in the future!`;
        return false;
    } else {
        document.getElementById('missingDate').innerHTML = ``;
        return true;
    }
}


function hasSelectedDate() {
    let dateValue = document.getElementById("date-input").value;
    //dateValue is not tt.mm.jjjj
    if (dateValue.length < 1 && dateValue !== 'tt.mm.jjjj') {
        return false;
    } else {
        return true;
    }
}


function checkPrio() {
    if (selectedPrio === undefined) {
        document.getElementById('missingPrio').innerHTML = `Please select a Prio!`;
        return false;
    } else {
        document.getElementById('missingPrio').innerHTML = ``;
        return true;
    }
}


function rightMenuAddTask() {
    document.getElementById('addtaskid').classList.add('rightHover')
}


function CategoryScroll() {
    document.getElementById('category').classList.add('category-inputfield-selector-scroll')
    document.getElementById('contactSelection').classList.add('category-inputfield-selector-scroll')
}