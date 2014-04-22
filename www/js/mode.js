$(document).delegate("#modeSelection", "pageshow", function() {
    $("#free-mode-btn").click(function() {
        showConfirm();
    });
});

// process the confirmation dialog result

function onConfirm(button) {
    if (button == 1) {
        $.mobile.navigate('#manual-measure');
    } else if (button == 2) {
        $.mobile.navigate('#bluetooth-measure');
    }
}

// Show a custom confirmation dialog
//
function showConfirm() {
    navigator.notification.confirm(
        'Do you want to turn on bluetooth',
        onConfirm,
        'Bluetooth',
        'No,Yes'
    );
}