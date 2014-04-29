var sw1_interval = null;
var sw2_interval = null;
var sw4_interval = null;
var sw5_interval = null;

$("#bluetooth-toggle").bind("click", function(event) {
    var $this = $(this);
    // $this will contain a reference to the checkbox   
    if ($this.is(':checked')) {
        // $('#toggle-progress').show();
        // if (!sw1_interval)
        //     drawSW(1);
        settings.bluetooth = true;
    } else {
        //$('#toggle-progress').hide();
        // the checkbox was unchecked
        settings.bluetooth = false;
    }
});

$("#bluetooth-toggle-2").bind("click", function(event) {
    var $this = $(this);
    // $this will contain a reference to the checkbox   
    if ($this.is(':checked')) {
        // $('#toggle-progress-2').show();
        // if (!sw2_interval)
        //     drawSW(2);
        settings.bluetooth = true;
    } else {
        // $('#toggle-progress-2').hide();
        // the checkbox was unchecked
        settings.bluetooth = false;
    }
    saveSettings();
});

$("#b-start-btn").click(function(event) {
    var sd = $("#startdate").datepicker("getDate");
    var ed = $("#enddate").datepicker("getDate");
    var mr = $("#morning-reminder").val();
    var er = $("#evening-reminder").val();
    var bluetooth = $("#bluetooth-toggle").is(':checked');
    event.preventDefault();
    if (sd.toJSON() == "") {
        alert("Start date is empty!");
        return;
    } else if (ed.toJSON() == "") {
        alert("End date is empty!");
        return;
    } else if (mr === "") {
        alert("Morning reminder is empty!");
        return;
    } else if (er === "") {
        alert("Evening reminder is empty!");
        return;
    } else {
        //alert("sd " + sd + "ed " + ed + "mr " + mr + "er ");
        startHBPM(sd, ed, mr, er);
        if (bluetooth) {
            $.mobile.navigate("#bluetooth-measure");
        } else {
            $.mobile.navigate("#manual-measure");
        }
    }
});

$("#editHBPM-btn").click(function(event) {
    $("#startdate").datepicker("setDate", settings.hbpmStartDate);
    $("#enddate").datepicker("setDate", settings.hbpmEndDate);
    $("#morning-reminder").data("DateTimePicker").setDate(settings.hbpmStartDate);
    $("#evening-reminder").data("DateTimePicker").setDate(settings.hbpmStartDate);

});


$("#new-measurement-btn").click(function(event) {
    event.preventDefault();
    var bt = $("#bluetooth-toggle-2").is(':checked');
    if (bt) {
        $.mobile.navigate("#bluetooth-measure");
    } else {
        $.mobile.navigate("#manual-measure");
    }
});

$("#cancelHBPM-btn").click(function(event) {
    alert("HBPM is cancelled, record saved.");
    settings.hbpm = false;
    settings.totalFiles++;
    saveSettings();
});

//==============================
// Local Notification
//==============================
function setLocalNotificaiton(date_c, title_c, message_c, repeat_c, endDate) {
    var id_c = parseInt(Math.random() * 1000, 10);
    var ed_json = endDate.toJSON();
    //alert("adding notification json:" + ed_json);
    window.plugin.notification.local.add({
        id: id_c,
        title: title_c,
        message: message_c,
        repeat: repeat_c,
        date: date_c,
        json: ed_json
    });
}

function startHBPM(startDate, endDate, morning, evening) {
    if (settings.hbpm) {
        //if there is one already existed, cancel it
        window.plugin.notification.local.cancelAll();
    }
    var title = 'BPEase Reminder';
    var message = 'Time to measure your blood pressure, please! :-)~~~';
    var repeat = 'daily';
    var year = startDate.getFullYear();
    var month = startDate.getMonth();
    var day = startDate.getDate();
    var m = morning.split(":");
    var e = evening.split(":");
    var startDate_m = new Date(year, month, day, m[0], m[1], 0);
    var startDate_e = new Date(year, month, day, e[0], e[1], 0);
    setLocalNotificaiton(startDate_m, title, message, repeat, endDate);
    setLocalNotificaiton(startDate_e, title, message, repeat, endDate);
    settings.firsttime = false;
    settings.hbpm = true;
    settings.hbpmFileName = "H" + settings.totalFiles;
    settings.hbpmStartDate = startDate_m;
    settings.hbpmEndDate = endDate;
    settings.hbpmEndDate.setHours(e[0]);
    settings.hbpmEndDate.setMinutes(e[1]);
    saveSettings();
    alert("HBPM starts! It will continue during " +
        day + "/" + month + "/" + year + " ~ " +
        endDate.getDate() + "/" + endDate.getMonth() + "/" + endDate.getFullYear());
}


//Draw spinning wheel
var cog = new Image();
var rotation = 0;

