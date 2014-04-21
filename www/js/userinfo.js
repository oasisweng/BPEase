function saveUserInfo(){
    logit("can read this...");
    var userinfo = {}
    userinfo.name = $("#name").value;
    userinfo.dob = $("#datepicker").value;
    userinfo.nhsno = $("#nhsono").value;
    userinfo.gpemail= $("#gpemail").value;

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    logit(fileSystem.name + "yo");
    logit(fileSystem.root.name + "yo2");
    logit(fileSystem.root.fullPath + "yo3");
    fileSystem.root.getFile("userinfo.txt", {
        create: true
    }, function(entry) {
        logit(entry);
        entry.createWriter(function(writer) {
            writer.onwrite = function(evt) {
                logit("write success");
            };
            logit("writing to file");
            var json = JSON.stringify(userinfo); 
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

function readUserInfo(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    logit(fileSystem.name);
    logit(fileSystem.root.name);
    logit(fileSystem.root.fullPath);
    fileSystem.root.getFile("userinfo.txt", function(entry) {
        var reader = new FileReader();
        logit(entry);
        reader.onloadend= function(evt){
            var userinfo =evt.target.result;
            var userinfoObj = JSON.parse(userinfo);
            logit("reading"+userinfo);
            document.getElementById("outname").innerHTML=userinfoObj.name;
        }
    }, function(error) {
        logit(error);
    });
}, function(event) {
    logit(event.target.error.code);
});
}

 $("#btn-next").bind("click",function(event){
    saveUserInfo();
    alert("data saved");
});

 $("#pi-save-btn").bind("click",function(event){
    readUserInfo();

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