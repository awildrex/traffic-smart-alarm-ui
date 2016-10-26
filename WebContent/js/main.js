var API_BASE_URL = "localhost:8080/";
//var API_BASE_URL = "http://localhost:8888/";

var USER_URL ='users';
//var USER_URL ='json/user.json';

var CLOCK_URL ='clocks';
//var CLOCK_URL = 'http://localhost:8888/json/clocks.json';

var CLOCK_ACCESS_URL='acls';
//var CLOCK_ACCESS_URL='http://localhost:8888/json/clockAccess.json';

var CUR_USER_URL = 'currentUser'

var currentUser = null;
var contentTable = null;
var editRowNum = null;
var tableFormat = null;
var currentURL = null;

var editFunction = null;
var saveFunction = null;
var generateRow = null;
var getFuntion	 = null;
var exceptionFunction = null;


//global lists
var usersList = [];
var clockAccessList = [];
var clockList = [];



function loadPage(url){
	$('#menu').addClass('hidden');
	$.get(url, function(data, status){
	    //alert("Data: " + data + "\nStatus: " + status);
	    $("#content").html(data);
	});
}


function getData(url, callback) {
	var val = getCookie('creds');
	if( val === null ) {
		loadPage('./partials/login.html');
		return;
	}
	console.log(val);
	
	if(!url.startsWith("http")) {
		url = 'http://' + API_BASE_URL + url;
	}
	console.log(url);
	$.ajax({
		  url: url,
		  type: 'GET',
		  beforeSend:function(xhr){
		  		xhr.setRequestHeader("Authorization",'Basic ' + val);
		  }
		}).done(function(data){
			//alert(data);
			callback(data);
		}).fail(function(thing){
			//alert(thing);
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
		url = 'http://' + API_BASE_URL + url;
	}
	
	$.ajax({
		  url: url,
		  type: 'DELETE',
		  beforeSend:function(xhr){
		  	xhr.setRequestHeader("Authorization",'Basic ' + val);
		  }
		}).done(function(){
			//alert(data);
			callback();
		}).fail(function(thing){
			//alert(thing);
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
		url = 'http://' + API_BASE_URL + url;
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
			//alert(data);
			callback(data);
		}).fail(function(thing){
			//alert(thing);
			errorCallback(thing);
		});
}	

function cancelSave(){
	$('#list').removeClass('hidden');
	$('#edit').addClass('hidden');
	$('#btnAdd').removeClass('hidden');
}

function errorCallback(req){
	if(exceptionFunction !== null) {
		exceptionFunction(req);
	}
	alert(req.responseText);
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
		if(clockAccessList[i].id == id){
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
	if( val !== null ) {
		var url = 'http://' + API_BASE_URL + CUR_USER_URL; 
		console.log(url);
		$.ajax({
		  url: url,
		  type: 'GET',
		  beforeSend:function(xhr){
		  		xhr.setRequestHeader("Authorization",'Basic ' + val);
		  }
		}).done(function(data){
			console.log('here');
			currentUser = data;
			setCookie('creds', val, 20);
			$('#icon').removeClass('hidden');
			$('#lbLogoff').removeClass('hidden');
		}).fail(function(data){
			alert(data.status);
			//errorCallback(thing);
			
			if(data.status === 403 ){
				alert('Invalid login');
				if (currentURL !== null ){
					loadPage('./partials/login.html');
				} else {
					exceptionFunction();
				}
				//invalidate cookie
				setCookie('creds', null, -1);
			}
		});
	} else {
		loadPage('./partials/login.html');
	}
}

$(document).ready(function() {
	validateUser();
});