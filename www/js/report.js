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
    hours = time.getHours();
    minutes = time.getMinutes();
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


function generatePDFReport(dates, times, d, s, p, pd) {
    var doc = new jsPDF('p', 'pt', 'a4', false);
    var length = dates.length;

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
    $('#bp-table1').empty();
    $('#bp-table1').append("<tr><th>Date</th><th>Time</th><th>Systolic</th><th>Diastolic</th><th>Pulse</th></tr>");
    $('#bp-table1').append($(content)).trigger('create');

    //For summary date range and number of readings
    if (length > 0) {

        getDateInfo(0, dates, times);
        var fullStartDate = day + " " + monthNames[month] + " " + hours + ":" + minutes;
        getDateInfo(length - 1, dates, times);
        var fullEndDate = day + " " + monthNames[month] + " " + hours + ":" + minutes;
        $('#rstartdate').html(fullStartDate);
        $('#renddate').html(fullEndDate);
        $('#n-readings').html(length);
    }
    //alert("finish sum" + length);

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

    //alert("finish prep");
    $('#bp-table2').empty();
    $('#bp-table2').append('<tr><th>BP</th><th>Minimum</th><th>Maximum</th><th>Average</th></tr>');
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
    $("#welcome-footer").width = "1200px";
    //$("#main").css("background-color", "white");
    doc.addHTML(document.getElementById("rpage"), function() {
        // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        //     fs.URL = fileSystem.root.toURL();
        //     fileSystem.root.getFile("test.pdf", {
        //         create: true,
        //         exclusive: false
        //     }, function(entry) {
        //         entry.createWriter(function(writer) {
        //             writer.onwrite = function(evt) {
        //                 file.URL = entry.toURL();
        //                 $('#toggle-progress-3').hide("fast", function() {
        //                     clearInterval(sw3_interval);
        //                     sendEmail();
        //                 });
        //             };
        //             writer.write(doc.output("arraybuffer"));
        //         }, function(error) {
        //             logit(error);
        //         });

        //     }, function(error) {
        //         logit(error);
        //     });
        // }, function(event) {
        //     logit(event.target.error.code);
        // });
        var string = doc.output('datauristring');
        $('.preview-pane').attr('src', string);
    });
}