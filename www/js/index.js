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
        alert("device ready")
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
        $(document).delegate("#records", "pageshow", function() {
            alert("records showing");
        });
    }
};
$(document).delegate("#welcome", "pageshow", function() {
    $("#menu-button").css("display","none");
});

function logit(s) {
    document.getElementById("log").innerHTML += s;
    document.getElementById("log").innerHTML += "<br/>";
}

function onError(err) {
    logit(err.code);
}

//==============================
// Datepicker
//==============================
 $('.input-daterange').datepicker({
    todayBtn: "linked"
});
$('#datepicker').datepicker({
    startDate: "-95y",
    endDate: "+0d",
    autoclose: true
});

$('.hbpm-datepicker').datepicker({
    startDate: "+0d",
    endDate: "+1y",
    autoclose: true,
    todayHighlight: true
});

$('.hbpm-timepicker').datetimepicker({
    pickDate: false
});

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
// PDF Generator
// For more information, check: http://parall.ax/products/jspdf
//==============================
function generatePDFReport() {
    //FIRST GENERATE THE PDF DOCUMENT
    logit("generating pdf...");
    var doc = new jsPDF();
    doc.text(20, 20, 'HELLO!');
    doc.setFont("courier");
    doc.setFontType("normal");
    doc.text(20, 30, 'This is a PDF document generated using JSPDF.');
    doc.text(20, 50, 'YES, Inside of PhoneGap!');
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

function saveUserInfo(){
    logit("can read this...");
    var userinfo = {fileName: "personalInfo"}
    userinfo.name = $("#name").value;
    userinfo.dob = $("#datepicker").value;
    userinfo.nhsno = $("#nhsono").value;
    userinfo.gpemail= $("#gpemail").value;

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    logit(fileSystem.name + "yo");
    logit(fileSystem.root.name + "yo2");
    logit(fileSystem.root.fullPath + "yo3");
    fileSystem.root.getFile("userinfo.txt", {
        create: true
    }, function(entry) {
        logit(entry);
        entry.createWriter(function(writer) {
            writer.onwrite = function(evt) {
                logit("write success");
            };
            logit("writing to file");
            var json = JSON.stringify(userinfo); 
            writer.write(json);
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

function readUserInfo(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    logit(fileSystem.name);
    logit(fileSystem.root.name);
    logit(fileSystem.root.fullPath);
    fileSystem.root.getFile("userinfo.txt", function(entry) {
        var reader = new FileReader();
        logit(entry);
        reader.onloadend= function(evt){
            var userinfo =evt.target.result;
            var userinfoObj = JSON.parse(userinfo);
            logit("reading"+userinfo);
            document.getElementById("outname").innerHTML=userinfoObj.name;
        }
    }, function(error) {
        logit(error);
    });
}, function(event) {
    logit(event.target.error.code);
});
}

 $("#btn-next").bind("click",function(event){
    saveUserInfo();
    alert("data saved");
});

 $("#pi-save-btn").bind("click",function(event){
    readUserInfo();

 });
//Stringify a JSON JSON.stringify({test:123})
//Parse a JSON String JSON.parse(json).test