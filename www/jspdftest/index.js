$(document).ready(function() {
    generatePDFReport([], [], [], [], []);
});


//==============================
// PDF Generator
// For more information, check: http://parall.ax/products/jspdf
//==============================
function generatePDFReport(date_and_time, systolic, diastolic, pulse, personalDetais) {
    // @TODO: Need to simplify this demo

    var doc = new jsPDF('p', 'pt', 'a4');

    // doc.addHTML(document.body, function() {
    //     alert("finished");
    //     var string = pdf.output('datauristring');
    //     $('.preview-pane').attr('src', string);
    // });

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