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

    if (time_v === "") {
        alert("Time is empty");
        pass = false;
    } else if (date_v === "") {
        alert("Date is empty");
        pass = false;
    } else if (diastole1_v === "") {
        alert("Diastole Reading 1 is empty");
        pass = false;
    } else if (diastole2_v === "") {
        alert("Diastole Reading 2 is empty");
        pass = false;
    } else if (systole1_v === "") {
        alert("Systole Reading 1 is empty");
        pass = false;
    } else if (systole2_v === "") {
        alert("Systole Reading 2 is empty");
        pass = false;
    } else if (pulse1_v === "") {
        alert("Pule Reading 1 is empty");
        pass = false;
    } else if (pulse2_v === "") {
        alert("pulse2 Reading 2 is empty");
        pass = false;
    }

    if (diastole1_v < 60 || diastole2_v < 60 || diastole1_v > 120 || diastole2_v > 120 || systole1_v < 80 || systole2_v < 80 || systole1_v > 220 || systole2_v > 220) {
        errorMessage();
        pass = false;
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