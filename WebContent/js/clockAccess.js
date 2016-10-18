userTable = null;
usersList = null;
clockList = null;


tableFormat = '<div id="ca_{0}"><div class="floatLeft" style="width:15%; min-width:25px; height:30px;"><img class="button" src="./images/edit1.png" onclick="editFunction({1})"/>' +
			  '<img class="button" src="./images/delete1.png" onclick="deleteUser({2})"/></div>' +
			  '<div class="floatLeft" style="width:40%; min-width:50px; height:30px;">{3}</div>' +
    		  '<div class="floatLeft" style="width:45%; min-width:50px; height:30px;">{4}</div></div>';
    		  
var usersAccessTable = '<div id="user_{0}"><div class="floatLeft" style="width:15%; min-width:25px; height:30px;">' +
					   '<img class="button" src="./images/delete1.png" onclick="toggleUserOption({1}, false)"/></div>' +
					   '<div class="floatLeft" style="width:85%; min-width:50px; height:30px;"><span style="height:30px;">{2}<span></div>' +
					   '</div>';

function clockAccessCallback(data) {
	clockAccessList=data;
	for(var i=0; i< clockAccessList.length; ++i){
		generateRow(clockAccessList[i]);
	}	
}

function clockAccessUserCallback(data){
	usersList=data;
	var cbUser = $('#cbUsers');
	for(var i=0; i<usersList.length; ++i){
		cbUser.append('<option value="' + usersList[i].id +'">' + usersList[i].username + '</option>'); 
	}
	getData(CLOCK_ACCESS_URL, clockAccessCallback);
}

function clockAccessClockCallback(data){
	clockList=data;
	var cbUser = $('#cbClocks');
	for(var i=0; i<clockList.length; ++i){
		cbUser.append('<option value="' + clockList[i].id +'">' + clockList[i].name + '</option>'); 
	}
	getData(USER_URL, clockAccessUserCallback);
}

editFunction = function(rowNum){
	//enable all disabled options
	var options = $('#cbUsers').find('option[disabled]');
	for(var i =0; i<options.length; ++i){
		options.prop('disabled', false);
	}
	$('#curUsers').empty();
	if(rowNum !== null ){
		editRowNum = getClockAccessIndex(rowNum);
		console.log(editRowNum);
		if(editRowNum > -1) {
			$('#cbClocks').val(clockAccessList[editRowNum].clock);
			var clockID = getClockIndex(clockAccessList[editRowNum].clock);
			$('#spClock').text(clockList[clockID].name);
			
			$('#cbClocks').addClass('hidden');
			$('#spClock').removeClass('hidden');
		
			
			for(var i=0; i<	clockAccessList[editRowNum].allowed_users.length; ++i){
				toggleUserOption(clockAccessList[editRowNum].allowed_users[i], true);
			}
		}
	} else {
		$('#cbClocks').val("Select Clock");
		$('#cbUsers').val("Select User");	
		$('#cbClocks').removeClass('hidden');
		$('#spClock').addClass('hidden');
	}
	
	$('#btnAdd').addClass('hidden');
	$('#list').addClass('hidden');
	$('#edit').removeClass('hidden');
};

//TODO: HERE
saveFunction = function(){
	var userIDs=[];
	var clockID=null;
	var requestType='POST';
	var usersSelected = $('#cbUsers').find('option[disabled]');
	var tempURL = CLOCK_ACCESS_URL;
	
	for(var i=0; i<usersSelected.length; ++i){
		userIDs.push(usersSelected[i].value);
	}
	
	
	if(editRowNum !== null){
		tempURL += '/' + clockAccessList[editRowNum].id;
		clockID = clockAccessList[editRowNum].clock;
	} else {
		clockID = $('#cbClocks').val();
	}
	
	var access = {
		"clock": clockID,
		"allowed_users": userIDs
	};
	
	console.log(tempURL);
	console.log(access);
	
	var callback = function(data){
		if(editRowNum !== null){
			clockAccessList[editRowNum] = data;
		} else {
			clockAccessList.push(data);
		}
		
		generateRow(data);
		editRowNum = null;
		$('#list').addClass('hidden');
		$('#edit').removeClass('hidden');
		$('#btnAdd').removeClass('hidden');
	}
	
	postData(tempURL, access, callback);
};

generateRow = function(clockAccess){
	var usernames = '', 
		clockname = '';
		
	if (userTable === null){
		userTable= $('#tblUsers')
	}
	
	var clockIndex = getClockIndex(clockAccess.clock);
	if( clockIndex >-1) {
		clockname = clockList[clockIndex].name;
	}
	for(var i=0; i<	clockAccess.allowed_users.length; ++i){
		if (usernames !== '') {
			usernames = usernames + ', ' + getUserName(clockAccess.allowed_users[i]);
		} else {
			usernames = getUserName(clockAccess.allowed_users[i]);
		}
	}
	
	var val = tableFormat.format(clockAccess.id, clockAccess.id, clockAccess.id, clockname, usernames);
	
	var div = $('#ca_' + clockAccess.id);
	if( div.length){
		div.html(val);
	} else {
		userTable.append(val);
	}
	
};

function getUserName(id) {
	for(var i=0; i<usersList.length; ++i){
		if(usersList[i].id === id){
			return usersList[i].username;
		}
	}
	return '';

}

function addUser(){
 	var ddl = $('#cbUsers');
 	if(ddl.val() !== '-1') {
 		toggleUserOption(ddl.val(), true);
 	} else {
 		alert('Please select a user from the list');
 	}
}

function toggleUserOption(id, toggle){
	var curUsers = $('#curUsers');
	var val;
	var ddl = $('#cbUsers');
	
	if(toggle===true){
		for(var i=0; i<usersList.length; ++i){
			if(usersList[i].id == id){
				val = usersAccessTable.format(id, id, usersList[i].username);
				curUsers.append(val);
				//ddl.val('Select User');
				ddl.find('option[value='+id+']').prop('disabled', toggle);
			}
		}
	} else {
		$('#user_'+id).remove();
		ddl.find('option[value='+id+']').prop('disabled', toggle);
	}
}

$(document).ready(function() {
	getData(CLOCK_URL, clockAccessClockCallback);
});