
function AddToPrint(filename){
    var dialog = document.getElementById("printDialog");
    dialog.classList.remove("hidden");
}

function CancelDocument(){
    
    //todo: remove all prints
    HideDialog();
    
}

function HideDialog(){
    var dialog = document.getElementById("printDialog");
    dialog.classList.add("hidden");
}