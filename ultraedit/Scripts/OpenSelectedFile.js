// include C:\\mystuff\\tools\\UltraEdit\\Scripts\\EnvParms.js

var line;
if (UltraEdit.activeDocument.isSel()) {
} else {
    UltraEdit.activeDocument.selectLine();
}
line = UltraEdit.activeDocument.selection;

line = line.replace(/^\s*(.*?)\s*$/, "$1");
line = line.replace(/\r?\n/g,"")
           .replace(/'/g,"");

var a = line.indexOf("\"");
//UltraEdit.outputWindow.write("[a=" + a + "]");
if (a != -1) {
    var b = line.indexOf("\"", a+1);
    //UltraEdit.outputWindow.write("[b=" + b + "]");
    if (b != -1) {
        line = line.substring(a+1, b);
    }
}

line = subEnvParms(line);

UltraEdit.outputWindow.write("[" + line + "]");

UltraEdit.open(line);
