#!/usr/bin/env node
const fs = require("fs");
const http = require("http");
const path = require("path");

const manager = require("./manage_files.js")

const PORT = 80;
const ROOT_DIR = "."

function getFileType(request){
    let filename = request.url;
    return filename.split('.').slice(-1);
}

function error404(response){
    response.writeHead(404, {"ContentType" : "text/plain"});
    response.write("Error 404: That path does not seem to exist");
    response.end();
    return;
}

function getIndex(response){
    fs.readFile("./index.html", function(error, data){
        response.writeHead(200, {"ContentType" : "text/html"});
        response.write(data);
        response.end();
    });
    return;
}

function getCheckFile(response){
    fs.readFile("./javascript/check_files.js", function(error, data){
        response.writeHead(200, {"ContentType" : "text/javacript"});
        response.write(data);
        response.end();
    });
    return;
}

function getStyles(response){
    fs.readFile("./css/styles.css", function(error, data){
        response.writeHead(200, {"ContentType" : "text/css"});
        response.write(data);
        response.end();
    });
    return;
}

function getImage(request, response){
    let desiredPhoto = `.${request.url}`;
    let filetype = getFileType(request);

    fs.readFile(desiredPhoto, function(error, data){
        response.writeHead(200, {"ContentType" : `image/${filetype}`});
        response.write(data);
        response.end();
    })

    return;
}

function getPhotos(request, response){
    let urlParts = request.url.split(/[=&]/);
    let desiredAmount = parseInt(urlParts[1]);
    let currentCount = parseInt(urlParts[3]);
    let filetype = getFileType(request);

    let newPhotos = manager.getFiles(desiredAmount, currentCount);
    response.writeHead(200, {"ContentType" : `image/${filetype}`});
    response.write(newPhotos);
    response.end();

    return;
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
    }else{
        error404(response);
    }

}

http.createServer(onRequest).listen(PORT);
console.log("Local server started on %d", PORT);