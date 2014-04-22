$(document).delegate("#modeSelection", "pageshow", function() {
    $("#free-mode-btn").click(function() {
        event.preventDefault();
        showConfirm();
    });
});

// process the confirmation dialog result
var isManual = false;

function onConfirm(button) {

    if (button == 1) {
        window.setTimeout("$.mobile.navigate('#manual-measure');", 1000);
    } else {
        window.setTimeout("$.mobile.navigate('#bluetooth-measure');", 1000);
    }
}

// Show a custom confirmation dialog
//
function showConfirm() {
    navigator.notification.confirm(
        'Do you want to turn on bluetooth', // message
        onConfirm, // callback to invoke with index of button pressed
        'Bluetooth', // title
        'No,Yes' // buttonLabels
    );
}