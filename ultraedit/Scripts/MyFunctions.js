

/*** GetFileExt ***********************************************************/

/* Script Name:   FileNameFunctions.js
   Creation Date: 2008-10-25
   Last Modified: 2010-01-16
   Copyright:     Copyright (c) 2010 by Mofi
   Original:      http://www.ultraedit.com/files/scripts/FileNameFunctions.js
                  http://www.ultraedit.com/forums/viewtopic.php?t=6762

The function   GetFileExt   returns the file extension of the open file
specified by the document index number or from a string passed as input
parameter to the function. If the name of a file starts with a point and
does not contain any other point like the file   .htaccess   this string
will be interpreted as file name and not as file extension. By default
an empty string "" is returned if an error occurred. No checks are done
to validate if the string returned is really a valid file extension. The
errors are:

 1) The input string is empty.
 2) The input string is a path string.
 3) No file is open in UltraEdit/UEStudio.
 4) The document index number is invalid.
 5) The specified file is a new file not saved yet.

The errors 1) and 2) can occur only when passing a string to this function,
the errors 3) - 5) only when using this function with a document index number.
An empty string is also returned if a file does not have a file extension.

This function requires UltraEdit >= v13.10 or UEStudio >= v6.30.

As input parameter the string of a full file name can be specified.
Alternatively the document index can be specified as number parameter.
If no parameter is specified, or the document index is lower than 0, the
file extension of the active document is returned. If the document index
is greater/equal the number of open files, an empty string (default) is
returned.

Note: The file extension is per definition everything after last point in
the name of a file. The last point is a delimiter character which separates
the name of a file into the parts   file name   and   file extension   and
does not belong itself to any of these 2 parts of the name of a file.
Therefore this function returns by default always a string not starting
with a point. You can change this by passing as second parameter to the
function the boolean value true. The second parameter is optional. It is
not necessary to call the function with value false as second parameter
if the function should return the file extension without point.

If a global variable named   g_nDebugMessage   exists and has the value 1
for debugging to output window or 2 for debugging with message boxes a
debug message is shown if an error condition is handled by the function.

This function is copyrighted by Mofi for free usage by UE/UES users.
The author cannot be responsible for any damage caused by this function.
You use it at your own risk. */

