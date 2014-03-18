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
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        //navigator.notification.alert("PhoneGap is ready!");
        logit("Phonegap is ready.");
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024, gotFS, onError);
        var element = document.getElementById('deviceProperties');
        element.innerHTML = 'Device Name: '     + device.name     + '<br />' +
                            'Device Cordova: '  + device.cordova  + '<br />' +
                            'Device Platform: ' + device.platform + '<br />' +
                            'Device UUID: '     + device.uuid     + '<br />' +
                            'Device Model: '    + device.model    + '<br />' +
                            'Device Version: '  + device.version  + '<br />';

    },
};

function logit(s){
    document.getElementById("log").innerHTML += s;
    document.getElementById("log").innerHTML += "<br/>";
}

function onError(err) {
    logit(err.code);
}

var FILENAME = "readme.txt",
    file = {
        writer: { available: false },
        reader: { available: false }
    },
    $ = function (id) {
        return document.getElementById(id);
    };

function gotFileWriter(fileWriter) {
    logit("Got File Writer");
    file.writer.available = true;
    file.writer.object = fileWriter;
    saveText(); 
}

function gotFileEntry(fileEntry) {
    logit("Got File Entry!");
    file.entry = fileEntry;
    fileEntry.createWriter(gotFileWriter, onError);
}

function gotFS(fs) {
    fs.root.getFile(FILENAME, {create: true, exclusive: false},
                    gotFileEntry, onError);
}

function readText() {
    if (file.entry) {
        file.entry.file(function (txtFile) {
            var reader = new FileReader();
            file.reader.available = false;
            reader.onloadend = function (evt) {
                file.reader.available = true;
                var text = evt.target.result;
                logit("Reading "+text);
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
        file.writer.object.onwriteend = function (evt) {
            file.writer.available = true;
            file.writer.object.seek(0);
            logit("saving complete");
            readText();
        }
        file.writer.object.write("hello world!");
    } else {
        logit("Writer is unavaiable!");
    }

    return false;
}

function onload() {
    //alert("abc");
}