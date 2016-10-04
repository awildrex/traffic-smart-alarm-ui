/**
 * 
 */

var API_BASE_URL = "http://localhost:8080/";
var contentTable = null;
var editRowNum = null;

function loadPage(url){
	$.get(url, function(data, status){
	    //alert("Data: " + data + "\nStatus: " + status);
	    $("#content").html(data);
	});
}

function getData(url, callback){
	
	if(!url.startsWith("http")) {
		url = API_BASE_URL + url;
	}
	
	var data;
	
	$.ajax({
		  url: url,
		  type: 'GET',
		  dataType: 'json',
		  data: data,
		  success: callback,
		  error : ajaxFailure
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
		  error : ajaxFailure
		});
}

function postData(url, data, callback){
	
	if(!url.startsWith("http")) {
		url = API_BASE_URL + url;
	}
	
	$.ajax({
	    url: url,
	    dataType: 'json',
	    type: 'post',
	    contentType: 'application/json',
	    data: JSON.stringify( data ),
	    processData: false,
	    success: callback,
	    error: ajaxFailure
	});
}	

function ajaxFailure(jqXHR, textStatus, errorThrown){
	//TODO: add error lightbox
	alert(textStatus);
};


function cancelSave(){
	$('#list').removeClass('hidden');
	$('#edit').addClass('hidden');
}

String.prototype.format = function() {
  var str = this;
  for (var i = 0; i < arguments.length; i++) {       
    var reg = new RegExp("\\{" + i + "\\}", "gm");             
    str = str.replace(reg, arguments[i]);
  }
  return str;
}