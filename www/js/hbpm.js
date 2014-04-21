$("#bluetooth-toggle").bind("click", function(event) {
    var $this = $(this);
    // $this will contain a reference to the checkbox   
    if ($this.is(':checked')) {
        $('#toggle-progress').show();
        settings.bluetooth = true;
    } else {
        $('#toggle-progress').hide();
        // the checkbox was unchecked
        settings.bluetooth = false;
    }
});

$("#b-start-btn").click(function() {
    startHBPM();
    event.preventDefault();
    if ($("#bluetooth-toggle").is(':checked')) {
        $.mobile.navigate("#bluetooth-measure");
    } else {
        $.mobile.navigate("#manual-measure");
    }
});


function startHBPM(startDate, endDate, morning, evening, bluetooth) {
    logit("Local Notificaition Demo");
    window.plugin.notification.local.onadd = function(id, state, json) {
        logit("added a new local notification " + id + " " + state + " " + json);
    };
    window.plugin.notification.local.ontrigger = function(id, state, json) {
        logit("a notification is triggered " + id + " " + state + " " + json);
        date = new Date($.parseJSON(json));
        today = new Date();
        if (date.getDate() == today.getDate())
            alert("HBPM Mode finished");
    };

    var title = 'BPEase Reminder';
    var message = 'Time to measure your blood pressure, please! :-)~~~';
    var repeat = 'daily';
    var startDate_m = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDay(), morning.getHours(), morning.getMinutes(), 0, 0);
    var startDate_e = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDay(), evening.getHours(), evening.getMinutes(), 0, 0);
    setLocalNotificaiton(startDate_m, title, message, repeat, endDate);
    setLocalNotificaiton(startDate_e, title, message, repeat, endDate);

    settings.hbpm = true;
    settings.totalFiles++;
    settings.hbpmFileName = "H" + settings.totalFiles;
    settings.hbpmStartDate = startDate;
    settings.hbpmEndDate = endDate;
    alert("HBPM starts!");
}

//==============================
// Local Notification
//==============================
function setLocalNotificaiton(date_c, title_c, message_c, repeat_c, endDate) {
    var id_c = parseInt(Math.random() * 1000);
    logit("Notification ID " + id_c);
    window.plugin.notification.local.add({
        id: id_c,
        title: title_c,
        message: message_c,
        repeat: repeat_c,
        date: date_c,
        json: JSON.stringify(endDate)
    });
}