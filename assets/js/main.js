let tasks = [];
let categories = [];
let predefinedContacts = [
    {
        'name': 'David Eisenberg',
        'picture': '',
        'email': 'davidberg@gmail.com',
        'phone': '+43 7777 777 77 7',
    },
    {
        'name': 'Anton Christophorus Mayer',
        'picture': '',
        'email': 'antom@gmail.com',
        'phone': '+43 1111 111 11 1',
    },
    {
        'name': 'Anja Schulz',
        'picture': '',
        'email': 'schulz@hotemail.com',
        'phone': '+43 2222 222 22 2',
    },
    {
        'name': 'Eva Berta Fischer',
        'picture': '',
        'email': 'eva@gmail.com',
        'phone': '+49 5555 555 55 5',
    },
    {
        'name': 'Benedikt Ziegler',
        'picture': '',
        'email': 'benedikt@gmail.com',
        'phone': '+43 3333 333 33 3',
    },
    {
        'name': 'Emmanuel Mauer',
        'picture': '',
        'email': 'emmanuelMa@gmail.com',
        'phone': '+43 4444 444 44 4',
    },
    {
        'name': 'Marcel Bauer',
        'picture': '',
        'email': 'bauer@gmail.com',
        'phone': '+43 6666 666 66 6',
    }
];
let contacts = [];
let selectedPrio;
let selectedColor;
let currentCategoryName;
let currentCategoryColor;
let currentContactName;
let selectedContacts = [];
let activeUser;
let user = [];


/**
 * Asynchronously initializes the app by downloading the necessary data from the server and storing it locally.
 * 
 */
async function init() {
    await downloadFromServer();
    tasks = JSON.parse(await backend.getItem('tasks')) || [];
    categories = JSON.parse(await backend.getItem('categories')) || [];
    contacts = JSON.parse(await backend.getItem('contacts')) || [];
    user = JSON.parse(await backend.getItem('user')) || [];
    activeUser = JSON.parse(await backend.getItem('activeUser')) || [];
    logtOutBtn();
}


async function pushTasksToBackend(tasks) {
    await backend.setItem("tasks", JSON.stringify(tasks));
}


async function pushCategoryToBackend(categories) {
    await backend.setItem("categories", JSON.stringify(categories));
}


async function pushContactToBackend(contacts) {
    await backend.setItem("contacts", JSON.stringify(contacts));
}


async function pushUserToBackend(user) {
    await backend.setItem("user", JSON.stringify(user));
}


async function pushActiveUserToBackend(activeUser) {
    await backend.setItem("activeUser", JSON.stringify(activeUser));
}


async function pushtaskStatesToBackend(taskStates) {
    await backend.setItem("taskStates", JSON.stringify(taskStates));
}


function renderAddTaskBacklogOnContacts() {
    document.getElementById('addTaskBacklogOnContacts').innerHTML = '';
    document.getElementById('addTaskBacklogOnContacts').innerHTML += generateAddTaskBacklog();
}


async function logout() {
    let guest = 'Guest'
    activeUser = guest;
    await backend.setItem("activeUser", JSON.stringify(activeUser));
    openlogin();
}


function openlogin() {
    window.location.href = 'login.html';
}


function toggleMenu() {
    document.getElementById('toggle-menu').classList.toggle('d-none');
}


function logtOutBtn(){
    document.getElementById('nav-log').innerHTML = `Logout [${activeUser}]`
}