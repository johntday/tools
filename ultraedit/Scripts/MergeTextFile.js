/* Script Name:   MergeTextFiles.js
   Creation Date: 2009-02-19
   Last Modified: 2009-02-20
   Copyright:     Copyright (c) 2009 by Mofi
   Original:      http://www.ultraedit.com/files/scripts/MergeTextFiles.js
                  http://www.ultraedit.com/forums/viewtopic.php?t=7118

The script   MergeTextFiles   merges / combines / copies the content of all
specified files in a specified folder or all open files into a new file.

!!! IMPORTANT !!!
Don't run this script with View - Views/Lists - Open File Tabs disabled.
Current version of UltraEdit (v14.20.1.1008) and UEStudio (v9.00.0.1030)
and all former versions manage the document array wrong on file open/close
from within a script if the Open File Tabs are not enabled resulting in
weird behavior of this script and an error break of the script execution.

The script supports Unicode files as well as ASCII/ANSI files. Also the
format of the line ending (DOS/UNIX/MAC) doesn't matter. The text files
are not modified. They can even be read-only files. Some or all files
of a directory can also already be open in UE/UES. The script will not
change anything in open files except the cursor position. Open files
can even have unsaved modifications.

The script ignores files already viewed or opened in hex edit mode,
so this script cannot be used to merge binary data.

For files found in a directory the order for copying the text of the
files into the new file is determined by the file names. The file names
list of the found files is sorted case-insensitive before the script starts
processing the files. A numeric sort of the file names is not supported, so
(for example) File10.txt is processed before File2.txt.

When running the script to copy the text of all open files into a new file
the current document order (= open file tabs order) determines the copy
order.

The script requires UltraEdit >= v13.10 or UEStudio >= v6.30.

The script has 3 input parameters which can be defined completely or
partially. If an input parameter does not have a valid value/string, the
script user will be asked at the start of script execution to provide the
parameter string's value respectively the value of a number parameter.

  1) nOpenFiles - determines if all open files should be merged or all
     files of specified type found in a directory.

  2) sDirectory - contains an absolute or relative path to the folder with
     the files. Use relative paths with care because such a path is relative
     to the current working directory of UltraEdit/UEStudio which is by
     default the active directory on start of UE/UES. If the directory is
     not specified in the script (see below) then the user has to enter the
     folder path. It is not possible for the user to browse to the folder.
     UE/UES do not have currently a command to open a dialog for browsing
     to a folder from within a script. Typing mistakes can be avoided by
     browsing to the folder in the file manager (Windows Explorer, etc.),
     copying the complete folder path (for example from the address bar)
     and pasting it into the edit field of the dialog. The script does not
     verify if the specified or entered string is a valid folder path and
     if the folder really exists. This parameter is ignored if nOpenFiles
     does not equal 0.

  3) sFileType - contains the file type specification string. If this
     string is not defined (empty) the user has to enter it during script
     execution. This parameter is ignored if nOpenFiles does not equal 0.

Further the script has 1 additional parameter mainly for debugging which
must be specified in the script file itself: bShowFileNames - see below.
But a file listing in the output window could be also of general interest.

The results file will be empty if a script error occurred or all files
are empty / binary files.

If less than 2 files are open when starting this script the input parameter
nOpenFiles is always set to 0 even if defined in the script with a value
greater than 0 to always run the script to merge files found in a directory
instead of all open files. Why? Because it does not really make sense to
use this script for just opening a new file or just copying the data of
1 file into a new file.

To insert a text string above every content copied into the new file you
have to remove the line comment from the line / blocks with the variable
bCopied. Just search for bCopied and you will see the not active
demonstration code for inserting such a text above every copied content.
It should be no problem to adapt that lines to your requirements.

ATTENTION:
This script requires function GetListOfFiles which is by default not present
in this script file. Download the source code of function GetListOfFiles
from   http://www.ultraedit.com/files/scripts/GetListOfFiles.js  then copy
the whole function without the comments at the top and the demonstration
code at the bottom and paste it into this file. Then adapt the two strings
sSummaryInfo and sResultsDocTitle in the GetListOfFiles function to your
version of UE/UES. Function GetListOfFiles is only required when using
this script to merge files of a specified type in a specified directory.

For further details see the referenced topic in the user forum for scripts.

This script is copyrighted by Mofi for free usage by UE/UES users. The
author cannot be responsible for any damage caused by this script. You
use it at your own risk. */


var nOpenFiles=-1;    // < 0 ... ask user if open files or files in a directory should be merged.
                      //   0 ... merge found files in a directory.
                      // > 0 ... merge all open files.
