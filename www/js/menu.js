function loadCurrentActivityButton() {
    if (!settings.hbpm) {
        $("#modeSelection-btn").removeClass("remove");
    } else {
        $("#currentActivity-btn").removeClass("remove");
    }
}

$(document).delegate("#mainMenu", "pageshow", function() {
    $("#modeSelection-btn").addClass("remove");
    $("#currentActivity-btn").addClass("remove");
    loadCurrentActivityButton();
});