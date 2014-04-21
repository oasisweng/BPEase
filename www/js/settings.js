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
    logit("can read this...");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
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
        logit(evt.target.error.code);
    });
}

function loadSettings(success) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getFile("settings.txt", {
            create: false
        }, function(entry) {
            var reader = new FileReader();
            alert("reading settings");
            reader.onloadend = function(evt) {
                var settingsJson = evt.target.result;
                var settingsObj = JSON.parse(settingsJson);
                logit("setting is set " + settingsObj);
                settings.firsttime = settingsObj.firsttime;
                settings.hbpm = settingsObj.hbpm;
                settings.bluetooth = settingsObj.bluetooth;
                settings.hasActivity = settingsObj.hasActivity;
                settings.hbpmFilePrefix = settingsObj.hbpmFilePrefix;
                success();
            }
        }, function(error) {
            logit("failed to load setting " + error);
        });
    }, function(event) {
        logit("failed to load setting " + event.target.error.code);
    });
}

$("#bluetooth-toggle").bind("click", function(event) {
    alert("bluetooth changed");
});

//  $("#pi-save-btn").bind("click",function(event){
//     readUserInfo();

//  });