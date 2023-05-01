let currentDraggedElement;


async function initBoard() {
    await downloadFromServer();
    jsonParse();
    updateHTML();
    await loadAddTask();
    rightMenuRemoveHover();
    CategoryScroll();
    cleanseTaskStates();
}


/**
 * Loading Server atas
 */
function jsonParse() {
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    categories = JSON.parse(backend.getItem('categories')) || [];
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    user = JSON.parse(backend.getItem('user')) || [];
    activeUser = JSON.parse(backend.getItem('activeUser')) || [];
    taskStates = JSON.parse(backend.getItem("taskStates")) || [];
}


/**
 * Pinning notes on board at right progress-column
 */
function updateHTML() {
    clearTable()
    for (let i = 0; i < tasks.length; i++) {
        let element = tasks[i]['processing_state'];
        if (element == "todoTable" || element == "progressTable" || element == "feedbackTable" || element == "doneTable") {
            document.getElementById(element).innerHTML += createTaskHTML(i);
            checkForSubTasks(i);
            handleProgressBars(i);
        }
    }
}


function checkForSubTasks(i) {
    if (tasks[i].taskSubtask.length == 0) {
        document.getElementById(`progress-bar-${i}`).classList.add('d-none')
    } else {
        document.getElementById(`progress-bar-${i}`).classList.remove('d-none');
    }
}


function rightMenuRemoveHover() {
    document.getElementById('addtaskid').classList.remove('rightHover')
    document.getElementById('boardid').classList.add('rightHover');
}


/**
Clears the contents of task tables in HTML with id 'todoTable', 'progressTable', 'feedbackTable', 'doneTable'.
*/
function clearTable() {
    document.getElementById('todoTable').innerHTML = '';
    document.getElementById('progressTable').innerHTML = '';
    document.getElementById('feedbackTable').innerHTML = '';
    document.getElementById('doneTable').innerHTML = '';
}


/**
 * startDragging - sets the id of the currently dragged element
 * @param {string} id - id of the current element being dragged
 */
function startDragging(id) {
    currentDraggedElement = id;
}


/**
 * allowDrop - prevents default behavior when an element is dropped
 * @param {event} ev - drop event object
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * MoveTo - updates the processing state of the current dragged element
 * and updates the HTML
 * @param {string} processing_state - new processing state
 */
function MoveTo(processing_state) {
    tasks[currentDraggedElement].processing_state = processing_state;
    updateHTML();
    let allTasksAsString = JSON.stringify(tasks);
    backend.setItem('tasks', allTasksAsString);
}


function getInitials(str) {
    return str.charAt(0);
}


/**
Creates the HTML code for a task item, including its title, description, priority and assigned contacts.
*/
function createTaskHTML(i) {
    let task = tasks[i];
    let prioImage = getPriorityImage(task.taskPrio);
    let initialContacts = getInitialContacts(task.taskContact);
    let shortDescription = getShortDescription(task.taskDescription);
    let progressValue = '';
    if (task.taskSubtask.length == 1) {
        progressValue = `${task.taskSubtask.length} Subtask`;
    } else if (task.taskSubtask.length >= 1) {
        progressValue = `${task.taskSubtask.length} Subtasks`;
    }
    return returnTaskHTML(i, prioImage, initialContacts, shortDescription, progressValue, task);
}


