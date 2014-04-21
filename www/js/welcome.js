//load either register or main menu button
function loadWelcomeButton() {
    if (settings.firstTime) {
        $("#register-button").removeClass("remove");
    } else {
        $("#menu-button").removeClass("remove");
    }
}

$(document).delegate("#welcome", "pageshow", function() {
    $("#register-button").addClass("remove");
    $("#menu-button").addClass("remove");
    loadWelcomeButton();
});