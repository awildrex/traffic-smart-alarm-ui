//validate user is logged in before anything
validateUser();

contentTable = null;
exceptionFunction = null;
clockList = null;
currentURL = ALARMS_URL;

tableFormat='<div id="al_{0}" style="height:30px;"><div class="floatLeft" style="width:10%; min-width:25px; height:30px;"><img class="button" src="./images/edit1.png" onclick="editFunction({1})"/>' +
'<img class="button" src="./images/delete1.png" onclick="deleteAlarm({2})"/></div>' +
'<div class="floatLeft" style="width:15%; min-width:50px; height:30px;"><span class="hidden floatleft" style="white-space:nowrap;">Name:</span> {3}</div>' +
'<div class="floatLeft" style="width:25%; min-width:100px; height:30px;"><span class="hidden">Clock(s):</span>{4}</div>' +
'<div class="floatLeft" style="width:15%; min-width:100px; height:30px;"><span class="hidden">Arrival Time:</span>{5}</div>' +
'<div class="floatLeft" style="width:20%; min-width:50px; height:30px;"><span class="hidden">Schedule:</span>{6}</div>' +
'<div class="floatLeft" style="width:15%; min-width:25px;"><span class="hidden">Trigger Time</span>{7}</div></div>' ;

var factorAccessTable = '<div id="fac_{0}"><div class="floatLeft" style="width:15%; min-width:25px; height:30px;">' +
					   '<img class="button" src="./images/delete1.png" onclick="toggleFactorOption(\'{1}\', false)"/></div>' +
					   '<div class="floatLeft" style="width:85%; min-width:50px; height:30px;"><span style="height:30px;">{2}<span></div>' +
					   '</div>';

getFuntion = function(data){
	alarmsList=data;
	for(var i=0; i<alarmsList.length; i++){
		generateRow(alarmsList[i], i);
	}
}

function AlarmsClockCallback(data){
	clockList=data;
	var cbClocks = $('#cbClocks');
	for(var i=0; i<clockList.length; ++i){
		cbClocks.append('<option value="' + clockList[i].id +'">' + clockList[i].name + '</option>');
	}
	getData(ALARMS_URL, getFuntion);
}

editFunction = function(id){

  $('#edit').find('input[type=checkbox]:checked').removeAttr('checked');
  $('#curFact').empty();

  if(id !== null ){
		editRowNum = getAlarmIndex(id);
		if(editRowNum > -1) {
      var obj =  alarmsList[editRowNum];
			$('#txtName').val(obj.name);
      //TODO add support for multiple clocks
      $('#cbClocks').val(obj.clockId);

			$('#txtDest').val(obj.destination);

      //Schedule
      for(var i = 0; i< obj.schedule.days.length; ++i){
        $('#cb' + obj.schedule.days[i]).prop('checked', true);
      }
      //$('#cbRepeat').prop('checked', obj.schedule.repeat);

      //TODO repeat interval??

      $('#txtArrivalTime').val(obj.arrivalTime);
      $('#txtLead').val(obj.leadTimeMinutes);
      $('#cbSound').val(obj.sound);

      for(var i=0; i<	obj.factors.length; ++i){
				toggleFactorOption(obj.factors[i], true);
			}

		} else {
			editRowNum = null;
			return;
		}
	} else {
		editRowNum = null;
    $('#txtName').val('');
    $('#txtDest').val('');
    $('#txtArrivalTime').val('');
    $('#txtLead').val('');
    $('#cbSound').val('Select Sound');
    $('#cbFactors').val('Select Factor');
	}

	$('#btnAdd').addClass('hidden');
	$('#list').addClass('hidden');
	$('#edit').removeClass('hidden');
}

function deleteAlarm(id){
	var tempURL = ALARMS_URL + '/' + id;

	var callback = function(){
		$('#al_' + id).remove();
	};

	deleteData(tempURL, callback);
}


