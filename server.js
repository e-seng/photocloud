#!/usr/bin/env node
var fs = require("fs");
var http = require("http");

var port = 8080;

function error404(request){
    return;
}

function getIndex(response){
    fs.readFile("./index.html", function(error, data){
        response.writeHead(200, {"ContentType" : "text/html"});
        response.write(data);
        response.end();
    });
}

function getStyles(response){
    fs.readFile("./css/styles.css", function(error, data){
        response.writeHead(200, {"ContentType" : "text/css"});
        response.write(data);
        response.end();
    });
}

function onRequest(request, response){
    console.log("A request has been made to %s", request.url);

    if(request.method == "GET" && request.url == "/"){
        getIndex(response);
    }
    if(request.method){
        getStyles(response);
    }
}

http.createServer(onRequest).listen(port);
console.log("Local server started on %d", port);