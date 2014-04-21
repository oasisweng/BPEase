function saveRecord(data_json) {
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
                            data_arr = $.parseJSON(evt.target.result);
                            data_arr.push(data_json);

                            //save it again
                            fileSystem.root.getFile(fileName, {
                                create: true
                            }, function(entry) {
                                var fileEntry = entry;
                                logit(entry);
                                entry.createWriter(function(writer) {
                                    writer.onwrite = function(evt) {
                                        alert("writing succeeded ");
                                    };
                                    writer.write(data_arr);
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
                logit("File not yet exist");
                data_arr.push(data_json)
                ileSystem.root.getFile(fileName, {
                    create: true
                }, function(entry) {
                    var fileEntry = entry;
                    logit(entry);
                    entry.createWriter(function(writer) {
                        writer.onwrite = function(evt) {
                            alert("writing succeeded ");
                        };
                        writer.write(data_arr);
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
        settings.totalFiles++;
        data_arr.push(data_json);
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile("H" + settings.totalFiles + ".txt", {
                create: true
            }, function(entry) {
                var fileEntry = entry;
                logit(entry);
                entry.createWriter(function(writer) {
                    writer.onwrite = function(evt) {
                        alert("writing succeeded ");
                    };
                    writer.write(data_arr);
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
}

$(document).delegate("#records", "pageshow", function() {
    alert("records showing");
});