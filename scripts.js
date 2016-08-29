
var countSelectedImages = 0;
var selectedImages = [];

function AddToPrint(filename, noPush){

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

    var numberOfImagesAddedController = 0;
    var createAdRowNow = false;
    var createNewImageRow = true;
    var currentImageRow = undefined;

    for(var i = numberOfImagesAddedController; i < selectedImages.length; i++){
        if(createNewImageRow){
            currentImageRow = document.createElement("div");
            currentImageRow.classList.add("row");

            imgContainer.appendChild(currentImageRow);

            createNewImageRow = false;
        }

        var createdImageColumnDiv = CreateColDiv("3");
        createdImageColumnDiv.classList.add("printPreviewColumn");


        var createdImg = document.createElement("img");
        createdImg.src = selectedImages[i];
        createdImg.classList.add("downloadableImage");
        

        var printPreviewDiv = document.createElement("div");
        printPreviewDiv.classList.add("printPreview");
        

        printPreviewDiv.appendChild(createdImg);
        

        createdImageColumnDiv.appendChild(printPreviewDiv);
        currentImageRow.appendChild(createdImageColumnDiv);

        numberOfImagesAddedController++;

        if(numberOfImagesAddedController == 4){
            createNewImageRow = true;
            numberOfImagesAddedController = 0;

            //ads row after evert 4th image
            imgContainer.appendChild(CreateAdRow());
        }

        //if last
        if(i+1 == selectedImages.length){
            var numberOfEmtyDivsToAdd = 4 - numberOfImagesAddedController;

            for(var y = 0; y < numberOfEmtyDivsToAdd; y++){
                currentImageRow.appendChild(CreateColDiv("3"));
            }
        }
    }

    imgContainer.appendChild(CreateAdRow());
}

function CreateColDiv(dementor){
    var createdColumnDiv = document.createElement("div");
    createdColumnDiv.classList.add("col-" + dementor);    

    return createdColumnDiv;
}

function CreateAdRow(){
    var adColumn = CreateColDiv(12);
    adColumn.style = "background-color:SteelBlue; color:white";
    adColumn.innerHTML = "Placeholder for ads <br/><br/><br/><br/><br/>"

    var adRow = document.createElement("div");
    adRow.classList.add("row");
    adRow.classList.add("ad");
    adRow.appendChild(adColumn);

    return adRow;
}

function OpenPrintDialog(){
    window.print();
}