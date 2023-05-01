async function addUser() {
	let username = document.getElementById('name').value;
	let email = document.getElementById('email').value;
	let password = document.getElementById('password').value;

	for (let i = 0; i < user.length; i++) {
		if (email === user[i].email) {
			showUserExist();
			return false;
		}
	}
	await checkPassword(username, email, password);
}


async function checkPassword(username, email, password) {
	if (password.length > 4) {
		user.push({ username: username, email: email, password: password });
		await backend.setItem('user', JSON.stringify(user));
		removeUserExist();
		removeAlert();
		succeslogin();
		setTimeout(openlogin, 1000);
	} else {
		showend();
	}
}


async function deleteUser(email) {
	user = user.filter(user => user.email !== email);
	await backend.setItem('user', JSON.stringify(user));
	location.reload();
}


async function clearUsers() {
    user = [];
    await backend.setItem('user', JSON.stringify(user));
	tasks = [];
    await backend.setItem('tasks', JSON.stringify(tasks));
    location.reload();
}


async function getInfo() {
	let email = document.getElementById('email').value
	let password = document.getElementById('password').value
	for (let i = 0; i < user.length; i++) {
		if (email == user[i].email && password == user[i].password) { //check is user input matches email and password of a current index of the user array
			activeUser = user[i].username;
			await backend.setItem("activeUser", JSON.stringify(activeUser));
			succeslogin();
			showendremove();
			setTimeout(opensummary, 3000);
			return;
		}
	}
	showend()
}


function opensummary() {
	window.location.href = 'index.html'
}


function showend() {
	document.getElementById('alertspan').classList.remove('d-none');
}


function showUserExist() {
	document.getElementById('userexist').classList.remove('d-none');
}


function removeUserExist() {
	document.getElementById('userexist').classList.add('d-none');
}


function removeAlert() {
	document.getElementById('alertspan').classList.add('d-none');
}


function showendremove() {
	document.getElementById('alertspan').classList.add('d-none');
}


function succeslogin() {
	document.getElementById('alertspanloggin').classList.remove('d-none');
}


function reloadSignUp() {
	location.reload();
}