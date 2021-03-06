//constants in class

contentTable = null;
exceptionFunction = null;

tableFormat='<div id="user_{0}"><div class="floatLeft" style="width:15%; min-width:25px; height:30px;"><img class="button" src="./images/edit1.png" onclick="editUser({1})"/>' +
'<img class="button" src="./images/delete1.png" onclick="deleteUser({2})"/></div>' +
'<div class="floatLeft" style="width:35%; min-width:50px; height:30px;"><span class="hidden floatleft" style="white-space:nowrap;">Name:</span> {3}</div>' +
'<div class="floatLeft" style="width:40%; min-width:100px; height:30px;"><span class="hidden">Description:</span>{4}</div>' +
'<div class="floatLeft" style="width:10%; min-width:50px; height:30px;"><span class="hidden">Location:</span>{5}</div></div>';

currentURL = USER_URL;

getFuntion = function(data){
	usersList=data;
	for(var i=0; i<usersList.length; i++){
		addUserRow(usersList[i], i);
	}
}

function editUser(id){
	if(id !== null ){
		editRowNum = getUserIndex(id);
		if(editRowNum > -1) {
			$('#txtUserName').val(usersList[editRowNum].username);
			$('#cmbRole').val(usersList[editRowNum].role);
			$('#cbActive').prop('checked', usersList[editRowNum].active);
		} else {
			editRowNum = null;
			return;
		}
	} else {
		editRowNum = null;
		$('#txtUserName').val("");
		$('#txtPassword').val("");
		$('#txtPassword1').val('');
		$('#cmbRole').val("-1");
		$('#cbActive').prop('checked', false);
	}
	$('#btnAdd').addClass('hidden');
	$('#list').addClass('hidden');
	$('#edit').removeClass('hidden');
}

function deleteUser(id){
	var tempURL = USER_URL + '/' + id;

	var callback = function(){
		$('#user_' + id).remove();
	};

	deleteData(tempURL, callback);
}


function saveUser(){
	var username = $('#txtUserName').val();
	var password = $('#txtPassword').val();
	var password2 = $('#txtPassword1').val();
	var role = $('#cmbRole').val();
	var active = $('#cbActive').is(':checked');
	var message = [];

	var user = {
		"username": username,
		"password": password,
		"role": role,
		"active": active
	};

	message = validateData(user);

	if(password.length > 0 && password !== password2) {
		message.push('Passwords do not match');
	}


	if(message.length > 0 ){
		showErrorMessage(message);
		return;
	}

	var tempURL = USER_URL;
	var postType = false;
	if(editRowNum !== null){
		tempURL += '/' + usersList[editRowNum].id;
		postType = true;
	}

	var callback = function(data){
		if(editRowNum !== null){
			usersList[editRowNum] = data;

		} else {
			usersList.push(data);
		}

		addUserRow(data);
		$('#btnAdd').removeClass('hidden');
		$('#list').removeClass('hidden');
		$('#edit').addClass('hidden');
	}

	postData(tempURL, user, callback, postType);
}

function addUserRow(user){
	if (contentTable === null){
		contentTable= $('#tblUsers')
	}

	var val = tableFormat.format(user.id, user.id, user.id, user.username, user.role, user.active);
	var div = $('#user_' + user.id);

	if( div.length){
		div.html(val);
	} else {
		contentTable.append(val);
	}
}

validateData = function(data){
	var messages = [];

	if(data.username === undefined || data.username.trim() === '') {
		messages.push('Please enter a valid username.');
	}

	if(editRowNum === null && (data.password !== undefined && data.password.trim() === '')){
		messages.push('Please enter a valid password.');
	}

	if(data.role === undefined || data.role === '-1' || data.role === null) {
		messages.push('Please select a valid user role.');
	}

	return messages;
}

exceptionFunction = function(req) {

};

$(document).ready(function() {
	validateUser();
	getData(USER_URL, getFuntion);
});
