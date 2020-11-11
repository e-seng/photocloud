// Checks for and populates the website with photos found within the local directory
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

function appendPhoto(photoPath){
	//Prevent duplicate photos
	if(photoArray.includes(photoPath)){return;}
	photoArray.push(photoPath);
	
	let newPhoto = document.createElement("img");
	newPhoto.classList.add("photo");
	newPhoto.src = photoPath;

	let photoWrapper = document.querySelector("#photos");

	photoWrapper.appendChild(newPhoto);
}

function requestPhotos(){
    let photoCount = document.querySelectorAll(".photo").length;
    
    // Call for the next photos to be loaded
    var xml = new XMLHttpRequest();

    xml.onreadystatechange = function(){        
        if(this.readyState !== 4 && this.status !== 200){return;}
        if(xml.responseText.length == 3 || !xml.responseText.length){
            limitReached = true;
            return;
        }
        if(photoArray.includes(xml.responseText)){return;}
		let photos = xml.responseText.split(",");
		photos.forEach(function(photo){
			appendPhoto(photo);
		});
    }

    if(limitReached){return;}

    xml.open("GET", `./getphotos?add=${photosToAdd}&current=${photoCount}`);
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
