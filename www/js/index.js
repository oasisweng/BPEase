/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //navigator.notification.alert("PhoneGap is ready!");
        logit("Phonegap is ready.");
        logit("File system demo:");
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024, gotFS, onError);
        var element = document.getElementById('deviceProperties');
        element.innerHTML = 'Device Name: ' + device.name + '<br />' + 'Device Cordova: ' + device.cordova + '<br />' + 'Device Platform: ' + device.platform + '<br />' + 'Device UUID: ' + device.uuid + '<br />' + 'Device Model: ' + device.model + '<br />' + 'Device Version: ' + device.version + '<br />';
        logit("setting local notificaition");
        window.plugin.notification.local.onadd = function(id, state, json) {
            logit("added a new local notification " + id + " " + state + " " + json);
        };
        window.plugin.notification.local.ontrigger = function(id, state, json) {
            logit("a notification is triggered " + id + " " + state + " " + json);
        };
        window.plugin.notification.local.add({
            message: 'Great app!'
        });
        var title = 'Reminder';
        var message = 'Dont forget to buy some flowers.';
        var repeat = 'weekly';
        var date = new Date().getTime();
        var new_date = new Date(date + 6 * 1000);
        setLocalNotificaiton(new_date, title, message, repeat);
        generatePDFReport();

        $('#pi-save-btn').bind("click", function(){
            
        })
    }
};

function logit(s) {
    document.getElementById("log").innerHTML += s;
    document.getElementById("log").innerHTML += "<br/>";
}

function onError(err) {
    logit(err.code);
}

//==============================
// Local Notification
//==============================
function setLocalNotificaiton(date_c, title_c, message_c, repeat_c) {
    var id_c = parseInt(Math.random() * 1000);
    logit("Notification ID " + id_c);
    window.plugin.notification.local.add({
        id: id_c,
        title: title_c,
        message: message_c,
        repeat: repeat_c,
        date: date_c,
    });
}
//==============================
// Files
//==============================
var FILENAME = "readme.txt",
    file = {
        writer: {
            available: false
        },
        reader: {
            available: false
        },
        fullPath: ""
    };

function gotFileWriter(fileWriter) {
    logit("Got File Writer");
    file.writer.available = true;
    file.writer.object = fileWriter;
    saveText();
}

function gotFileEntry(fileEntry) {
    file.entry = fileEntry;
    file.fullPath = fileEntry.fullPath;
    logit("Got File Entry! " + file.fullPath);
    fileEntry.createWriter(gotFileWriter, onError);
}

function gotFS(fs) {
    fs.root.getFile(FILENAME, {
        create: true,
        exclusive: false
    }, gotFileEntry, onError);
}

function readText() {
    if (file.entry) {
        file.entry.file(function(txtFile) {
            var reader = new FileReader();
            file.reader.available = false;
            reader.onloadend = function(evt) {
                file.reader.available = true;
                var text = evt.target.result;
                logit("Reading " + text);
                //sendEmail();
            }
            reader.readAsText(txtFile);
        }, onError);
    }
    return false;
}

function saveText() {
    if (file.writer.available) {
        file.writer.available = false;
        logit("saving text 'hello world!'");
        file.writer.object.onwriteend = function(evt) {
            file.writer.available = true;
            file.writer.object.seek(0);
            logit("saving complete");
            readText();
        }
        file.writer.object.write("hello world HAHAHA PRANK!");
    } else {
        logit("Writer is unavaiable!");
    }
    return false;
}
//==============================
// Email Composer
//==============================
function sendEmail() {
    logit("Email Demo");
    subject = "subject";
    body = "body";
    toRecipients = ["oasisweng@gmail.com"];
    ccRecipients = ["chaitanya.agrawal.13@ucl.ac.uk"];
    bccRecipients = [""];
    isHtml = true;
    logit("Sending with Attachments:" + file.fullPath);
    attachments = [file.fullPath];
    attachmentsData = null;
    window.plugins.emailComposer.showEmailComposerWithCallback(sendEmail_Result, subject, body, toRecipients, ccRecipients, bccRecipients, isHtml, attachments, attachmentsData);
}

function sendEmail_Result() {
    logit("Email calling back");
}
//==============================
// Datepicker
//==============================
$(function() {
    $('#datepicker').datepicker({
        format: 'mm-dd-yyyy',
        endDate: '+1y',
        startDate: '-80y'
    });
});

//=========================================================================
//JQPlot 
//For more information, check: http://www.jqplot.com/tests/line-charts.php
//=========================================================================
function plotGraph(){
    
}


//==============================
// PDF Generator
// For more information, check: http://parall.ax/products/jspdf
//==============================
function generatePDFReport() {
    //FIRST GENERATE THE PDF DOCUMENT
    logit("generating pdf...");
    // @TODO: Need to simplify this demo

    var doc = new jsPDF();
    //Page 1-Readings details
    doc.setFontType("bold");
    doc.text(10,10,"Home blood pressure");
    doc.text(10,20,"monitoring (HBPM)");

    doc.setFontType("normal");
    doc.text(10,40,"Patient detaisl:");
    doc.text(10,50,"Name:");
    doc.text(10,60,"DOB:");
    doc.text(10,70,"NHS Number:");
    doc.text(10,80,"GP Surgery:");
    doc.text(10,90,"Named GP:");
    doc.text(10,110,"Medical History:");
    doc.text(10,120,"HTN-y/n");
    doc.text(10,130,"Arrythmia-y/n");

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

    //Adding the tables
    


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