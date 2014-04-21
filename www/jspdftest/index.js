$(document).ready(function() {
    generatePDFReport([], [], [], [], []);
});


//==============================
// PDF Generator
// For more information, check: http://parall.ax/products/jspdf
//==============================
function generatePDFReport(date_time, systolic, diastolic, pulse, personalDetais) {
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
    for(var i=0;i<systolic.length;i++)
    {
       content += '<td>' + date_time[i] + '</td>';
       content += '<td>' + date_time[i+1] + '</td>';   
       content += '<td>' + systolic[i] + '</td>';
       content += '<td>' + diastolic[i] + '</td>';
       content += '<td>' + pulse[i] + '</td>';
       content += '</tr>';
   }

//For summary date range and number of readings
   var length_date_time =  date_time.length;
   var readings_date_range = "(" + date_time[0] + "," date_time[1] + ") to " + "(" + date_time[length_date_time-2] + "," date_time[length_date_time-1] + ")" ;
   var length_readings = systolic.length;

//For Table 2 
   var readings = new Array(systolic,diastolic,pulse);
    var min_max_avg = new Array();
    for(var k=0;k<readings.length;k++)
        {
            var l= readings[k];
            var min = Math.min.apply(null,l);
            var max = Math.max.apply(null,l);
            var sum =0;
            for(var z=0 ; z<l.length; z++)
            {
               sum += l[z];
            }
            var avg = sum/l.length;
            min_max_avg.push(min,max,avg);
        }

    var columnHeadings = new Array("Syst BP","Diast BP","Pulse")    
    var content2= "";
    for(var m=0;m<columnHeadings.length;m++)
    {
        content2 += '<tr>';
        content2 += '<td>' + columnHeadings[m] + '</td>';
        content2 += '<td>'+ min_max_avg[m] + '</td>';
        content2 += '<td>'+ min_max_avg[m+1] + '</td>';
        content2 += '<td id= 'redcolouredbox'>'+ min_max_avg[m+2] + '</td>';
        content2+= '</tr>';
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







var content = "<tr>";
for (var a = 0; a < systolic.length; a++) {
    for (var b = 0; b < date_and_time.length; b += 2) {
        content += '<td>' + date_and_time[b] + '</td>';
        content += '<td>' + date_and_time[b + 1] + '</td>';
        for (var c = 0; c < systolic.length; c++) {
            content += '<td>' + systolic[c] + '</td>';
            for (var d = 0; d < diastolic.length; d++) {
                content += '<td>' + diastolic[d] + '</td>';
                for (var e = 0; e < pulse.length; e++) {
                    content += '<td>' + pulse[e] + '</td>';
                    content += '</tr>';
                }
            }
        }
    }
}
$("#bp-table").innerHTML += content;