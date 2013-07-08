// ----------------------------------------------------------------------------
// Script Name: delLinesCntgStr.js
// Creation Date: 2008-05-08
// Last Modified:
// Copyright: none
// Purpose: Deletes lines containing user-specified string, then reports on
// what was deleted
// ----------------------------------------------------------------------------

// Search string variable used for deletion of lines
var delString = UltraEdit.activeDocument.selection;
if( delString == "" )
	delString = UltraEdit.getString("Delete lines containing what?",1);

// Start at the beginning of the file
UltraEdit.activeDocument.top();

// Establish our search string for the loop condition
UltraEdit.activeDocument.findReplace.regExp = true;
UltraEdit.activeDocument.findReplace.find(delString);

// Variable  count found items
var nFound = 0;

//Clear and enable the status window
UltraEdit.outputWindow.clear(); 
UltraEdit.outputWindow.showOutput=true;
UltraEdit.outputWindow.showWindow(true);

// Loop through the file, count and delete found lines
while (UltraEdit.activeDocument.isFound())
{
	// We use an if statement here, because when the above "isFound" is evaluated,
	// the script will use the last Find operation for re-evaluation instead of initiating
	// a new one, causing one extra erroneous deletion.
	if (UltraEdit.activeDocument.isFound()) 
	{
		//Select the line
		UltraEdit.activeDocument.key("END");
		var nLen = UltraEdit.activeDocument.currentColumnNum;
		UltraEdit.activeDocument.key("HOME");
		UltraEdit.activeDocument.gotoLineSelect(UltraEdit.activeDocument.currentLineNum,nLen+1);
		//Write line to status window with line number
		UltraEdit.outputWindow.write((UltraEdit.activeDocument.currentLineNum + nFound) + "\t" + UltraEdit.activeDocument.selection);
		//Delete the line
		UltraEdit.activeDocument.deleteLine();
		nFound++
	}
	
	//Find the next instance.
	UltraEdit.activeDocument.top();
	UltraEdit.activeDocument.findReplace.find(delString);
}

//Write the final status.
if( nFound == 0 )
{
	UltraEdit.outputWindow.write("No occurrences of \"" + delString + "\" found in this file.\r\nNo lines were deleted.");
} 
else 
{
	UltraEdit.outputWindow.write(nFound + " lines containing \"" + delString + "\" were found and deleted in the file.\r\n\r\n");
}