
/* This script file can be executed to see what the function returns for
   every opened document if there is any document opened in UE/UES. */

/*** IsUnicode ************************************************************/

/* Script Name:   IsUnicode.js
   Creation Date: 2008-04-16
   Last Modified: 2010-03-16
   Copyright:     Copyright (c) 2010 by Mofi
   Original:      http://www.ultraedit.com/files/scripts/IsUnicode.js
                  http://www.ultraedit.com/forums/viewtopic.php?t=5441

Note: With UltraEdit v16.00 and later versions this function is
      not needed anymore because of document property codePage.

The function   IsUnicode   returns   true   if the file is detected by
UltraEdit/UEStudio as Unicode file or   false   if the file is loaded as
an ASCII/ANSI file. EBCDIC file detection is not supported by this function.

This function requires UltraEdit >= v13.10 or UEStudio >= v6.30.

Unicode files are files with encoding UTF-16 LE (little endian) with or
without BOM, UTF-16 BE (big endian), UTF-8 with or without BOM and ASCII
Escaped Unicode files. It depends on your current settings at   Advanced -
Configuration - File Handling - Unicode / UTF-8 Detection   which of these
files are correct detected by UE/UES as Unicode file on file open. See also
page "Unicode and UTF-8 Support" in help of UltraEdit/UEStudio.

As input parameter the document index can be specified. If this parameter
is missing, or contains a number lower than 0, or is greater/equal the
number of open files, the active document is used.

After executing this function the cursor is always at top of the file. So
best use it before doing anything else after opening a file or remember
in variables or with a bookmark the current cursor position and set the
cursor back to its initial position after using this function.

The detection can return the wrong result if the file is empty or contains
only blank lines and is a UTF-16 file without BOM. For such files it would
be necessary to insert a character at top of the file, but this function
should not make any modifications and should also work for read-only files
as good as possible. Therefore the function returns in such a rare case
always false (= ASCII/ANSI). Don't use this function on files opened in hex
edit mode. It will return always false for files opened in hex edit mode.

If a global variable named   g_nDebugMessage   exists and has the value 1
for debugging to output window or 2 for debugging with message boxes a
debug message is shown if an error condition is handled by the function.

This function is copyrighted by Mofi for free usage by UE/UES users.
The author cannot be responsible for any damage caused by this function.
You use it at your own risk. */

function IsUnicode (nDocumentNumber) {

   /* Determine the type of output for debug messages from the global
      variable g_nDebugMessage: 1 ... debug to output window, 2 ... debug
      to message dialog, all others ... no debug messages. If the global
      variable g_nDebugMessage does not exist, don't show debug messages. */
   var nOutputType = (typeof(g_nDebugMessage) == "number") ? g_nDebugMessage : 0;

   // Return false if no document is open in UltraEdit/UEStudio.
   if (UltraEdit.document.length < 1) {
      if (nOutputType == 2) {
         UltraEdit.messageBox("No document is open currently!","IsUnicode Error");
      } else if (nOutputType == 1) {
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("IsUnicode: No document is open currently!");
      }
      return false;
   }

   // Validate input parameter and use default if wrong or not specified.
   if (typeof(nDocumentNumber) != "number") nDocumentNumber = -1;

   if (nDocumentNumber >= UltraEdit.document.length) {
      nDocumentNumber = -1;
      if (nOutputType == 2) {
         UltraEdit.messageBox("A document with index number "+nDocumentNumber+" does not exist!","IsUnicode Error");
      } else if (nOutputType == 1) {
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("IsUnicode: A document with index number "+nDocumentNumber+" does not exist!");
      }
   }
   var WorkingFile = (nDocumentNumber < 0) ? UltraEdit.activeDocument : UltraEdit.document[nDocumentNumber];

   /* If the file is opened in hex edit mode the function will return
      always false (= ASCII/ANSI) because the function is designed for
      being used on text files opened in text edit mode. */
   if (WorkingFile.hexMode) {
      if (nOutputType == 2) {
         UltraEdit.messageBox("The document is opened in hex edit mode!","IsUnicode Warning");
      } else if (nOutputType == 1) {
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("IsUnicode: The document is opened in hex edit mode!");
      }
      return false;
   }
   /* Now determine format of the file by moving cursor to top of the
      file and check the byte offset in the file at this position. */
   WorkingFile.top();
   /* If the byte offset is not zero, the file has a not displayed BOM
      (byte order mark) and therefore is definitely a Unicode file. */
   if (WorkingFile.currentPos > 0) return true;
   /* If the file is completely empty, it is not possible to detect if
      the file is an ASCII/ANSI file or a UTF-16 file without BOM which
      has been made empty before calling this function. */
   if (WorkingFile.isEof()) {
      if (nOutputType == 2) {
         UltraEdit.messageBox("The document is empty!","IsUnicode Warning");
      } else if (nOutputType == 1) {
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("IsUnicode: The document is empty!");
      }
      return false;
   }

   /* The file is either a UTF-16 LE file without BOM or an ASCII/ANSI file.
      That can be determined by moving the cursor one character right and
      check the byte offset at this position in comparison with the byte
      offset of the previous position. But that works only if the cursor
      is not on a blank line. In that case it is necessary to find a non
      blank line to be able to determine if a single character is encoded
      with 1 byte (ASCII/ANSI) or with 2 bytes (Unicode). That could be
      easily done with a regex search, but is done here with a simple
      loop to keep the existing find settings unchanged. */
   while (WorkingFile.isChar("\r") || WorkingFile.isChar("\n")) {
      WorkingFile.key("DOWN ARROW");
      if (WorkingFile.isEof()) {
         WorkingFile.top();
         if (nOutputType == 2) {
            UltraEdit.messageBox("The document contains only blank lines!","IsUnicode Warning");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("IsUnicode: The document contains only blank lines!");
         }
         return false;
      }
   }
   var nLastByteOffset = WorkingFile.currentPos;
   WorkingFile.key("RIGHT ARROW");
   var bUnicodeFile = ((WorkingFile.currentPos - nLastByteOffset) > 1) ? true : false;
   WorkingFile.top();
   return bUnicodeFile;
}  // End of function IsUnicode


/*** IsUnicode Demonstration **********************************************/

// Code to test/run the function IsUnicode on all opened documents.

if (UltraEdit.document.length > 0) {
   UltraEdit.outputWindow.showStatus=false;
   UltraEdit.outputWindow.clear();
   if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
   var nDocIndex = 0;
   do {
      if (UltraEdit.document[nDocIndex].hexMode) continue;
      var nLineNumber = UltraEdit.document[nDocIndex].currentLineNum;
      var nColumnNumber = UltraEdit.document[nDocIndex].currentColumnNum;
      if (typeof(UltraEdit.activeDocumentIdx) == "undefined") nColumnNumber++;
      var sType = IsUnicode(nDocIndex) ? "Unicode" : "ASCII/ANSI";
      UltraEdit.document[nDocIndex].gotoLine(nLineNumber,nColumnNumber);
      UltraEdit.outputWindow.write("\""+UltraEdit.document[nDocIndex].path+"\" is loaded as "+sType+" file.");
   } while (++nDocIndex < UltraEdit.document.length);
}