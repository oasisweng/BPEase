function loadCurrentActivityButton() {
    if (settings.firstTime) {
        $("#currentActivity-btn").removeClass("remove");
    } else {
        $("#modeSelection-btn").removeClass("remove");
    }
};

$(document).delegate("#mainMenu", "pageshow", function() {
    $("#currentActivity-btn").addClass("remove");
    $("#modeSelection-btn").addClass("remove");
    loadCurrentActivityButton();
});