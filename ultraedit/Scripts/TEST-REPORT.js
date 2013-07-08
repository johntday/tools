// ----------------------------------------------------------------------------
// TEST PROGRAM
// http://www.ultraedit.com/support/tutorials_power_tips/ultraedit/scripting_techniques.html
// http://www.ultraedit.com/downloads/extras.html
// http://www.ultraedit.com/support/tutorials_power_tips/ultraedit/run_macro_script_from_command_line.html
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// DECLARATION
// ----------------------------------------------------------------------------
var findStr;
var x = 0;
var lineNum;
var ordersArr = new Array();


// ----------------------------------------------------------------------------
// MAIN
// ----------------------------------------------------------------------------
myinit();

// prompt for the search value
findStr = UltraEdit.getString("Please Enter a Product ID",1);

UltraEdit.outputWindow.write("");
UltraEdit.outputWindow.write("--- Search String ---");
UltraEdit.outputWindow.write("You searched for \"" + findStr + "\"");
UltraEdit.outputWindow.write("");

UltraEdit.outputWindow.write("--- Line Numbers ---");
UltraEdit.activeDocument.findReplace.find(findStr);

//loop to end of file
while (!(UltraEdit.activeDocument.isEof())) {
  if (UltraEdit.activeDocument.isFound()) {
    //get the line number that findStr is found on
    lineNum = UltraEdit.activeDocument.currentLineNum;
    //store line in array entry, but without line termination
    UltraEdit.activeDocument.key("HOME");
    /* If configuration setting >Home Key Always Goto Column 1<
       is not enabled, the cursor could be not at start of the
       line, if the line starts with spaces or tabs. */
    if (UltraEdit.activeDocument.isColNumGt(1)) {
      UltraEdit.activeDocument.key("HOME");
    }
    UltraEdit.activeDocument.startSelect();
    UltraEdit.activeDocument.key("END");
    ordersArr[x]= UltraEdit.activeDocument.selection;
    UltraEdit.activeDocument.endSelect();
    //output the line findStr is on
    UltraEdit.outputWindow.write("Found \"" + findStr + "\" on line: " + lineNum);
    //increment count
    ++x;
  } else {
    UltraEdit.activeDocument.bottom();
    break;
  }
  UltraEdit.activeDocument.findReplace.find(findStr);
}

UltraEdit.outputWindow.write("");
UltraEdit.outputWindow.write("--- Total Orders ---");
UltraEdit.outputWindow.write("Total for \"" + findStr + "\" is: " + x );
UltraEdit.outputWindow.write("");

UltraEdit.outputWindow.write("--- Order Data ---");
//Output values in array
for (var i = 0; i < ordersArr.length; i++) {
  UltraEdit.outputWindow.write(ordersArr[i]);
}
UltraEdit.outputWindow.write("");
UltraEdit.outputWindow.write("");

//copy contents of output window
UltraEdit.outputWindow.copy();

// ----------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------
function myinit() {
    //Clear the output window, make it visible and disable status information.
    UltraEdit.outputWindow.showStatus=false;
    UltraEdit.outputWindow.clear();
    if (UltraEdit.outputWindow.visible == false) {
      UltraEdit.outputWindow.showWindow(true);
    }
    
    //Make sure we start at the beginning of the file
    UltraEdit.activeDocument.top();
}
