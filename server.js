#!/usr/bin/env node
var fs = require("fs");
var http = require("http");
var manager = require("./manage_files.js")

var port = 80;

String.prototype.format = function(){
    let originalString = this;
    
    for(var index in arguments){
        originalString = originalString.replace("{" + index + "}", arguments[index]);
    }

    return originalString;
}

function error404(response){
    response.writeHead(404, {"ContentType" : "text/plain"});
    response.write("Whoops, the file that you requested does not seem to exist :/");
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
    let desiredPhoto = ".{0}".format(request.url);
    let filetype = getFileType(request);

    fs.readFile(desiredPhoto, function(error, data){
        response.writeHead(200, {"ContentType" : "image/{0}".format(filetype)});
        response.write(data);
        response.end();
    })

    return;
}

function getFileType(request){
    let filename = request.url;
    let parts = filename.split('.');
    return parts[1];
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
    console.log("A request has been made to {0} {1}".format(request.method, request.url));

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

http.createServer(onRequest).listen(port);
console.log("Local server started on %d", port);