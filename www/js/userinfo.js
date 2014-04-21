var userinfo_json;
var userinfo;

function saveUserInfo() {
    var aName = $('#user-name').val();
    var aDOB = $('#datepicker').datepicker("getDate").toJSON();
    var aNHSNO = $('#nhsno').val();
    var aGPEMAIL = $('#gpemail').val();
    var isHypertension = $('#user-hypertension option:selected').val();
    var isArrythmia = $('#user-arrythmia option:selected').val();
    var med = $("#medication").val();
    userinfo_json = JSON.stringify({
        name: aName,
        dob: aDOB,
        nhsno: aNHSNO,
        gpemail: aGPEMAIL,
        hypertension: isHypertension,
        arrythmia: isArrythmia,
        medication: med
    }, null, '\t');
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getFile("userinfo.txt", {
            create: true
        }, function(entry) {
            var fileEntry = entry;
            logit(entry);
            entry.createWriter(function(writer) {
                writer.onwrite = function(evt) {
                    logit("write success");
                    alert("saving " + userinfo_json);
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

function setPersonalInformation() {
    $('#user-name').val(userinfo.name);
    $('#nhsno').val(userinfo.nhsno);
    var dob2 = new Date(userinfo.dob);
    $('#datepicker').datepicker("setDate", dob2);
    $('#gpemail').val(userinfo.gpemail);
    $('#user-hypertension').val(userinfo.hypertension);
    $('#user-arrythmia').val(userinfo.arrythmia);
    $("#medication").val(userinfo.medication);
}

function setUserInfo() {
    $("#pi-name").html(userinfo.name);
    $("#pi-no").html(userinfo.nhsno);
    var dob2 = new Date(userinfo.dob);
    $("#pi-dob").html(dob2.toDateString());
    $("#pi-em").html(userinfo.gpemail);
    if (userinfo.hypertension == "Yes")
        $("#pi-h").html("Yes");
    else
        $("#pi-h").html("No");
    if (userinfo.arrythmia == "Yes")
        $("#pi-a").html("Yes");
    else
        $("#pi-a").html("No");
    if (userinfo.medication == "")
        $("#pi-medication").html("None");
    else
        $("#pi-medication").html(userinfo.medication);
}

function readUserInfo(isEditing) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getFile("userinfo.txt", {
            create: false
        }, function(entry) {
            var fileEntry = entry;
            if (fileEntry) {
                fileEntry.file(function(txtFile) {
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        userinfo_json = evt.target.result;
                        logit("Reading " + userinfo_json);
                        userinfo = $.parseJSON(userinfo_json);
                        if (isEditing)
                            setPersonalInformation();
                        else
                            setUserInfo();
                    }
                    reader.readAsText(txtFile);
                }, function(error) {
                    logit(error);
                });
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
    saveUserInfo();
});
$("#pi-edit-btn").click(function(event) {
    readUserInfo(true);
});

$(document).delegate("#personal-info", "pageshow", function() {
    readUserInfo(false);
});

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