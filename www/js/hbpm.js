$("#bluetooth-toggle").bind("click", function(event) {
    var $this = $(this);
    // $this will contain a reference to the checkbox   
    if ($this.is(':checked')) {
        $('#toggle-progress').show();
    } else {
        $('#toggle-progress').hide();
        // the checkbox was unchecked
    }
});


function startHBPM(startDate, endDate, morning, evening, bluetooth) {

}