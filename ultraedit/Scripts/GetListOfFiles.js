
// This script file can be executed to use the function and get a list of files.

/*** GetListOfFiles *******************************************************/

/* Script Name:   GetListOfFiles
   Creation Date: 2008-04-16
   Last Modified: 2011-08-15
   Copyright:     Copyright (c) 2011 by Mofi
   Original:      http://www.ultraedit.com/files/scripts/GetListOfFiles.js
                  http://www.ultraedit.com/forums/viewtopic.php?t=5442

The function   GetListOfFiles   creates in an edit window a list of files
according to the arguments passed to the function. It uses the   Find In
Files   command with parameter   Results to Edit Window   for creating
the file list.

The return value of the function is   true   if a file list with at least
1 file name could be created otherwise   false   is returned. The new file
with the file list will be always an ASCII file (= Unicode file names are
not supported), it will have the focus and the cursor is at top of the file.

The function requires UltraEdit >= v13.10 or UEStudio >= v6.30.

As input parameters the function requires 1 value, 2 strings and 1 boolean:

  1) nFileList - is the number which specifies which file list
     shall be created. The possible values are:
        0 ... get list of files in a specified directory.
        1 ... get list of open files.
        2 ... get list of favorite files.
        3 ... get list of project files.
        4 ... get list of solution files (only supported by UEStudio).
     If this parameter is not specified, or is not a value parameter,
     or contains a wrong number, value 0 will be used as default.

  2) sDirectory - is the initial directory for the search. If this string
     is empty, the current working directory ".\" is used if a search in
     a directory shall be done. For all other lists it is ignored. The
     working directory is by default the directory active on start of
     UltraEdit/UEStudio. In the properties of a shortcut the working
     directory can be specified in the edit field named "Start In".

  3) sFileType - contains the file type specification like "*.txt" or
     "ga*.htm;et*.htm". This string is only used for the search in a
     specified directory. "*" is used if not correct specified.

  4) bSubDirs - is a boolean parameter which determines to find files only
     in the specified directory (value: false) or also in subdirectories
     (value: true). This boolean is only used for the search in a specified
     directory. The default value is false if the parameter is not correct
     specified in the calling routine.

NOTE:
An existing edit window from a previous Find In Files run is not closed
and therefore the results of the search for the file names are appended
to the existing content of the file. This makes it possible to run this
function multiple times with different values for the parameters to get
1 big file list.

ATTENTION:
If you use a localized version of UltraEdit or UEStudio adapt the first
2 strings in the function to your version of UE/UES or the function will
not work. And the function uses also a non regular expression search and
sets all find parameters as needed for this search.

If a global variable named   g_nDebugMessage   exists and has the value 1
for debugging to output window or 2 for debugging with message boxes a
debug message is shown if an error condition is handled by the function.
If there is no global variable g_nDebugMessage error messages are shown
with message boxes.

This function is copyrighted by Mofi for free usage by UE/UES users.
The author cannot be responsible for any damage caused by this function.
You use it at your own risk.

HINTS:
The list can be loaded into an array of file names with following code:

UltraEdit.activeDocument.selectAll();
var asFileNames = UltraEdit.activeDocument.selection.split("\r\n");
// Last element of array is usually an empty string because all file
// names in the list are terminated usually with a DOS line termination.
// This empty string is removed from the array. The number of file names
// is then equal the number of array elements (length property).
if (asFileNames[asFileNames.length-1] == "") asFileNames.pop();
// The results file with the list of file names is no longer needed
// when using now the file names in the array asFileNames.
UltraEdit.closeFile(UltraEdit.activeDocument.path,2);

The main script can now use a for loop to open a found file, modify
the opened file, save and close it, and continue with next file until
all files have been modified. If it is possible that some of the files
in the list are already open, extra code is needed to make the already
opened file active instead of opening it. For details see on forum topic
http://www.ultraedit.com/forums/viewtopic.php?f=52&t=4596#p26710 the
hint on common mistake "Opening a file already open from within script
does not result in reloading file content and making the file active". */

