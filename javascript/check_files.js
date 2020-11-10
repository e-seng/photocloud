// Checks for and populates the website with photos found within the local directory
var photo_count;
var limitReached = false;
var photoArray = [];
const photosToAdd = 5;

window.onscroll = function(ev){
    if((window.innerHeight + window.scrollY) > document.body.scrollHeight) {
        return;
    }
    requestPhotos();
}
//document.getElementById("").innerHTML = "";

function requestPhotos(){
    photoCount = document.querySelectorAll(".photo").length;
    
    // Call for the next photos to be loaded
    var xml = new XMLHttpRequest();

    xml.onreadystatechange = function(){        
        if(this.readyState !== 4 && this.status !== 200){return;}
        if(xml.responseText.length == 3 || !xml.responseText.length){
            limitReached = true;
            return;
        }
        if(photoArray.includes(xml.responseText)){return;}
        console.log(xml.responseText.length);
        photoArray.push(xml.responseText);
        updatePage();
    }

    if(limitReached){return;}

    xml.open("GET", `./getphotos?add=${photosToAdd}&current=${photoCount}`));
    xml.send();
}

function updatePage(){
    var collectedPhotos = "";
    var photoCount = 0;
    photoArray.forEach(function(photoSet){
        if(photoSet.length === 3 || !photoSet.length){return;}
        collectedPhotos += photoSet;
        photoCount++;
    });

    document.getElementById("photos").innerHTML = collectedPhotos;

    limitReached = !photoArray.length;
    
}
