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
personalDetais[3] = "";
personalDetais[4] = "P Garcha";
personalDetais[5] = "I am a fit and healthy boy.";
personalDetais[6] = "No";
personalDetais[7] = "No";

$(document).ready(function() {
    generatePDFReport(dates, times, diastolic, systolic, pulse);
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

function generatePDFReport(dates, times, d, s, p) {
    // @TODO: Need to simplify this demo

    var doc = new jsPDF('p', 'pt', 'a4');

    //For Table 1
    var content = "<tr>";
    for (var i = 0; i < systolic.length; i++) {
        getDateInfo(i);
        content += '<td>' + day + " " + monthNames[month] + '</td>';
        content += '<td>' + hours + ":" + minutes + '</td>';
        content += '<td>' + systolic[i] + '</td>';
        content += '<td>' + diastolic[i] + '</td>';
        content += '<td>' + pulse[i] + '</td>';
        content += '</tr>';
    }
    $('#bp-table1').append($(content)).trigger('create');

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

    doc.addHTML(document.getElementById("rpage"), function() {
        //var string = doc.output('datauristring');
        //$('.preview-pane').attr('src', string);
        doc.save();
    });
}