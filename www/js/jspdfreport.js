//==============================
// PDF Generator
// For more information, check: http://parall.ax/products/jspdf
//==============================
function generatePDFReport(date_and_time,systolic,diastolic,pulse) {
    //FIRST GENERATE THE PDF DOCUMENT
    logit("generating pdf...");
    // @TODO: Need to simplify this demo

    var doc = new jsPDF();
    //Page 1-Readings details
    doc.setFontType("bold");
    doc.text(10,10,"Home blood pressure");
    doc.text(10,20,"monitoring (HBPM)");

    doc.setFontType("normal");
    doc.text(10,40,"Patient detais:");
    doc.text(10,50,"Name:");
    doc.text(10,60,"DOB:");
    doc.text(10,70,"NHS Number:");
    doc.text(10,80,"GP Surgery:");
    doc.text(10,90,"Named GP:");
    doc.text(10,110,"Medical History:");
    doc.text(10,120,"HTN-y/n");
    doc.text(10,130,"Arrythmia-y/n");

    //Adding the tables
    var content = "<tr>";
    for(var a=0;a<systolic.length;a++)
    {
      for(var b=0;b< date_and_time.length;b+=2)
      {
          content += '<td>' + date_and_time[b] + '</td>';
          content += '<td>' + date_and_time[b+1] + '</td>';
          for(var c=0; c < systolic.length; c++)
          {
             content += '<td>' + systolic[c] + '</td>';
             for(var d=0; d< diastolic.length;d++)
             {
                 content += '<td>' + diastolic[d] + '</td>';          
                 for(var e=0;e < pulse.length; e++)
                   {
                       content += '<td>' + pulse[e] + '</td>';
                       content += '</tr>';
                   }
               }
           }
       }
   }


    pdf.addHTML("
        <table style='width:50px'>
        <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Systolic</th>
        <th>Diastolic</th>
        <th>Pulse</th>
        </tr> "+content,function() {
        var string = pdf.output('firsttable');
        $('.preview-pane').attr('src', string);
    });



    doc.setFontType("bold");
    doc.text(60,90,"SUMMARY:");
    doc.text(60,100,"Readings from "+ ""+ "to "+""); // min and max date to be added here
    doc.text(60,110,"Total number of readings: "+ systolic.length);
    doc.text(60,120,"*Remember to discard the first days reading in the averages");
    doc.text(63,130,"calculation.");

    var readings = new Array(systolic,diastolic,pulse);
    var min_and_max = new Array();
    for(var k=0;k<readings.length;k++)
        {
            var l= readings[k];
            var min = Math.min.apply(null,l);
            var max = Math.max.apply(null,l);
            min_and_max.push(min,max);
        }

    var columnHeadings = new Array("Syst BP","Diast BP","Pulse")    
    var content2= "";
    for(var m=0;m<columnHeadings.length;m++)
    {
        content2 += '<tr>';
        content2 += '<td>' + columnHeadings[m] + '</td>';
        if(columnHeadings[m] == "Syst BP")
            {
                content2 += '<td>'+ min_and_max[0] + '</td>';
                content2 += '<td>'+ min_and_max[1] + '</td>';
            }
        if(columnHeadings[m] == "Diast BP")
            {
                content2 += '<td>'+ min_and_max[2] + '</td>';
                content2 += '<td>'+ min_and_max[3] + '</td>';
            }
        if(columnHeadings[m] == "Pulse")
            {
                content2 += '<td>'+ min_and_max[4] + '</td>';
                content2 += '<td>'+ min_and_max[5] + '</td>';
            }
        content2+= '</tr>'
    }
        
    pdf.addHTML("
        <table style='width:50px'>
        <tr>
        <th>BP</th>
        <th>Minimum</th>
        <th>Maximum</th>
        <th>Average</th>
        </tr>
         "+content2,function() {
        var string = pdf.output('secondtable');
        $('.preview-pane').attr('src', string);
    });

    doc.addPage();
    //Page 2-Instructions for HBPM 
    doc.setFontType('bold');
    doc.text(40,20,'Recall- instructions on the HBPM-could flash');
    doc.text(60,30,'up when pxs start this mode');

    doc.setFontType('normal');
    doc.text(10,50,'* When using home blood pressure monitoring (HBPM) to confirm a');
    doc.text(14,60,'diagnosis of hypertension,');
    doc.text(10,70,'* ensure that:');
    doc.text(10,80,'* - for each blood pressure recording, two consecutive');
    doc.text(14,90,'measurements are taken, atleast 1 min');
    doc.text(10,100,'* apart and with the person seated and');
    doc.text(10,110,'* - blood pressure is recorded twice daily, ideally in the morning');
    doc.text(14,120,'and evening and');
    doc.text(10,130,'* - blood pressure recording continues for at least 4 days, ideally');
    doc.text(14,140,'for 7 days.');
    doc.text(10,150,'* Discard the measurements taken on the first day and use the');
    doc.text(10,160,'average value of all the remaining');
    doc.text(10,170,'* measurements to confirm a diagnosis of hypertension.');

    doc.addPage();

    //Page 3-Nice guidance reminder for GP
    doc.setFontType('bold');
    doc.text(60,10,'NICE guidance reminder for GP:');
    doc.text(30,20,'http://www.nice.org.uk/guidance/CG127/QuickRefGuide');

    doc.setFontType('normal');
    doc.text(10,30,'* Stage 1 hypertension Clinic blood pressure is 140/90 mmHg');
    doc.text(14,40,'or higher and subsequent ambulatory');
    doc.text(10,50,'* blood pressure monitoring(ABPM) daytime average or');
    doc.text(14,60,'home blood pressure monitoring (HBPM)');
    doc.text(10,70,'* average blood pressure is 135/85 mmHg or higher.');
    doc.text(10,80,'* Stage 2 hypertension Clinic blood pressure is 160/100');
    doc.text(14,90,'mmHg or higher and subsequent ABPM');
    doc.text(10,100,'* daytime average or HBPM average blood pressure is 150/95');
    doc.text(14,110,'mmHg or higher.');
    doc.text(10,120,'* Severe hypertension Clinic systolic blood pressure is 180');
    doc.text(14,130,'mmHg or higher, or clinic diastolic blood');
    doc.text(10,140,'* pressure is 110 mmHg or higher.');

    var pdfOutput = doc.output();
    logit(pdfOutput);

    //NEXT SAVE IT TO THE DEVICE'S LOCAL FILE SYSTEM
    logit("saving to file system...");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        logit(fileSystem.name);
        logit(fileSystem.root.name);
        logit(fileSystem.root.fullPath);
        fileSystem.root.getFile("test.pdf", {
            create: true
        }, function(entry) {
            var fileEntry = entry;
            logit(entry);
            entry.createWriter(function(writer) {
                writer.onwrite = function(evt) {
                    logit("write success");
                };
                logit("writing to file");
                writer.write(pdfOutput);
            }, function(error) {
                logit(error);
            });
        }, function(error) {
            logit(error);
        });
    }, function(event) {
        logit(evt.target.error.code);
    });
}
//Stringify a JSON JSON.stringify({test:123})
//Parse a JSON String JSON.parse(json).test