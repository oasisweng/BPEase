$(document).ready(function() {
    generatePDFReport([], [], [], [], []);
});


//==============================
// PDF Generator
// For more information, check: http://parall.ax/products/jspdf
//==============================


var date_time = new Array()
date_time[0] = "01/04/14";
date_time[1] = "08:30";
date_time[2] = "01/04/14";
date_time[3] = "17:30";
date_time[4] = "02/04/14";
date_time[5] = "09:15";
date_time[6] = "02/04/14";
date_time[7] = "18:00";
date_time[8] = "03/04/14";
date_time[9] = "09:00";
date_time[10] = "03/04/14";
date_time[11] = "17:45";

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
personalDetais[3] = "";
personalDetais[4] = "P Garcha";
personalDetais[5] = "I am a fit and healthy boy.";
personalDetais[6] = "No";
personalDetais[7] = "No";



function generatePDFReport() {
    // @TODO: Need to simplify this demo

    var doc = new jsPDF('p', 'pt', 'a4');

    // doc.addHTML(document.body, function() {
    //     alert("finished");
    //     var string = pdf.output('datauristring');
    //     $('.preview-pane').attr('src', string);
    // });



    //======================================
    //Functions written on April 21,2014
    //======================================

    //For Table 1
    var content = "<tr>";
    for (var i = 0; i < systolic.length; i++) {
        content += '<td>' + date_time[i] + '</td>';
        content += '<td>' + date_time[i + 1] + '</td>';
        content += '<td>' + systolic[i] + '</td>';
        content += '<td>' + diastolic[i] + '</td>';
        content += '<td>' + pulse[i] + '</td>';
        content += '</tr>';
    }

    //For summary date range and number of readings
    var length_date_time = date_time.length;
    //var readings_date_range = "(" + date_time[0] + "," date_time[1] + ") to " + "(" + date_time[length_date_time-2] + "," date_time[length_date_time-1] + ")" ;
    var length_readings = systolic.length;

    //For Table 2 
    var readings = new Array(systolic, diastolic, pulse);
    var min_max_avg = new Array();
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
        content2 += '<td>' + min_max_avg[m] + '</td>';
        content2 += '<td>' + min_max_avg[m + 1] + '</td>';
        content2 += '<td id= ' + "'redcolouredbox'>" + min_max_avg[m + 2] + '</td>';
        content2 += '</tr>';
    }



    //======================================
    //Functions written on April 21,2014
    //====================================== 

    doc.addHTML(document.body, function() {
        var string = doc.output('datauristring');
        $('.preview-pane').attr('src', string);
    });
}
//Parse a JSON String JSON.parse(json).test