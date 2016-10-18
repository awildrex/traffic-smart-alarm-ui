/**
 * 
 */

var username='smart-alarm-admin';
var password='48e11eb5-5828-4f00-8ebd-30ebe850029b';
var hash=btoa(username + ':' + password);
console.log(hash);
var API_BASE_URL = "http://localhost:8080/";
//var API_BASE_URL = "http://localhost:8888/";

var USER_URL ='users';
//var USER_URL ='json/user.json';

//var CLOCK_URL ='clocks';
var CLOCK_URL = 'http://localhost:8888/json/clocks.json';

var CLOCK_ACCESS_URL='acls';
//var CLOCK_ACCESS_URL='http://localhost:8888/json/clockAccess.json';

var contentTable = null;
var editRowNum = null;
var tableFormat = null;

var editFunction = null;
var saveFunction = null;
var generateRow = null;

//global lists
var usersList = null;
var clockAccessList = null;
var clockList = null;



function loadPage(url){
	$('#menu').addClass('hidden');
	$.get(url, function(data, status){
	    //alert("Data: " + data + "\nStatus: " + status);
	    $("#content").html(data);
	});
}


function getData(url, callback) {
	if(!url.startsWith("http")) {
		url = API_BASE_URL + url;
	}
	
	$.ajax({
		  url: url,
		  type: 'GET',
		  success: callback,
		  error : errorCallback,
		  beforeSend:function(xhr){
		  		xhr.setRequestHeader("Authorization",'Basic ' + hash);
		  }
		});
}

function deleteData(url, callback){
	
	if(!url.startsWith("http")) {
		url = API_BASE_URL + url;
	}
	
	$.ajax({
		  url: url,
		  type: 'DELETE',
		  success: callback,
		  error : errorCallback,
		  beforeSend:function(xhr){
		  	xhr.setRequestHeader("Authorization",'Basic ' + hash);
		  }
		});
}

function postData(url, data, callback){
	if(!url.startsWith("http")) {
		url = API_BASE_URL + url;
	}
	console.log(JSON.stringify(data));
	$.ajax({
	    url: url,
	    dataType: 'json',
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify(data),
	    processData: false,
	    success: callback,
	    error: errorCallback,
 		beforeSend:function(xhr){
	  		xhr.setRequestHeader("Authorization",'Basic ' + hash);
		}
	});
}	

function cancelSave(){
	$('#list').removeClass('hidden');
	$('#edit').addClass('hidden');
	$('#btnAdd').removeClass('hidden');
}

function errorCallback(req){
	alert(req.responseText);
}

function getUserIndex(id){
	for(var i=0; i<userList.length; ++i){
		if(userList[i].id === id){
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