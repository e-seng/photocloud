// Checks for and populates the website with photos found within the local directory

function init(){
	var limitReached = false;
    var queryPhoto = false; // set this to be true if photos are being queried
	var photoArray = [];

    // Get current date, so data can be pulled starting from here.
    var reqDate = new Date();
    // Remove any data more precise than the date
    reqDate = new Date(`${reqDate.toISOString().split('T')[0]}T07:00:00.000Z`);

	window.onscroll = function(ev){
    	if((window.innerHeight + window.scrollY) > document.body.scrollHeight){
        	return;
	    }
        if(queryPhoto){return;} // Don't add traffic if a request is prev. made
    	requestPhotos();
	}

	//document.getElementById("").innerHTML = "";

    function numToLet(number){
        let numArray = Array.from(number.toString());
        numArray = numArray.map(Number);
        let finalString = "";

        numArray.forEach((num) => {
            if(!num) return;
            finalString += String.fromCharCode(Number(num) + 97);
        });

        return finalString;
    }

	function appendPhoto(photoPath, requestDate){
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
        newPhoto.classList.add(numToLet(requestDate));
		newPhoto.src = photoPath;

        newPhoto.addEventListener("click", () => enlargePhoto(photoPath));

		let photoWrapper = document.querySelector("#photos");

		photoWrapper.appendChild(newPhoto);
	}

    function requestPhotos(){
        let date = reqDate.getTime();
        //let photoCount = document.querySelectorAll(".photo").length;
        let photoCount = document.querySelectorAll(`.${numToLet(date)}`).length;

        // Create XHR to call new photos
        const XHR = new XMLHttpRequest();

        XHR.onreadystatechange = function(){
            if(XHR.readyState !== 4 && this.status !== 200){return;}
            if(!XHR.responseText){return;}
            queryPhoto = false;
            let response = JSON.parse(XHR.responseText);
            console.log(response);

            reqDate = new Date(response.date);
            response.photos.forEach(function(photo){
                if(limitReached){return;}
                if(photo === "date-end"){return;}
                if(photo === "file-end"){
                    limitReached = true;
                    return;
                }
                appendPhoto(photo, reqDate.getTime());
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
    form.addEventListener("submit", function(event){
        event.preventDefault();
        let file = document.querySelector("input[type=file]").files[0];
        uploadFile(file);
        console.log(" good");
    })

    function enlargePhoto(photoname){
        document.querySelector("#focus-image").src = photoname;
        document.querySelector(".image-modal").classList.remove("modal-hidden");
    }

    function modalExit(){
        document.querySelector(".image-modal").classList.add("modal-hidden");
    }

    // Work out navigation stuff;
    document.querySelector("#cycle_left").addEventListener("click", () => {
        let fullPhotoSrc = document.querySelector("#focus-image").src;
        // Get the photo name, and reattach it to the proper path
        let currentPhoto = `photos/${fullPhotoSrc.split("photos/")[1]}`;
        let imageIndex = photoArray.indexOf(currentPhoto);

        if(imageIndex - 1 < 0) return;

        document.querySelector("#focus-image").src = photoArray[imageIndex - 1];
    });

    document.querySelector("#cycle_right").addEventListener("click", () => {
        let fullPhotoSrc = document.querySelector("#focus-image").src;
        // Get the photo name, and reattach it to the proper path
        let currentPhoto = `photos/${fullPhotoSrc.split("photos/")[1]}`;
        let imageIndex = photoArray.indexOf(currentPhoto);

        if(imageIndex + 1 >= photoArray.length) return;

        document.querySelector("#focus-image").src = photoArray[imageIndex + 1];
    });

    document.querySelector(".exit").addEventListener("click", () => {
        modalExit();
    });
}

window.addEventListener("load", () => init());
