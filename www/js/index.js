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
//==============================
// PDF Generator
// For more information, check: http://parall.ax/products/jspdf
//==============================
function generatePDFReport() {
    //FIRST GENERATE THE PDF DOCUMENT
    logit("generating pdf...");
    // @TODO: Need to simplify this demo

    var doc = new jsPDF('p','in','letter')
    , sizes = [12, 16, 20]
    , fonts = [['Times','Roman'],['Helvetica',''], ['Times','Italic']]
    , font, size, lines
    , margin = 0.5 // inches on a 8.5 x 11 inch sheet.
    , verticalOffset = margin
    , loremipsum ='\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tBPEase\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\Blood Presure Report\n\nPersonal Details\nName:\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tDOB:\nNHS Number:\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tGP Name:\nHypertension:\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tHeart Arrhythmia:\nMedical info:\n\nReadings\n'
    // Margins:
    doc.setDrawColor(0, 255, 0)
    .setLineWidth(1/72)
    .line(margin, margin, margin, 11 - margin)
    .line(8.5 - margin, margin, 8.5-margin, 11-margin)

    // the 3 blocks of text
    for (var i in fonts)
    {
     if (fonts.hasOwnProperty(i)) 
     {
        font = fonts[i]
        size = sizes[i]

        lines = doc.setFont(font[0], font[1])
                    .setFontSize(size)
                    .splitTextToSize(loremipsum, 7.5)
        // Don't want to preset font, size to calculate the lines?
        // .splitTextToSize(text, maxsize, options)
        // allows you to pass an object with any of the following:
        // {
        //  'fontSize': 12
        //  , 'fontStyle': 'Italic'
        //  , 'fontName': 'Times'
        // }
        // Without these, .splitTextToSize will use current / default
        // font Family, Style, Size.
        doc.text(0.5, verticalOffset + size / 72, lines)

        verticalOffset += (lines.length + 0.5) * size / 72
      }
    }
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