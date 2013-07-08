// ----------------------------------------------------------------------------
// TEST PROGRAM
// http://www.ultraedit.com/support/tutorials_power_tips/ultraedit/scripting_techniques.html
// http://www.ultraedit.com/downloads/extras.html
// http://www.ultraedit.com/support/tutorials_power_tips/ultraedit/run_macro_script_from_command_line.html
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// DECLARATION
// ----------------------------------------------------------------------------
var filename = "C:\\IBM\\WCTk\\workspace\\BODL\\pcm\\procedures.sql";
var exportPathNEW = "P:\\export\\";
var exportPathOLD = "G:\\Export\\";
var pcmDBName;
var x = 0;
var lineNum;
var ordersArr = new Array();

// ----------------------------------------------------------------------------
// MAIN
// ----------------------------------------------------------------------------

// input
pcmDBName = UltraEdit.getString("PCM database name",1);

UltraEdit.open(filename);

//Make sure we start at the beginning of the file
UltraEdit.activeDocument.top();

// SEARCH SETTINGS
UltraEdit.activeDocument.findReplace.matchWord  = true;
UltraEdit.activeDocument.findReplace.matchCase  = true;
UltraEdit.activeDocument.findReplace.replaceAll = true;

// REPLACE
UltraEdit.activeDocument.findReplace.replace("[pcmdatabase]", pcmDBName);

UltraEdit.activeDocument.findReplace.replace(exportPathOLD, exportPathNEW);

