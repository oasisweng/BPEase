//==============================
// PDF Generator
// For more information, check: http://parall.ax/products/jspdf
//==============================
var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

var month;
var day;
var hours;
var minutes;

function getDateInfo(i, dates, times) {
    month = dates[i].getMonth();
    day = dates[i].getDate();
    hours = times[i].getHours();
    minutes = times[i].getMinutes();
    if (day % 10 == 1)
        day = day + "st";
    else if (day % 10 == 2)
        day = day + "nd";
    else if (day % 10 == 3)
        day = day + "rd";
    else
        day = day + "th";
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
}

//==============================
// Email Composer
//==============================
var fs = {
    URL: ""
};
var file = {
    URL: ""
};

function sendEmail() {
    var date = new Date().toDateString();
    subject = userinfo.name + "\'s BP Report on " + date;
    body = "";
    toRecipients = ["oasisweng@gmail.com"];
    ccRecipients = ["chaitanya.agrawal.13@ucl.ac.uk", "delia.gander.13@ucl.ac.uk"];
    bccRecipients = [""];
    isHtml = false;
    attachments = ["/storage/emulated/0/test.pdf", file.URL];
    attachmentsData = null;
    alert(fs.URL);

    window.plugins.emailComposer.showEmailComposerWithCallback(sendEmail_Result, subject, body, toRecipients, ccRecipients, bccRecipients, isHtml, attachments, attachmentsData);
}

function sendEmail_Result(res) {
    alert(res);
}

function constructingTable(dates, times, d, s, p, pd) {
    var length = s.length;

    //alert("create new jspdf");
    $("#rname").html(pd[0]);
    $("#rdob").html(pd[1]);
    $("#rnhsno").html(pd[2]);
    $("#rhistory").html(pd[3]);
    $("#rh").html(pd[4]);
    $("#ra").html(pd[5]);

    //alert("finish pd");
    //For Table 1
    var content = "<tr>";
    for (var i = 0; i < length; i++) {
        getDateInfo(i, dates, times);
        content += '<td>' + day + " " + monthNames[month] + '</td>';
        content += '<td>' + hours + ":" + minutes + '</td>';
        content += '<td>' + s[i] + '</td>';
        content += '<td>' + d[i] + '</td>';
        content += '<td>' + p[i] + '</td>';
        content += '</tr>';
    }
    $('#bp-table1').append($(content)).trigger('create');

    //For summary date range and number of readings
    if (length > 0) {
        getDateInfo(0, dates, times);
        var fullStartDate = day + " " + monthNames[month] + " " + hours + ":" + minutes;
        getDateInfo(length - 1, dates, times);
        var fullEndDate = day + " " + monthNames[month] + " " + hours + ":" + minutes;
        $('#rp-startdate').html(fullStartDate);
        $('#rp-enddate').html(fullEndDate);
        $('#n-readings').html(6);
    }

    //For Table 2 
    var min_max_avg = new Array();
    var readings = new Array(s);
    for (var k = 0; k < readings.length; k++) {
        var l = readings[k];
        var min = Math.min.apply(null, l);
        var max = Math.max.apply(null, l);
        var sum = 0;
        for (var z = 0; z < l.length; z++) {
            sum += l[z];
        }
        var avg = sum / l.length;
        min_max_avg.push(min, max, avg);
    }
    var readings = new Array(d);
    for (var k = 0; k < readings.length; k++) {
        var l = readings[k];
        var min = Math.min.apply(null, l);
        var max = Math.max.apply(null, l);
        var sum = 0;
        for (var z = 0; z < l.length; z++) {
            sum += l[z];
        }
        var avg = sum / l.length;
        min_max_avg.push(min, max, avg);
    }
    var readings = new Array(p);
    for (var k = 0; k < readings.length; k++) {
        var l = readings[k];
        var min = Math.min.apply(null, l);
        var max = Math.max.apply(null, l);
        var sum = 0;
        for (var z = 0; z < l.length; z++) {
            sum += l[z];
        }
        var avg = sum / l.length;
        min_max_avg.push(min, max, avg);
    }

    var columnHeadings = new Array("Syst BP", "Diast BP", "Pulse")
    var content2 = "";
    for (var m = 0; m < columnHeadings.length; m++) {
        content2 += '<tr>';
        content2 += '<td>' + columnHeadings[m] + '</td>';
        content2 += '<td>' + parseInt(min_max_avg[m * 3]) + '</td>';
        content2 += '<td>' + parseInt(min_max_avg[m * 3 + 1]) + '</td>';
        content2 += '<td>' + parseInt(min_max_avg[m * 3 + 2]) + '</td>';
        content2 += '</tr>';
    }
    $('#bp-table2').append($(content2)).trigger('create');
}

