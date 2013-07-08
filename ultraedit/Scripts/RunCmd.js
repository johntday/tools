//
// Save this output to log directory
//
// include C:\\tools\\EnvParms.js
// include MyStringFunctions.js
var logPath   = uelogPath;
var mylogfile = uelogFile;
var now = new Date();
var startMilliseconds = now.getTime();
var name = "";
var description = "";
var mySelection = UltraEdit.activeDocument.selection;
var line = "";
var spaces4 = "    ";
var myLogDocIndex;
var originalDocIndex;
var g_nDebugMessage = 1;

// Clear and enable the status window and throw error
UltraEdit.outputWindow.clear(); 
UltraEdit.outputWindow.showOutput=true;
UltraEdit.outputWindow.showWindow(true);

// save original file cursor position
originalDocIndex = UltraEdit.activeDocumentIdx;
var x = UltraEdit.activeDocument.currentLineNum;
var y = UltraEdit.activeDocument.currentColumnNum;
//UltraEdit.activeDocument.gotoLine(x, y+1);

// GET INPUT
description = GetPrefix(mySelection, "{");
if( description == "" ) {
    var errorText = "ERROR:  No command text";
    UltraEdit.outputWindow.write(errorText);
    throw errorText;
}
name = GetSubstringBetween (mySelection, "{", "}");
if( name == "" ) {
    var errorText = "ERROR:  No description text";
    UltraEdit.outputWindow.write(errorText);
    throw errorText;
}

// GET FILE
UltraEdit.open(mylogfile);
myLogDocIndex = UltraEdit.activeDocumentIdx;
UltraEdit.activeDocument.bottom();
UltraEdit.activeDocument.write("\r\n");

// START
UltraEdit.activeDocument.write("<RUN host=\"" + HOST + "\" dt=\"");
UltraEdit.activeDocument.timeDate();
line = "\" ms=\"" + startMilliseconds + "\" >";
UltraEdit.activeDocument.write(line);
UltraEdit.activeDocument.write("\r\n");

// NAME (comment)
UltraEdit.activeDocument.write(spaces4 + "<COMMENT>" + name + "</COMMENT>" + "\r\n");

// DESCRIPTION (command text)
UltraEdit.activeDocument.write(spaces4 + "<CMD>" + description + "</CMD>" + "\r\n");
UltraEdit.activeDocument.write(spaces4 + "<OUTPUT>\r\n");

// RUN COMMAND
UltraEdit.document[originalDocIndex].setActive();
UltraEdit.runTool("runCmd");

// CHECK FOR SUCCESS
var isSuccess = "true";
UltraEdit.activeDocument.findReplace.matchCase=true;
UltraEdit.activeDocument.findReplace.matchWord=true;
UltraEdit.activeDocument.findReplace.mode=0;
UltraEdit.activeDocument.findReplace.find("BUILD FAILED");
if (UltraEdit.activeDocument.selection=="BUILD FAILED")
    isSuccess = "false";
if (isSuccess == "false") {
    UltraEdit.outputWindow.write("!!!!!!!!!!!!!!");
    UltraEdit.outputWindow.write("!!! FAILED !!!");
    UltraEdit.outputWindow.write("!!!!!!!!!!!!!!");
}

// SAVE and CLOSE
logPath = logPath
      + now.getFullYear()
      + now.getMonth()
      + now.getDate()
      + "-"
      + now.getHours()
      + now.getMinutes()
      + now.getSeconds()
      + ".txt";
UltraEdit.saveAs(logPath);
UltraEdit.closeFile(logPath,2);

// END
UltraEdit.document[myLogDocIndex].setActive();
UltraEdit.activeDocument.write(spaces4 + spaces4 + "\"" + logPath.replace(DOCUMENTS_BASE,"DOCUMENTS_BASE") + "\"\r\n");
UltraEdit.activeDocument.write(spaces4 + "</OUTPUT>\r\n");
UltraEdit.activeDocument.write(spaces4 + "<END dt=\"");
UltraEdit.activeDocument.timeDate();
line = "\" isSuccessful=\"" + isSuccess + "\" secs=\"" + howLongDidItTake() + "\" />";
UltraEdit.activeDocument.write(line);
UltraEdit.activeDocument.write("\r\n");
UltraEdit.activeDocument.write("</RUN>");

// set original active
UltraEdit.document[originalDocIndex].setActive();
// ----------------------------- END ------------------------------------------

// ----------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------
/*
 * CALCULATE TIME
 */
function howLongDidItTake() {
    var later = new Date();
    return Math.round( (later.getTime() - startMilliseconds) / 1000.0);
}

