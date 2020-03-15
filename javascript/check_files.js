// Checks for and populates the website with photos found within the local directory
var fs = require("fs");

String.prototype.format = function(){
    let string = this;

    for (let index in arguments){
        string = string.replace("{" + addText + "}", arugments[index]);
    }

    return string;
}

var files = fs.readdirSync("./stockimages/");
console.log(files)

//document.getElementById("").innerHTML = "";