function drawSW(index) {
    rotation = 0;
    cog.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABK1JREFUeNqMVt1ZGzkUvVfS4IW1l8GO82w6IBXE7mCpAFMB+Pt4Z6iApALcAe4AU0HoAJfg7BPYHinnXmmciX+y0YdmJHnQ0bk/R5cvh5cUyFPwRD4EChgEvGWMB36R3+JaiTkmD5gOs8yNb25uLlerFf1pM2yIGA82TEY7xow1oj4GBU6S6yywPNG4JwDH+XGv0Whs7ndN8n97mmPsLCSYgy7ImPQE/pFDyAF+7L0fgTNFUDBcLal90taD1doQ/T6NT9DnW8zkT+jJuQVYukG3hifCVk/L3JOxMBa8VVlSp9MhHKLaB+zpNo1fdgEpmByuMqUAV5viOQLwXNax9KBAFNEEpN1pUwnQmvl6aTza6zNjrCKaymeyOdYAMgfg18iG4T/qw+AC94zvpzDjcwqOXo3VGH26H0xMZ7jPxgT0R2zUi4BYt6bAfEbJvJFZKA4ODgZ5nhcJLE9mk35X21vWC/TXKmiwr2xszoQd/PQv3t/QCzY2twpqBpb5FKOp+hCgzWaTWq0W1Xx0ij5An9WC5VtiLMwvNBrVaSGMvQk5jHQVPN7sb0HzAtE+QJrNgrcUNEARieWCut0ugR0tl8sKcJ5Ahc3jRviPK8ZGTaaBwGKyT+gTiwM4a3Jrba6MbeVXo5F4kp9shn29ndUYC9vLirGDXzRhrYhD8DME5Hkg22df5rDYS/RXmVIsaP/Q/SXs600YnifTjbeSWliEdTYb3QyTqYfdDKTL4B1KS6tVqf6SgGq3P9BvZGpvNIrPCgVKZlGlCDQDxJiCjVppCab05DJHzb+b1Gm36X80cVjLuzozexs0f6IgRkA5XRhzIixRL1+IzhwdHVHrn1Y9oXe1i10aKT6bGGhg1CKK+cT0zCGCs0oXTIogybJMw/779//o48duMvnO9rzLn+Kz8wgS5Shqo4njpCoOQA5Ajb8adHh4SMvVghaLhYb/HsBip88krNVISSEigOlhjmi0LziNhr6wOsgO9C1339vbGznnNAU2AM9Svk235cqKieKGkldAf7DGvTrjnjJnzyQoMu0ZTuZgUqvmlYR+f39XIE4uqCX1E/rDZpCYmKwOOmivAfYK9KF1AM7EdG4uAMLAOjmQideQXOJQkyUisqYiFRhtSFbxCxj8do0T30dmTvLhC+an0MZZVBHX09tBTG4qFigZEJEChjTIEwtRik81Qa7uOQU0IrYAe7FRjqYw6SlYjgAyN1GmHsFIGPfVnxzFuFITKEkfYK+oWZ5qKlIkcZ7UE92oXBmeIgIxtAO5UtSHqo9uiLW+sme5ejSIRASeAFR4LYy8MMzL1aq3EYWzJF28BgMEzGYpBkrMKelgl+P6uTcVY8NjLYyYPwMTCcufSaouH6al9xNJcjC82vDb9uVZKbrWIumNO+waVsu1TCC+Wxcg6xaSpsZSYM2wLO9/U8qZWH+wztQnsfAxV/E3MIKZVf1FsmJVV8mamhEmxZ0X7sSsABsGv1tZJGejmptU7FBUDYzPAXQBwFEEl+9+stFEroJEci2ELwIMmZuWoSTE9DYYcWVCjlJrZWMpeBhlAEqBiulPE84S3ixU5gSTwGGOdyEVNJXxA8nPevshwABHktBS1YoQ+QAAAABJRU5ErkJggg=='; // Set source path
    if (index == 1) {
        sw1_interval = setInterval(draw, 10);
    } else if (index == 2) {
        sw2_interval = setInterval(draw2, 10);
    } else if (index == 4) {
        sw4_interval = setInterval(draw4, 10);
    } else {
        sw5_interval = setInterval(draw5, 10);
    }
}

function draw() {
    var ctx = document.getElementById('sw-canvas').getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.save();
    ctx.clearRect(0, 0, 27, 27);
    ctx.translate(13.5, 13.5); // to get it in the origin
    rotation += 1;
    ctx.rotate(rotation * Math.PI / 64); //rotate in origin
    ctx.translate(-13.5, -13.5); //put it back
    ctx.drawImage(cog, 0, 0);
    ctx.restore();
}