function generatePDFReport(dates, times, d, s, p, pd) {
    var doc = new jsPDF('p', 'pt', 'a4', false);
    constructingTable(dates, times, d, s, p, pd);
    doc.addHTML($("#report"), 30, 30, {}, function(canvas, w, h) {
        h = $("#report").height();
        //doc.addImage(canvas.toDataURL(), 'png', 30, 30, w, h, undefined, 'none');
        //Page 2-Instructions for HBPM 
        //var imgData = 'data:image/png;base64,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';
        doc.setFontSize(40);
        doc.setDrawColor(0);
        doc.setFillColor(238, 238, 238);
        doc.rect(0, 0, 595.28, 841.89, 'F');
        doc.text(35, 100, "hello world");
        doc.addImage(canvas, "png", 100, 200, 280, 210, undefined, "none");
        doc.addPage();
        doc.setFontSize(24);
        doc.setFontType('bold');
        doc.text(40, 40, 'Recall- instructions on the HBPM-could flash');
        doc.text(130, 75, 'up when pxs start this mode');
        doc.setFontSize(16);
        doc.setFontType('normal');
        doc.text(60, 120, '* When using home blood pressure monitoring (HBPM) to confirm a');
        doc.text(72, 150, 'diagnosis of hypertension,');
        doc.text(60, 180, '* ensure that:');
        doc.text(60, 210, '* - for each blood pressure recording, two consecutive');
        doc.text(72, 240, 'measurements are taken, atleast 1 min');
        doc.text(60, 270, '* apart and with the person seated and');
        doc.text(60, 300, '* - blood pressure is recorded twice daily, ideally in the morning');
        doc.text(72, 330, 'and evening and');
        doc.text(60, 360, '* - blood pressure recording continues for at least 4 days, ideally');
        doc.text(72, 390, 'for 7 days.');
        doc.text(60, 420, '* Discard the measurements taken on the first day and use the');
        doc.text(60, 450, 'average value of all the remaining');
        doc.text(60, 480, '* measurements to confirm a diagnosis of hypertension.');

        //Page 3-Nice guidance reminder for GP
        doc.addPage();
        doc.setFontSize(20);
        doc.setFontType('bold');
        doc.text(145, 40, 'NICE guidance reminder for GP:');
        doc.text(40, 75, 'http://www.nice.org.uk/guidance/CG127/QuickRefGuide');
        doc.setFontSize(16);
        doc.setFontType('normal');
        doc.text(60, 120, '* blood pressure monitoring(ABPM) daytime average or');
        doc.text(72, 150, 'home blood pressure monitoring (HBPM)');
        doc.text(60, 180, '* average blood pressure is 135/85 mmHg or higher.');
        doc.text(60, 210, '* Stage 2 hypertension Clinic blood pressure is 160/100');
        doc.text(72, 240, 'mmHg or higher and subsequent ABPM');
        doc.text(60, 270, '* daytime average or HBPM average blood pressure is 150/95');
        doc.text(72, 300, 'mmHg or higher.');
        doc.text(60, 330, '* Severe hypertension Clinic systolic blood pressure is 180');
        doc.text(72, 360, 'mmHg or higher, or clinic diastolic blood');
        doc.text(60, 390, '* pressure is 110 mmHg or higher.');

    });
}