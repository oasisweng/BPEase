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
            logit("Loading welcome screen");
            $("#register-button").addClass("remove");
            $("#menu-button").addClass("remove");
            loadWelcomeButton();
            //var element = document.getElementById('deviceProperties');
            //element.innerHTML = 'Device Name: ' + device.name + '<br />' + 'Device Cordova: ' + device.cordova + '<br />' + 'Device Platform: ' + device.platform + '<br />' + 'Device UUID: ' + device.uuid + '<br />' + 'Device Model: ' + device.model + '<br />' + 'Device Version: ' + device.version + '<br />';

            logit("Initializing local notification plugin");
            window.plugin.notification.local.onadd = function(id, state, json) {
                logit("added a new local notification " + id + " " + state + " " + json);
            };
            window.plugin.notification.local.ontrigger = function(id, state, json) {
                date = new Date($.parseJSON(json));
                today = new Date();
                if (date.getDate() == today.getDate() && date.getMonth() == today.getMonth()) {
                    alert("HBPM Mode finished");
                }
                $.mobile.navigate("#current-activity");
            };

            //generatePDFReport(dates, times, diastolic, systolic, pulse, personalDetais);

            //bluetooth
            logit("Bluetooth demo:");
            var macaddress = "00:09:1F:80:39:5C";
            //var macaddress = "E4:25:E7:E1:DE:06";
            bluetoothSerial.list(function(results) {
                logit(JSON.stringify(results));
            }, function(error) {
                logit("Failed to retrieve mac ad list " + error);
            });
            bluetoothSerial.isEnabled(function() {
                logit("bluetooth is enabled");
            }, function(error) {
                logit(error);
            });
            bluetoothSerial.connectInsecure(macaddress, function() {
                // if connected
                logit("bluetooth connected");
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
                        logit("Drop the love! Unable to disconnect.." + error);
                    });
                }, function(error) {
                    logit("Unable to subscribe to love.." + error);
                });
            }, function(error) {
                logit("Please check connection.. " + error);
            });

            //==============================
            // Datepicker
            //==============================
            $(".input-daterange").datepicker({
                startDate: "+0d",
                endDate: "+1y",
                autoclose: true,
                todayHighlight: true,
                todayBtn: "linked"
            });

            $('#datepicker').datepicker({
                startDate: "-95y",
                endDate: "+0d",
                autoclose: true
            });

            $("#date3").datepicker({
                startDate: "+0d",
                endDate: "+1y",
                autoclose: true,
                todayHighlight: true,
                todayBtn: "linked"
            });

            $('.hbpm-timepicker').datetimepicker({
                pickDate: false
            });

            //tweak
            $("#bluetooth-toggle").prop("checked", false).checkboxradio('refresh');
            $("#bluetooth-toggle-2").prop("checked", false).checkboxradio('refresh');
        });
    }
};
$(function() {
    if ($(window).width() > 800) {
        $(".btn-triple").css("font-size", "17px");
    } else {
        $(".btn-triple").css("font-size", "13px");
    }
    $(window).resize(function() {
        if ($(window).width() > 800) {
            $(".btn-triple").css("font-size", "17px");
        } else {
            $(".btn-triple").css("font-size", "13px");
        }
    });

    FastClick.attach(document.body);
    // var dates = new Array()
    // dates[0] = new Date();
    // dates[1] = new Date();
    // dates[2] = new Date();
    // dates[3] = new Date();
    // dates[4] = new Date();
    // dates[5] = new Date();


    // var times = new Array()
    // times[0] = new Date();
    // times[1] = new Date();
    // times[2] = new Date();
    // times[3] = new Date();
    // times[4] = new Date();
    // times[5] = new Date();

    // var systolic = new Array();
    // systolic[0] = 115;
    // systolic[1] = 110;
    // systolic[2] = 113;
    // systolic[3] = 115;
    // systolic[4] = 125;
    // systolic[5] = 117;

    // var diastolic = new Array();
    // diastolic[0] = 74;
    // diastolic[1] = 85;
    // diastolic[2] = 70;
    // diastolic[3] = 70;
    // diastolic[4] = 85;
    // diastolic[5] = 79;

    // var pulse = new Array();
    // pulse[0] = 74;
    // pulse[1] = 85;
    // pulse[2] = 70;
    // pulse[3] = 65;
    // pulse[4] = 85;
    // pulse[5] = 79;

    // var personalDetais = new Array();
    // personalDetais[0] = "Viraj Makol";
    // personalDetais[1] = "12/05/1995";
    // personalDetais[2] = "92147637523";
    // personalDetais[3] = "I am a fit and healthy boy.";
    // personalDetais[4] = "No";
    // personalDetais[5] = "No";

    // logit("Generating PDF Report");

    // generatePDFReport(dates, times, diastolic, systolic, pulse, personalDetais);
});

$(document).delegate("#current-activity", "pageshow", function() {
    if (settings.bluetooth) {
        $("#bluetooth-toggle-2").prop("checked", true).checkboxradio('refresh');
    } else {
        $("#bluetooth-toggle-2").prop("checked", false).checkboxradio('refresh');
    }

    if (settings.hbpm) {
        var sd = settings.hbpmStartDate;
        var ed = settings.hbpmEndDate;
        $("#startdate-txt").html(sd.getDate() + "/" + sd.getMonth() + "/" + sd.getFullYear());
        $("#enddate-txt").html(ed.getDate() + "/" + ed.getMonth() + "/" + ed.getFullYear());
        $("#morning-reminder-txt").html(sd.getHours() + ":" + sd.getMinutes());
        $("#evening-reminder-txt").html(ed.getHours() + ":" + ed.getMinutes());
    } else {
        $("#startdate-txt").html("");
        $("#enddate-txt").html("");
        $("#morning-reminder-txt").html("");
        $("#evening-reminder-txt").html("");
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