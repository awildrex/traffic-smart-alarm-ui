currentURL = null;

function login(){
	var name = $('#txtUserName').val();
	var password = $('#txtPassword').val();
	var messages;

	var user = {
		"username": name,
		"password": password
	};

	messages = validateData(user);

	if (messages.length > 0){
		showErrorMessage(messages);
		return;
	}

	var hash=btoa(name + ':' + password);
	setCookie('creds', hash, 20);

	validateUser();
	$('#dvLogin').addClass('hidden');
	$('#lbLogoff').removeClass('hidden');
}

exceptionFunction = function(){
	//alert('Invalid User');
	$('#dvLogin').removeClass('hidden');
	$('#lbLogoff').addClass('hidden');
};

validateData = function(data){
	var messages = [];
	if(data.username === undefined || data.username.trim() === '') {
		messages.push('Please enter a username.');
	}

	if(data.password === undefined || data.password.trim() === '') {
		messages.push('Please enter a password.');
	}
	return messages;
};