function GetListOfFiles (nFileList, sDirectory, sFileType, bSubDirs) {

   /* The summary info line at end of a Search - Find in Files result is
      language depended as also the name of the results document. Adapt
      the following 2 strings to your version of UE/UES. Take a look
      in Configuration/Preferences on "Search - Set Find Output Format"
      on "Find Summary" definition, or better execute once the command
      "Find in Files" from menu "Search" and adapt the two strings below
      accordingly. You can also just open GetListOfFiles.js and execute
      it with command "Run Active Script" from menu "Scripting" to see
      how the find results look like in your version of UE/UES when you
      enter during script execution the parameters correct. Please note
      that with disabling the "Find Summary" completely this script will
      not work as is. */
   var sSummaryInfo = "Search complete, found";
   var sResultsDocTitle = "** Find Results ** ";  // Note the space at end!
   // For German UltraEdit the default strings are:
   // var sSummaryInfo = "Suche abgeschlossen, ";
   // var sResultsDocTitle = "** Suchergebnisse ** ";

   /* Determine the type of output for debug messages from the global
      variable g_nDebugMessage: 1 ... debug to output window, 2 ... debug
      to message dialog, all others ... no debug messages. If the global
      variable g_nDebugMessage does not exist, display the debug message
      as popup message in a dialog box (value 2). */
   var nOutputType = (typeof(g_nDebugMessage) == "number") ? g_nDebugMessage : 2;

   if (typeof(nFileList) != "number" || nFileList < 0 || nFileList > 4) nFileList = 0;

   if (nFileList == 0) {  // Search in a specified directory?
      // If no directory specified, use current working directory.
      if (typeof(sDirectory) != "string" || sDirectory == "" ) sDirectory = ".\\";
      // Append a backslash if it is missing at end of the directory string.
      else if (sDirectory.match(/\\$/) == null) sDirectory += "\\";
      // Search for all files if no file type is specified.
      if (typeof(sFileType) != "string" || sFileType == "") sFileType = "*";
      if (typeof(bSubDirs) != "boolean") bSubDirs = false;
   } else {
      sDirectory = "";    // For the list of open, favorite, project
      sFileType = "";     // or solution files the other 3 parameters
      bSubDirs = false;   // have always the same default values.
   }

   // Remember current regular expression engine.
   var nRegexEngine = UltraEdit.regexMode;
   /* A regular expression engine must be defined or the find
      for the last line in the Unicode results could fail. */
   UltraEdit.ueReOn();

   /* Run a Find In Files with an empty search string to get the
      list of files stored in the specified directory in an edit
      window and delete the last line with the summary info. */
   UltraEdit.frInFiles.directoryStart=sDirectory;
   UltraEdit.frInFiles.filesToSearch=nFileList;
   UltraEdit.frInFiles.matchCase=false;
   UltraEdit.frInFiles.matchWord=false;
   UltraEdit.frInFiles.regExp=false;
   UltraEdit.frInFiles.searchInFilesTypes=sFileType;
   UltraEdit.frInFiles.searchSubs=bSubDirs;
   UltraEdit.frInFiles.unicodeSearch=false;
   UltraEdit.frInFiles.useOutputWindow=false;
   if (typeof(UltraEdit.frInFiles.openMatchingFiles) == "boolean") {
      UltraEdit.frInFiles.openMatchingFiles=false;
   }
   UltraEdit.frInFiles.find("");

   /* If the Find In Files results window was open already the results
      of the search above are appended, but the results document does
      not get automatically the focus as it does if there was no results
      document open from a previous search. Therefore care must be taken
      that the document with the Find In Files results is the active
      document after the search to continue on correct file. */
   var bListCreated = false;
   if (UltraEdit.activeDocument.path == sResultsDocTitle) bListCreated = true;
   else {
      for (var nDocIndex = 0; nDocIndex < UltraEdit.document.length; nDocIndex++) {
         if (UltraEdit.document[nDocIndex].path == sResultsDocTitle) {
            UltraEdit.document[nDocIndex].setActive();
            bListCreated = true;
            break;
         }
      }
   }
   if (bListCreated == true) {
      // Search for the summary info at bottom of the results.
      UltraEdit.activeDocument.findReplace.searchDown=false;
      UltraEdit.activeDocument.findReplace.matchCase=true;
      UltraEdit.activeDocument.findReplace.matchWord=false;
      UltraEdit.activeDocument.findReplace.regExp=false;
      UltraEdit.activeDocument.findReplace.find(sSummaryInfo);
      bListCreated = UltraEdit.activeDocument.isFound();
   }
   UltraEdit.activeDocument.findReplace.searchDown=true;
   switch (nRegexEngine) {   // Restore original regular expression engine.
      case 1:  UltraEdit.unixReOn(); break;
      case 2:  UltraEdit.perlReOn(); break;
      default: UltraEdit.ueReOn();   break;
   }
   /* Check now if the Find above has had success finding the last line in
      the active document which should contain the Find In Files results. */
   if (bListCreated == false) {
      if (nOutputType == 2) {
         UltraEdit.messageBox("There is a problem with frInFiles command or the strings of the script variables\n\"sSummaryInfo\" or \"sResultsDocTitle\" are not adapted to your version of UE/UES!","GetListOfFiles Error");
      } else if (nOutputType == 1) {
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("GetListOfFiles: There is a problem with frInFiles command or the strings of the script variables");
         UltraEdit.outputWindow.write("                \"sSummaryInfo\" or \"sResultsDocTitle\" are not adapted to your version of UE/UES!");
      }
      return false;
   }
   /* Last line with summary info found. Delete it and convert the file into
      an ASCII text file for better handling of the file names. Unicode file
      names are not supported by this script function. If the file with the
      results is already an ASCII file from a previous execution, there is
      no need for the conversion. */
   UltraEdit.activeDocument.deleteLine();
   UltraEdit.activeDocument.top();
   UltraEdit.activeDocument.key("RIGHT ARROW");
   if (UltraEdit.activeDocument.currentPos > 1) UltraEdit.activeDocument.unicodeToASCII();
   else UltraEdit.activeDocument.top();

   // If top of file is also end of file, no files were found.
   if (UltraEdit.activeDocument.isEof()) {
      if (nOutputType == 2) {
         var sMessage = "";
         switch (nFileList) {
            case 0: sMessage = "No file "+sFileType+" was found in directory\n\n"+sDirectory; break;
            case 1: sMessage = "There are no opened files."; break;
            case 2: sMessage = "There are no favorite files."; break;
            case 3: sMessage = "There are no project files or no project is opened."; break;
            case 4: sMessage = "There are no solution files or no solution is opened."; break;
         }
         UltraEdit.messageBox(sMessage,"GetListOfFiles Error");
      } else if (nOutputType == 1) {
         var sMessage = "";
         switch (nFileList) {
            case 0: sMessage = "No file "+sFileType+" was found in directory "+sDirectory; break;
            case 1: sMessage = "There are no opened files."; break;
            case 2: sMessage = "There are no favorite files."; break;
            case 3: sMessage = "There are no project files or no project is opened."; break;
            case 4: sMessage = "There are no solution files or no solution is opened."; break;
         }
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("GetListOfFiles: "+sMessage);
      }
      UltraEdit.closeFile(UltraEdit.activeDocument.path,2);
      return false;
   }
   return true;
}  // End of function GetListOfFiles


