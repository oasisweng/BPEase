var isFirstTime = true;

//load either register or main menu button
function loadWelcomeButton(){
	if (isFirstTime){
		$("#register-button").removeClass("remove");
	} else {
		$("#menu-button").removeClass("remove");
	}
}