function returnTaskHTML(i, prioImage, initialContacts, shortDescription, progressValue, task) {
    return `<div onclick="openTaskDetails(${i})" id="${i}" class="task-details-button">
    <div id="draggable${i}" draggable="true"  ondragstart="startDragging(${i})" class="task">
      <div class="frame71">
        <div class="frame119">
          <div class="frame1132">
            <div class="design" style="color: white;font-weight: 400;border-radius: 8px; padding: 7px 28px; background-color: ${task.taskCategoryColor}">
              ${task.taskCategoryName}
            </div>
          </div>
          <div class="frame116">
            <div class="frame114">
              <div class="website">${task.taskTitle}</div>
              <div class="modify">${shortDescription}</div>
            </div>
          </div>
        </div>
        <div class="progress-container">
          <div class="progress-value">${progressValue}</div>
        </div>
        <div id="progress-bar-${i}" class="d-none progress-bar">
			<div id="progress-${i}" class="progress" style="width: 100%;"></div>
		</div>
        <div class="trash-place">
          <div class="initialContactsStyle">${initialContacts}</div>
          <div>
            <img class="prio" src="${prioImage}">
            <img onclick="doNotOpen(event); deleteTask(${i})" class="trash" src="../img/board/trash.png">
          </div>
        </div>
      </div>
    </div>`;
}


function prepareTaskEdit(i) { //prepares edit when task is opened
    let { taskCategoryName, taskDescription,
        taskTitle } = tasks[i];
    document.getElementById("category-input").value = taskCategoryName;
    document.getElementById("title-input").value = taskTitle;
    document.getElementById("description-input").value = taskDescription;
    document.getElementById('edit-task-form')
        .setAttribute('onsubmit', `executeEditTask(${i}, event)`);
}


async function executeEditTask(i, event) {
    await editTask(i, event); openTaskDetails(i); hideElement('task-edit');
}


async function editTask(i, event) {
    event.preventDefault();
    let taskCategoryName = document.getElementById("category-input").value;
    let taskTitle = document.getElementById("title-input").value;
    let taskDescription = document.getElementById("description-input").value;
    let taskDate = document.getElementById("date-input").value;
    await checkAndExecuteEdit(i, taskCategoryName, taskTitle, taskDescription, taskDate);
}


async function checkAndExecuteEdit(i, taskCategoryName, taskTitle, taskDescription, taskDate) {
    if (meetsConditions(i, taskCategoryName, taskTitle, taskDescription, taskDate)) {
        tasks[i].taskCategoryName = taskCategoryName;
        tasks[i].taskTitle = taskTitle;
        tasks[i].taskDescription = taskDescription;
        if (hasSelectedDate()) {
            tasks[i].taskDate = taskDate;
        }
        renderCategory();
        updateHTML();
        await pushTasksToBackend(tasks);
    }
    resetTaskPopup();
    return false;
}


function meetsConditions(i, taskCategoryName, taskTitle, taskDescription, taskDate) {
    return taskCategoryName !== tasks[i].taskCategoryName ||
        taskTitle !== tasks[i].taskTitle ||
        taskDescription !== tasks[i].taskDescription ||
        taskDate !== tasks[i].taskDate
}



function setTaskPopup() {
    document.getElementById('task-popup').style.minHeight = '430px';
}


function resetTaskPopup() {
    document.getElementById('task-popup').style.minHeight = 'unset';
}


function prepareMoveTo(i) {
    document.getElementById('task-popup').style.height = '300px';
    document.getElementById('task-popup').style.overflow = 'hidden';
    document.getElementById('move-to-td').onclick = () => moveTo(i, 'todoTable');
    document.getElementById('move-to-ip').onclick = () => moveTo(i, 'progressTable');
    document.getElementById('move-to-af').onclick = () => moveTo(i, 'feedbackTable');
    document.getElementById('move-to-d').onclick = () => moveTo(i, 'doneTable');
    document.getElementById('task-to-move').innerHTML =
        document.querySelector(".titelclass span").textContent;
    showElement('move-task-menu');
}


async function moveTo(i, newCategory) {
    let task = tasks[i];
    task['processing_state'] = newCategory;
    updateHTML();
    await pushTasksToBackend(tasks);
    closeWindow('popupTask');
    hideElement('task-edit');
    hideElement('move-task-menu');
    resetTaskPopup();
    resetMoveTo()
}


function resetMoveTo() {
    document.getElementById('task-popup').style.height = 'unset';
    document.getElementById('task-popup').style.overflow = 'unset';
}


/**
 * Returns an image path based on the priority level passed as argument
 */
