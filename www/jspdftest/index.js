//==============================
// PDF Generator
// For more information, check: http://parall.ax/products/jspdf
//==============================
var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

var dates = new Array()
dates[0] = new Date();
dates[1] = new Date();
dates[2] = new Date();
dates[3] = new Date();
dates[4] = new Date();
dates[5] = new Date();


var times = new Array()
times[0] = new Date();
times[1] = new Date();
times[2] = new Date();
times[3] = new Date();
times[4] = new Date();
times[5] = new Date();

var systolic = new Array();
systolic[0] = 115;
systolic[1] = 110;
systolic[2] = 113;
systolic[3] = 115;
systolic[4] = 125;
systolic[5] = 117;

var diastolic = new Array();
diastolic[0] = 74;
diastolic[1] = 85;
diastolic[2] = 70;
diastolic[3] = 70;
diastolic[4] = 85;
diastolic[5] = 79;

var pulse = new Array();
pulse[0] = 74;
pulse[1] = 85;
pulse[2] = 70;
pulse[3] = 65;
pulse[4] = 85;
pulse[5] = 79;

var personalDetais = new Array();
personalDetais[0] = "Viraj Makol";
personalDetais[1] = "12/05/1995";
personalDetais[2] = "92147637523";
personalDetais[3] = "No";
personalDetais[4] = "No";
personalDetais[5] = "No medicine taken. Never had this before. Hopefully will never have it. Wish those who have it to live in a happy life now and then.";

$(document).ready(function() {
    generatePDFReport(dates, times, diastolic, systolic, pulse, personalDetais);
});

var month;
var day;
var hours;
var minutes;

function getDateInfo(i) {
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
function sendEmail(fullPath) {
    subject = "subject";
    body = "body";
    toRecipients = ["oasisweng@gmail.com"];
    ccRecipients = ["chaitanya.agrawal.13@ucl.ac.uk", "delia.gander.13@ucl.ac.uk"];
    bccRecipients = [""];
    isHtml = true;
    logit("Sending with Attachments:" + fullPath);
    attachments = [fullPath];
    attachmentsData = null;
    window.plugins.emailComposer.showEmailComposerWithCallback(sendEmail_Result, subject, body, toRecipients, ccRecipients, bccRecipients, isHtml, attachments, attachmentsData);
}

function generatePDFReport(dates, times, d, s, p, pd) {
    // @TODO: The dates are only half in chronically desending order 
    //        (true file wise, false individual record wise)

    //For summary date range and number of readings
    getDateInfo(0);
    var fullStartDate = day + " " + monthNames[month] + " " + hours + ":" + minutes;
    getDateInfo(systolic.length - 1);
    var fullEndDate = day + " " + monthNames[month] + " " + hours + ":" + minutes;
    $('#rstartdate').html(fullStartDate);
    $('#renddate').html(fullEndDate);
    $('#n-readings').html(systolic.length);

    //For Table 2 
    var min_max_avg = new Array();
    var readings = new Array(systolic);
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
    var readings = new Array(diastolic);
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
    var readings = new Array(pulse);
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

    //pdf generator
    var doc = new jsPDF('p', 'pt', 'a4'),
        font = ['Helvetica', ''];
    doc.setFont(font[0], font[1]);

    //Header
    doc.setFontType("bold");
    doc.text(265, 20, "BPEase");
    doc.text(210, 50, "Blood Pressure Report");

    doc.setFontSize(13);
    //Personal Info
    doc.text(30, 80, "Personal Detais");
    doc.setFontType("normal");
    doc.text(30, 110, "Patient Name: " + personalDetais[0]);
    doc.text(378, 110, "DOB: ");
    doc.text(428, 110, personalDetais[1]);
    doc.text(30, 140, "NHS Number: " + personalDetais[2]);
    doc.text(342, 140, "GP Name:");
    doc.text(428, 140, "Afsana Bhuiya");
    doc.text(30, 170, "HTN: " + personalDetais[3]);
    doc.text(300, 170, "Heart Arrythmia: ");
    doc.text(428, 170, personalDetais[4]);
    doc.text(30, 200, "Medical Info: ");
    lines = doc.setFont(font[0], font[1]).splitTextToSize(personalDetais[5], 450)
    doc.text(50, 230, lines)
    doc.setFont("helvetica");


    //Detail table
    doc.setFontType("bold");
    doc.text(30, 300, "Reading Details");
    doc.text(30, 330, "Date");
    doc.text(100, 330, "Time");
    doc.text(170, 330, "Systole");
    doc.text(270, 330, "Diastole");
    doc.text(375, 330, "Heart Rate");

    var vSet = 360;
    doc.setFontType("normal");
    for (var k = 0; k < 1; k++) {
        for (var i = 0; i < systolic.length; i++) {
            getDateInfo(i);
            var d = day + " " + monthNames[month];
            var t = hours + ":" + minutes
            doc.text(30, vSet, d);
            doc.text(100, vSet, t);
            doc.text(185, vSet, String(systolic[i]));
            doc.text(289, vSet, String(diastolic[i]));
            doc.text(400, vSet, String(pulse[i]));
            vSet += 30;
            if (vSet >= 840) {
                doc.addPage();
                vSet = 30;
            }
        }
    }
    if (vSet > 660) {
        doc.addPage();
        vSet = 30;
    } else
        vSet += 40;

    //Summary Table
    doc.setFontType("bold");
    doc.text(30, vSet, "Reading Summary");
    doc.text(30, vSet + 30, "Type");
    doc.text(170, vSet + 30, "Mininum");
    doc.text(270, vSet + 30, "Maxinum");
    doc.text(370, vSet + 30, "Average");
    vSet += 60;
    doc.setFontType("normal");
    doc.text(30, vSet, "Systole:");
    doc.text(30, vSet + 30, "Diastole:");
    doc.text(30, vSet + 60, "Heart Rate:");

    var hSet = 185;
    for (var m = 0; m < 3; m++) {
        doc.text(hSet, vSet, String(parseInt(min_max_avg[m * 3])));
        doc.text(hSet + 100, vSet, String(parseInt(min_max_avg[m * 3 + 1])));
        doc.text(hSet + 200, vSet, String(parseInt(min_max_avg[m * 3 + 2])));
        vSet += 30;
        hSet = 189;
    }


    var string = doc.output('datauristring');
    $('.preview-pane').attr('src', string);
    //arraybuffer
    doc.save();
}