// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------



// ----------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------
function strInput() {

  //Get user input
  var str = UltraEdit.getString("Please Enter a String:",1);

  //Output what was entered
  UltraEdit.activeDocument.write("You Entered " + str + "\r\n");

  //Conditional responses
  if (str == "UltraEdit") {
    UltraEdit.activeDocument.write(str + " has an integrated scripting engine.\r\n");
    UltraEdit.activeDocument.write(str + " is a very powerful editor.\r\n");
    UltraEdit.activeDocument.write("\r\n");
  } else if (str == "UEStudio") {
    UltraEdit.activeDocument.write(str + " also has integrated scripting\r\n");
    UltraEdit.activeDocument.write(str + " includes all the functionality of UltraEdit and more.\r\n");
    UltraEdit.activeDocument.write("\r\n");
  } else {
    UltraEdit.activeDocument.write("Sorry, there is no defined output for " + str + "\r\n");
    UltraEdit.activeDocument.write("\r\n");
  }

} //end strInput

strInput();