#!/usr/bin/env node
var fs = require("fs");
var http = require("http");

var port = 8080;

function error404(request){
    return;
}

function onRequest(request, response){

}

http.createServer(onRequest).listen(port);
console.log("Local server started on %d", port);