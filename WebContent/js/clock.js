
tableFormat='<div id="cl_{0}"><div class="floatLeft" style="width:15%; min-width:25px; height:30px;"><img class="button" src="./images/edit1.png" onclick="editClock({1})"/>' +
'<img class="button" src="./images/delete1.png" onclick="deleteClock({2})"/></div>' +
'<div class="floatLeft" style="width:15%; min-width:50px; height:30px;"><span class="hidden floatleft" style="white-space:nowrap;">Name:</span> {3}</div>' +
'<div class="floatLeft" style="width:30%; min-width:100px; height:30px;"><span class="hidden">Description:</span>{4}</div>' +
'<div class="floatLeft" style="width:30%; min-width:100px; height:30px;"><span class="hidden">Location:</span>{5}</div>' +
'<div class="floatLeft" style="width:10%; min-width:50px; height:30px;"><span class="hidden">Active:</span>{6}</div></div>';

function getClocks(data){
	clockList=data;
	for(var i=0; i<clocks.length; i++){
		addClockRow(clocks[i]);
	}	
}

function editClock(id){
	if(id !== null) {
		editRowNum = getClockIndex(id);
		if(editRowNum >-1) {
			$('#txtName').val(clocks[editRowNum].name);
			$('#txtDescription').val(clocks[editRowNum].description);
			$('#txtLocation').val(clocks[editRowNum].location);
			$('#cbActive').prop('checked', clocks[editRowNum].active);
		} else {
			editRowNum = null;
			return;
		}
	} else {
		editRowNum = null;
		$('#txtName').val("");
		$('#txtDescription').val("");
		$('#txtLocation').val("");
		$('#cbActive').prop('checked', false);
	}
	
	$('#btnAdd').addClass('hidden');
	$('#list').addClass('hidden');
	$('#edit').removeClass('hidden');
}

function deleteClock(id){
	var tempURL = CLOCK_URL + '/' + id;
	
	var callback = function(){
		$('#cl_' + id).remove();
	};
	
	deleteData(tempURL, callback);
}


function saveClock(){
	var name = $('#txtName').val();
	var description = $('#txtDescription').val();
	var location = $('#txtLocation').val();
	var active = $('#cbActive').is(':checked');
	
	var clock = {
		"name": name,
		"description": description,
		"location": location,
		"active": active
	};
	
	var tempURL = CLOCK_URL;
	if(editRowNum !== null){
		tempURL += clocks[editRowNum].id;
	}
	
	var callback = function(data){
		if(editRowNum !== null){
			clockList[editRowNum] = data;
		} else {
			clockList.push(data);
		}
		
		addClockRow(data);

		$('#btnAdd').removeClass('hidden');
		$('#list').removeClass('hidden');
		$('#edit').addClass('hidden');
	}
	
	postData(tempURL, clock, callback);
}

function addClockRow(obj){
	if (contentTable === null){
		contentTable= $('#tblUsers')
	}
	var val = tableFormat.format(obj.id, obj.id, obj.id, obj.name, obj.description, obj.location, obj.active);
	var div = $('#cl_' + user.id);
	
	if( div.length){
		div.html(val);
	} else {
		contentTable.append(val);
	}
}

$(document).ready(function() {
	getData(CLOCK_URL, getClocks);
});