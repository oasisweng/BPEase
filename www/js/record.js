var records = new Array();

function saveRecord(data_json) {
    var data_arr = new Array();
    if (settings.hbpm) { //hbpm mode
        settings.hbpmFileName = "H" + settings.totalFiles;
        var fileName = settings.hbpmFileName + ".txt";
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile(fileName, {
                create: false
            }, function(entry) {
                var fileEntry = entry;
                if (fileEntry) {
                    fileEntry.file(function(txtFile) {
                        var reader = new FileReader();
                        reader.onloadend = function(evt) {
                            var result = $.parseJSON(evt.target.result);
                            data_arr = result.records;
                            data_arr.push(data_json[0]);
                            data_arr.push(data_json[1]);

                            var new_result = {
                                sd: settings.hbpmStartDate,
                                ed: settings.hbpmEndDate,
                                records: data_arr
                            };
                            alert("saving records " + evt.target.result);
                            //save it again
                            fileSystem.root.getFile(fileName, {
                                create: true
                            }, function(entry) {
                                var fileEntry = entry;
                                logit(entry);
                                entry.createWriter(function(writer) {
                                    writer.onwrite = function(evt) {
                                        alert("updating existing records succeeded " + JSON.stringify(new_result));
                                    };
                                    writer.write(JSON.stringify(new_result));
                                }, function(error) {
                                    logit(error);
                                });
                            }, function(error) {
                                alert("unable to find file" + fileName);
                            });
                        }
                        reader.readAsText(txtFile);
                    }, function(error) {
                        logit(error);
                    });
                }
            }, function(error) {
                //file not yet exist
                var startdate;
                var enddate;
                data_arr.push(data_json[0]);
                data_arr.push(data_json[1]);
                startdate = settings.hbpmStartDate;
                enddate = settings.hbpmEndDate;

                var new_result = {
                    sd: startdate,
                    ed: enddate,
                    records: data_arr
                };
                alert("startdate:" + startdate);
                fileSystem.root.getFile(fileName, {
                    create: true
                }, function(entry) {
                    var fileEntry = entry;
                    entry.createWriter(function(writer) {
                        writer.onwrite = function(evt) {
                            alert("saving new record succeeded " + JSON.stringify(new_result) + " in " + settings.hbpmFileName);
                        };
                        writer.write(JSON.stringify(new_result));
                    }, function(error) {
                        logit(error);
                    });
                }, function(error) {
                    logit(error);
                });
            });
        }, function(event) {
            logit(evt.target.error.code);
        });
    } else {
        //free mode 
        var startdate;
        var enddate;
        data_arr.push(data_json[0]);
        data_arr.push(data_json[1]);
        startdate = data_json[0].date;
        enddate = data_json[1].date;

        var new_result = {
            sd: startdate,
            ed: enddate,
            records: data_arr
        };

        alert("saving records " + JSON.stringify(new_result));
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile("H" + settings.totalFiles + ".txt", {
                create: true
            }, function(entry) {
                var fileEntry = entry;
                entry.createWriter(function(writer) {
                    writer.onwrite = function(evt) {
                        alert("free mode writing succeeded, saving to " + "H" + settings.totalFiles + ".txt");
                        settings.totalFiles++;
                    };
                    writer.write(JSON.stringify(new_result));
                }, function(error) {
                    logit(error);
                });
            }, function(error) {
                logit(error);
            });
        }, function(event) {
            logit(event);
        });
    }
    saveSettings();
}

function readRecord(fileSystem, i) {
    alert("reading i" + i + " t" + settings.totalFiles);
    if (i >= settings.totalFiles || settings.totalFiles == 0) {
        return;
    } else {
        var sd;
        var ed;
        fileSystem.root.getFile("H" + i + ".txt", {
            create: false
        }, function(entry) {
            var fileEntry = entry;
            alert("receving file entry.");
            if (fileEntry) {
                fileEntry.file(function(txtFile) {
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        var result = $.parseJSON(evt.target.result);
                        sd = new Date(result.sd).toDateString();
                        ed = new Date(result.ed).toDateString();
                        $('#records-table').append(
                            $('<tr><td><label><input type="checkbox" id="record-toggle-' + i + '" class="record-toggle"><span id="startdate-' + i + '">' + sd + '</span>-<span id="enddate-' + i + '">' + ed + '</span></label></td></tr>')
                        ).trigger('create');
                        alert("receiving result " + evt.target.result + " " + sd);
                        records.push(result);
                        readRecord(fileSystem, i + 1);
                    };
                    reader.readAsText(txtFile);
                }, function(error) {
                    logit(error);
                });
            }
        }, function(error) {
            alert("can't locate H" + i + ".txt ")
            readRecord(fileSystem, i + 1);
        });
    }
}


function displayRecords() {
    records = new Array();
    $('#records-table').empty();
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        alert("reading records");
        readRecord(fileSystem, 0);
    }, function(error) {
        alert("can't access files.");
    });
}


$(document).delegate("#records", "pageshow", function() {
    displayRecords();
});

$("#send-button").click(function() {
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
    pulse[3] = 70;
    pulse[4] = 85;
    pulse[5] = 79;

    var personalDetais = new Array();
    personalDetais[0] = "Viraj Makol";
    personalDetais[1] = "12/05/1995";
    personalDetais[2] = "92147637523";
    personalDetais[3] = "I am a fit and healthy boy love love love.";
    personalDetais[4] = "No";
    personalDetais[5] = "No";

    generatePDFReport(dates, times, diastolic, systolic, pulse, personalDetais);

    var dates = new Array();
    var times = new Array();
    var systolic = new Array();
    var diastolic = new Array();
    var pulse = new Array();
    var personalDetais = new Array();
    readUserInfo(false);
    personalDetais[0] = userinfo.name;
    personalDetais[1] = userinfo.dob;
    personalDetais[2] = userinfo.nhsno;
    personalDetais[3] = userinfo.medication;
    personalDetais[4] = userinfo.hypertension;
    personalDetais[5] = userinfo.arrythmia;


    for (var i = 0; i < settings.totalFiles; i++) {
        if ($("#record-toggle-" + i).is(':checked')) {
            for (var j = 0; j < records[i].length; j++) {
                times.push(records[i][j].time);
                dates.push(records[i][j].date);
                diastolic.push(records[i][j].diastole);
                pulse.push(records[i][j].pulse);
            }
        };
    }
    alert("dates " + dates);
    alert("times " + times);
})