function saveRecord(data_json) {
    alert("saving records " + data_json);
    var data_arr = new Array();
    if (settings.hbpm) { //hbpm mode
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
                                logit("Reading " + evt.target.result);
                                var result = $.parseJSON(evt.target.result);
                                data_arr = result.records;
                                data_arr.push(data_json);

                                var new_result = {
                                    sd: result.sd,
                                    ed: result.ed,
                                    records: data_arr
                                };

                                //save it again
                                fileSystem.root.getFile(fileName, {
                                    create: true
                                }, function(entry) {
                                    var fileEntry = entry;
                                    logit(entry);
                                    entry.createWriter(function(writer) {
                                        writer.onwrite = function(evt) {
                                            alert("updating existing records succeeded ");
                                        };
                                        writer.write(JSON.stringify(new_result));
                                    }, function(error) {
                                        logit(error);
                                    });
                                }, function(error) {
                                    logit(error);
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
                    data_arr.push(data_json);
                    if (settings.hbpm) {
                        startdate = settings.startdate;
                        enddate = settings.enddate;
                    } else {
                        startdate = settings.hbpmStartDate;
                        enddate = settings.hbpmEndDate;
                    }

                    var new_result = {
                        sd: startdate,
                        ed: enddate,
                        records: data_arr
                    };
                    fileSystem.root.getFile(fileName, {
                            create: true
                        }, function(entry) {
                            var fileEntry = entry;
                            entry.createWriter(function(writer) {
                                    writer.onwrite = function(evt) {
                                        alert("saving new record succeeded " + JSON.stringify(new_result));
                                    };
                                    writer.write(JSON.stringify(new_result));
                                },
                                function(error) {
                                    logit(error);
                                });
                        },
                        function(error) {
                            logit(error);
                        });
                });
            },
            function(event) {
                logit(evt.target.error.code);
            });
    } else {
        //free mode 
        settings.totalFiles++;
        var startdate;
        var enddate;
        data_arr.push(data_json);
        if (settings.hbpm) {
            startdate = settings.startdate;
            enddate = settings.enddate;
        } else {
            startdate = data_json[0].date;
            enddate = data_json[1].date;
        }

        var new_result = {
            sd: startdate,
            ed: enddate,
            records: data_arr
        };

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile("H" + settings.totalFiles + ".txt", {
                create: true
            }, function(entry) {
                var fileEntry = entry;
                entry.createWriter(function(writer) {
                    writer.onwrite = function(evt) {
                        alert("free mode writing succeeded" + JSON.stringify(new_result));
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
}

function displayRecords() {
    for (var i = 0; i < settings.totalFiles; i++) {
        var sd;
        var ed;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile("H" + i + ".txt", {
                create: false
            }, function(entry) {
                var fileEntry = entry;
                if (fileEntry) {
                    fileEntry.file(function(txtFile) {
                        var reader = new FileReader();
                        reader.onloadend = function(evt) {
                            logit("Reading " + evt.target.result);
                            var result = $.parseJSON(evt.target.result);
                            sd = result.sd;
                            ed = result.ed;
                        };
                        reader.readAsText(txtFile);
                    }, function(error) {
                        logit(error);
                    });
                }
            }, function(error) {
                logit(error);
            });
        }, function(error) {
            logit(error);
        });
        $('#records-table').append(
            $('<tr><td><div class="ui-checkbox"><label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-checkbox-off"><span id="startdate-' + i + '">' + sd + '</span>-<span id="enddate-' + i + '">' + ed + '</span></label><input type="checkbox" id="record-toggle-' + i + '" class="record-toggle"></div></td></tr>')
        );
    }
}

$(document).delegate("#records", "pageshow", function() {
    displayRecords();
});