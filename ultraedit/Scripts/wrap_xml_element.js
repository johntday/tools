/*
 * Get selection or select line
 */
var line;
var eol = "\r\n";
if (UltraEdit.activeDocument.isSel()) {
    line = UltraEdit.activeDocument.selection;
    
    var elementName = UltraEdit.getString("Please enter element name to wrap:",1);

	var a = "<"+elementName+">";
	var b = "</"+elementName+">";
	
	if (elementName==="pre") {
		a = a + eol;
		b = b + eol;
	}

//    if (UltraEdit.outputWindow.visible == false) 
//        UltraEdit.outputWindow.showWindow(true);
//    UltraEdit.outputWindow.write("line="+line);
    UltraEdit.activeDocument.findReplace.mode=1;
    UltraEdit.activeDocument.findReplace.replace(line, a + line + b);
}
