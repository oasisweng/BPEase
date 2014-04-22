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
pulse[3] = 70;
pulse[4] = 85;
pulse[5] = 79;

var personalDetais = new Array();
personalDetais[0] = "Viraj Makol";
personalDetais[1] = "12/05/1995";
personalDetais[2] = "92147637523";
personalDetais[3] = "I am a fit and healthy boy love love love.";
personalDetais[4] = "No";
personalDetais[5] = "No";

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
    sendEmail();
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

    $("#name").html(personalDetais[0]);
    $("#dob").html(personalDetais[1]);
    $("#nhsno").html(personalDetais[2]);
    $("#history").html(personalDetais[3]);
    $("#h").html(personalDetais[4]);
    $("#a").html(personalDetais[5]);

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
    $('#startdate').html(fullStartDate);
    $('#enddate').html(fullEndDate);
    $('#n-readings').html(6);

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
    doc.addHTML(document.body, function() {
        var string = doc.output('datauristring');
        $('.preview-pane').attr('src', string);
        var output = doc.output();
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile("test.pdf", {
                create: true
            }, function(entry) {
                var fileEntry = entry;
                entry.createWriter(function(writer) {
                    writer.onwrite = function(evt) {
                        alert("pdf saved");
                        sendEmail(entry.fullPath);
                    };
                    writer.write(output);
                }, function(error) {
                    logit(error);
                });

            }, function(error) {
                logit(error);
            });
        }, function(event) {
            logit(event.target.error.code);
        });
    });

    //Page 2-Instructions for HBPM 
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
    doc.addPage();

}