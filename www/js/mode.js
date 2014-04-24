$(document).delegate("#modeSelection", "pageshow", function() {
    $("#free-mode-btn").click(function() {
        showConfirm();
    });
});

// process the confirmation dialog result

function onConfirm(button) {
    if (button == 1) {
        setTimeout($.mobile.navigate('#manual-measure'), 1500);
    } else if (button == 2) {
        setTimeout($.mobile.navigate('#bluetooth-measure'), 1500);
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