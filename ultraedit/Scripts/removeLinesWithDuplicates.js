// ----------------------------------------------------------------------------
// Script Name: removeLinesWithDuplicates.js
// Creation Date: 2009-03-12
// Last Modified: 
// Copyright: none
/* Purpose: Checks one line at a time.  If the line matches the specified regular 
   expression, then the next line is checked as well.  If both lines match the 
   regex, and the matches are exactly the same, the second line is considered a
   duplicate and deleted from the file.
// ----------------------------------------------------------------------------*/

dbg = 0; // set to true for debugging to the output window
dbgt = UltraEdit.outputWindow; // easier access to output window

/* This is the regular expression used to match the date at the
   beginning of the line.  You can change this regex to match
   anything you want... just be aware that this is what is used 
   to check for and ultimately delete duplicates! */
var tregex = new RegExp(/^\d+:\d+/);

// This variable is used to count how many duplicates are deleted
var ii = 0;

// always start at the top of the file
UltraEdit.activeDocument.top();

/* call the countLines() function to get the number of lines 
   in the open file */
var numOfLines = countLines();
    if (dbg) { dbgt.write("number of lines in file = " + numOfLines); }

/* This is the javascript loop that will parse the entire file. For
more information about using loops in scripting, see the following:
http://www.openjs.com/articles/for_loop.php */
for (i = 1; i < numOfLines; i++) {

 /* Because these variables are used and re-used each time through
    the loop, it's important that we "reset" them to nothing with each
    loop (each check for duplicates) - like a blank canvas. */
    var found = ""; 
    var foundn = ""; 
    var j = ""; 
    var selectedLine = "";
    var nextLine = "";
    var ln = "";
    var lnn = "";

 /* use variable "ln" to store the current line number and 
    return to it when needed */
    ln = UltraEdit.activeDocument.currentLineNum;
    // select the current line
    UltraEdit.activeDocument.selectLine();
    // load the current line into a selection
    selectedLine = UltraEdit.activeDocument.selection;
    // go back to the beginning of the line we're on...
    UltraEdit.activeDocument.gotoLine(ln, 1);
 /* use variable "found" to store whether or not we were able to 
    match our regex in the selection */
    found = selectedLine.match(tregex);
    
    // if a the regex is found...
    if (found) {
            if (dbg) { dbgt.write("Found in line " + i +": " + found); }
        // begin the check on the next line for a duplicate
        UltraEdit.activeDocument.key("DOWN ARROW");
     /* use variable "lnn" to store the "next" line number and 
        return to it when needed */   
        lnn = UltraEdit.activeDocument.currentLineNum;
        UltraEdit.activeDocument.key("HOME"); 
        // select the "next" line
        UltraEdit.activeDocument.selectLine();
        // load the "next" line into a variable
        nextLine = UltraEdit.activeDocument.selection;
        // go back to the beginning of the "next" line...
        UltraEdit.activeDocument.gotoLine(lnn, 1);
            if (dbg) { dbgt.write("  Checking next line for a match..."); }
     /* use variable "foundn" to store whether or not we were able to 
        match our regex in the "next" line selection */
        foundn = nextLine.match(tregex);
        if (foundn) {
            j = i + 1;
                if (dbg) { dbgt.write("  Line " + i +": \"" + found + "\"... Line " + j + ": \"" + foundn + "\""); }
            // if "found" and "foundn" are exactly the same...
            if (foundn.toString() == found.toString()) {
                    if (dbg) { dbgt.write("  DUPLICATE FOUND! Deleting line " + j + "!"); }
                // ...delete the 2nd line which is a duplicate...
                UltraEdit.activeDocument.deleteLine();
                // ...increment our reporting counter...
                ii++
                // ...and finally go back to the original line!
                UltraEdit.activeDocument.gotoLine(ln, 1);
            }
         }
    } else {
    /* if the regex pattern is NOT found in ths line, do
       nothing and go on to the next line*/
        UltraEdit.activeDocument.key("DOWN ARROW");    
            if (dbg) { dbgt.write("Line " + i +": not checking, no match"); }
    }
    
}
/* End javascript loop */

// Report to user how many lines have been deleted. 
if (ii > 0) {
    UltraEdit.messageBox("Removal complete.  Found and removed " + ii + " duplicate records (lines).");
} else {
    UltraEdit.messageBox("No duplicates found in this file; no lines removed!");
}


/* This is the function that is used to count the number
   of lines in the File. */
function countLines() {
    UltraEdit.activeDocument.selectAll();
    var selLines = UltraEdit.activeDocument.selection;
    var splt = selLines.split("\n");
    return splt.length;
}