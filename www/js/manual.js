//==============================
//Validating Manual results
//==============================

var time_v;
var date_v;
var diastole1_v;
var diastole2_v;
var systole1_v;
var systole2_v;
var pulse1_v;
var pulse2_v;

function saveResults() {
    //save the record
    var data_arr = new Array();
    var data1 = {
        time: time_v,
        date: date_v,
        diastole: diastole1_v,
        systole: systole1_v,
        pulse: pulse1_v
    };
    var data2 = {
        time: time_v,
        date: date_v,
        diastole: diastole2_v,
        systole: systole2_v,
        pulse: pulse2_v
    };
    data_arr.push(data1);
    data_arr.push(data2);
    saveRecord(data_arr);
}

function onConfirmError(button) {
    if (button == 1) {
        saveResults();
        $.mobile.navigate("#mainMenu");
    }
}

function errorMessage() {
    navigator.notification.confirm(
        'Your measurements may contain errors, do you want to retake?', // message
        onConfirmError, // callback to invoke with index of button pressed
        'Error!', // title
        'No,Yes' // buttonLabels
    );
}

function validateResults(index1, index2) {
    var pass = true;
    var 

    if (time_v === "") {
        alert('The field Time is either empty or has an incorrect value. Please try again.If the same incorrect value appears more than 2 times,please contact your GP immediately!');
        pass = false;
    } else if (date_v === "" ) {
        alert('The field Date is either empty. Please try again.If the same incorrect value appears more than 2 times,please contact your GP immediately!');
        pass = false;
    } else if (diastole1_v === "" || diastole1_v >110 || diastole1_v <60 ) {
        alert('The field Diastole Reading 1 is either empty or has an incorrect value. Please try again.If the same incorrect value appears more than 2 times,please contact your GP immediately!');
        pass = false;
    } else if (diastole2_v === "" || diastole2_v >110 || diastole2_v <60 ) {
        alert('The field Diastole Reading 2 is either empty or has an incorrect value. Please try again.If the same incorrect value appears more than 2 times,please contact your GP immediately!');
        pass = false;
    } else if (systole1_v === "" || systole1_v > 180 || systole1_v <90) {
        alert('The field Systole Reading 1 is either empty or has an incorrect value. Please try again.If the same incorrect value appears more than 2 times,please contact your GP immediately!');
        pass = false;
    } else if (systole2_v === "" || systole2_v > 180 || systole2_v <90) {
        alert('The field Systole Reading 2 is either empty or has an incorrect value. Please try again. If the same incorrect value appears more than 2 times,please contact your GP immediately!');
        pass = false;
    } else if (pulse1_v === "" || pulse1_v < 40 || pulse1_v >140) {
        alert('The field Diastole Pulse Reading 1 is either empty or has an incorrect value. Please try again. If the same incorrect value appears more than 2 times,please contact your GP immediately!');
        pass = false;
    } else if (pulse2_v === "" || pulse2_v < 40 || pulse2_v > 140) {
        alert('The field Pulse Reading 2 is either empty or has an incorrect value. Please try again. If the same incorrect value appears more than 2 times,please contact your GP immediately!');
        pass = false;
    } else {
        if (diastole1_v < 60 || diastole2_v < 60 || diastole1_v > 120 || diastole2_v > 120 || systole1_v < 80 || systole2_v < 80 || systole1_v > 220 || systole2_v > 220) {
            errorMessage();
            pass = false;
        }
    }



    return pass;
}

$("#manual-button-save").click(function(event) {
    time_v = $('#time' + 3).val();
    date_v = $('#date' + 3).datepicker("getDate");
    diastole1_v = $('#diastole' + 3).val();
    diastole2_v = $('#diastole' + 4).val();
    systole1_v = $('#systole' + 3).val();
    systole2_v = $('#systole' + 4).val();
    pulse1_v = $('#pulse' + 3).val();
    pulse2_v = $('#pulse' + 4).val();

    if (validateResults(3, 4)) {
        saveResults();
        $.mobile.navigate("#mainMenu");
    } else {
        event.preventDefault();
    }

});