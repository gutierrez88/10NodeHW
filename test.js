var fs = require("fs");

var defaultSong = "";
 
fs.readFile("./random.txt", "utf8", function(error, data) {
    if (error) {
        console.log(error);
    };
    debugger;
    var dataArr = [];
    console.log(data);
    var dataArr = data.split(",");
    console.log(dataArr);
    defaultSong = dataArr[1];
});