function saveUser(){
  var name = $('#txtName').val();
  var destination = $('#txtDest').val();
  var days = [];
  var daysSelected = $('#dvDays').find('input[type=checkbox]:checked');
  for(var i=0; i<daysSelected.length; ++i){
    days.push(daysSelected[i].value);
  }

  var factors = [];
  //var rpt = $('#cbRepeat').is(':checked');
  var rid = null;
  var arrivalTime = $('#txtArrivalTime').val();
  var leadTime = $('#txtLead').val();
  var sound = $('#cbSound').val();
  var factorsSelected = $('#cbFactors').find('option[disabled]');
	var active = $('#cbActive').is(':checked');
	var clock = $('#cbClocks').val();
  for(var i=0; i<factorsSelected.length; ++i){
    factors.push(factorsSelected[i].value);
  }

	var alarm = {
    "clockId": clock,
    "triggerTime": null,
    "name": name,
    "destination": destination,
    "schedule": {
      "days": days,
      //"repeat": rpt,
      "repeatIntervalDays": rid
    },
    "arrivalTime": arrivalTime,
    "leadTimeMinutes": leadTime,
    "sound": sound,
    "factors": ['TRAFFIC']

		//,"active": active
	};

	var messages = validateData(alarm);

	if(messages.length > 0 ){
		showErrorMessage(messages);
		return;
	}

	var tempURL = ALARMS_URL;
	var postType = false;
	if(editRowNum !== null){
		tempURL += '/' + alarmsList[editRowNum].id;
		postType = true;
	}

	var callback = function(data){
		if(editRowNum !== null){
			alarmsList[editRowNum] = data;

		} else {
			alarmsList.push(data);
		}

		generateRow(data);
		$('#btnAdd').removeClass('hidden');
		$('#list').removeClass('hidden');
		$('#edit').addClass('hidden');
	}

	postData(tempURL, alarm, callback, postType);
}

generateRow = function(alarm){
	if (contentTable === null){
		contentTable= $('#tblUsers')
	}

  var days = '';
  var clocks = '';
  var counter = 0;

  if(alarm.schedule.days.length !== 7) {
    for(; counter < alarm.schedule.days.length;  ++counter){
      if(counter>0){
        days = days + ', ' + alarm.schedule.days[counter];
      } else {
        days = alarm.schedule.days[counter];
      }
    }
  } else {
    days = 'All Days';
  }

  counter = 0;
  var clock = getClockIndex(alarm.clockId);
  //TODO add support for multiple clocks
  clocks = clockList[clock].name;
	var date;
	var time;

	if(alarm.triggerTime !== null){
		date = new Date(alarm.triggerTime);
		time = date.getDay() + ' ' + date.getHours() + ':' + date.getMinutes();
	}

	var val = tableFormat.format(alarm.id, alarm.id, alarm.id, alarm.name, clocks, alarm.arrivalTime, days, time);
	var div = $('#al_' + alarm.id);

	if( div.length){
		div.html(val);
	} else {
		contentTable.append(val);
	}
}

function addFactor(){
 	var ddl = $('#cbFactors');
 	if(ddl.val() !== '-1') {
 		toggleFactorOption(ddl.val(), true);
 	} else {
 		alert('Please select a factor from the list');
 	}
}

function toggleFactorOption(id, toggle){
	var curUsers = $('#curFact');
	var val;
	var ddl = $('#cbFactors');

	if(toggle===true){
				val = factorAccessTable.format(id, id, id);
				curUsers.append(val);
				//ddl.val('Select User');
				ddl.find('option[value='+id+']').prop('disabled', toggle);
	} else {
		$('#fac_'+id).remove();
		ddl.find('option[value='+id+']').prop('disabled', toggle);
	}
}

validateData = function(data){
	var time = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
	var digits = /^[0-9]*$/;
	var message = [];

	if(time.test(data.arrivalTime) === false) {
		message.push('Please enter a valid arrival time.');
	}

	if(data.name === null || data.name === ''){
		message.push('Please enter a valid name.');
	}

	if(data.destination === null || data.destination === '') {
		message.push('Please enter a valid destination.');
	}

	if(digits.test(data.leadTimeMinutes) === false){
		message.push('Please enter a valid lead time.');
	}

	if(data.clockId === '-1') {
		message.push('Please select a valid clock.');
	}
	return message;
};

$(document).ready(function() {
	getData(CLOCK_URL, AlarmsClockCallback);
});
