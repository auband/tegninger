
var countSelectedImages = 0;
var selectedImages = [];

function AddToPrint(filename, noPush){
    //var dialog = document.getElementById("printDialog");
    //dialog.classList.remove("hidden");

    //imgContainerSelected

    if(!noPush)
        selectedImages.push(filename);

    var divSelectContainer = document.getElementById(filename).parentElement;
    divSelectContainer.classList.add("imgContainerSelected");

    var divImgCounterContainer = divSelectContainer.children[0];
    
    divImgCounterContainer.classList.add("downloadImgCounterContainerSelected");
    divImgCounterContainer.classList.remove("downloadImgCounterContainer");
    divImgCounterContainer.innerHTML++;

    countSelectedImages++;
    var btnDownloadNow = document.getElementById("btnDownloadNow");
    btnDownloadNow.value = "Print " + countSelectedImages + " tegninger";
}

function GoToPrintPage(){
    sessionStorage.setItem("selectedImages", JSON.stringify(selectedImages));
    window.location.href = 'printPage.htm';
}

function GoToIndexPage(){
    window.location.href = 'index.htm';
}

function PurgeSelectedImages(){
    sessionStorage.removeItem("selectedImages");
}

function OnLoadIndexPage(){
    
    if(sessionStorage.getItem("selectedImages") != undefined){
        selectedImages = JSON.parse(sessionStorage.getItem("selectedImages"));

        for(var i = 0; i < selectedImages.length; i++){
            AddToPrint(selectedImages[i], true);
        }
    }
}

function OnLoadPrintPage(){
    
    selectedImages = JSON.parse(sessionStorage.getItem("selectedImages"));

    var imgContainer = document.getElementById("imgContainer");

    for(var i = 0; i < selectedImages.length; i++){

        var createdColumnDiv = document.createElement("div");
        createdColumnDiv.classList.add("col-2"); 

        var createdImg = document.createElement("img");
        createdImg.src = selectedImages[i];
        createdImg.classList.add("downloadableImage");

        createdColumnDiv.appendChild(createdImg);

        imgContainer.appendChild(createdColumnDiv);
    }
}

function OpenPrintDialog(){
    window.print();
}