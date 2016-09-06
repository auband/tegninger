

var selectedImageIds = [];
var waitForAnimation = false;

function AddToPrint(imgId, insertIntoSelectedPrints){

    if(insertIntoSelectedPrints){
        selectedImageIds.push(imgId);
    }    

    SetSelectedForPrintGraphics(imgId);
}

function SetSelectedForPrintGraphics(imgId){

    if(document.getElementById(imgId) != undefined){//element may be hidden

        var divSelectContainer = document.getElementById(imgId).parentElement;

        

        divSelectContainer.classList.add("imgContainerSelected");

        var divImgCounterContainer = divSelectContainer.children[0];
        
        divImgCounterContainer.classList.add("downloadImgCounterContainerSelected");
        divImgCounterContainer.classList.remove("downloadImgCounterContainer");
        divImgCounterContainer.innerHTML++;
        
        var btnDownloadNow = document.getElementById("btnDownloadNow");
        btnDownloadNow.value = "Print " + selectedImageIds.length + " tegninger";
    }
} 

function GoToPrintPage(){   
    sessionStorage.setItem("selectedImages", JSON.stringify(selectedImageIds)); //must keep for navigation between pages
    window.location.href = 'printPage.htm';
}

function GoToIndexPage(){
    window.location.href = 'index.htm';
}

function PurgeSelectedImages(){
    sessionStorage.removeItem("selectedImages");
}

function OnLoadIndexPage(){
    
    $.getJSON('imageMetaData.json', function(imageData) {         
        FillContentFromJson(imageData, 0);
        ResetPrintStateOnImages(false);
    });
}

function ResetPrintStateOnImages(refillArrayOfPrints){
    if(sessionStorage.getItem("selectedImages") != undefined){//get from storage
        selectedImageIds = JSON.parse(sessionStorage.getItem("selectedImages"));

        for(var i = 0; i < selectedImageIds.length; i++){
            AddToPrint(selectedImageIds[i], refillArrayOfPrints);
        }
    }
}

function OnLoadPrintPage(){
    
    selectedImageIds = JSON.parse(sessionStorage.getItem("selectedImages"));

    var imgContainer = document.getElementById("imgContainer");

    var numberOfImagesAddedController = 0;
    var createAdRowNow = false;
    var createNewImageRow = true;
    var currentImageRow = undefined;

    for(var i = numberOfImagesAddedController; i < selectedImageIds.length; i++){
        if(createNewImageRow){
            currentImageRow = document.createElement("div");
            currentImageRow.classList.add("row");

            imgContainer.appendChild(currentImageRow);

            createNewImageRow = false;
        }

        var createdImageColumnDiv = CreateColDiv("3");
        createdImageColumnDiv.classList.add("printPreviewColumn");


        var createdImg = document.createElement("img");
        createdImg.src = selectedImageIds[i];
        createdImg.classList.add("downloadableImage");
        

        var printPreviewDiv = document.createElement("div");
        printPreviewDiv.classList.add("printPreview");

        var printedLogoBottom = document.createElement("div");
        printedLogoBottom.innerHTML = "TEGNINGER.NO<p class='printedSubtitle'>Gratis tegninger for fargelegging for store og små</p>"
        printedLogoBottom.classList.add("printedLogo");
        printedLogoBottom.classList.add("print-only");      

        printPreviewDiv.appendChild(createdImg);
        printPreviewDiv.appendChild(printedLogoBottom);
                

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
        if(i+1 == selectedImageIds.length){
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
    
    adColumn.classList.add("adColumn");
    adColumn.innerHTML = "Placeholder for ads <br/><br/><br/><br/><br/>"

    var adRow = document.createElement("div");
    adRow.classList.add("row");
    adRow.classList.add("adRow");
    adRow.classList.add("non-printable");
    adRow.appendChild(adColumn);

    return adRow;
}

function OpenPrintDialog(){
    window.print();
}

function FillContentFromJson(json, startIndex, setSelectedGraphics = false){

    var contentDiv = $("#content");
    contentDiv.empty();

    var createRow = true;
    var rowDiv;
    var appendAdRowAfterController = 0;

    jQuery.each(json, function(i, val){

        if(i < startIndex)
            return;//next
        
        if(!IsTagsInFilter(val.tags))
            return;

        var appendAdRowAfter = false;

        if(createRow){

            rowDiv = $("<div class='row'></div>") 
            contentDiv.append(rowDiv);

            createRow = false;

            if(appendAdRowAfterController == 0){
                appendAdRowAfter = true;
                appendAdRowAfterController = 1;
            }
            else{
                appendAdRowAfterController--;
            }
        }
        else{
            createRow = true;
        } 

        var columnDiv = $("<div class='col-6'></div>")
        rowDiv.append(columnDiv);

        var imgContainerDiv = $("<div class='imgContainer'></div>");
        columnDiv.append(imgContainerDiv);

        imgContainerDiv.append("<div class='downloadImgCounterContainer'>0</div>");
        imgContainerDiv.append("<img id='"+ val.name + "' class='downloadableImage' src='" + val.path + "'></img>")

        columnDiv.append("</br>");

        var innerRowDiv = $("<div class='row'></div>'");
        columnDiv.append(innerRowDiv);

        var innerColumnDiv1 = $("<div class='col-4'></div>");
        innerRowDiv.append(innerColumnDiv1);

        innerColumnDiv1.append("<input type='button' value='Legg til print' class='downloadButton' onclick='AddToPrint(\"" + val.name + "\", true);' />");

        var innerColumnDiv2 = $("<div class='col-8'></div>");
        innerRowDiv.append(innerColumnDiv2);

        var tagListUl = $("<ul class='tags'></ul>");
        innerColumnDiv2.append(tagListUl);

        for(y in val.tags){
            tagListUl.append("<li><a href='#'>"+ TagValueToName(val.tags[y]) +"</a></li>");
        }

        if(appendAdRowAfter){
            contentDiv.append(CreateAdRow);
        }       
        
        imgContainerDiv.data('tags', val.tags);

    });//end for each

    
    contentDiv.show(1000, function(){
        if(setSelectedGraphics){
            for(var i = 0; i < selectedImageIds.length; i++){
                SetSelectedForPrintGraphics(selectedImageIds[i]);
            }
        }    
    });
}

function OnChangeFilter(){
    $("#content").hide(1000, function(){
        $.getJSON('imageMetaData.json', function(imageData) {         
            FillContentFromJson(imageData, 0, true);        
        });
    });
}

function TagValueToName(v){
    switch(v){
        case "patterns":
            return "Mønstre";
        case "humans":
            return "Mennesker";
        case "nintendo":
            return "Nintendo";
        case "letters-numbers":
            return "Bokstaver og tall";
        case "animals":
            return "Dyr";
        case "fruit-vegs":
            return "Frukt og grønnsaker";
        case "disney":
            return "Disney";
        default:
            return "Ukjent";
    }
}

function IsTagsInFilter(tags){

    var filter = $('#filterSelect').popSelect('value');

    if(filter.length == 0) 
        return true; //empty filter, it is in filter

    for(var i = 0; i < tags.length; i++){
        if(jQuery.inArray(tags[i], filter) > -1)
            return true;
    }

    return false;
}