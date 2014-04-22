//==============================
//Validating Manual results
//==============================
function onConfirmError(button) {
    if (button == 1) {
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
    var time = $('#time' + index1).val();
    var date = $('#date' + index1).val();
    var diastole1 = $('#diastole' + index1).val();
    var diastole2 = $('#diastole' + index2).val();
    var systole1 = $('#systole' + index1).val();
    var systole2 = $('#systole' + index2).val();
    var pulse1 = $('#pulse' + index1).val();
    var pulse2 = $('#pulse' + index2).val();

    if (time == "") {
        alert("Time is empty");
        pass = false;
    } else if (date == "") {
        alert("Date is empty");
        pass = false;
    } else if (diastole1 == "") {
        alert("Diastole Reading 1 is empty");
        pass = false;
    } else if (diastole2 == "") {
        alert("Diastole Reading 2 is empty");
        pass = false;
    } else if (systole1 == "") {
        alert("Systole Reading 1 is empty");
        pass = false;
    } else if (systole2 == "") {
        alert("Systole Reading 2 is empty");
        pass = false;
    } else if (pulse1 == "") {
        alert("Pule Reading 1 is empty");
        pass = false;
    } else if (pulse2 == "") {
        alert("pulse2 Reading 2 is empty");
        pass = false;
    }

    if (pass && diastole1 < 60 && diastole2 < 60 && diastole1 > 120 && diastole2 > 120 && systole1 < 80 && systole2 < 80 && systole1 > 220 && systole2 > 220) {
        errorMessage();
    }
}

$("#button-save").click(function(event) {
    validateResults(3, 4);
});