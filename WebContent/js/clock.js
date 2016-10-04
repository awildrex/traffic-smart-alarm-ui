var clocks;
var clockTableFormat='<tr><td><img class="button" src="./images/edit1.png" onclick="editClock({0})"/>' +
					 '<img class="button" src="./images/delete1.png" onclick="deleteClock({1})"/></td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td></tr>';
var clockURL = 'http://localhost:8888/json/clocks.json';
editRowNum = null;
contentTable=null;

function getClocks(data){
	clocks=data;
	for(var i=0; i<clocks.length; i++){
		addClockRow(clocks[i], i);
	}	
}

function editClock(rowNum){
	if(rowNum !== null) {
		$('#txtName').val(clocks[rowNum].name);
		$('#txtDescription').val(clocks[rowNum].description);
		$('#txtLocation').val(clocks[rowNum].location);
		$('#cbActive').prop('checked', clocks[rowNum].active);
	}
	$('#list').addClass('hidden');
	$('#edit').removeClass('hidden');
}

function deleteClock(rowNum){
	var url = clockURL + rowNum;
	
	var success=function(){
		//TODO: remove row from table;
	}
	
	deleteData(url, success);
}


function saveClock(){
	var name = $('#txtName').val();
	var description = $('#txtDescription').val();
	var location = $('#txtLocation').val();
	var active = $('#cbActive').val();
	
	var clock = {
		"name": name,
		"description": description,
		"location": location,
		"active": active
	};
	
	var tempURL = clockURL;
	if(editRowNum !== null){
		tempURL += clocks[editRowNum];
	}
	
	var callback = function(data){
		//alert(data);
		addClockRow(data, clock.length);
		$('#list').addClass('hidden');
		$('#edit').removeClass('hidden');
	}
	
	postData(tempURL, clock, callback);
}

function addClockRow(obj, rowNum){
	if (contentTable === null){
		contentTable= $('#tblUsers')
	}
	var val = clockTableFormat.format(rowNum, rowNum, obj.name, obj.description, obj.location, obj.active);
	contentTable.append(val);
}

$(document).ready(function() {
	getData(clockURL, getClocks);
});