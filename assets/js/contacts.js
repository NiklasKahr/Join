let initials = [];


async function initContacts() { //initialize program
    await loadAddTask();
    renderContacts(); //render contact list and display first contact
    rightMenuRemoveHoverAddTask();
}

//render functions
function renderContacts(contactIndex) { //render necessary components for contact list
    if (contacts && contacts.length > 0) { //check if contact list is empty
        try { //would throw error if executed by Add Task
            sortJSONAlphabetically(contacts);
            initials = [];
            fillInitials();
            assignPictures();
            renderList();
            handleContactDisplay(contactIndex);
        } catch { }
    } else {
        try { //would throw error if executed by Add Task
            handleEmptyContactList();
        } catch { }
    }
}


function handleContactDisplay(contactIndex) {
    if (contactIndex) {
        renderDisplay(contactIndex);
    } else {
        adjustElementsEmptyContacts();
    }
    document.getElementById('user-icon').classList.add('d-none');
}


function renderList() { //render contacts corresponding to first name initial
    renderInitials();
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        renderListHTML(contact, i);
    }
}


function renderListHTML(contact, i) { //render contact list HTML
    let initialContainer = document.getElementById(firstLetterOf(contact).toLowerCase() + '-container');
    initialContainer.innerHTML += `
    <div onclick="renderDisplay(${i}); makeContactVisibleMobile()" id="contact${i}" class="contact-container contact-background ps-1 ps-1-altered">
        <div class="profile-container justify-content-975 hide-profile">
            <div class="display-flex align-items-center">
                <img id="img${i}" class="profile border-radius-100" src="${contact['picture']}"
                    alt="Profile"></div>
            <span class="initials font-12px white">${getBothInitials(i)}</span>
        </div>
        <div class="display-flex justify-content-center flex-direction-column credentials height-100 ms-1_25">
            <span class="width font-21px mb-0_2">${truncateString(contact['name'])}</span>
            <a class="width" ${contact['email']}">${truncateString(contact['email'])}</a>
        </div></div>`;
}


function renderEmptyListHTML() { //render empty contact list HTML
    document.getElementById('contact-list').innerHTML = `
    <span class="font-21px darkblue mt-3">No contacts available</span>
    <span class="font-14px darkblue mt-1">Add a new contact to get started</span>
    <div class="button-container-list height-unset flex-direction-column p-unset mt-2">
        <button onclick="showElement('blur-container-new')" class="button-blue width-fit-content white">
            New contact
            <img class="new-contact-img ps-0_5" src="../img/contacts/new-contact.svg" alt="New contact">
        </button>
        <button onclick="renderPredefinedContacts()"
            class="button-blue width-fit-content white button-blue-shadow mt-1_5">
            Predefined contacts
        </button>
    </div>
    `;
}


function renderDisplay(i) { //render contact details
    handleActiveContact();
    adjustElements(i);
    checkEmptyElements(); //check if email or phone is empty
    adjustClasses(i);
}


function renderInitials() { //render initials of contact list (e.g. A, B, C, ...)
    let contactList = document.getElementById('contact-list');
    contactList.innerHTML = '';
    for (let i = 0; i < initials.length; i++) {
        const initial = initials[i];
        contactList.innerHTML += `
        <div id="${initial.toLowerCase()}-container" class="letter-container">
            <span class="letter font-21px ps-1_4">${initial}</span>
            <div class="separation ps-1"></div>
        </div>
        `;
    }
}

//add contact function
function addContact(event) { //save contact in backend and re-render
    event.preventDefault();
    let name = document.getElementById('name-input-add').value;
    let email = document.getElementById('email-input-add').value;
    let phone = document.getElementById('phone-input-add').value;
    let contact = {
        'name': name, 'picture': '../img/contacts/' + getRandomColorImage(), 'email': email, 'phone': phone
    }
    updateAndRender(contact, contacts.length); //without +1, updates automatically
    hideElement('blur-container-new');
    clearInputFields();
    return false;
}

//edit contact functions
function prepareEdit() { //load contact data and adjust onclick event of edit button
    let i = getActiveIndex();
    let contact = contacts[i];
    document.getElementById("name-input-edit").value = contact['name'];
    document.getElementById("email-input-edit").value = contact['email'];
    document.getElementById("phone-input-edit").value = contact['phone'];
    document.getElementById('edit-form').setAttribute('onsubmit', `editContact(${i}, event)`)
}


function editContact(i, event) { //edit shown contact and re-render
    event.preventDefault();
    let contact = contacts[i];
    if (inputWasChanged('name-input-edit', contact['name'])) {
        contact['name'] = document.getElementById("name-input-edit").value.replace(/\s{2,}/g, ' '); //prevent double spaces
    }
    if (inputWasChanged('email-input-edit', contact['email'])) {
        contact['email'] = document.getElementById("email-input-edit").value;
    }
    if (inputWasChanged('phone-input-edit', contact['phone'])) {
        contact['phone'] = document.getElementById("phone-input-edit").value.replace(/\s{2,}/g, ' ');
    }
    updateAndRender(null, i); //null because no new contact is added
    hideElement('blur-container-edit');
    return false;
}

