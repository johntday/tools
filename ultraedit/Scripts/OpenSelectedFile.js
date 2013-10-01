// include V:\\GitHub\\tools\\ultraedit\\Scripts\\EnvParms.js
// include V:\\GitHub\\tools\\ultraedit\\Scripts\\FUNCTIONS.js

var line;
if (UltraEdit.activeDocument.isSel()) {
} else {
    UltraEdit.activeDocument.selectLine();
}
line = UltraEdit.activeDocument.selection;

line = line.replace(/^\s*(.*?)\s*$/, "$1");
line = line.replace(/\r?\n/g,"")
           .replace(/'/g,"");

line = parseBetweenChar(line, "\"");

//UltraEdit.outputWindow.write("line1=[" + line + "]");
line = subEnvParms(line);

//UltraEdit.outputWindow.write("[" + line + "]");

if ( line.startsWith("http:") || line.startsWith("https:") ) {
} else {
	UltraEdit.open(line);
}
