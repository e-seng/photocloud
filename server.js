#!/usr/bin/env node
const fs = require("fs");
const http = require("http");
const path = require("path");
const exifp = require("exif-parser");
const qs = require("querystring");

const manager = require("./manage_files.js")

const PORT = 9000;
const ROOT_DIR = process.cwd(); // this should be altered in deployment

function getFileType(request){
    let filename = request.url;
    return filename.split('.').slice(-1)[0];
}

function error404(response){
    response.writeHead(404, {"Content-Type" : "text/plain"});
    response.write("Error 404: That path does not seem to exist");
    response.end();
}

function error500(response){
    response.writeHead(500, {"Content-Type" : "text/plain"});
    response.write("Error 500: Something went wrong with the server");
    response.end();
}

function getIndex(response){
    filepath = path.join(ROOT_DIR, "index.html");

    try{
        data = fs.readFileSync(filepath);
    }catch(err){
        error500(response);
        console.log(`Error: ${err}`);
        return;
    }

    response.writeHead(200, {"Content-Type" : "text/html"});
    response.write(data);
    response.end();
}

function getCheckFile(response){
    filepath = path.join(ROOT_DIR, "javascript", "check_files.js");

    try{
        data = fs.readFileSync(filepath);
    }catch(err){
        error500(response);
        console.log(`Error: ${err}`);
        return;
    }

    response.writeHead(200, {"Content-Type" : "text/javascript"});
    response.write(data);
    response.end();
}

function getStyles(response){
    filepath = path.join(ROOT_DIR, "css", "styles.css");

    try{
        data = fs.readFileSync(filepath);
    }catch(err){
        error500(response);
        console.log(`Error: ${err}`);
        return;
    }

    response.writeHead(200, {"Content-Type" : "text/css"});
    response.write(data);
    response.end();
    return;
}

function getImage(request, response){
    let desiredPhoto = `.${request.url}`;
    let filetype = getFileType(request);

    filepath = ROOT_DIR;

    request.url.split('/').forEach(function(url_part){
        filepath = path.join(filepath, url_part);
    });

    try{
        data = fs.readFileSync(filepath);
    }catch(err){
        error500(response);
        console.log(`Error: ${err}`);
        return;
    }

    response.writeHead(200, {"Content-Type" : `image/${filetype}`});
    response.write(data);
    response.end();

    return;
}

function getPhotos(request, response){
    let urlParts = request.url.split(/[=&]/);
    let desiredAmount = parseInt(urlParts[1]);
    let currentCount = parseInt(urlParts[3]);

    let newPhotos = manager.getFiles(desiredAmount, currentCount);
    response.writeHead(200, {"Content-Type" : `application/json`});
    response.write(newPhotos);
    response.end();

    return;
}

function recieveFile(request, response){
	let tmpDir = path.join(ROOT_DIR, "tmp");
	if(!fs.existsSync(tmpDir)){fs.mkdirSync(tmpDir);}

	let buffer = "";
	
	request.on("data", chunk => {
		buffer += chunk;
	});
	request.on("end", () => {
		// console.log(buffer);
		let fileInfo = JSON.parse(buffer);
		
		try{
			// let filepath = path.join(tmpDir, fileInfo.name);
            let filepath = path.join(tmpDir, "test_file.png");
            let binaryArr = [];
            // Save all bytes from the file stream to convert back into an image
            for(let index in Object.keys(fileInfo.data)){
                console.log(fileInfo.data[index]);
                binaryArr.push(fileInfo.data[index]);
            }

			let binaryBuffer = Buffer.from(binaryArr);
            console.log("bonk");
            fs.writeFileSync(filepath, binaryBuffer);
			// TODO : Figure out how binary buffers should work, because
			// 		  currently only writing the data in ascii


			// TODO : Move photo into relevant nested folder
			// use time: <root>/<year>/<month>/<day>/file.ext
			// time info given in epoch within fileInfo.lastModified

			response.writeHead(200, {"Content-Type" : "text/plain"});
			response.write("photo recieved");
			response.end();
		}catch(err){
			response.writeHead(500, {"Content-Type" : "text/plain"});
			response.write(`Server side error : ${err}`);
			console.log(`Error: ${err}`);
			response.end();
		}
	});
	
}

function onRequest(request, response){
    const imageTypes = ["jpg", "jpeg", "png", "jfif", "gif", "bmp", "tiff"];
    let ip = (request.headers['x-forwarded-for'] || '').split(',').pop() ||
         request.connection.remoteAddress ||
         request.socket.remoteAddress ||
         request.connection.socket.remoteAddress;
    console.log(`${ip} made a ${request.method} request to ${request.url}`);

    if(request.method == "GET" && request.url == "/"){
        manager.updateTxt();
        getIndex(response);
    }else if(request.method == "GET" && request.url == "/styles.css"){
        getStyles(response);
    }else if(request.method == "GET" && imageTypes.includes(getFileType(request))){
        getImage(request, response);
    }else if(request.method == "GET" && request.url == "/check_files.js"){
        getCheckFile(response);
    }else if(request.method == "GET" && request.url.split("?")[0] == "/getphotos"){
        getPhotos(request, response);
	}else if(request.method == "POST" && request.url === "/photoupload"){
		recieveFile(request, response);
    }else{
        error404(response);
    }

}

http.createServer(onRequest).listen(PORT);
console.log("Local server started on %d", PORT);
