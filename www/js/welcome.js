//load either register or main menu button
function loadWelcomeButton() {
    if (settings.firsttime) {
        $("#register-button").removeClass("remove");
    } else {
        $("#menu-button").removeClass("remove");
    }
}

$("#register-button").click(function(event) {
    settings.firsttime = false;
    saveSettings();
});