// Checks for and populates the website with photos found within the local directory

function init(){
	var limitReached = false;
    var queryPhoto = false; // set this to be true if photos are being queried
	var photoArray = [];

    // Get current date, so data can be pulled starting from here.
    var photoDate = new Date();
    // Remove any data more precise than the date
    photoDate = new Date(photoDate.toLocaleDateString());

	window.onscroll = function(ev){
    	if((window.innerHeight + window.scrollY) > document.body.scrollHeight){
        	return;
	    }
        if(queryPhoto){return;} // Don't add traffic if a request is prev. made
    	requestPhotos();
	}

	//document.getElementById("").innerHTML = "";

	function appendPhoto(photoPath){
		// Check for the end of the photostream
		if(photoPath === "end"){
			limitReached = true;
			console.log("oh no");
			return;
		}

		//Prevent duplicate photos
		if(photoArray.includes(photoPath)){return;}
		photoArray.push(photoPath);
	
		let newPhoto = document.createElement("img");
		newPhoto.classList.add("photo");
		newPhoto.src = photoPath;

		let photoWrapper = document.querySelector("#photos");

		photoWrapper.appendChild(newPhoto);
	}

    /* This is the old requestPhotos function
	function requestPhotos(){
	    let photoCount = document.querySelectorAll(".photo").length;
        const photosToAdd = 5;
    
    	// Call for the next photos to be loaded
	    const XHR = new XMLHttpRequest();

        XHR.onreadystatechange = function(){
        	if(this.readyState !== 4 && this.status !== 200){return;}
	        if(photoArray.includes(XHR.responseText)){return;}
			if(!XHR.responseText){return;}
			let photos = JSON.parse(XHR.responseText);
			photos.forEach(function(photo){
				if(limitReached){return;}
				appendPhoto(photo);
			});
    	}

	    if(limitReached){return;}

	    XHR.open("GET", `./getphotos?add=${photosToAdd}&current=${photoCount}`);
        XHR.send();
	} // */

    function requestPhotos(){
        let date = photoDate.getTime();
        let photoCount = document.querySelectorAll(".photo").length;
        //let photoCount = document.querySelectorAll(`.${date}`).length;

        // Create XHR to call new photos
        const XHR = new XMLHttpRequest();
        
        XHR.onreadystatechange = function(){
            if(XHR.readyState !== 4 && this.status !== 200){return;}
            if(!XHR.responseText){return;}
            queryPhoto = false;
            let photos = JSON.parse(XHR.responseText);
            
            photos.forEach(function(photo){
                if(limitReached){return;}
                appendPhoto(photo);
            });
        }

        if(limitReached){return;}
        XHR.open("GET", `./getphotos?current=${photoCount}&date=${date}`);
        XHR.send();
        queryPhoto = true;
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

    function uploadFile(file){
        const fr = new FileReader();
        const XHR = new XMLHttpRequest();

        let stream = {};
        stream.name = file.name;
        stream.lastModified = file.lastModified;

        fr.onloadend = function(dump){
            let data = new Uint8Array(fr.result);
            stream.data = data;

            XHR.open("POST", "/photoupload");
            XHR.send(JSON.stringify(stream))
            console.log("photo uploaded");
        }

        fr.readAsArrayBuffer(file);
    }
    
    // let submit = document.querySelector("input[type=submit]");
    let form = document.querySelector("form");
    let file = document.querySelector("input[type=file]").files[0];
    form.addEventListener("submit", function(event){
        event.preventDefault();
        uploadFile(file);
        console.log(" good");
    });
}

window.addEventListener("load", () => init());
