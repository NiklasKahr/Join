function generateCategory() {
    return /*html*/ `<p class="category-font">Category</p>
    <p class="font-red" id="missingCategory"></p>
    <div onclick="categorySelector()" id="categorySelector" class="category-inputfield input-font">
        <div class="selected-category" id="selected-category">
            <p class="selected-font">Select task category</p>
            <img class="arrow-down" src="../img/AddTask/arrow-down.png">
        </div>
        <div class="category-inputfield-selector display-none" id="selector">
            <div onclick="colorSelector()" class="selected-font category-hover">
                New category</div>
        </div>
        <div class="category-inputfield-selector display-none" id="category">


            <!-- Rendering Category Dropdown -->

        </div>
    </div>
    <div id="color" class="selected-color-container display-none">
        <div class="new-category-inputfield inputfield-box">
            <input required id="newCategoryInput" class="border-transparent" type="text"
                placeholder="add new category">
            <div class="add-cancel-box">
                <img onclick="addNewCategory()" class="newcategory-btn" src="../img/AddTask/check.png">
                <div class="line"></div>
                <img onclick="renderCategory()" class="newcategory-btn"
                    src="../img/AddTask/cross.png">
            </div>
        </div>
        <div class="selected-color-container">
            <div>
                <div id="fillNewCategory" class="display-none choose-color">Fülle das Feld aus!</div>
                <div id="chooseAColor" class="display-none choose-color">Wähle eine Farbe!</div>
            </div>
            <div class="selected-color">
                <div onclick="addNewColor(1)" id="blue" class="pointer blue circle"></div>
                <div onclick="addNewColor(2)" id="red" class="pointer red circle"></div>
                <div onclick="addNewColor(3)" id="green" class="pointer green circle"></div>
                <div onclick="addNewColor(4)" id="orange" class="pointer orange circle"></div>
                <div onclick="addNewColor(5)" id="purple" class="pointer purple circle"></div>
                <div onclick="addNewColor(6)" id="yellow" class="pointer yellow circle"></div>
            </div>

        </div>
    </div>
`;
}

function generateSelectedCategory(id) {
    return /*html*/ `<div class="selected-category" id="selected-category">
                <div class="display-flex align-center">
                    <p class="selected-font" id="selection${id}">${categories[id].name}</p><div class="${categories[id].color} circle"></div>
                </div>
            <img class="arrow-down" src="../img/AddTask/arrow-down.png">
        </div>
        <div class="category-inputfield-selector display-none" id="selector">
            <div onclick="colorSelector()" class="selected-font category-hover">New category</div>
        </div>
        <div class="category-inputfield-selector display-none" id="category">
                           
            <!-- Rendering Category Dropdown -->

        </div>`;
}

function generateContacts() {
    const selectedContact = "Select contacts to assign";
    let html = /*html*/`
      <p class="assigned-font">Assigned to</p>
      <p class="font-red" id="missingContacts"></p>
      <div id="newContact1" class="category-inputfield input-font">
        <div onclick="contactSelector()" class="selected-category">
          <p class="selected-font selected-contact">${selectedContact}</p>
          <img class="arrow-down" src="../img/AddTask/arrow-down.png">
        </div>
        <div class="category-inputfield-selector display-none" id="contact">
          <div onclick="newContact()" class="display-flex space-between align-center category-hover">
            <div class="selected-font">Invite new contact</div>
            <img class="mr-18 invite-img" src="../img/AddTask/invite.png">
          </div>
          <div id="contactSelection">
      `;
  
    const contactCheckboxes = contacts.map((contact, index) => {
      return `
        <div onclick="toggleSelectedContact(${index})" class="display-flex align-center clickable">
          <div class="checkbox-background" style="background: ${contact.selected ? '#54a8ff' : '#b4b4b4'}"></div>
          <label for="checkbox${index}">${contact.name}</label>
        </div>`;
    }).join('');
  
    html += contactCheckboxes;
    html += `
          </div>
        </div>
      </div>
      <div id="newContact2" class="new-category-inputfield inputfield-box display-none">
        <input id="newContactInput" class="border-transparent" type="text" placeholder="add new contact">
        <div class="add-cancel-box">
          <img onclick="addNewContact()" class="newcategory-btn" src="../img/AddTask/check.png">
          <div class="line"></div>
          <img onclick="newContact()" class="newcategory-btn" src="../img/AddTask/cross.png">
        </div>
      </div>
    `;
    return html;
  }


function generateAddTaskBacklog() {
    return /*html*/ `
    <form class="add-task-content">
				<div class="content-left">
					<div class="margin-left">
						<h1>Add Task</h1>
						<div class="title-box">
							<p class="title-font">Title</p>
							<p class="font-red" id="missingTitle"></p>
							<input required id="title" class="title-inputfield input-font" type="text"
								placeholder="Enter a title">
						</div>
						<div class="description-box">
							<p class="description-font">Description</p>
							<p class="font-red" id="missingDescription"></p>
							<textarea id="description" class="description-inputfield input-font" type="text"
								placeholder="Enter a Description"></textarea>
						</div>
						<div class="category-box" id="categoryContainer">
		
							<!-- Rendering Category -->
		
						</div>
		
						<div class="assigned-box" id="contactContainer">
		
							<!-- Rendering Contacts -->
		
						</div>
					</div>
				</div>
		
				<div class="parting-line"></div>
		
				<div class="content-right">
					<div class="taskresponsive">
						<div class="date-box">
							<p class="date-font">Due date</p>
							<p class="font-red" id="missingDate"></p>
							<input required id="date" class="date-inputfield input-font" type="date" lang="en-US"
								placeholder="dd/mm/yyyy" onclick="(this.type='date')" onblur="(this.type='date')">
						</div>
						<div class="prio-box">
							<p class="prio-font">Prio</p>
							<div class="prio-choice">
								<button onclick="changePrio(0)" class="prio-inputfield-urgent">
									<img id="urgentClicked" class="display-none" src="../img/AddTask/urgent-btn-clicked.png">
									<img id="urgent" class="" src="../img/AddTask/urgent-btn.png"></button>
								<button onclick="changePrio(1)" class="prio-inputfield-medium">
									<img id="mediumClicked" class="display-none" src="../img/AddTask/medium-btn-clicked.png">
									<img id="medium" src="../img/AddTask/medium-btn.png"></button>
								<button onclick="changePrio(2)" class="prio-inputfield-low">
									<img id="lowClicked" class="display-none" src="../img/AddTask/low-btn-clicked.png">
									<img id="low" src="../img/AddTask/low-btn.png"></button>
							</div>
						</div>
						<div class="subtask-box">
							<p class="subtask-font">Subtasks</p>
							<div class="subtask-inputfield input-font">
								<input required id="subtask" class="outline-none" type="text"
									placeholder="Add new subtask">
								<img onclick="addSubTask()" class="hover-btn" src="../img/AddTask/plus.png">
							</div>
							<div id="subtasks">

								<!-- Rendering Subtasks -->

							</div>
						</div>
						<div class="create-cancel-container">
							<img onclick="clearTasks()" class="cancel-btn" src="../img/AddTask/cancel-btn.png">
							<img onclick="addToTaskOnBoard()" class="create-btn" src="../img/AddTask/createTask-btn.png">
						</div>
					</div>
				</div>
			</form>
    `;
}