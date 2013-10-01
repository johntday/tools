// include V:\\GitHub\\johntday.github.com\\_draft\\scripts\\find-replace.txt

// test
if (debug) {
	if (UltraEdit.outputWindow.visible == false) 
	    UltraEdit.outputWindow.showWindow(true);

	UltraEdit.outputWindow.write("START");

	for (var i=0; i < BLOGLINKS.length; i++) {
		var mylink = BLOGLINKS[i];
		//UltraEdit.outputWindow.write("mylink["+i+"]="+mylink);
		UltraEdit.outputWindow.write("mylink["+i+"].name='"+mylink.name+"'");
		UltraEdit.outputWindow.write("mylink["+i+"].canonical='"+mylink.canonical+"'");
		UltraEdit.outputWindow.write("mylink["+i+"].link='"+mylink.link+"'");
	}
}

var selectedText;
if (UltraEdit.activeDocument.isSel()) {
    selectedText = UltraEdit.activeDocument.selection;
    
    UltraEdit.activeDocument.findReplace.mode=1;
    var replacement = getCanonical(selectedText);
    if (replacement)
    	UltraEdit.activeDocument.findReplace.replace(selectedText, "["+selectedText+"]["+replacement+"]");
}

if (debug)
	UltraEdit.outputWindow.write("DONE");

// ----------------- FUNCTIONS -----------------------------------
function getCanonical(name) {
	for (var i=0; i < BLOGLINKS.length; i++) {
		var mylink = BLOGLINKS[i];
		if (mylink.name.toLowerCase() === name.toLowerCase())
			return mylink.canonical;
	}
	UltraEdit.outputWindow.write("Match not found");
	return null;
}	
