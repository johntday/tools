// ----------------------------------------------------------------------------
// TEST PROGRAM
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// DECLARATION
// ----------------------------------------------------------------------------
var findStr;
var x = 0;
var lineNum;
var ordersArr = new Array();

UltraEdit.runTool("Open Selected File");

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
var secs = ""
      + now.getFullYear()
      + now.getMonth()
      + now.getDate()
      + "-"
      + now.getHours()
      + now.getMinutes()
      + now.getSeconds()
    ;
}
