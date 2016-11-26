var API_BASE_URL = 'http://smartalarmopenshift-sourcecoders.rhcloud.com/';
//var API_BASE_URL = "http://localhost:8888/";

var USER_URL ='users';
//var USER_URL ='json/user.json';

var CLOCK_URL ='clocks';
//var CLOCK_URL = 'http://localhost:8888/json/clocks.json';

var CLOCK_ACCESS_URL='acls';
//var CLOCK_ACCESS_URL='http://localhost:8888/json/clockAccess.json';

var CUR_USER_URL = 'currentUser';

var ALARMS_URL = 'alarms';
//var ALARMS_URL = 'http://localhost:8888/json/alarms.json';

var currentUser = null;
var contentTable = null;
var editRowNum = null;
var tableFormat = null;
var currentURL = null;

var editFunction = null;
var deleteFunction = null;
var saveFunction = null;
var validateData = null;
var generateRow = null;
var getFuntion	 = null;
var exceptionFunction = null;
var authenticated = false;


//global lists
var usersList = [];
var clockAccessList = [];
var clockList = [];
var alarmsList = [];


function loadPage(url){
	//$('#menu').addClass('hidden');
	$.get(url, function(data, status){
	    $("#content").html(data);
	});
}


function getData(url, callback) {
	var val = getCookie('creds');
	if( val === null ) {
		loadPage('./partials/login.html');
		return;
	}

	if(!url.startsWith("http")) {
		url = API_BASE_URL + url;
	}

	$.ajax({
		  url: url,
		  type: 'GET',
		  beforeSend:function(xhr){
		  		xhr.setRequestHeader("Authorization",'Basic ' + val);
		  }
		}).done(function(data){
			callback(data);
		}).fail(function(thing){
			errorCallback(thing);
		});
}

function deleteData(url, callback){
	var val = getCookie('creds');
	if( val === null ) {
		loadPage('./partials/login.html');
		return;
	}

	if(!url.startsWith("http")) {
		url = API_BASE_URL + url;
	}

	$.ajax({
		  url: url,
		  type: 'DELETE',
		  beforeSend:function(xhr){
		  	xhr.setRequestHeader("Authorization",'Basic ' + val);
		  }
		}).done(function(){
			callback();
		}).fail(function(thing){
			errorCallback(thing);
		});
}

function postData(url, data, callback, put){
	var val = getCookie('creds');
	if( val === null ) {
		loadPage('./partials/login.html');
		return;
	}

	if(!url.startsWith("http")) {
		url = API_BASE_URL + url;
	}

	var type = 'POST';

	if(put){
		type = 'PUT';
	}

	$.ajax({
	    url: url,
	    dataType: 'json',
	    type: type,
	    contentType: 'application/json',
	    data: JSON.stringify(data),
	    processData: false,
 		beforeSend:function(xhr){
	  		xhr.setRequestHeader("Authorization",'Basic ' + val);
		}
	}).done(function(data){
			callback(data);
		}).fail(function(thing){
			errorCallback(thing);
		});
}

function cancelSave(){
	$('#list').removeClass('hidden');
	$('#edit').addClass('hidden');
	$('#btnAdd').removeClass('hidden');
}

function errorCallback(req){
	var messages = [];

	if(req.status === 500){
		messages.push('An unknown error occuried, please wait and try again.');
	} else if (req.status >= 400){
		messages.push(req.responseJSON.message);
	}

	if(messages.length > 0){
		showErrorMessage(messages);
	}

	if(exceptionFunction !== null) {
		exceptionFunction(req);
	}
}

function getAlarmIndex(id){
	for(var i=0; i<alarmsList.length; ++i){
		if(alarmsList[i].id === id){
			return i;
		}
	}
	return -1;
}

function getUserIndex(id){
	for(var i=0; i<usersList.length; ++i){
		if(usersList[i].id === id){
			return i;
		}
	}
	return -1;
}

function getClockIndex(id){
	for(var i=0; i<clockList.length; ++i){
		if(clockList[i].id === id){
			return i;
		}
	}
	return -1;
}

function getClockAccessIndex(id){
	for(var i=0; i<clockAccessList.length; ++i){
		if(clockAccessList[i].clockId == id){
			return i;
		}
	}
	return -1;
}

String.prototype.format = function() {
  var str = this;
  for (var i = 0; i < arguments.length; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm");
    str = str.replace(reg, arguments[i]);
  }
  return str;
}

function getCookie(cname) {
	var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return null;
}

function setCookie(cname, cvalue, exMinutes) {
    var d = new Date();
    d.setTime(d.getTime() + (exMinutes*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function validateUser(){

	var val = getCookie('creds');

	if(currentUser !== null && currentUser.role === 'USER' &&
		( currentURL === CLOCK_ACCESS_URL || currentURL === CLOCK_URL ||
			currentURL === USER_URL) ) {
					loadPage('./partials/403.html');
					return;
	}

	if( val !== null ) {
		var url = API_BASE_URL + CUR_USER_URL;
		$.ajax({
		  url: url,
		  type: 'GET',
			data: null,
		  beforeSend:function(xhr){
		  		xhr.setRequestHeader("Authorization",'Basic ' + val);
		  }
		}).done(function(data){
			currentUser = data;
			setCookie('creds', val, 1);
			if(authenticated === false){
				$('#menu').removeClass('hidden');
				$('#lbLogoff').removeClass('hidden');
				var menuURL = './partials/userMenu.html';
				if(currentUser.role === 'ADMIN') {
					menuURL = './partials/menu.html';
				}
				$.get(menuURL, function(data, status){
						$("#menu").html(data);
				});

				authenticated = true;
				$("#content").html('');
			}
		}).fail(function(data){
			if(data.status === 403 ){
				showErrorMessage('Invalid username or password');
				if (currentURL !== null ){
					loadPage('./partials/login.html');
					authenticated = false;
				} else {
					exceptionFunction();
				}
				//invalidate cookie
				setCookie('creds', null, -1);
			} else {
				showErrorMessage('An unknown error occuried, please wait and try again.');
				setCookie('creds', null, -1);

				return;
			}
		});
	} else {
		loadPage('./partials/login.html');
			authenticated = false;
			$("#menu").html('');
			$('#lbLogoff').addClass('hidden');

	}
}

$(document).ready(function() {
	validateUser();
});

function showErrorMessage(message){
	var temp = [];
	var i=0;
	var html ='';
	var template='<span>{0}</span><br/>';

	if (typeof message === 'string') {
		temp.push(message);
	} else {
		temp = message;
	}

	for(; i<temp.length; ++i){
		html += template.format(temp[i]);
	}

	$('#dvMessage').empty();
	$('#dvMessage').append(html);

	toggleLightBox(true);
}

function toggleLightBox(toggle){
	if(toggle === true){
		$('#dvErrors').show();
		$('#mask').show();
	} else {
		$('#dvErrors').hide();
		$('#mask').hide();
	}
}
