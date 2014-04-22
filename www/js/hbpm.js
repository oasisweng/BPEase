$("#bluetooth-toggle").bind("click", function(event) {
    var $this = $(this);
    // $this will contain a reference to the checkbox   
    if ($this.is(':checked')) {
        $('#toggle-progress').show();
        drawSW(1);
        settings.bluetooth = true;
    } else {
        $('#toggle-progress').hide();
        // the checkbox was unchecked
        settings.bluetooth = false;
    }
});

$("#bluetooth-toggle-2").bind("click", function(event) {
    var $this = $(this);
    // $this will contain a reference to the checkbox   
    if ($this.is(':checked')) {
        $('#toggle-progress-2').show();
        drawSW(2);
        settings.bluetooth = true;
    } else {
        $('#toggle-progress-2').hide();
        // the checkbox was unchecked
        settings.bluetooth = false;
    }
});

$("#b-start-btn").click(function(event) {
    var sd = $("#startdate").datepicker("getDate");
    var ed = $("#enddate").datepicker("getDate");
    var mr = $("#morning-reminder").val();
    var er = $("#evening-reminder").val();
    var bt = $("#bluetooth-toggle").is(':checked');
    alert(sd);
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
    }
    startHBPM(sd, ed, mr, er);
    if (bt) {
        $.mobile.navigate("#bluetooth-measure");
    } else {
        $.mobile.navigate("#manual-measure");
    }
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
    alert("the program is cancelled");
    settings.hbpm = false;
    saveSettings();
});

//==============================
// Local Notification
//==============================
function setLocalNotificaiton(date_c, title_c, message_c, repeat_c, endDate) {
    var id_c = parseInt(Math.random() * 1000, 10);
    var ed_json = endDate.toJSON();
    alert("adding notification json:" + ed_json);
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
    var title = 'BPEase Reminder';
    var message = 'Time to measure your blood pressure, please! :-)~~~';
    var repeat = 'daily';
    var year = startDate.getFullYear();
    var month = startDate.getMonth();
    var day = startDate.getDay();
    var m = morning.split(":");
    var e = evening.split(":");
    var startDate_m = new Date(year, month, day, m[0], m[1], 0);
    var startDate_e = new Date(year, month, day, e[0], e[1], 0);
    setLocalNotificaiton(startDate_m, title, message, repeat, endDate);
    setLocalNotificaiton(startDate_e, title, message, repeat, endDate);

    settings.hbpm = true;
    settings.hbpmFileName = "H" + settings.totalFiles;
    settings.hbpmStartDate = startDate;
    settings.hbpmEndDate = endDate;
    settings.totalFiles++;
    saveSettings();
    alert("HBPM starts!" + JSON.stringify(settings));
}


//Draw spinning wheel
var cog = new Image();

function drawSW(index) {
    cog.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABK1JREFUeNqMVt1ZGzkUvVfS4IW1l8GO82w6IBXE7mCpAFMB+Pt4Z6iApALcAe4AU0HoAJfg7BPYHinnXmmciX+y0YdmJHnQ0bk/R5cvh5cUyFPwRD4EChgEvGWMB36R3+JaiTkmD5gOs8yNb25uLlerFf1pM2yIGA82TEY7xow1oj4GBU6S6yywPNG4JwDH+XGv0Whs7ndN8n97mmPsLCSYgy7ImPQE/pFDyAF+7L0fgTNFUDBcLal90taD1doQ/T6NT9DnW8zkT+jJuQVYukG3hifCVk/L3JOxMBa8VVlSp9MhHKLaB+zpNo1fdgEpmByuMqUAV5viOQLwXNax9KBAFNEEpN1pUwnQmvl6aTza6zNjrCKaymeyOdYAMgfg18iG4T/qw+AC94zvpzDjcwqOXo3VGH26H0xMZ7jPxgT0R2zUi4BYt6bAfEbJvJFZKA4ODgZ5nhcJLE9mk35X21vWC/TXKmiwr2xszoQd/PQv3t/QCzY2twpqBpb5FKOp+hCgzWaTWq0W1Xx0ij5An9WC5VtiLMwvNBrVaSGMvQk5jHQVPN7sb0HzAtE+QJrNgrcUNEARieWCut0ugR0tl8sKcJ5Ahc3jRviPK8ZGTaaBwGKyT+gTiwM4a3Jrba6MbeVXo5F4kp9shn29ndUYC9vLirGDXzRhrYhD8DME5Hkg22df5rDYS/RXmVIsaP/Q/SXs600YnifTjbeSWliEdTYb3QyTqYfdDKTL4B1KS6tVqf6SgGq3P9BvZGpvNIrPCgVKZlGlCDQDxJiCjVppCab05DJHzb+b1Gm36X80cVjLuzozexs0f6IgRkA5XRhzIixRL1+IzhwdHVHrn1Y9oXe1i10aKT6bGGhg1CKK+cT0zCGCs0oXTIogybJMw/779//o48duMvnO9rzLn+Kz8wgS5Shqo4njpCoOQA5Ajb8adHh4SMvVghaLhYb/HsBip88krNVISSEigOlhjmi0LziNhr6wOsgO9C1339vbGznnNAU2AM9Svk235cqKieKGkldAf7DGvTrjnjJnzyQoMu0ZTuZgUqvmlYR+f39XIE4uqCX1E/rDZpCYmKwOOmivAfYK9KF1AM7EdG4uAMLAOjmQideQXOJQkyUisqYiFRhtSFbxCxj8do0T30dmTvLhC+an0MZZVBHX09tBTG4qFigZEJEChjTIEwtRik81Qa7uOQU0IrYAe7FRjqYw6SlYjgAyN1GmHsFIGPfVnxzFuFITKEkfYK+oWZ5qKlIkcZ7UE92oXBmeIgIxtAO5UtSHqo9uiLW+sme5ejSIRASeAFR4LYy8MMzL1aq3EYWzJF28BgMEzGYpBkrMKelgl+P6uTcVY8NjLYyYPwMTCcufSaouH6al9xNJcjC82vDb9uVZKbrWIumNO+waVsu1TCC+Wxcg6xaSpsZSYM2wLO9/U8qZWH+wztQnsfAxV/E3MIKZVf1FsmJVV8mamhEmxZ0X7sSsABsGv1tZJGejmptU7FBUDYzPAXQBwFEEl+9+stFEroJEci2ELwIMmZuWoSTE9DYYcWVCjlJrZWMpeBhlAEqBiulPE84S3ixU5gSTwGGOdyEVNJXxA8nPevshwABHktBS1YoQ+QAAAABJRU5ErkJggg=='; // Set source path
    if (index == 1) {
        setInterval(draw, 10);
    } else {
        setInterval(draw2, 10);
    }
}
var rotation = 0;

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