//delete contact function
function deleteContact(i) { //delete shown contact and re-render
    contacts.splice(i, 1);
    if (i === contacts.length) {
        i--; //decrement i if contact at last index is deleted
    }
    if (window.innerWidth <= 975) {
        makeListVisible();
    }
    updateAndRender(null, i);
}

//visibility functions
function doNotClose(event) { //prevent closing of modal (add contact, edit contact)
    event.stopPropagation();
}


function showElement(id) {
    document.getElementById(id).style.display = 'flex';
    if (id == 'blur-container-edit') {
        prepareEdit(); //load contact data and adjust onclick event of edit button
    }
}


function hideElement(id) {
    document.getElementById(id).style.display = 'none';
}


function adjustVisibility() { //adjust visibility of contact list and contact details
    if (window.innerWidth <= 975) {
        showElement('contact-list-container');
        hideElement('contact-display-container');
    } else {
        showElement('contact-display-container');
        showElement('contact-list-container');
    }
}


function makeContactVisibleMobile() { //make contact details visible on mobile (only on mobile)
    if (window.innerWidth <= 975) {
        showElement('contact-display-container');
        hideElement('contact-list-container');
    }
}


function makeListVisible() { //make contact list visible
    showElement('contact-list-container');
    hideElement('contact-display-container');
}

//return functions
function firstLetterOf(contact) { //return first letter of contact name
    return contact['name'].charAt(0).toUpperCase();
}


function getBothInitials(i) { //get both initials of each contact
    let contact = contacts[i];
    let fullName = contact['name'].split(' ');
    let bothInitials;
    //check if contact has two names
    if (fullName.length == 1) {
        bothInitials = fullName[0].charAt(0).toUpperCase()
    } else if (fullName.length >= 2) {
        bothInitials = fullName[0].charAt(0).toUpperCase() + fullName[fullName.length - 1].charAt(0).toUpperCase();
    }
    return bothInitials;
}


function getActiveIndex() { //return index of active contact
    if (document.getElementsByClassName('active1').length == 0) { //if active contact exists (necesseary due to function call on load)
        return null;
    }
    for (let i = 0; i < contacts.length; i++) {
        if (document.getElementById(`contact${i}`).classList.contains('active1')) {
            return i;
        }
    }
}


function truncateString(str) { //truncate string if too long (contact list)
    if (str) {
        if (str.length > 20 && window.innerWidth > 975 || str.length > 20 && window.innerWidth <= 475) {
            return str.substring(0, 17) + "...";
        }
        return str;
    } else {
        return '';
    }
}


function abbreviateContact(name) { //abbreviate contact name if too long (contact display)
    if (name) {
        if (name.length > 14 && hasMoreThanTwoNames(name)) { //abbreviate all names except the first and last one
            let names = name.split(' ');
            let abbreviatedName = names[0] + ' ';
            for (let i = 1; i < names.length - 1; i++) {
                abbreviatedName += names[i].charAt(0) + '. ';
            }
            abbreviatedName += names[names.length - 1];
            return abbreviatedName;
        } else {
            return name;
        }
    } else { return ''; }
}

//conditionals
function hasNoPicture(contact) { //check if contact has profile picture
    return contact['picture'] == '';
}


function inputWasChanged(id, currentReference) { //check if input contains value
    return document.getElementById(id).value != currentReference;
}


function elementEmpty(id) {
    return document.getElementById(id).innerHTML == ''
}


function hasMoreThanTwoNames(name) { //check if contact has more than two names
    return name.split(' ').length > 2;
}

//sort, filter and other functions
function sortJSONAlphabetically(contacts) { //sort contacts by name
    contacts.sort(function (a, b) {
        if (a['name'].toLowerCase() < b['name'].toLowerCase()) {
            return -1;
        }
        if (a['name'].toLowerCase() > b['name'].toLowerCase()) {
            return 1;
        }
        return 0;
    });
    return contacts;
}


function fillInitials() { //return initial of each contact
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const initial = firstLetterOf(contact);
        if (!initials.includes(initial)) { //check if initial already exists
            initials.push(initial);
        }
    }
    initials.sort();
}


function assignPictures() { //assign random picture to contacts without picture
    if (contacts) {
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            if (hasNoPicture(contact)) {
                contact['picture'] = '../img/contacts/' + getRandomColorImage(); //e.g. '../img/contacts/blue.png'
            }
        }
    }
}


