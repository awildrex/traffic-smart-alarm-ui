//constants in class
var users;
var tableFormat='<tr><td><img class="button" src="./images/edit1.png" onclick="editUser({0})"/>' +
				'<img class="button" src="./images/delete1.png" onclick="deleteUser({1})"/></td><td>{2}</td><td>{3}</td><td>{4}</td></tr>';

var userTable = null;
var userURL = 'http://localhost:8888/json/user.json';
var editRowNum = null;

function getUsers(data){
	users=data;
	for(var i=0; i<users.length; i++){
		addUserRow(users[i], i);
	}	
}

function editUser(rowNum){
	$('#txtUserName').val(users[rowNum].username);
	$('#cmbRole').val(users[rowNum].role);
	$('#cbActive').prop('checked', users[rowNum].active);
	$('#list').addClass('hidden');
	$('#edit').removeClass('hidden');
	
}

function deleteUser(rowNum){
	
}


function saveUser(){
	var username = $('#txtUsername').val();
	var password = $('#txtPassword').val();
	var role = $('#cmbRole').val();
	var active = $('#cbActive').val();
	
	var user = {
		"username": username,
		"password": password,
		"role": role,
		"active": active
	};
	
	var tempURL = userURL;
	if(editRowNum !== null){
		tempURL += '/' + users[editRowNum];
	}
	
	var callback = function(data){
		//alert(data);
		addUserRow(data, users.length);
		$('#list').addClass('hidden');
		$('#edit').removeClass('hidden');
	}
	
	postData(tempURL, user, callback);
}

function addUserRow(user, rowNum){
	if (userTable === null){
		userTable= $('#tblUsers')
	}
	var val = tableFormat.format(rowNum, rowNum, user.username, user.role, user.active);
	userTable.append(val);
}

$(document).ready(function() {
	getData(userURL, getUsers);
});