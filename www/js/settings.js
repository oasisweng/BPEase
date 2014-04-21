var settings = {}

function setFirstTime(){
    settings.firsttime = false;
}
function sethbpm(){
    settings.hbpm = false;
}
function setBluetooth(){
    settings. = false;
}



function saveSettings(){
    logit("can read this...");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    logit(fileSystem.name + "yo");
    logit(fileSystem.root.name + "yo2");
    logit(fileSystem.root.fullPath + "yo3");
    fileSystem.root.getFile("settings.txt", {s
        create: true
    }, function(entry) {
        logit(entry);
        entry.createWriter(function(writer) {
            writer.onwrite = function(evt) {
                logit("write success");
            };
            logit("writing to file");
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

function readSettings(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    logit(fileSystem.name);
    logit(fileSystem.root.name);
    logit(fileSystem.root.fullPath);
    fileSystem.root.getFile("settings.txt", function(entry) {
        var reader = new FileReader();
        logit(entry);
        reader.onloadend= function(evt){
            var settingsJson =evt.target.result;
            var settingsObj = JSON.parse(settingsJson);
            logit("reading"+userinfo);
            settings.firsttime = settingsObj.firsttime;
            settings.hbpm = settingsObj.hbpm;
            settings.bluetooth = settingsObj.bluetooth;

        }
    }, function(error) {
        logit(error);
    });
}, function(event) {
    logit(event.target.error.code);
});
}

function ifhbpm(){
    readSettings();
    if (settings.hbpm = true)
    { 
        settings.hbpm = false;
    }
    else
    {
        settings.hbpm = true;
    }
    saveSettings();
}

function ifBluetooth(){
    readSettings();
    if (settings.bluetooth = true)
    { 
        settings.bluetooth = false;
    }
    else
    {
        settings.bluetooth = true;
    }
    saveSettings();
}

 $("#bluetooth-toggle").bind("click",function(event){
    ifBluetooth();
    alert("bluetooth changed");
});

//  $("#pi-save-btn").bind("click",function(event){
//     readUserInfo();

//  });
