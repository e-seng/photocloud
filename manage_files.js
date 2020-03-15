// This file should be included in the server to update the photos.json file
var fs = require("fs");

const DIRECTORIES = ["./stockimages/",]

module.exports = {
    updateJson: function updateJson(){
        DIRECTORIES.forEach(function(filepath){
            let files = fs.readdirSync(filepath);
            console.log(files)
        });
    } 
}

