#!/usr/bin/env node
var fs = require("fs");
var http = require("http");

var port = 8080;

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

function onRequest(request, response){
    let imageTypes = ["jpg", "jpeg", "png", "jfif", "gif", "bmp", "tiff", "svg"];
    console.log("A request has been made to %s", request.url);

    if(request.method == "GET" && request.url == "/"){
        getIndex(response);
    }else if(request.method == "GET" && request.url == "/styles.css"){
        getStyles(response);
    }else if(request.method == "GET" && imageTypes.includes(getFileType(request))){
        getImage(request, response);
    }else if(request.method == "GET" && request.url == "/check_files.js"){
        getCheckFile(response);
    }else if(request.method == "GET" && request.url == "/test"){
        fs.readFile("./php/test.php", function(err, data){
            response.writeHead(200, {"ContentType" : "text/php"});
            response.write(data);
            response.end();
        });
    }else{
        error404(response);
    }

}

http.createServer(onRequest).listen(port);
console.log("Local server started on %d", port);