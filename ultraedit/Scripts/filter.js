// ----------------------------------------------------------------------------
// Name:        filter.js
// Version:     1.01
// Creation:    20090222
// Description: This script takes a document and filters it by a string.
//              The user will be asked to enter a string by the script.
//              The script will create a new file and only insert lines of
//              the active file that match the filter string.
// ----------------------------------------------------------------------------
// Update:      20090430 Since larger documents take more time to filter due
//                       scrren updates, I have decided to keep a blank document
//                       active while the filtering is in progress. That way,
//                       no screen updates are necessary and will improve
//                       performance
// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------
// writeDebug(): writes text with Prefix to output window
// ----------------------------------------------------------------------------
function writeDebug(strToWrite) {
	UltraEdit.outputWindow.write("script:filter.js: " + strToWrite)
}

// ----------------------------------------------------------------------------
// waitDebug(): waits for several seconds
// ----------------------------------------------------------------------------
function waitDebug(iTime) {
	var iCntr;
	var iMaxCntr = 10000000;
	if (iTime > 0) {
		iMaxCntr = iTime * 10000000;
	}
	for (iCntr = 0; iCntr < iMaxCntr;) {
		iCntr++;
	}
}

// ----------------------------------------------------------------------------
// getCurrentDocumentIdx(): retrieves current document idx
// ----------------------------------------------------------------------------
function getCurrentDocumentIdx() {
	var iIdx;
	var iTotalDocs = UltraEdit.document.length;
	var objActiveDoc = UltraEdit.activeDocument;
	
	for (iIdx = 0; iIdx < iTotalDocs;iIdx++) {
    // UltraEdit.outputWindow.write("script:filter.js: iIdx:" + iIdx);
	  if (UltraEdit.document[iIdx].path == objActiveDoc.path){
	  	return iIdx;
	  }
	}
	return -1;
}

// ----------------------------------------------------------------------------
// main:
// ----------------------------------------------------------------------------


UltraEdit.outputWindow.showWindow(true);
writeDebug("Start of filter.js");

// ----------------------------------------------------------------------------
// variables

// line terminator character 
var lineTerminator = "\r?\n";
var iLineIdx;
var iCurrentLine = UltraEdit.activeDocument.currentLineNum;
// writeDebug("Current line: " + iCurrentLine);

UltraEdit.activeDocument.bottom();
var iLastLine = UltraEdit.activeDocument.currentLineNum;
// writeDebug("Last line: " + iLastLine);
UltraEdit.activeDocument.top();


// capture filter string strFilter
var strFilter = UltraEdit.getString("Please enter the filter string:",1);
writeDebug("SearchString: " + strFilter);

// get current doc index iIdxActiveDoc
// this is the document we will have to filter
var iIdxActiveDoc = getCurrentDocumentIdx();
// writeDebug("Active doc idx: " + iIdxActiveDoc);

// create a new document
// this is the document we will use to insert the filtered lines
UltraEdit.newFile();

// create a new document
// this is the document we will display while filtering is in progress
// since we want to close that doc at the very end without saving,
// we will need to retriev the document name (the close function
// unfortunately does not work with a doc index)
UltraEdit.newFile();
var strLastDocPath = UltraEdit.activeDocument.path


// get the number of documents iNrOfDocs
var iNrOfDocs = UltraEdit.document.length;
//writeDebug("Number of docs: " + iNrOfDocs);

// since the 1st doc is idx 0, we have to subtract 1 to get the index
// of the last doc; however, since the filtered content will go in the
// 2nd last document, we will have to subtract 2 to get the idx of that doc
var iIdxFilteredDoc = iNrOfDocs-2;


// set find dialog options
UltraEdit.document[iIdxActiveDoc].findReplace.matchCase = false;
UltraEdit.document[iIdxActiveDoc].findReplace.matchWord = false;
UltraEdit.document[iIdxActiveDoc].findReplace.regExp = true;
UltraEdit.document[iIdxActiveDoc].findReplace.searchDown = true;


// filter routine
iLineIdx = 1;

UltraEdit.document[iIdxActiveDoc].gotoLine(1);
UltraEdit.document[iIdxActiveDoc].findReplace.find(strFilter);

// this is the 'MAIN' loop -
// we iterate throught he document unless the
// line number count is set (uncomment the max iLineIdx)
while (UltraEdit.document[iIdxActiveDoc].isSel()) {

   iLineIdx = UltraEdit.document[iIdxActiveDoc].currentLineNum;
	UltraEdit.document[iIdxActiveDoc].selectLine();
	writeDebug("Searching line: " + iLineIdx);
	writeDebug("Selected text: " + UltraEdit.document[iIdxActiveDoc].selection);

  UltraEdit.document[iIdxActiveDoc].copy();
  UltraEdit.document[iIdxFilteredDoc].paste();
  UltraEdit.document[iIdxActiveDoc].findReplace.find(strFilter);

   /*
   uncomment next line if you would like
   to limit the lines to be filtered
   */
   /*
   if (iLineIdx > 40)
      break;
   */

   // if we did not advance in the line, we will break,
   // since that means we have not found anything,
   // or we are at the end of the file
   if (iLineIdx == UltraEdit.document[iIdxActiveDoc].currentLineNum)
      break;
}


// at the end,
// 1) close the very last document we created only to keep an empty
//    document in the foreground and avoid lengthy screen updates
//    this doc is now obsolte and has served its purpose
// 2) select the original document with all the content
//    and go back to initial line

UltraEdit.closeFile(strLastDocPath,2);
UltraEdit.document[iIdxActiveDoc].setActive();
UltraEdit.activeDocument.gotoLine(iCurrentLine);
