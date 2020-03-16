// This file should be included in the server to update the photos.json file
var fs = require("fs");

const DIRECTORIES = ["./stockimages/",]

function getFileNames(){
    let files = [];
    DIRECTORIES.forEach(function(dir){
        filenames = fs.readdirSync(dir);
        
        filenames.forEach(function(file){
            let filepath = "{0}{1}\n".format(dir, file);
            files.push(filepath);
        });
    });
    return files;
}

function getExistingFiles(reader, array){
    reader.on("data", function(data){
        func(data);
    });

    reader.on("end", function(){
        console.log("end");
    });
}

function dump_data(data, array){
    array.push(data);
}

module.exports = {
    updateJson: function updateJson(){

        let files = getFileNames();
        let existing_files = fs.readFileSync("photo_list.txt", "utf-8").split("\n");


        files.forEach(function(file){
            file = file.toString();
            if(existing_files.includes(file.split("\n")[0])){return;}
            
            fs.appendFile("./photo_list.txt", file, function(err){
                if(err) throw err;
            });   
            
        });
    } 
}

String.prototype.format = function(){
    let string = this;

    for (let index in arguments){
        string = string.replace("{" + addText + "}", arugments[index]);
    }

    return string;
}

