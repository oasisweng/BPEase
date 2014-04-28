var records = new Array();
var sw3_interval = null;

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
                            //alert("saving records " + evt.target.result);
                            //save it again
                            fileSystem.root.getFile(fileName, {
                                create: true
                            }, function(entry) {
                                var fileEntry = entry;
                                logit(entry);
                                entry.createWriter(function(writer) {
                                    writer.onwrite = function(evt) {
                                        //alert("updating existing records succeeded " + JSON.stringify(new_result));
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
                //alert("startdate:" + startdate);
                fileSystem.root.getFile(fileName, {
                    create: true
                }, function(entry) {
                    var fileEntry = entry;
                    entry.createWriter(function(writer) {
                        writer.onwrite = function(evt) {
                            //alert("saving new record succeeded " + JSON.stringify(new_result) + " in " + settings.hbpmFileName);
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

        //alert("saving records " + JSON.stringify(new_result));
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile("H" + settings.totalFiles + ".txt", {
                create: true
            }, function(entry) {
                var fileEntry = entry;
                entry.createWriter(function(writer) {
                    writer.onwrite = function(evt) {
                        //alert("free mode writing succeeded, saving to " + "H" + settings.totalFiles + ".txt");
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
    //alert("reading i" + i + " t" + settings.totalFiles);
    if (i < 0 || settings.totalFiles == 0) {
        return;
    } else {
        var sd;
        var ed;
        fileSystem.root.getFile("H" + i + ".txt", {
            create: false
        }, function(entry) {
            var fileEntry = entry;
            //alert("receving file entry.");
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
                        //alert("receiving result " + evt.target.result + " " + sd);
                        records.push(result);
                        readRecord(fileSystem, i - 1);
                    };
                    reader.readAsText(txtFile);
                }, function(error) {
                    logit(error);
                });
            }
        }, function(error) {
            alert("can't locate H" + i + ".txt ")
            readRecord(fileSystem, i - 1);
        });
    }
}


function displayRecords() {
    records = new Array();
    if (sw3_interval) {
        clearInterval(sw3_interval);
    }
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        //alert("reading records");
        readRecord(fileSystem, settings.totalFiles - 1);
    }, function(error) {
        alert("can't access files.");
    });
}


$(document).delegate("#records", "pageshow", function() {
    displayRecords();
});

$("#send-button").click(function() {
    $(this).attr('disabled', 'disabled');
    drawSW3();
    $('#toggle-progress-3').show("slow", function() {
        var dates = new Array();
        var times = new Array();
        var systolic = new Array();
        var diastolic = new Array();
        var pulse = new Array();
        var personalDetais = new Array();
        //readUserInfo(false);
        personalDetais.push(
            userinfo.name,
            userinfo.dob,
            userinfo.nhsno,
            userinfo.hypertension,
            userinfo.arrythmia,
            userinfo.medication);
        for (var i = 0; i < settings.totalFiles; i++) {
            if ($("#record-toggle-" + i).is(':checked')) {
                var record = records[i].records;
                for (var j = 0; j < record.length; j++) {
                    //alert(JSON.stringify(record[j]) + record[j].date);
                    var measurement = record[j];
                    times.push(measurement.time);
                    dates.push(measurement.date);
                    systolic.push(measurement.systole);
                    diastolic.push(measurement.diastole);
                    pulse.push(measurement.pulse);
                }
            };
        }
        //alert(dates + "|||||" + times + "||||" + systolic + "||||||" + diastolic + "||||" + personalDetais);
        generatePDFReport(dates, times, diastolic, systolic, pulse, personalDetais);
    });
});

$("#record-button-back").click(function() {
    clearInterval(sw3_interval);
    $('#records-table').empty();
})

//Draw spinning wheel
var cog = new Image();

function drawSW3() {
    cog.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABK1JREFUeNqMVt1ZGzkUvVfS4IW1l8GO82w6IBXE7mCpAFMB+Pt4Z6iApALcAe4AU0HoAJfg7BPYHinnXmmciX+y0YdmJHnQ0bk/R5cvh5cUyFPwRD4EChgEvGWMB36R3+JaiTkmD5gOs8yNb25uLlerFf1pM2yIGA82TEY7xow1oj4GBU6S6yywPNG4JwDH+XGv0Whs7ndN8n97mmPsLCSYgy7ImPQE/pFDyAF+7L0fgTNFUDBcLal90taD1doQ/T6NT9DnW8zkT+jJuQVYukG3hifCVk/L3JOxMBa8VVlSp9MhHKLaB+zpNo1fdgEpmByuMqUAV5viOQLwXNax9KBAFNEEpN1pUwnQmvl6aTza6zNjrCKaymeyOdYAMgfg18iG4T/qw+AC94zvpzDjcwqOXo3VGH26H0xMZ7jPxgT0R2zUi4BYt6bAfEbJvJFZKA4ODgZ5nhcJLE9mk35X21vWC/TXKmiwr2xszoQd/PQv3t/QCzY2twpqBpb5FKOp+hCgzWaTWq0W1Xx0ij5An9WC5VtiLMwvNBrVaSGMvQk5jHQVPN7sb0HzAtE+QJrNgrcUNEARieWCut0ugR0tl8sKcJ5Ahc3jRviPK8ZGTaaBwGKyT+gTiwM4a3Jrba6MbeVXo5F4kp9shn29ndUYC9vLirGDXzRhrYhD8DME5Hkg22df5rDYS/RXmVIsaP/Q/SXs600YnifTjbeSWliEdTYb3QyTqYfdDKTL4B1KS6tVqf6SgGq3P9BvZGpvNIrPCgVKZlGlCDQDxJiCjVppCab05DJHzb+b1Gm36X80cVjLuzozexs0f6IgRkA5XRhzIixRL1+IzhwdHVHrn1Y9oXe1i10aKT6bGGhg1CKK+cT0zCGCs0oXTIogybJMw/779//o48duMvnO9rzLn+Kz8wgS5Shqo4njpCoOQA5Ajb8adHh4SMvVghaLhYb/HsBip88krNVISSEigOlhjmi0LziNhr6wOsgO9C1339vbGznnNAU2AM9Svk235cqKieKGkldAf7DGvTrjnjJnzyQoMu0ZTuZgUqvmlYR+f39XIE4uqCX1E/rDZpCYmKwOOmivAfYK9KF1AM7EdG4uAMLAOjmQideQXOJQkyUisqYiFRhtSFbxCxj8do0T30dmTvLhC+an0MZZVBHX09tBTG4qFigZEJEChjTIEwtRik81Qa7uOQU0IrYAe7FRjqYw6SlYjgAyN1GmHsFIGPfVnxzFuFITKEkfYK+oWZ5qKlIkcZ7UE92oXBmeIgIxtAO5UtSHqo9uiLW+sme5ejSIRASeAFR4LYy8MMzL1aq3EYWzJF28BgMEzGYpBkrMKelgl+P6uTcVY8NjLYyYPwMTCcufSaouH6al9xNJcjC82vDb9uVZKbrWIumNO+waVsu1TCC+Wxcg6xaSpsZSYM2wLO9/U8qZWH+wztQnsfAxV/E3MIKZVf1FsmJVV8mamhEmxZ0X7sSsABsGv1tZJGejmptU7FBUDYzPAXQBwFEEl+9+stFEroJEci2ELwIMmZuWoSTE9DYYcWVCjlJrZWMpeBhlAEqBiulPE84S3ixU5gSTwGGOdyEVNJXxA8nPevshwABHktBS1YoQ+QAAAABJRU5ErkJggg=='; // Set source path
    clearInterval(sw3_interval);
    sw3_interval = setInterval(draw3, 10);
}

var rotation = 0;

function draw3() {
    var ctx = document.getElementById('sw-canvas-3').getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.save();
    ctx.clearRect(0, 0, 27, 27);
    ctx.translate(13.5, 13.5); // to get it in the origin
    rotation += 1;
    ctx.rotate(rotation * Math.PI / 64); //rotate in origin
    ctx.translate(-13.5, -13.5); //put it back
    ctx.drawImage(cog, 0, 0);
    ctx.restore();
}