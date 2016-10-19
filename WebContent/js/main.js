/**
 * 
 */

var username='smart-alarm-admin';
var password='password here';
var hash=btoa(username + ':' + password);
console.log(hash);
var API_BASE_URL = "http://localhost:8080/";
//var API_BASE_URL = "http://localhost:8888/";

var USER_URL ='users';
//var USER_URL ='json/user.json';

var CLOCK_URL ='clocks';
//var CLOCK_URL = 'http://localhost:8888/json/clocks.json';

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
	console.log(url);
	$.ajax({
		  url: url,
		  type: 'GET',
		  beforeSend:function(xhr){
		  		xhr.setRequestHeader("Authorization",'Basic ' + hash);
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
	
	if(!url.startsWith("http")) {
		url = API_BASE_URL + url;
	}
	
	$.ajax({
		  url: url,
		  type: 'DELETE',
		  beforeSend:function(xhr){
		  	xhr.setRequestHeader("Authorization",'Basic ' + hash);
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
	if(!url.startsWith("http")) {
		url = API_BASE_URL + url;
	}
	console.log(JSON.stringify(data));
	console.log(url);
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
	  		xhr.setRequestHeader("Authorization",'Basic ' + hash);
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