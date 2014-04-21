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


   