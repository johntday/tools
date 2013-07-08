// Start at the beginning of the file
UltraEdit.activeDocument.top();

// Search string variable used for deletion of lines
var delString = UltraEdit.getString("Delete lines containing what?",1);

// Establish our search string for the loop condition
UltraEdit.activeDocument.findReplace.find(delString);

     // Loop through the file and delete found lines
     while (UltraEdit.activeDocument.isFound()){
     UltraEdit.activeDocument.top();
     UltraEdit.activeDocument.findReplace.find(delString);
     
     // We use an if statement here, because when the above "isFound" is evaluated,
     // the script will use the last Find operation for re-evaluation instead of initiating
     // a new one, causing one extra unintended deletion.
     if (UltraEdit.activeDocument.isFound()) {
          UltraEdit.activeDocument.deleteLine();
     }
}