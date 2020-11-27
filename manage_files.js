// This file should be included in the server to update the photos.txt file
const fs = require("fs");
const path = require("path");

const DIRECTORIES = ["./stockimages/",]

function getFileNames(){
    let files = [];
    DIRECTORIES.forEach(function(dir){
        if(!fs.existsSync(dir)){return;}
        filenames = fs.readdirSync(dir);
        
        filenames.forEach(function(file){
            if(file[0] == "."){return;}
            let filepath = `${dir}${file}`;
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
            if(existing_files.includes(file)){return;}
            
            fs.appendFile(FILE_NAME, `${file}\n`, function(err){
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

    saveFile: function saveFile(fileJSON){
        try{
			// let filepath = path.join(tmpDir, fileJSON.name);
            // let filepath = path.join(tmpDir, "test_file.png");
            let binaryArr = [];
            // Save all bytes from the file stream to convert back into an image
            for(let index in Object.keys(fileJSON.data)){
                binaryArr.push(fileJSON.data[index]);
            }

            let photoDate = new Date(fileJSON.lastModified * 1000);

            let filepath = path.join(ROOT_DIR,
                                     photoDate.getFullYear(),
                                     photoDate.getMonth() + 1,
                                     photoDate.getDate(),
                                     fileJSON.name
            );

			let binaryBuffer = Buffer.from(binaryArr);
            console.log("bonk");
            fs.writeFileSync(filepath, binaryBuffer);

			// TODO : Move photo into relevant nested folder
			// use time: <root>/<year>/<month>/<day>/file.ext
			// time info given in epoch within fileInfo.lastModified

		}catch(err){
            throw err;
		}
    }
}