function getPriorityImage(priority) {
    if (priority === "Urgent") {
        return "../img/board/capa_red.png";
    } else if (priority === "Medium") {
        return "../img/board/capa.png";
    } else if (priority === "Low") {
        return "../img/board/capa_green.png";
    } else {
        return "";
    }
}


/**
This function generates initial contacts from a list of contacts.
@param {Array} contacts - An array of strings, where each string represents a contact name.
@return {string} - A string representation of the initial contacts, with each initial surrounded by a div with a "ContactName" class and a colored background.
*/
function getInitialContacts(contacts) {
    let initialContacts = "";
    for (let j = 0; j < contacts.length; j++) {
        let initial = contacts[j].charAt(0).toUpperCase();
        let color = getLetterColor(initial);
        initialContacts += `<div class="ContactName" style="background: ${color};">${initial}</div>`;
    }
    return initialContacts;
}


/**
 * Returns the color for a given initial letter
 */
function getLetterColor(initial) {
    let letterColors = {
        "A": "#FFB347", "B": "#7FFFD4",
        "C": "#00FF00", "D": "#1E90FF",
        "E": "#FF69B4", "F": "#8A2BE2",
        "G": "#228B22", "H": "#4B0082",
        "I": "#FF6347", "J": "#3CB371",
        "K": "#DC143C", "L": "#7B68EE",
        "M": "#6B8E23", "N": "#FF7F50",
        "O": "#40E0D0", "P": "#BA55D3",
        "Q": "#9370DB", "R": "#00FF7F",
        "S": "#8B008B", "T": "#66CDAA",
        "U": "#008080", "V": "#8B0000",
        "W": "#556B2F", "Z": "#B0C4DE",
        "Y": "#FFA07A", "Z": "#FFDAB9"
    };
    return letterColors[initial];
}


/**
Gets a short version of the task description.
*/
function getShortDescription(description) {
    return description.length > 40 ? description.substr(0, 39) + "..." : description;
}


/**
Displays task details in a popup.
@param {number} i - Index of the task in the tasks array.
*/
function openTaskDetails(i) {
    let { taskContact, taskSubtask } = tasks[i];
    showMainInfo(i);
    prepareTaskEdit(i);
    let subtaskContainer = document.createElement("div"); // create subtask container
    handleSubTaskContainer(subtaskContainer, taskSubtask, i);
    document.querySelector(".subtasks").innerHTML = ""; // replace innerHTML of .subtasks with subtaskContainer
    document.querySelector(".subtasks").appendChild(subtaskContainer);
    handleAssignees(taskContact);
    document.querySelector(".popupTask").style.display = "flex";
    document.querySelector(".popupTaskBackground").style.display = "flex";
    handleProgressBars(i);
    document.getElementById('task-popup').onclick = function () { doNotClose(event); handleProgressBars(i); };
    document.getElementById('move-to').onclick = function () { doNotClose(event); prepareMoveTo(i); };
}


function handleSubTaskContainer(subtaskContainer, taskSubtask, i) {
    subtaskContainer.classList.add("subtask-container");
    subtaskContainer.style.display = "flex";
    // loop through taskSubtask and create checkboxpopup for each
    taskSubtask.forEach((subtask, index) => {
        let checkboxPopup = document.createElement("div");
        let subtaskP = document.createElement("p");
        subtaskP.classList.add("subtasks");
        subtaskP.innerHTML = subtask;
        handleCheckboxPopup(subtaskContainer, checkboxPopup, subtaskP, i, index);
    });
}


function handleCheckboxPopup(subtaskContainer, checkboxPopup, subtaskP, i, index) {
    checkboxPopup.classList.add("checkboxpopup");
    let checkbox = document.createElement("input");
    checkbox.classList.add("sub-checkbox-board");
    checkbox.type = "checkbox";
    checkbox.id = `subtask-${i}-${index}`;
    checkboxPopup.appendChild(checkbox);
    checkboxPopup.appendChild(subtaskP);
    subtaskContainer.appendChild(checkboxPopup);
    handleCheckBoxClick(checkbox, i, index);
}