function draw2() {
    var ctx = document.getElementById('sw-canvas-2').getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.save();
    ctx.clearRect(0, 0, 27, 27);
    ctx.translate(13.5, 13.5); // to get it in the origin
    rotation += 1;
    ctx.rotate(rotation * Math.PI / 64); //rotate in origin
    ctx.translate(-13.5, -13.5); //put it back
    ctx.drawImage(cog, 0, 0);
    ctx.restore();
}

function draw4() {
    var ctx = document.getElementById('sw-canvas-4').getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.save();
    ctx.clearRect(0, 0, 27, 27);
    ctx.translate(13.5, 13.5); // to get it in the origin
    rotation += 1;
    ctx.rotate(rotation * Math.PI / 64); //rotate in origin
    ctx.translate(-13.5, -13.5); //put it back
    ctx.drawImage(cog, 0, 0);
    ctx.restore();
}

function draw5() {
    var ctx = document.getElementById('sw-canvas-5').getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.save();
    ctx.clearRect(0, 0, 27, 27);
    ctx.translate(13.5, 13.5); // to get it in the origin
    rotation += 1;
    ctx.rotate(rotation * Math.PI / 64); //rotate in origin
    ctx.translate(-13.5, -13.5); //put it back
    ctx.drawImage(cog, 0, 0);
    ctx.restore();
}



///bluetooth-measure

var time1_v;
var time2_v;


$(document).delegate("#bluetooth-measure", "pageshow", function() {
    $("#measurement-button-1").removeClass("remove");
    $("#measurement-button-2").addClass("remove");
    $("#save-bt-btn").addClass("remove");
    $("#measurement-button-1").click(function() {
        $('#toggle-progress-4').show();
        if (!sw4_interval)
            drawSW(4);
        bt.xx(function(data) {
            var m = data;
            var t = m.time;
            //index of first ":"
            x = t.indexOf(":");
            time1_v = t.substring(11, x) + ":" + t.substring(x + 1, x + 3);
            diastole1_v = m.dia;
            systole1_v = m.sys;
            pulse1_v = m.pulse;
            $("#time1").html(time1_v + " " + t.substring(8, 10) + "/" + t.substring(5, 7) + "/" + t.substring(0, 4));
            $("#diastolic1").html(m.dia);
            $("#systolic1").html(m.sys);
            $("#pulse1").html(m.pulse);
            $("#measurement-button-1").addClass("remove");
            $("#measurement-button-2").removeClass("remove");
            $('#toggle-progress-4').hide();
        }, function(error) {
            $.mobile.navigate("#manual-measure");
        });
    });


    $("#measurement-button-2").click(function() {
        $('#toggle-progress-5').show();
        if (!sw5_interval)
            drawSW(5);
        bt.xx(function(data) {
            var m = data;
            var t = m.time;
            //index of first ":"
            x = t.indexOf(":");
            time2_v = t.substring(11, x) + ":" + t.substring(x + 1, x + 3);
            diastole2_v = m.dia;
            systole2_v = m.sys;
            pulse2_v = m.pulse;
            $("#time2").html(time2_v + " " + t.substring(8, 10) + "/" + t.substring(5, 7) + "/" + t.substring(0, 4));
            $("#diastolic2").html(m.dia);
            $("#systolic2").html(m.sys);
            $("#pulse2").html(m.pulse);
            $("#measurement-button-2").addClass("remove");
            $("#save-bt-btn").removeClass("remove");
            $('#toggle-progress-5').hide();
        }, function(error) {
            $.mobile.navigate("#manual-measure");
        });
    });

    $("#save-bt-btn").click(function() {
        date_v = new Date();
        //save the record
        var data_arr = new Array();
        var data1 = {
            time: time1_v,
            date: date_v,
            diastole: diastole1_v,
            systole: systole1_v,
            pulse: pulse1_v
        };
        var data2 = {
            time: time2_v,
            date: date_v,
            diastole: diastole2_v,
            systole: systole2_v,
            pulse: pulse2_v
        };
        data_arr.push(data1);
        data_arr.push(data2);
        saveRecord(data_arr);
    });
});




//====================================
//Code for checking date range
//====================================
 function checkDateRange(start, end) 
   {
        var startDate = Date.parse(start);
        var endDate = Date.parse(end);
        if (isNaN(startDate)) 
        {
            alert("The start date provided is not valid, please enter a valid date.");
            return false;
        }
        if (isNaN(endDate)) 
        {
           alert("The end date provided is not valid, please enter a valid date.");
           return false;
        }
        var difference = (endDate - startDate) / (86400000);
        if (difference < 0) 
        {
          alert("The start date must come before the end date.");
          return false;
        }
        if (difference < 4 || difference >7)
        {
          alert("The range must be at least 4 days or maximum 7 days.");
          return false;
        }
   return true;
}
//====================================
//Code for checking date range
//====================================