var settings = {
    firsttime: true,
    hbpm: false,
    bluetooth: false,
    hbpmFileName: "H0",
    hbpmStartDate: new Date(),
    hbpmEndDate: new Date,
    totalFiles: 0
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

function setHBMPFileName(v) {
    settings.hbpmFileName = v;
}

function saveSettings() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getFile("settings.txt", {
            create: true
        }, function(entry) {
            logit(entry);
            entry.createWriter(function(writer) {
                writer.onwrite = function(evt) {
                    alert("settings saved!");
                };
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
    logit("loading settings");
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
                    settings.hbpmFileName = settingsObj.hbpmFileName;
                    settings.hbpmStartDate = new Date(settingsObj.hbpmStartDate);
                    settings.hbpmEndDate = new Date(settingsObj.hbpmEndDate);
                    settings.totalFiles = settingsObj.totalFiles;
                    logit("setting is set " + settingsJson);
                    success();
                };
                reader.readAsText(txtFile);
            }, function(error) {
                logit("can't read" + error);
            });
        }, function(error) {
            logit("failed to load setting " + error);
        });
    }, function(event) {
        logit("failed to load setting " + event);
        success();
    });
}

//  $("#pi-save-btn").bind("click",function(event){
//     readUserInfo();

//  });