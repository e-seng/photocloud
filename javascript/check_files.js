// Checks for and populates the website with photos found within the local directory
var photo_count;
var limit;
var photoArray = [];

String.prototype.format = function(){
    let string = this;

    for (let index in arguments){
        string = string.replace("{" + index + "}", arguments[index]);
    }

    return string;
}


window.onscroll = function(ev){
    if((window.innerHeight + window.scrollY) > document.body.scrollHeight) {
        return;
    }
    requestPhotos();
}
//document.getElementById("").innerHTML = "";

function requestPhotos(){
    const photosToAdd = 5;
    photoCount = document.querySelectorAll(".photo").length;
    
    // Call for the next photos to be loaded
    var xml = new XMLHttpRequest();

    xml.onreadystatechange = function(){
        if(this.readyState != 4 && this.status != 200){return;}
        if(photoArray.includes(xml.responseText)){return;}
        photoArray.push(xml.responseText);
        updatePage();
    }

    xml.open("GET", "./getphotos?add={0}&current={1}".format(photosToAdd, photoCount));
    xml.send();
}

function updatePage(){
    var collectedPhotos = "";
    photoArray.forEach(function(photoSet){
        collectedPhotos += photoSet;
    });

    document.getElementById("photos").innerHTML = collectedPhotos;
}