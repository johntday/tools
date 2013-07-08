//
// Save this output to log directory
//

UltraEdit.open("C:\\Users\\jtday\\Documents\\MyLog.txt");

UltraEdit.activeDocument.timeDate;
UltraEdit.activeDocument.write("\r\n");


// Determine the document index of the active document.
var nActiveDocIndex = 0;
while (nActiveDocIndex < UltraEdit.document.length) {
   if (UltraEdit.activeDocument.path == UltraEdit.document[nActiveDocIndex].path) break;
   nActiveDocIndex++;
}

// Copy file contents and reset cursor back to where it was.
var x = UltraEdit.activeDocument.currentLineNum;
var y = UltraEdit.activeDocument.currentColumnNum;
UltraEdit.activeDocument.selectAll();
UltraEdit.activeDocument.copy();
UltraEdit.activeDocument.gotoLine(x, y+1);

// Copy contents into the backup file, save and close it.
var logPath = "C:\\Users\\jtday\\Documents\\logs\\UltraEdit\\";
var now = new Date();
logPath = logPath
      + now.getFullYear()
      + now.getMonth()
      + now.getDate()
      + "-"
      + now.getHours()
      + now.getMinutes()
      + now.getSeconds()
      + ".txt";
      
//Clear the output window, make it visible and disable status information.
//UltraEdit.outputWindow.showStatus=false;
//UltraEdit.outputWindow.clear();
//if (UltraEdit.outputWindow.visible == false) {
//  UltraEdit.outputWindow.showWindow(true);
//}
//UltraEdit.outputWindow.write("---");
//UltraEdit.outputWindow.write("logPath="+logPath);
//UltraEdit.outputWindow.write("nActiveDocIndex="+nActiveDocIndex);
//UltraEdit.outputWindow.write("---");

//UltraEdit.newFile();
//UltraEdit.activeDocument.paste();

UltraEdit.saveAs(logPath);
UltraEdit.closeFile(logPath,2);

// Go back to the document whose contents we copied.
UltraEdit.document[nActiveDocIndex].setActive();

UltraEdit.activeDocument.write("{@doclink " + logPath + "}");
