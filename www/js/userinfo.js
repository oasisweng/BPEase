function saveUserInfo(){
		var dob = $("#dob").value;
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        logit(fileSystem.name);
        logit(fileSystem.root.name);
        logit(fileSystem.root.fullPath);
        fileSystem.root.getFile("userinfo.txt", {
            create: true
        }, function(entry) {
            var fileEntry = entry;
            logit(entry);
            entry.createWriter(function(writer) {
                writer.onwrite = function(evt) {
                    logit("write success");
                };
                logit("writing to file");
                writer.write(pdfOutput);
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