var sDirectory="";    // Stores the path to the directory with the files. If
                      // this string is empty, the user will be asked to enter it.
                      // Note: You must use \\ for every backslash in the string.
var sFileType="";     // Stores the file type specification string. If this
                      // string is empty, the user will be asked to enter it.

var bShowFileNames=false;  // Set this variable to true to list the names
                           // of the processed files in the output window.

// Set working environment for the script.
UltraEdit.insertMode();
UltraEdit.columnModeOff();
UltraEdit.ueReOn();

// Prepare output window for displaying information during script execution.
UltraEdit.outputWindow.clear();
UltraEdit.outputWindow.showStatus=true;
if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);

UltraEdit.outputWindow.write("Executing script MergeTextFiles for merging text in files into one file.");
UltraEdit.outputWindow.write("");  // Write a blank line to the output window.

// If less than 2 files are open then always merge all files found in a directory.
if (UltraEdit.document.length < 2) {
   if (nOpenFiles > 0) {
      UltraEdit.outputWindow.write( "Warning: Preset for running the script on all open files ignored");
      UltraEdit.outputWindow.write( "         because there are less than 2 files currently open.");
      UltraEdit.outputWindow.write("");
   }
   nOpenFiles = 0;
}

/* Create a new file for the merged text data now before asking the user if not
   all options are completely defined - see above. Currently (UE 14.20.1) the
   commands getValue and getString are working as expected only if at least
   1 file is open. This is why the new file is created at this time. */
UltraEdit.newFile();
/* Get the document index for this file with a simple method because new files
   are always appended to the array of documents, and therefore the index of a
   new file is equal to the number of opened documents minus 1. */
var nDataFile = UltraEdit.document.length - 1;


var sUsersChoice="";  // Used for displaying the users choice as text.
var nLineNumber=1;    // Remembers the current line number in result file.
var sFullFileName=""; // Stores name of active file with path.
var nFileCount=1;     // Counts the files processed and is also used as
                      // member for current line number in the list file.
var nIgnoredFiles=0;  // Counts the number of ignored files.
var nDocIndex=0;      // Document index of active file.
//var bCopied=false;  // true when text copied into new file.


if (nOpenFiles < 0) { // 1st parameter: merge all open files or files in a folder.
   // Ask the user which files to merge.
   nOpenFiles = UltraEdit.getValue("Merge all open files (=1) or all files found in a folder (=0)?",1);
}
sUsersChoice = nOpenFiles ? "all open files" : "  all found files in a folder";
UltraEdit.outputWindow.write("Files:   " + sUsersChoice);

