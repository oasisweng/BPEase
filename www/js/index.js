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

        loadSettings(function() {
            logit("File system demo:");
            $("#register-button").addClass("remove");
            $("#menu-button").addClass("remove");
            loadWelcomeButton();
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024, gotFS, onError);
            //var element = document.getElementById('deviceProperties');
            //element.innerHTML = 'Device Name: ' + device.name + '<br />' + 'Device Cordova: ' + device.cordova + '<br />' + 'Device Platform: ' + device.platform + '<br />' + 'Device UUID: ' + device.uuid + '<br />' + 'Device Model: ' + device.model + '<br />' + 'Device Version: ' + device.version + '<br />';

            logit("Initiating local notification plugin..");
            window.plugin.notification.local.onadd = function(id, state, json) {
                logit("added a new local notification " + id + " " + state + " " + json);
            };
            window.plugin.notification.local.ontrigger = function(id, state, json) {
                alert('Time to measure your blood pressure, please! :-)~~~');
                date = new Date($.parseJSON(json));
                today = new Date();
                if (date.getDate() == today.getDate()) {
                    alert("HBPM Mode finished");
                }
            };

            var dates = new Array()
            dates[0] = new Date();
            dates[1] = new Date();
            dates[2] = new Date();
            dates[3] = new Date();
            dates[4] = new Date();
            dates[5] = new Date();


            var times = new Array()
            times[0] = new Date();
            times[1] = new Date();
            times[2] = new Date();
            times[3] = new Date();
            times[4] = new Date();
            times[5] = new Date();

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
            pulse[3] = 65;
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

            logit("Generating PDF Report");

            generatePDFReport(dates, times, diastolic, systolic, pulse, personalDetais);

            //bluetooth
            logit("Bluetooth demo:");
            var macaddress = "00:09:1F:80:39:5C";
            bluetoothSerial.connect(macaddress, function() {
                // if connected
                bluetoothSerial.subscribe('\n', function(data) {
                    logit("Receiving data " + data);
                    //disconnect
                    bluetoothSerial.disconnect(function() {
                        bluetoothSerial.unsubscribe(
                            function(data) {
                                logit("unsubscribing " + data);
                            },
                            function(error) {
                                logit("unsubscribe error.." + error);
                            }
                        );
                    }, function(error) {
                        logit("unable to disconnect.." + error);
                    });
                }, function(error) {
                    logit("Please check connection.. subscribe failure.." + error);
                });
            }, function(error) {
                logit("Please check connection.." + error);
            });
        });
    }
};

$(function() {
    FastClick.attach(document.body);

    var dates = new Array()
    dates[0] = new Date();
    dates[1] = new Date();
    dates[2] = new Date();
    dates[3] = new Date();
    dates[4] = new Date();
    dates[5] = new Date();


    var times = new Array()
    times[0] = new Date();
    times[1] = new Date();
    times[2] = new Date();
    times[3] = new Date();
    times[4] = new Date();
    times[5] = new Date();

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
    pulse[3] = 65;
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

    logit("Generating PDF Report");

    generatePDFReport(dates, times, diastolic, systolic, pulse, personalDetais);
});

$(document).delegate("#current-activity", "pageshow", function() {
    if (settings.bluetooth) {
        $("#bluetooth-toggle-2").prop("checked", true).checkboxradio('refresh');;
    } else {
        $("#bluetooth-toggle-2").prop("checked", false).checkboxradio('refresh');
    }
})
$(document).delegate("#setupHBPM", "pageshow", function() {
    if (settings.bluetooth) {
        $("#bluetooth-toggle").prop("checked", true).checkboxradio('refresh');;
    } else {
        $("#bluetooth-toggle").prop("checked", false).checkboxradio('refresh');
    }
})

function logit(s) {
    document.getElementById("log").innerHTML += s;
    document.getElementById("log").innerHTML += "<br/>";
    var objDiv = document.getElementById("debug");
    objDiv.scrollTop = objDiv.scrollHeight;
}

function onError(err) {
    logit(err.code);
}

function appPause() {
    saveSettings();
}

//==============================
// Datepicker
//==============================
$('#datepicker').datepicker({
    startDate: "-95y",
    endDate: "+0d",
    autoclose: true
});

$('.hbpm-datepicker').datepicker({
    startDate: "+0d",
    endDate: "+1y",
    autoclose: true,
    todayHighlight: true,
    todayBtn: "linked"
});

$('.hbpm-timepicker').datetimepicker({
    pickDate: false
});

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
        logit("Writer is unavailable!");
    }
    return false;
}