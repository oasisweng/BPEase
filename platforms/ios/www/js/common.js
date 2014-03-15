// =======================================================
//    Any common functions used across the applicaiton
// =======================================================

$(document).ready(function(){
	console.log('document ready');
	$("a#button-back").bind("click",function(event){
		event.preventDefault();
		history.back(1);
		console.log('clicked');
		return false;
	})

})