function handleCheckBoxClick(checkbox, i, index) { // Attach click event to each checkbox
    checkbox.addEventListener("click", function () {
        setTaskState(`subtask-${i}-${index}`, checkbox.checked);
    });
    // Load task state from backend
    let taskState = taskStates.find(t => t.taskId === `subtask-${i}-${index}`);
    if (taskState) {
        checkbox.checked = taskState.isChecked;
    }
}


function handleAssignees(taskContact) {
    let assignedTo = document.createElement("div");
    assignedTo.innerHTML = "<span style='font-weight: 700; font-size: 18px;'>Assigned To:</span>";
    taskContact.forEach(contact => {
        let contactDiv = document.createElement("div");
        let initial = contact.charAt(0).toUpperCase();
        let color = getLetterColor(initial);
        contactDiv.innerHTML = `<div style="background-color: ${color}; width: 40px; margin-top: 10px; height: 40px; margin-bottom: 10px; border-radius: 50%; display: inline-block; vertical-align: middle; text-align: center; color: white; font-weight: bold; font-size: 20px; line-height: 40px; margin-right: 10px;">${initial}</div>${contact}`;
        assignedTo.appendChild(contactDiv);
    });
    document.querySelector(".assignedTo").innerHTML = "";
    document.querySelector(".assignedTo").appendChild(assignedTo);
}


function showMainInfo(i) {
    let { taskCategoryColor, taskCategoryName, taskDescription, taskPrio, taskTitle, taskDate } = tasks[i];
    let { prioImgSrc, prioText } = getTaskPrioDetails(taskPrio);
    let prioImg = document.createElement("img");
    prioImg.src = prioImgSrc;
    setPopupTaskBackgroundColor(taskPrio);
    document.querySelector(".popupTaskUp .desing").style.backgroundColor = taskCategoryColor;
    document.querySelector(".popupTaskUp .desing").innerHTML = taskCategoryName;
    document.querySelector(".popupDate").innerHTML = formatDate(taskDate);
    document.querySelector(".titelclass span").innerHTML = taskTitle;
    document.querySelector(".titelclass .descText").innerHTML = taskDescription;
    document.querySelector(".popupPrio div:first-of-type").innerHTML = prioText;
    document.querySelector(".popupPrio div:first-of-type").appendChild(prioImg);
    document.body.style.overflowY = "hidden";
}


function handleProgressBars(i) {
    let taskSubtasks = tasks[i].taskSubtask;
    let completedTasks = 0; // count completed tasks
    taskSubtasks.forEach((subtask, index) => {
        let taskState = taskStates.find(t => t.taskId === `subtask-${i}-${index}`);
        if (taskState && taskState.isChecked) {
            completedTasks++;
        }
    });
    handleBarWidth(taskSubtasks, completedTasks, i);
}


function handleBarWidth(taskSubtasks, completedTasks, i) {
    if (taskSubtasks.length == 0) { // set width of progress bar
        document.getElementById('popup-progress-bar').classList.add('d-none');
    } else {
        let progress = (completedTasks / taskSubtasks.length) * 100; // calculate progress
        document.getElementById('popup-progress').style.width = `${progress}%`;
        document.getElementById(`progress-${i}`).style.width = `${progress}%`;
        document.getElementById('popup-progress-bar').classList.remove('d-none');
    }
}


function cleanseTaskStates() {
    for (let j = 0; j < taskStates.length; j++) {
        let tasksLength = tasks.length;
        let taskState = taskStates[j];
        let taskStateId = taskState.taskId;
        let taskStateIdArray = taskStateId.split("-");
        let taskStateIdIndex = taskStateIdArray[1];
        if (taskStateIdIndex >= tasksLength) {
            taskStates.splice(j, 1);
            j--;
        }
    }
}


