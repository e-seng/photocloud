// Checks for and populates the website with photos found within the local directory

String.prototype.format = function(){
    let string = this;

    for (let index in arguments){
        string = string.replace("{" + addText + "}", arugments[index]);
    }

    return string;
}

//document.getElementById("").innerHTML = "";