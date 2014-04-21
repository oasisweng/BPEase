$(document).delegate("#modeSelection", "pageshow", function() {
    $("#free-mode-btn").click(function() {
        event.preventDefault();
        showConfirm();
    });
});

// process the confirmation dialog result
function onConfirm(button) {
    if (button == 1) {
        $.mobile.navigate("#manual-measure");
    } else {
        $.mobile.navigate("#bluetooth-measure");
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