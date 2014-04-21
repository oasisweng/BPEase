var settings = {
    firsttime: true,
    hbpm: false,
    bluetooth: false,
    hasActivity: false,
    hbpmFilePrefix: "h1"
};

function setFirstTime(v) {
    settings.firsttime = v;
}

function sethbpm(v) {
    settings.hbpm = v;
}

function setBluetooth(v) {
    settings.bluetooth = v;
}

function setHasActivity(v) {
    settings.hasActivity = v;
}

function setHBMPFilePrefix(v) {
    settings.hbpmFilePrefix = v;
}

function saveSettings() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        logit("get file system");
        fileSystem.root.getFile("settings.txt", {
            create: true
        }, function(entry) {
            logit(entry);
            entry.createWriter(function(writer) {
                writer.onwrite = function(evt) {
                    logit("write success");
                };
                logit("writing settings");
                var json = JSON.stringify(settings);
                writer.write(json);
            }, function(error) {
                logit(error);
            });
        }, function(error) {
            logit(error);
        });
    }, function(event) {
        logit("cant save");
    });
}

function loadSettings(success) {
    if (settings.firsttime)
        success();
    else {
        logit("loading settings " + isCreating);
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            logit("get file system");
            fileSystem.root.getFile("settings.txt", {
                create: false
            }, function(entry) {
                entry.file(function(txtFile) {
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        var settingsJson = evt.target.result;
                        var settingsObj = $.parseJSON(settingsJson);
                        settings.firsttime = settingsObj.firsttime;
                        settings.hbpm = settingsObj.hbpm;
                        settings.bluetooth = settingsObj.bluetooth;
                        settings.hasActivity = settingsObj.hasActivity;
                        settings.hbpmFilePrefix = settingsObj.hbpmFilePrefix;
                        logit("setting is set " + settingsJson);
                        success();
                    }
                    reader.readAsText(txtFile);
                }, function(error) {
                    logit("can't read" + error);
                });
            }, function(error) {
                logit("failed to load setting " + error);
            });
        }, function(event) {
            logit("failed to load setting " + event);
        });
    }
}

//  $("#pi-save-btn").bind("click",function(event){
//     readUserInfo();

//  });