// ----------------------------------------------------------------------------
// TEST PROGRAM
// http://www.ultraedit.com/support/tutorials_power_tips/ultraedit/scripting_techniques.html
// http://www.ultraedit.com/downloads/extras.html
// http://www.ultraedit.com/support/tutorials_power_tips/ultraedit/run_macro_script_from_command_line.html
//uedit32 "C:\IBM\WCTk\workspace\junit-sample\workdir\input\vwCommerceFullExCodeTables.bcp" /s,e="Z:\Diract\mystuff\trunk\tools\UltraEdit\Scripts\UnicodeToAscii.js"
// ----------------------------------------------------------------------------


//var oldFilename = UltraEdit.activeDocument.path;
//UltraEdit.outputWindow.write("oldFilename=" + oldFilename);

//var newFilename = oldFilename.findReplace.replace("\.bcp","\.ascii");
//var newFilename = oldFilename + ".ascii";
//UltraEdit.outputWindow.write("newFilename=" + newFilename);

UltraEdit.activeDocument.selectAll;

UltraEdit.activeDocument.unicodeToASCII;

UltraEdit.activeDocument.save;

UltraEdit.activeDocument.close;