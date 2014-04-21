function loadCurrentActivityButton() {
    if (settings.firstTime) {
        $("#currentActivity-btn").removeClass("remove");
    } else {
        $("#modeSelection-btn").removeClass("remove");
    }
};

$(document).delegate("#menu", "pageshow", function() {
    loadCurrentActivityButton();
});