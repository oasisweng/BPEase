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
    var date = new Date(dates[i]);
    var time = new Date(times[i]);
    month = date.getMonth();
    day = date.getDate();
    var t = times[i].split(":");
    hours = t[0];
    minutes = t[1];
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

function sendEmail(filePath) {
    var date = new Date().toDateString();
    var subject = userinfo.name + "\'s BP Report on " + date;
    var body = " Have a lovely day!";
    var toRecipients = ["oasisweng@gmail.com"];
    var ccRecipients = ["chaitanya.agrawal.13@ucl.ac.uk", "delia.gander.13@ucl.ac.uk"];
    var bccRecipients = null;
    var isHtml = true;
    var attachments = [filePath.substring(7, filePath.length)];
    var attachmentsData = null;
    window.plugins.emailComposer.showEmailComposerWithCallback(sendEmail_Result, subject, body, toRecipients, ccRecipients, bccRecipients, isHtml, attachments, attachmentsData);
}

function sendEmail_Result(res) {
    alert(res);
}


function generatePDFReport(dates, times, d, s, p, pd) {
    // @TODO: The dates are only half in chronically desending order 
    //        (true file wise, false individual record wise)

    //For Summary Table 
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
    doc.text(30, 110, "Patient Name: " + pd[0]);
    doc.text(378, 110, "DOB: ");
    doc.text(428, 110, pd[1]);
    doc.text(30, 140, "NHS Number: " + pd[2]);
    doc.text(342, 140, "GP Name:");
    doc.text(428, 140, "Afsana Bhuiya");
    doc.text(30, 170, "HTN: " + pd[3]);
    doc.text(300, 170, "Heart Arrythmia: ");
    doc.text(428, 170, pd[4]);
    doc.text(30, 200, "Medical Info: ");
    lines = doc.setFont(font[0], font[1]).splitTextToSize(pd[5], 450)
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
        for (var i = 0; i < s.length; i++) {
            getDateInfo(i, dates, times);
            var dd = day + " " + monthNames[month];
            var tt = hours + ":" + minutes
            doc.text(30, vSet, dd);
            doc.text(100, vSet, tt);
            doc.text(185, vSet, String(s[i]));
            doc.text(289, vSet, String(d[i]));
            doc.text(400, vSet, String(p[i]));
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

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fs.URL = fileSystem.root.toURL();
        fileSystem.root.getFile(userinfo.name.trim() + ".pdf", {
            create: true,
            exclusive: false
        }, function(entry) {
            entry.createWriter(function(writer) {
                writer.onwrite = function(evt) {
                    file.URL = entry.toURL();
                    console.log("Report saved");
                    $('#toggle-progress-3').hide("fast", function() {
                        clearInterval(sw3_interval);
                        sendEmail(entry.toURL());
                        $("#send-button").removeAttr('disabled');
                    });
                };
                writer.write(doc.output("arraybuffer"));
            }, function(error) {
                console.log(error);
            });

        }, function(error) {
            console.log(error);
        });
    }, function(event) {
        console.log(event.target.error.code);
    });
}