/*** GetListOfFiles Demonstration *****************************************/

// Code to demonstrate the usage of the function GetListOfFiles.

var g_nDebugMessage=2;  // Enable debug messages with message boxes.
var nSearchIn=0;        // Stores users choice where to search.
var sFolder="";         // Stores the search root folder specified by the user.
var sFiles="";          // Stores the search files/types specified by the user.
var bSubFolders=false;  // Stores the users choice for searching in subdirectories.
var bNewOpened=false;   // Is set to true if a new file had to be opened.

UltraEdit.outputWindow.showStatus=false;
UltraEdit.outputWindow.clear();
if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);

if (UltraEdit.document.length < 1) {
   /* If no file is open the commands getValue and getString currently (UE v14.20.1)
      do not open message boxes for user input and return always 0 respectively NULL.
      As workaround open a new file and later close that file without saving. */
   UltraEdit.newFile();
   bNewOpened = true;
}

nSearchIn = UltraEdit.getValue("Search in a directory (= 0) or in special file group (= 1)?",1);
if (nSearchIn != 0) {
   nSearchIn = UltraEdit.getValue("Group: 1 = open, 2 = favorites, 3 = project, 4 = solution",1);
   switch (nSearchIn) {
      case 1: UltraEdit.outputWindow.write("Get list of open files");     break;
      case 2: UltraEdit.outputWindow.write("Get list of favorite files"); break;
      case 3: UltraEdit.outputWindow.write("Get list of project files");  break;
      case 4: UltraEdit.outputWindow.write("Get list of solution files"); break;
      default: nSearchIn = 0; break;
   }
}
if (nSearchIn == 0) {
   UltraEdit.outputWindow.write("Get list of files: in directory");
   sFolder = UltraEdit.getString("Please enter the path to the directory:",1);
   if ((sFolder == "") || (sFolder == ".\\")) {
      UltraEdit.outputWindow.write("Search directory:  .\\ (= working directory)");
   } else {
      UltraEdit.outputWindow.write("Search directory:  " + sFolder);
   }
   sFiles = UltraEdit.getString("Please enter the files/types to find:",1);
   if (sFiles == "") sFiles = "*";
   UltraEdit.outputWindow.write("Find files/types:  " + sFiles);
   var nSubFolders = UltraEdit.getValue("Search in subdirectories (0/1 = no/yes)?",1);
   if (nSubFolders) bSubFolders = true;
   var sUsersChoice = bSubFolders ? "true" : "false";
   UltraEdit.outputWindow.write("Search subfolders: " + sUsersChoice);
}
if (bNewOpened) UltraEdit.closeFile(UltraEdit.document[0].path,2);
GetListOfFiles(nSearchIn,sFolder,sFiles,bSubFolders);
