/*
 * Get selection or select line
 */
var line;
if (UltraEdit.activeDocument.isSel()) {
    line = UltraEdit.activeDocument.selection;
    
    var elementName = UltraEdit.getString("Please enter token to wrap:",1);

//    if (UltraEdit.outputWindow.visible == false) 
//        UltraEdit.outputWindow.showWindow(true);
//    UltraEdit.outputWindow.write("line="+line);
    UltraEdit.activeDocument.findReplace.mode=1;
    UltraEdit.activeDocument.findReplace.replace(line, 
        elementName + line + elementName);
}
