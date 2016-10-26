currentURL = null;

function login(){
	var name = $('#txtUserName').val();
	var password = $('#txtPassword').val();

	if(name === undefined || name.trim() === '') {
		alert('Please enter a username.');
		return;
	}
	
	if(password === undefined || password.trim() === '') {
		alert('Please enter a password.');
		return;
	}
	
	var hash=btoa(name + ':' + password);
	console.log(hash);
	setCookie('creds', hash, 20);
	
	validateUser();
	$('#dvLogin').addClass('hidden');
	$('#lbLogoff').removeClass('hidden');
}

exceptionFunction = function(){
	alert('Invalid User');
	$('#dvLogin').removeClass('hidden');
	$('#lbLogoff').addClass('hidden');
};