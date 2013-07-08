// (?s)(?-i)REORG.*?DAT object
UltraEdit.activeDocument.top();

// Search string variable used for deletion of lines
var delString = UltraEdit.getString("Perl RegEx?",1);

UltraEdit.activeDocument.useOutputWindow = true;
UltraEdit.activeDocument.findReplace.regExp = true;
UltraEdit.activeDocument.findReplace.replaceAll = true;
UltraEdit.activeDocument.findReplace.find(delString);

var i=0;
while (UltraEdit.activeDocument.isFound() && i < 100) {
	UltraEdit.activeDocument.selection.replaceAll = true;
	UltraEdit.outputWindow.write( UltraEdit.activeDocument.selection.replace("\r"," ").replace("\n"," ") );

	UltraEdit.activeDocument.findReplace.find(delString);

	i++;
}