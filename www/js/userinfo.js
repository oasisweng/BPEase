var userinfo_json;
var userinfo;

function saveUserInfo() {
    var aName = $('#user-name').val();
    var aDOB = $('#datepicker').datepicker("getDate");
    var aNHSNO = $('#nshno').val();
    var aGPEMAIL = $('#gpemail').val();
    var isHypertension = $('#user-hypertension option:selected').val();
    var isArrythmia = $('#user-arrythmia option:selected').val();
    userinfo_json = JSON.stringify({
        name: aName,
        dob: aDOB,
        nhsno: aNHSNO,
        gpemail: aGPEMAIL,
        hypertension: isHypertension,
        arrythmia: isArrythmia
    }, null, '\t');
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        logit(fileSystem.name);
        logit(fileSystem.root.name);
        logit(fileSystem.root.fullPath);
        fileSystem.root.getFile("test.pdf", {
            create: true
        }, function(entry) {
            var fileEntry = entry;
            logit(entry);
            entry.createWriter(function(writer) {
                writer.onwrite = function(evt) {
                    logit("write success");
                };
                logit("writing to file " + userinfo_json);
                writer.write(userinfo_json);
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

function readUserInfo() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        logit(fileSystem.name);
        logit(fileSystem.root.name);
        logit(fileSystem.root.fullPath);
        fileSystem.root.getFile("userinfo.txt", function(entry) {
            var fileEntry = entry;
            logit(entry);
            if (file.entry) {
                file.entry.file(function(txtFile) {
                    var reader = new FileReader();
                    file.reader.available = false;
                    reader.onloadend = function(evt) {
                        file.reader.available = true;
                        userinfo_json = evt.target.result;
                        logit("Reading " + userinfo_json);
                        userinfo = $.parseJSON(userinfo_json);
                    }
                    reader.readAsText(txtFile);
                }, onError);
            }
        }, function(error) {
            logit(error);
        });
    }, function(event) {
        logit(evt.target.error.code);
    });
}

//check if user info are entered correctly
$('#user-btn-next').click(function(event) {
    var aName = $('#user-name').val();
    var aDOB = $('#datepicker').val();
    var aNHSNO = $('#nshno').val();
    var aGPEMAIL = $('#gpemail').val();
    if (aName == "") {
        alert("Name is empty");
        event.preventDefault();
    } else if (aDOB == "") {
        alert("DOB is empty");
        event.preventDefault();
    } else if (aNHSNO == "") {
        alert("NHSNo is empty");
        event.preventDefault();
    } else if (aGPEMAIL == "") {
        alert("GP Email is empty");
        event.preventDefault();
    }
});

$("#pi-save-btn").click(function(event) {
    alert("finish");
})

//JSON.stringify
//JSON.stringify({ uno: 1, dos : 2 }, null, '\t')
// returns the string:
// '{            \
//     "uno": 1, \
//     "dos": 2  \
// }'

// obj = $.parseJSON(data) 
// obj.uno 
// obj.dos