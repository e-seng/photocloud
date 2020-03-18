// This file should be included in the server to update the photos.txt file
var fs = require("fs");

const DIRECTORIES = ["./stockimages/","./additional_photos/"]

function getFileNames(){
    let files = [];
    DIRECTORIES.forEach(function(dir){
        if(!fs.existsSync(dir)){return;}
        filenames = fs.readdirSync(dir);
        
        filenames.forEach(function(file){
            let filepath = "{0}{1}\n".format(dir, file);
            files.push(filepath);
        });
    });
    return files;
}

module.exports = {
    updateTxt: function updateTxt(){

        let files = getFileNames();
        let existing_files = fs.readFileSync("photo_list.txt", "utf-8").split("\n");

        files.forEach(function(file){
            file = file.toString();
            if(existing_files.includes(file.split("\n")[0])){return;}
            
            fs.appendFile("./photo_list.txt", file, function(err){
                if(err) throw err;
            });   
            
        });
    },

    getFiles: function getFiles(desiredAmount, currentCount){
        let existingFiles = fs.readFileSync("photo_list.txt", "utf-8").split("\n");
        let limit = existingFiles.length - 1;
        let finalString = "{0}";

        for(let counter = 0; counter < desiredAmount; counter++){
            let index = currentCount + counter;
            if(index >= limit){break;}

            let photoURL = existingFiles[index];
            console.log(photoURL)
            let addString = "<img src={0} class=\"photo\" />{1}".format(photoURL,"{0}");
            finalString = finalString.format(addString);
        }

        finalString = finalString.format("\n");
        return finalString;
    }
}

String.prototype.format = function(){
    let string = this;

    for (let index in arguments){
        string = string.replace("{" + addText + "}", arugments[index]);
    }

    return string;
}

