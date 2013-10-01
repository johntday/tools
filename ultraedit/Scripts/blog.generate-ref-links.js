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

for (var i=0; i < BLOGLINKS.length; i++) {
	var mylink = BLOGLINKS[i];
	// [github.home]: https://github.com/
	UltraEdit.activeDocument.write("[" + mylink.canonical + "]: " + mylink.link + "\r\n");
}

if (debug)
	UltraEdit.outputWindow.write("DONE");

// ----------------- END -----------------------------------
