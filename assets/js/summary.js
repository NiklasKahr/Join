/**
 * Asynchronously initializes the summary by calling the necessary functions to display task counts and greetings.
 */
async function initSummary() {
    await init();
    insertTaskCountByState(tasks);
    insertTaskCountByStateUrgent(tasks);
    filterTasks(tasks)
    greet();
    rightMenu();
}


/**
 * Asynchronously greets the active user based on the current time.
 * The greeting message and the user name are displayed on the page.
 * @returns {Promise} - Resolves when the active user has been determined.
 */
async function greet() {
    await new Promise((resolve) => {
        let checkActiveUser = setInterval(() => {
            if (activeUser) {
                clearInterval(checkActiveUser);
                resolve();
            }
        }, 100);
    });
    setDate();
}


function setDate() {
    let myDate = new Date();
    let hrs = myDate.getHours();
    let greet;
    if (activeUser === 'Gast') { activeUser = 'Guest'; }
    if (hrs < 12)
        greet = 'Good Morning,';
    else if (hrs >= 12 && hrs <= 17)
        greet = 'Good Afternoon,';
    else if (hrs >= 17 && hrs <= 24)
        greet = 'Good Evening,';
    document.getElementById('lblGreetings').innerHTML = `<b style="font-size: 40px;white-space: nowrap;">
         ${greet}<h1 class="greetname"></h1> <span style="font-size: 45px; color: #29ABE2;">
            ${activeUser === 'asd' ? '' : activeUser[0].toUpperCase() + activeUser.slice(1)} </span>`;
}


function rightMenu() {
    document.getElementById('summaryid').classList.add('rightHover')
}


/**
 * Counts the number of tasks for each processing state and displays the count on the page.
 * @param {Array} tasks - An array of task objects.
 */
function insertTaskCountByState(tasks) {
    let todoCount = 0; let progressCount = 0;
    let feedbackCount = 0; let doneCount = 0;
    tasks.forEach(task => {
        switch (task.processing_state) {
            case "todoTable":
                todoCount++; break;
            case "progressTable":
                progressCount++; break;
            case "feedbackTable":
                feedbackCount++; break;
            case "doneTable":
                doneCount++; break;
        }
    });
    setCounter(todoCount, progressCount, feedbackCount, doneCount);
}


function setCounter(todoCount, progressCount, feedbackCount, doneCount) {
    document.getElementById("todoTablehtml").innerHTML = todoCount;
    document.getElementById("progressTablehtml").innerHTML = progressCount;
    document.getElementById("feedbackTablehtml").innerHTML = feedbackCount;
    document.getElementById("doneTablehtml").innerHTML = doneCount;
    document.getElementById("totalCount").innerHTML = todoCount + progressCount + feedbackCount + doneCount;
}


/**
 * Counts the number of tasks with the "Urgent" priority and displays the count on the page.
 * 
 * @param {Array} tasks - An array of task objects.
 */
function insertTaskCountByStateUrgent(tasks) {
    let Urgentcount = 0;
    tasks.forEach(task => {
        switch (task.taskPrio) {
            case "Urgent":
                Urgentcount++;
                break;
        }
    });
    document.getElementById("Urgentcount").innerHTML = Urgentcount;
}


/**
 * Filters the given tasks based on priority and sorts them based on the date. 
 * The closest task is displayed with its date on the page.
 * 
 * @param {Array} tasks - An array of task objects.
 */
function filterTasks(tasks) {
    let filteredTasks = tasks.filter(task => task.taskPrio === "Urgent");
    filteredTasks.sort((a, b) => new Date(a.taskDate) - new Date(b.taskDate));
    let closestTask = filteredTasks[0].taskDate;
    let date = new Date(closestTask);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = date.toLocaleDateString('en-US', options);
    document.getElementById("UrgentDate").innerHTML = formattedDate;
}