if (nOpenFiles == 0) {  // Merge text of found files in a folder.

   // Verify existence of required function GetListOfFiles.
   if (typeof(GetListOfFiles) == "function") {

      while (sDirectory == "") {  // 2nd parameter: path to the folder with the files.
         // Ask the user for the path to the directory with the files.
         sUsersChoice = UltraEdit.getString("Please enter the path to the folder with the files:",1);
         sDirectory = sUsersChoice.replace(/\s+$/,"");  // Remove trailing spaces.
      }
      // Append a backslash if it is missing at end of the directory string.
      if (sDirectory.match(/\\$/) == null) sDirectory += "\\";
      UltraEdit.outputWindow.write("Folder:    " + sDirectory);

      if (sFileType == "") {      // 3rd parameter: file type specification string.
         // Ask for the type of files which should be merged.
         sUsersChoice = UltraEdit.getString("Please enter the file type specification; e.g.: Di*.c;Di*.h",1);
         sFileType = sUsersChoice.replace(/\s+$/,"");  // Remove trailing spaces.
         if (sFileType == "") sFileType = "*";
      }
      UltraEdit.outputWindow.write("File type: " + sFileType);

      var g_nDebugMessage = 1;  // Enable debug messages of the used function to output window.
                                // Mainly done to see the reason why GetListOfFiles returns
                                // false (incorrect directory path, incorrectly configured).

      if (GetListOfFiles(0,sDirectory,sFileType,false)) {

         /* Get document index of the newly-created list file which is normally now the
            last opened (= furthest right) document, but could be also a different document
            if the search results document existed already before starting this script. */
         var nListFile = UltraEdit.document.length - 1;
         if (UltraEdit.activeDocument.path != UltraEdit.document[nListFile].path) {
            for (nListFile = 0; nListFile < UltraEdit.document.length; nListFile++) {
              if (UltraEdit.activeDocument.path == UltraEdit.document[nListFile].path) break;
            }
         }

         // Sort the file names case-insensitive with removing duplicate lines.
         UltraEdit.activeDocument.sortAsc(0,true,true,1,-1);

         // Remember which clipboard is currently active.
         var nActiveClipboard = UltraEdit.clipboardIdx;
         // Use clipboard 9 for copying the data.
         UltraEdit.selectClipboard(9);

         /* Add a blank line to the output window if the file names will also be
            written to the output window to delimit them from the script parameters. */
         if (bShowFileNames) UltraEdit.outputWindow.write("");

         do // Run this loop until the cursor reaches the end of the list file.
         {
            // Get name of the current file in the list and position cursor on next line.
            UltraEdit.document[nListFile].startSelect();
            UltraEdit.document[nListFile].key("END");
            sFullFileName = UltraEdit.document[nListFile].selection;
            UltraEdit.document[nListFile].endSelect();
            UltraEdit.document[nListFile].gotoLine(++nFileCount,1);
            if (bShowFileNames) UltraEdit.outputWindow.write("File: " + sFullFileName);

            /* Check if the next file to open is already opened. If this
               is the case remember that and later don't close this file
               to avoid a re-ordered and renumbered document array. */
            var bFileAlreadyOpen = false;
            for (nDocIndex = 0; nDocIndex < UltraEdit.document.length; nDocIndex++) {
               if (UltraEdit.document[nDocIndex].path == sFullFileName) {
                  bFileAlreadyOpen = true;
                  break;
               }
            }
            // Open the file which can also be read-only if it is not already open.
            if (!bFileAlreadyOpen) UltraEdit.open(sFullFileName);

            // Ignore files opened in hex edit mode (binary files).
            if (UltraEdit.document[nDocIndex].hexMode == true) {
               if (!bFileAlreadyOpen) UltraEdit.closeFile(UltraEdit.document[nDocIndex].path,2);
               nIgnoredFiles++;
               continue;
            }
            // Select everything in the file and copy it.
            UltraEdit.document[nDocIndex].selectAll();
            UltraEdit.document[nDocIndex].copy();

            // Close the file without saving it when opened before.
            if (bFileAlreadyOpen) UltraEdit.document[nDocIndex].top();
            else UltraEdit.closeFile(UltraEdit.document[nDocIndex].path,2);

            // Insert additional text (header) above the text from the files. insertLine()
            // is used instead of write("\r\n") to be independent of line ending format.
//            if (bCopied) {   // Don't insert blank lines at top of the file.
//               UltraEdit.document[nDataFile].insertLine();
//               UltraEdit.document[nDataFile].insertLine();
//            }
//            UltraEdit.document[nDataFile].write("Text copied from: "+sFullFileName);
//            UltraEdit.document[nDataFile].insertLine();
//            UltraEdit.document[nDataFile].insertLine();
//            UltraEdit.document[nDataFile].insertLine();
//            bCopied = true;

            // Insert the copied lines from the normally already closed file.
            UltraEdit.document[nDataFile].paste();
            /* Verify if the last line of the copied text also has a line ending.
               If this is not the case insert one and make sure that the auto
               indent feature has not added additional preceding white-spaces. */
            if (UltraEdit.document[nDataFile].isColNumGt(1)) {
               UltraEdit.document[nDataFile].insertLine();
               if (UltraEdit.document[nDataFile].isColNumGt(1)) {
                  UltraEdit.document[nDataFile].deleteToStartOfLine();
               }
            }
         }
         while (!UltraEdit.document[nListFile].isEof());

         // Free memory used currently by clipboard 9 and switch back to previous clipboard.
         UltraEdit.clearClipboard();
         UltraEdit.selectClipboard(nActiveClipboard);
         // Close the list file without saving it and without prompt.
         UltraEdit.closeFile(UltraEdit.document[nListFile].path,2);
         // Move cursor to top of the file with all the copied data.
         UltraEdit.document[nDataFile].top();

         // Write into the output window how many files have been processed.
         if (bShowFileNames) UltraEdit.outputWindow.write("");
         if (--nFileCount == 1) {
            UltraEdit.outputWindow.write("Summary:   1 file has been processed.");
         } else {
            UltraEdit.outputWindow.write("Summary:   "+nFileCount+" files have been processed.");
         }
         // Write into the output window how many files have been ignored from the total number.
         if (nIgnoredFiles == 1) {
            UltraEdit.outputWindow.write("         1 file has been ignored.");
         } else if (nIgnoredFiles > 1) {
            UltraEdit.outputWindow.write("         "+nIgnoredFiles+" files have been ignored.");
         }
      }
      else { // No file found in the specified directory. Close the newly-created
             // file. An error message is shown for the reason in the output window.
         UltraEdit.closeFile(UltraEdit.document[nDataFile].path,2);
         UltraEdit.outputWindow.write("");
         UltraEdit.outputWindow.write("Script aborted because no files of specified type found.");
      }
   }
   else { // Function GetListOfFiles is missing. Report this error with the
          // same message in the output window as well as with a message box.
      UltraEdit.closeFile(UltraEdit.document[nDataFile].path,2);
      UltraEdit.outputWindow.clear();
      UltraEdit.outputWindow.write("The script MergeTextFiles requires function GetListOfFiles.");
      UltraEdit.outputWindow.write("Please download the source code of GetListOfFiles from");
      UltraEdit.outputWindow.write("");
      UltraEdit.outputWindow.write("http://www.ultraedit.com/files/scripts/GetListOfFiles.js");
      UltraEdit.outputWindow.write("");
      UltraEdit.outputWindow.write("and copy the function into this script file.");
      UltraEdit.messageBox("The script MergeTextFiles requires function GetListOfFiles.\nPlease download the source code of GetListOfFiles from\n\nhttp://www.ultraedit.com/files/scripts/GetListOfFiles.js\n\nand copy the function into this script file.","MergeTextFiles Error");
   }
}
else {  // Copy the text of all open files into a new file.
        // The document order determines the copy order!

   // Remember which clipboard is currently active.
   var nActiveClipboard = UltraEdit.clipboardIdx;
   // Use clipboard 9 for copying the data.
   UltraEdit.selectClipboard(9);

   /* Add a blank line to the output window if the file names will also be
      written to the output window to delimit them from the script parameter. */
   if (bShowFileNames) UltraEdit.outputWindow.write("");

   /* The number of files to process is equal to the number of open files which
      is equal to the document index of the new file that was just created. */
   nFileCount = nDataFile;
   do
   {
      if (bShowFileNames) UltraEdit.outputWindow.write("File: " + UltraEdit.document[nDocIndex].path);

      // Ignore files opened in hex edit mode (binary files).
      if (UltraEdit.document[nDocIndex].hexMode == true) {
         nIgnoredFiles++;
         continue;
      }

      // Select everything in the file and copy it.
      UltraEdit.document[nDocIndex].selectAll();
      UltraEdit.document[nDocIndex].copy();
      UltraEdit.document[nDocIndex].top();  // Just for unselecting.

      // Insert additional text (header) above the text from the files. insertLine()
      // is used instead of write("\r\n") to be independent of line ending format.
//      if (bCopied) {   // Don't insert blank lines at top of the file.
//         UltraEdit.document[nDataFile].insertLine();
//         UltraEdit.document[nDataFile].insertLine();
//      }  // insertLine is used instead of write("\r\n") to be independent of line ending format.
//      UltraEdit.document[nDataFile].write("Text copied from: "+UltraEdit.document[nDocIndex].path);
//      UltraEdit.document[nDataFile].insertLine();
//      UltraEdit.document[nDataFile].insertLine();
//      UltraEdit.document[nDataFile].insertLine();
//      bCopied = true;

      // Insert the copied lines from the file that is still open.
      UltraEdit.document[nDataFile].paste();
      /* Verify if the last line of the copied text also has a line ending.
         If this is not the case insert one and make sure that the auto
         indent feature has not added additional preceding white-spaces. */
      if (UltraEdit.document[nDataFile].isColNumGt(1)) {
         UltraEdit.document[nDataFile].insertLine();
         if (UltraEdit.document[nDataFile].isColNumGt(1)) {
            UltraEdit.document[nDataFile].deleteToStartOfLine();
         }
      }
   }
   while (++nDocIndex < nFileCount);

   // Free memory used currently by clipboard 9 and switch back to previous clipboard.
   UltraEdit.clearClipboard();
   UltraEdit.selectClipboard(nActiveClipboard);
   // Move cursor to top of the file with all the copied data.
   UltraEdit.document[nDataFile].top();

   // Write into the output window how many files have been processed.
   if (bShowFileNames) UltraEdit.outputWindow.write("");
   UltraEdit.outputWindow.write("Summary: "+nFileCount+" files have been processed.");
   // Write into the output window how many files have been ignored from the total number.
   if (nIgnoredFiles == 1) {
      UltraEdit.outputWindow.write("         1 file has been ignored.");
   } else if (nIgnoredFiles > 1) {
      UltraEdit.outputWindow.write("         "+nIgnoredFiles+" files have been ignored.");
   }
}

UltraEdit.outputWindow.showStatus=false;  // Disable standard success message.