// This file should be included in the server to update the photos.txt file
const fs = require("fs");
const path = require("path");

const DIRECTORIES = ["./photos/",] 
// TODO: Set this to be archive filepaths
// This should be for any old photos within different hard-drives that should
// not be manipulated (at least written to)
//
// ideally this should eventually be a modifiable text document, but that's 
// a later thing

const ROOT_DIR = "./photos/";
// This should be the directory where new uploaded files are written to.
// Files are also read from here when viewing

updateTxt: function updateTxt(){
    const FILE_NAME = "year_list.txt";

    if(!fs.existsSync(FILE_NAME)){
        // Create a blank file, which photos can be written to
        fs.writeFileSync(FILE_NAME, "");
    }

    let years = fs.readdirSync(ROOT_DIR);
    let existingYears = fs.readFileSync(FILE_NAME, "utf-8").split("\n");
    years.forEach(year => {
        if(existingYears.includes(year)) return;
        existingYears.push(year)
    });
    // Make the most recent year first
    existingYears.sort((a, b) => {return b - a});
    // Remove any empty elements
    existingYears.filter((element) => {return !!element;});

    fs.writeFileSync(FILE_NAME, existingYears.join('\n'));
}

module.exports = {
    getFilesLegacy: function getFilesLegacy(desiredAmount, currentCount){
        let existingFiles = fs.readFileSync("photo_list.txt", "utf-8").split("\n");
        let limit = existingFiles.length - 1;
        let finalString = [];

        for(let counter = 0; counter < desiredAmount; counter++){
            let index = currentCount + counter;
            if(index >= limit){
				finalString.push("file-end");
				break;
			}

            let photoURL = existingFiles[index];
            console.log(photoURL)
            finalString.push(photoURL);
        }

        return JSON.stringify(finalString);
    },

    getFiles: function getFiles(currentAmount, requestedEpoch){
        const DESIRED_AMOUNT = 5;
        const FILE_NAME = "year_list.txt";

        if(!fs.existsSync(FILE_NAME)) fs.writeFileSync(FILE_NAME, "");
        let existingYears = fs.readFileSync("year_list.txt", "utf-8").split('\n');
        let finalYear = existingYears.slice(-1)[0];

        let dateExists = false;
        let responseObj = {"date" : requestedEpoch, "photos" : []};
        let folderNest;

        do{ // Find the next available date that has files
            folderNest = ROOT_DIR;
            let date = new Date(requestedEpoch);
            let dateParts = date.toISOString().split('T')[0].split('-');

            // If no saved data, return
            if(!existingYears){
                responseObj.push("no-photos");
                return responseObj;
            }

            // Prevent an infinite loop if no files are found
            // ie. this loops until the year is less than the last existing year
            if(date.getFullYear() < finalYear || requestedEpoch < 0){
                responseObj.photos.push("file-end");
                return responseObj;
            }

            // If year does not have any photos, skip
            if(!existingYears.includes(date.getFullYear().toString())){
                let lastYear = `12/31/${date.getFullYear() - 1}`;
                requestedEpoch = new Date(lastYear).getTime();
                continue;
            }

            // Use Array.prototype.every() instead of .forEach();
            dateExists = dateParts.every(function(part){
                folderNest = path.join(folderNest, part);
                return fs.existsSync(folderNest);
            });

            if(!dateExists) requestedEpoch -= 86400000;
        }while(!dateExists);
        
        // here, a folder outlined by folderNest should exist
        responseObj.date = requestedEpoch;
        let filenames = fs.readdirSync(folderNest);
        let limit = filenames.length;

        for(let counter = 0; counter < DESIRED_AMOUNT; counter++){
            if(currentAmount + counter >= limit){
                responseObj.photos.push("date-end");
                responseObj.date -= 86400000; // ensure next date is queried
                return responseObj;
            }
            let filename = filenames[currentAmount + counter];
            let filepath = path.join(folderNest, filename);
            responseObj.photos.push(filepath);
        }

        return responseObj;
    },

    saveFile: function saveFile(fileJSON){
        try{
			// Check if the photo directory exists, create it if not
            if(!fs.existsSync(ROOT_DIR)) fs.mkdirSync(ROOT_DIR);

            let binaryArr = [];
            // Save all bytes from the file stream to convert back into an image
            for(let index in Object.keys(fileJSON.data)){
                binaryArr.push(fileJSON.data[index]);
            }

            // Place the file within several nested folders, organized as:
            // ROOT_DIR/year/month/day/photo.ext
            let photoDate = new Date(fileJSON.lastModified);
            let dateParts = photoDate.toISOString().split('T')[0].split('-');

            let folderNest = ROOT_DIR;

            dateParts.forEach(function(part){
                folderNest = path.join(folderNest, part);

                if(!fs.existsSync(folderNest)){
                    fs.mkdirSync(folderNest);
                }
            });

            let filepath = path.join(folderNest, fileJSON.name);

			let binaryBuffer = Buffer.from(binaryArr);
            console.log("bonk");
            fs.writeFileSync(filepath, binaryBuffer);

            updateTxt();

			// TODO : Move photo into relevant nested folder
			// use time: <root>/<year>/<month>/<day>/file.ext
			// time info given in epoch within fileInfo.lastModified

		}catch(err){
            throw err;
		}
    }
}
