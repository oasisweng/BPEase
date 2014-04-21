//load either register or main menu button
function loadWelcomeButton() {
    if (settings.firstTime) {
        $("#menu-button").removeClass("remove");
    } else {
        $("#register-button").removeClass("remove");
    }
}

$(document).delegate("#welcome", "pageshow", function() {
    $("#register-button").addClass("remove");
    $("#menu-button").addClass("remove");
    loadWelcomeButton();
});