async function setTaskState(taskId, isChecked) {
    let taskState = taskStates.find(t => t.taskId === taskId);
    if (!taskState) {
        taskState = { taskId, isChecked };
        taskStates.push(taskState);
    } else {
        taskState.isChecked = isChecked;
    }
    backend.setItem("taskStates", JSON.stringify(taskStates));
    await pushtaskStatesToBackend(taskStates);
}


function setPopupTaskBackgroundColor(taskPrio) {
    if (taskPrio === "Urgent") {
        document.querySelector(".popupPrio div:first-of-type").style.backgroundColor = "#af1111";
    } else if (taskPrio === "Medium") {
        document.querySelector(".popupPrio div:first-of-type").style.backgroundColor = "#FFA800";
    } else if (taskPrio === "Low") {
        document.querySelector(".popupPrio div:first-of-type").style.backgroundColor = "#008000";
    }
}


/**
 * Returns an object containing the priority text and priority image source for a task.
 */
function getTaskPrioDetails(taskPrio) {
    if (taskPrio === "Urgent") {
        prioText = "Urgent &nbsp;";
        prioImgSrc = "../img/board/prio_urgent_white.png";
    } else if (taskPrio === "Medium") {
        prioText = "Medium &nbsp;";
        prioImgSrc = "../img/board/prio_medium_white.png";
    } else if (taskPrio === "Low") {
        prioText = "Low &nbsp;";
        prioImgSrc = "../img/board/prio_low_white.png";
    }
    return { prioText, prioImgSrc };
}


/**
 * Formatting date string in "dd.mm.yyyy" format.
 */
function formatDate(date) {
    let dateArray = date.split("-");
    let year = dateArray[0];
    let month = dateArray[1];
    let day = dateArray[2];
    return `${day}.${month}.${year}`;
}


/** 
 * Hiding popup window by setting its display style to "none".
*/
function closeWindow() {
    document.querySelector(".popupTask").style.display = "none";
    document.querySelector(".popupTaskBackground").style.display = "none";
    document.body.style.overflowY = "overlay";
}


//prevent closing of modal (task popup)
function doNotOpen(event) {
    event.stopPropagation();
}


function showAddTaskElementTask() {
    document.getElementById('addTaskWindow').classList.remove('d-none');
    document.body.classList.remove("scrollable");
}


function closeAddTaskElement() {
    document.getElementById('addTaskWindow').classList.add('d-none');
    document.body.classList.add("scrollable");
}


function clearAddTaskInBoard() { // Clears all values from the form.
    title.value = '';
    description.value = '';
    category.value = 'Select task category';
    contact.value = 'Select contacts to assign';
    date.value = '';
    subtask.value = '';
    selectedPrio = '';
    closeAddTaskElement();
    initBoard();
}


async function addToTaskInBoard() { // Adds a new task by gathering data from the form, sending the data to the backend, and displaying successful message.
    if (checkFormValid() == true) {
        let task = gatherFormData();
        tasks.push(task);

        await pushTasksToBackend(tasks);
        clearAddTaskInBoard()
        renderCategory();
        renderContacts();
    }
}


/**
 * Check if search-value is empty - if not, execute searchAll with send-value
 */
function search() {
    if (document.getElementById('search').value == "") {
        updateHTML();
    } else {
        let search = document.getElementById('search').value;
        search = search.toLowerCase();
        searchAll(search);
    }
}


/**
 * Search Function
 */
function searchAll(search) {
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let tr = task['taskTitle'];
        let ts = task['taskDescription'];
        let ta = task['taskCategoryName'];
        let list = document.getElementById(`${i}`)
        if (!tr.toLowerCase().includes(search) && !ts.toLowerCase().includes(search) && !ta.toLowerCase().includes(search)) {
            list.style.display = "none";
        } else {
            list.style.display = "";
        }
    }
}


function CategoryScroll() {
    document.getElementById('category').classList.add('category-inputfield-selector-scroll')
    document.getElementById('contactSelection').classList.add('category-inputfield-selector-scroll')
}