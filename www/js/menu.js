function loadCurrentActivityButton() {
    if (!settings.hbpm) {
        $("#modeSelection-btn").removeClass("remove");
    } else {
        $("#currentActivity-btn").removeClass("remove");
    }
};

$(document).delegate("#mainMenu", "pageshow", function() {
    $("#currentActivity-btn").addClass("remove");
    $("#modeSelection-btn").addClass("remove");
    loadCurrentActivityButton();
});