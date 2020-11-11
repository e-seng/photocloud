// This file should be included in the server to update the photos.txt file
var fs = require("fs");

const DIRECTORIES = ["./stockimages/",]

function getFileNames(){
    let files = [];
    DIRECTORIES.forEach(function(dir){
        if(!fs.existsSync(dir)){return;}
        filenames = fs.readdirSync(dir);
        
        filenames.forEach(function(file){
            if(file[0] == "."){return;}
            let filepath = `${dir}${file}\n`;
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
        let finalString = [];

        for(let counter = 0; counter < desiredAmount; counter++){
            let index = currentCount + counter;
            if(index >= limit){return "end";}

            let photoURL = existingFiles[index];
            console.log(photoURL)
            finalString.push(photoURL);
        }

        return JSON.stringify(finalString);
    },
}