function getRandomColorImage() { //return random color for contact picture
    let colorImages = ['blue.png', 'green.png', 'orange.png', 'pink.png', 'purple.png', 'red.png'];
    let colorImage = colorImages[Math.floor(Math.random() * colorImages.length)];
    return colorImage;
}


function updateAndRender(contact, contactIndex) { //update contacts and render contact list
    updateContacts(contact); //optional parameter
    renderContacts(contactIndex);
}


async function updateContacts(contact) { //update contacts after adding or editing contact
    if (contact) { //if contact is given, add it to contacts
        contacts.push(contact);
    }
    await pushContactToBackend(contacts);
}


function handleActiveContact() { //handle classes of previous contact
    if (getActiveIndex() != null) { //check if there is active contact
        let activeIndex = getActiveIndex();
        document.getElementById(`contact${activeIndex}`).classList.add('contact-background');
        document.getElementById(`contact${activeIndex}`).classList.remove('active1');
        document.getElementById(`img${activeIndex}`).classList.remove('active2');
    }
}


function adjustElements(i) { //adjust elements when displaying other contact
    document.getElementById('removeClass').classList.remove('d-none');
    document.getElementById('removeClassSecond').classList.remove('d-none');
    let contact = contacts[i];
    document.getElementById('picture').classList.remove('d-none');
    document.getElementById('picture').src = contact['picture']; //change name, picture, email and phone
    document.getElementById('name').innerHTML = abbreviateContact(contact['name']);
    document.getElementById('initials').innerHTML = getBothInitials(i); //corresponding initials
    document.getElementById('email').innerHTML = contact['email'];
    document.getElementById('phone').innerHTML = contact['phone'];
    document.getElementById('email').innerHTML = contact['email']; //change href of email and phone
    document.getElementById('phone').href = 'tel:' + contact['phone'];
    document.getElementById('pen').onclick = function () { showElement('blur-container-edit'); };
    document.getElementById('edit-span').onclick = function () { showElement('blur-container-edit'); };
}


function adjustElementsEmptyContacts() {
    document.getElementById('display-top').classList.add('d-none');
    document.getElementById('display-mid').classList.add('d-none');
    document.getElementById('picture').classList.add('d-none');
    document.getElementById('picture').src = '';
    document.getElementById('name').innerHTML = '';
    document.getElementById('initials').innerHTML = '';
    document.getElementById('email').innerHTML = '';
    document.getElementById('email-span').innerHTML = '';
    document.getElementById('phone').innerHTML = '';
    document.getElementById('phone-span').innerHTML = '';
    document.getElementById('pen').onclick = '';
    document.getElementById('edit-span').onclick = '';
}


function adjustClasses(i) { //adjust classes of shown contact
    document.getElementById(`contact${i}`).classList.add('active1'); //change background color of contact
    document.getElementById(`img${i}`).classList.add('active2'); //change border color of profile picture
    document.getElementById(`contact${i}`).classList.remove('contact-background'); //restrict hover effect
}


function clearInputFields() { //clear input fields after adding contact
    document.getElementById('name-input-add').value = '';
    document.getElementById('email-input-add').value = '';
    document.getElementById('phone-input-add').value = '';
}


function handleEmptyContactList() { //adjust visibility of contact list and contact details
    renderEmptyListHTML();
    adjustElementsEmptyContacts();
}


function renderPredefinedContacts() { //render predefined contacts
    contacts = [...predefinedContacts]; //copy predefined contacts to contacts, no reference type
    assignPictures();
    updateAndRender(null, 0);
}


function checkEmptyElements() { //check if contact has empty email or phone
    if (elementEmpty('email')) {
        document.getElementById('email').innerHTML = 'No Email';
        document.getElementById('email').href = '#';
    }
    if (elementEmpty('phone')) {
        document.getElementById('phone').innerHTML = 'No Phone';
        document.getElementById('phone').href = '#';
    }
}


function clearAddTaskInContacts() { // Clears all values from the form.
    title.value = '';
    description.value = '';
    category.value = 'Select task category';
    contact.value = 'Select contacts to assign';
    date.value = '';
    subtask.value = '';
    selectedPrio = '';
    initContacts();
}


async function addToTaskInContacts() { // Adds a new task by gathering data from the form, sending the data to the backend, and displaying successful message.
    if (checkFormValid() == true) {
        let task = gatherFormData();
        tasks.push(task);
        await pushTasksToBackend(tasks);
        // showTaskAddedToBoard();
        setTimeout(openBoard, 1000);
    }
}


function openBoard() {
    window.location.href = 'board.html'
}


function showTaskAddedToBoard() {
    document.getElementById('taskAddedToBoard').classList.remove('d-none');
}


function rightMenuRemoveHoverAddTask() {
    document.getElementById('addtaskid').classList.remove('rightHover');
    document.getElementById('conctactsid').classList.add('rightHover');
}