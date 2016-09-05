
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
    
    $.getJSON('imageMetaData.json', function(imageData) {         
        FillContentFromJson(imageData, 0);
    });
   

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
    adRow.classList.add("non-printable");
    adRow.appendChild(adColumn);

    return adRow;
}

function OpenPrintDialog(){
    window.print();
}

function FillContentFromJson(json, startIndex){

    var contentDiv = $("#content");

    var createRow = true;
    var rowDiv;
    var appendAdRowAfterController = 0;

    jQuery.each(json, function(i, val){

        if(i < startIndex)
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

        innerColumnDiv1.append("<input type='button' value='Legg til print' class='downloadButton' onclick='AddToPrint(\"v_img1.svg\", false);' />");

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

    });
}

function ApplyFilter(){
    var filter = $('#filterSelect').popSelect('value');

    if(filter.length == 0){
        $(".imgContainer").each(function(){$(this).parent().show()});
        return;    
    }

    $(".imgContainer").each(function(){
        var hide = true;

        jQuery.each($(this).data("tags"), function(i, val){           

            if(jQuery.inArray(val, filter) > -1){
                //image attribute in filter. do not hide
                hide = false;                
            }
        });

        if(hide){
            $(this).parent().hide();
        }
        else{
            $(this).parent().show();
        }
        
    });;
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