function GetFileExt (CompleteFileNameOrDocIndexNumber, bWithPoint) {

   /* Change the initial string value for the file extension variable if
      the function should return a default extension instead of an empty
      string on an error. */
   var sFileExtension = "";
   var sNameOfFile = "";
   var sFullFileName = "";
   var nLastDirDelim = -1;

   /* Determine the type of output for debug messages from the global
      variable g_nDebugMessage: 1 ... debug to output window, 2 ... debug
      to message dialog, all others ... no debug messages. If the global
      variable g_nDebugMessage does not exist, don't show debug messages. */
   var nOutputType = (typeof(g_nDebugMessage) == "number") ? g_nDebugMessage : 0;

   // Insert a point on a default file extension if the optional second
   // parameter is defined, is of type boolean and has the value true.
   if (sFileExtension.length && (typeof(bWithPoint) == "boolean")) {
      if (bWithPoint) sFileExtension = "." + sFileExtension;
   }

   if (typeof(CompleteFileNameOrDocIndexNumber) == "string") {

      /* The input parameter is a string. Interpret this string as full
         name of a file and the calling routine wants to know the file
         extension part of this string. */
      sFullFileName = CompleteFileNameOrDocIndexNumber;

      if (sFullFileName == "") {                           // Error 1)
         if (nOutputType == 2) {
            UltraEdit.messageBox("The input string is an empty string!","GetFileExt Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFileExt: The input string is an empty string!");
         }
         return sFileExtension;
      }

      /* Search for a pipe character in the full file name. For
         files opened via FTP/SFTP the pipe character is used
         often to separate the name of a file from the path. */
      nLastDirDelim = sFullFileName.lastIndexOf("|");

      /* If the file name does not contain a pipe character, search
         for a forward slash in case of the file is opened with a
         standard URI via FTP/SFTP. */
      if (nLastDirDelim < 0) nLastDirDelim = sFullFileName.lastIndexOf("/");

      /* If the file name also does not contain a forward slash, search
         for the last backslash which is used normally as directory/file
         delimiter on Windows platforms. */
      if (nLastDirDelim < 0) nLastDirDelim = sFullFileName.lastIndexOf("\\");

      if (nLastDirDelim < 0) sNameOfFile = sFullFileName;
      else {
         if (nLastDirDelim == (sFullFileName.length-1)) {  // Error 2)
            if (nOutputType == 2) {
               UltraEdit.messageBox("The input string is a path string!","GetFileExt Error");
            } else if (nOutputType == 1) {
               if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
               UltraEdit.outputWindow.write("GetFileExt: The input string is a path string!");
            }
            return sFileExtension;
         }

         /* The name of the file is everything from string index after the
            last directory delimiter to end of the full name of the file. */
         nLastDirDelim++;
         sNameOfFile = sFullFileName.substring(nLastDirDelim);
      }

   } else {

      /* The input parameter is not specified or is not a string. Run in
         this case the function with the more complex code to determine
         the file extension from an opened file in UltraEdit/UEStudio
         specified by the document number or if missing from the active
         document. */

      // Return default extension if no document is open in UltraEdit/UEStudio.
      if (UltraEdit.document.length < 1) {                 // Error 3)
         if (nOutputType == 2) {
            UltraEdit.messageBox("No document is open currently!","GetFileExt Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFileExt: No document is open currently!");
         }
         return sFileExtension;
      }

      /* Validate input parameter and use default if the type is wrong
         or function called without any input parameter specified. */
      var nDocumentNumber = -1;
      if (typeof(CompleteFileNameOrDocIndexNumber) == "number") {
         nDocumentNumber = CompleteFileNameOrDocIndexNumber;
      }

      // Return default extension if document index number is invalid.
      if (nDocumentNumber >= UltraEdit.document.length) {  // Error 4)
         if (nOutputType == 2) {
            UltraEdit.messageBox("A document with index number "+nDocumentNumber+" does not exist!","GetFileExt Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFileExt: A document with index number "+nDocumentNumber+" does not exist!");
         }
         return sFileExtension;
      }

      /* Get name of file with path into a string variable and search for
         the position of the last backslash or pipe character/forward slash
         in the full file name. */
      if (nDocumentNumber < 0) {
         sFullFileName = UltraEdit.activeDocument.path;
         if (UltraEdit.activeDocument.isFTP()) {
            /* Files opened via FTP/SFTP contain often the pipe character
               to separate the name of a file from the path. But possible
               is also that a standard URI is used for a file opened via
               FTP/SFTP where just a forward slash is used as delimiter. */
            nLastDirDelim = sFullFileName.lastIndexOf("|");
            if (nLastDirDelim < 0) nLastDirDelim = sFullFileName.lastIndexOf("/");
         }
      } else {
         sFullFileName = UltraEdit.document[nDocumentNumber].path;
         if (UltraEdit.document[nDocumentNumber].isFTP()) {
            nLastDirDelim = sFullFileName.lastIndexOf("|");
            if (nLastDirDelim < 0) nLastDirDelim = sFullFileName.lastIndexOf("/");
         }
      }
      /* A local or network file on Windows platforms contains always
         backslashes as delimiter between directories and file names. */
      if (nLastDirDelim < 0) nLastDirDelim = sFullFileName.lastIndexOf("\\");

      /* If the file name does not contain a directory delimiter,
         this file is a new file which has not been saved yet. */
      if (nLastDirDelim < 0) {                             // Error 5)
         if (nOutputType == 2) {
            UltraEdit.messageBox("File extension can't be determined from a new file!","GetFileExt Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFileExt: File extension can't be determined from a new file!");
         }
         return sFileExtension;
      }

      /* The name of the file is everything from string index after the
         last directory delimiter to end of the full name of the file. */
      nLastDirDelim++;
      sNameOfFile = sFullFileName.substring(nLastDirDelim);

   }  // End of the input parameter evaluating code.

   /* Get the file extension part from the name of the file by copying
      everything from the position after the last point to end of the
      name of the file. */
   var nLastPointPos = sNameOfFile.lastIndexOf(".");
   if ((nLastPointPos < 1) || (nLastPointPos == (sNameOfFile.length-1))) {
      /* The file has no file extension which is very unusual in the Windows
         environment, but possible for other operating systems. Return an
         empty file extension, but print a warning message if debugging is
         enabled. A possibly defined default file extension is not returned
         here because this is not an error condition. Files must not have a
         file extension and therefore an empty string is correct here. */
      if (nOutputType == 2) {
         UltraEdit.messageBox("File \""+sNameOfFile+"\" has no file extension!","GetFileExt Warning");
      } else if (nOutputType == 1) {
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("GetFileExt: File \""+sNameOfFile+"\" has no file extension!");
      }
      // Return just a point when second parameter has boolean value true.
      if (typeof(bWithPoint) == "boolean") {
         if (bWithPoint) return ".";
      }
      return "";
   }
   // The file is a typical file with a name and an extension.
   // Normally is returned just the file extension. But if a
   // second parameter is defined, is of type boolean and has the
   // value true, the file extension is returned with the point.
   if (typeof(bWithPoint) != "boolean") nLastPointPos++;
   else if (!bWithPoint) nLastPointPos++;
   sFileExtension = sNameOfFile.substring(nLastPointPos);
   return sFileExtension;
}  // End of function GetFileExt

Array.prototype.ucase=function()
{
  for (i=0;i<this.length;i++)
  {this[i]=this[i].toUpperCase();}
}
