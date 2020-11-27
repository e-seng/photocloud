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
        const FILE_NAME = "photo_list.txt";

        if(!fs.existsSync(FILE_NAME)){
            // Create a blank file, which photos can be written to
            fs.writeFileSync(FILE_NAME, "");
        }

        let files = getFileNames();
        let existing_files = fs.readFileSync(FILE_NAME, "utf-8").split("\n");

        files.forEach(function(file){
            file = file.toString();
            if(existing_files.includes(file.split("\n")[0])){return;}
            
            fs.appendFile(FILE_NAME, file, function(err){
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
            if(index >= limit){
				finalString.push("end");
				break;
			}

            let photoURL = existingFiles[index];
            console.log(photoURL)
            finalString.push(photoURL);
        }

        return JSON.stringify(finalString);
    },
}
