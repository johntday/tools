// ----------------------------------------------------------------------------
// UltraEdit 15.00.0.1047
// Script Name: hideLinesContaining.js
// Author: Herman Mol
// Creation Date: 02-07-2009 09:52:46
// Copyright: none
// Purpose: Hide all lines not containing a certain search string
// Limitations:
// - current file only
// - case-insensitive
// - no regular expressions
// - The first and last line of the current file will always be shown
// Modified by Mofi on 06-03-2010 for compatibility with UE v16.00 and later
// ----------------------------------------------------------------------------

// Check if text was selected then we will look for that; else request for the find-text
var fndString = UltraEdit.activeDocument.selection;

// Unhide all if applicable
UltraEdit.activeDocument.expandAll();

// Save last line number
UltraEdit.activeDocument.bottom();
var cLeof = UltraEdit.activeDocument.currentLineNum;

// Start at the beginning of the file
UltraEdit.activeDocument.top();
// save location where we start finding; only line number, column will always be 0
var cLnumB = 1; // begin of search
var cLnumE = 1; // end of search
var i = 0; // count number of found occurrences

// nOffset was added by Mofi for UltraEdit v16.00 and later which hides all lines and
// not all lines except first (and last) as previous versions of UltraEdit. Variable
// nOffset used below on 2 lines gets value 1 if UltraEdit property activeDocumentIdx
// is defined and of type number which is true for UE v16.00 and later. For previous
// versions the variable nOffset is initialized with value 0 resulting in original
// behavior of this script.
var nOffset = (typeof(UltraEdit.activeDocumentIdx) == "number") ? 1 : 0;

// Did we have something selected when we started this script?
if (fndString == "")
{
  // No, so prompt what we are looking for
  fndString = UltraEdit.getString("Show only lines containing what?",1);
}

if (fndString != "")
{
  UltraEdit.ueReOn();
  // find only in current file, case insensitive
  UltraEdit.activeDocument.findReplace.mode = 0;
  UltraEdit.activeDocument.findReplace.regExp = false;
  UltraEdit.activeDocument.findReplace.matchCase = false;
  UltraEdit.activeDocument.findReplace.matchWord = false;
  UltraEdit.activeDocument.findReplace.searchDown = true;

  // the initial find ...
  UltraEdit.activeDocument.findReplace.find(fndString);
  // while the text is found
  while (UltraEdit.activeDocument.isFound())
  {
    i++;
    // where did we find the text
    cLnumE = UltraEdit.activeDocument.currentLineNum;
    // go the begin of that line
    if (cLnumE == 1)
    {
      // first occurrence on line one; nothing to hide
    }
    else
    {
      // go back to where the prior occurrence was found
      UltraEdit.activeDocument.gotoLine(cLnumB+nOffset,1);
      // select to the line the current occurrence is found
      UltraEdit.activeDocument.gotoLineSelect(cLnumE,1);
      // hide these lines
      UltraEdit.activeDocument.hideOrShowLines();
    }
    // set-up for the next roundtrip
    cLnumB = cLnumE;
    if (cLnumB >= cLeof)
    {
      break;
    }
    // see if there is more to be found, AFTER the last one found
    UltraEdit.activeDocument.gotoLine(cLnumB + 1,1);
    UltraEdit.activeDocument.findReplace.find(fndString);
  }
  // finally hide the part from the last occurrence found till the EOF, only if something was found
  if (i != 0)
  {
    UltraEdit.activeDocument.gotoLine(cLnumE+nOffset,1);
    UltraEdit.activeDocument.selectToBottom();
    UltraEdit.activeDocument.hideOrShowLines();
    UltraEdit.messageBox(i.toString() + " lines containing \"" + fndString + "\" were found in this file.");
  }
  else
  {
    UltraEdit.messageBox("No occurrences of \"" + fndString + "\" found in this file.");
  }
}
UltraEdit.activeDocument.top();
