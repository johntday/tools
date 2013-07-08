
/* Script Name:   CopyFileContent.js
   Creation Date: 2009-10-05
   Last Modified: 2010-03-16
   Copyright:     Copyright (c) 2010 by Mofi
   Original:      http://www.ultraedit.com/files/scripts/CopyFileContent.js

   Script to copy entire content of active file to active clipboard
   without changing the caret (cursor) position in the file. This
   script requires UltraEdit v13.10 / UEStudio V6.30 or any later. */

// Is at least 1 file open?
if (UltraEdit.document.length > 0) {
   // Is the current file opened in text edit mode?
   if (!UltraEdit.activeDocument.hexMode) {
      // Get the current line and column number.
      var nLineNum = UltraEdit.activeDocument.currentLineNum;
      var nColumnNum = UltraEdit.activeDocument.currentColumnNum;
      if (typeof(UltraEdit.activeDocumentIdx) == "undefined") nColumnNum++;
      // Copy entire file content to active clipboard.
      UltraEdit.activeDocument.selectAll();
      UltraEdit.activeDocument.copy();
      // Set the cursor back to the initial cursor position.
      UltraEdit.activeDocument.gotoLine(nLineNum,nColumnNum);
   } else {
      // File is opened in hex edit mode. Get current file position.
      var nFilePos = UltraEdit.activeDocument.currentPos;
      // Copy entire file content to active clipboard.
      UltraEdit.activeDocument.selectAll();
      UltraEdit.activeDocument.copy();
      // Set the cursor back to the initial cursor position.
      UltraEdit.activeDocument.gotoPage(nFilePos);
   }
}
