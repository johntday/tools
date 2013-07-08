
/* Script Name:   FileNameFunctions.js
   Creation Date: 2008-10-25
   Last Modified: 2010-01-16
   Copyright:     Copyright (c) 2010 by Mofi
   Original:      http://www.ultraedit.com/files/scripts/FileNameFunctions.js
                  http://www.ultraedit.com/forums/viewtopic.php?t=6762

This script contains following functions for the usage in other scripts:

   GetFileExt     get file extension from name of a file.
   GetFileName    get file name without extension from name of a file.
   GetFilePath    get file path from full name of a file.
   GetNameOfFile  get file name with extension from name of a file.

For all functions either the index number of an opened document or the
full name of a file can be specified as an input parameter. The functions
can be even used without any parameter to get the appropriate part of the
full file name of the active document. The functions use only core string
and UltraEdit functions. So nothing of the environment (running mode, find
parameters, ...) is changed by these functions.

This script contains a few examples at bottom. So it can be also simply
executed to see the functions in action.

If you want to report mistakes or have suggestions for further enhancements
or other useful file name functions post a message in the linked forum
thread - see the second URI above. The first URI links to the original
code of this script. */


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


/*** GetFileName **********************************************************/

/* Script Name:   FileNameFunctions.js
   Creation Date: 2008-10-25
   Last Modified: 2010-01-16
   Copyright:     Copyright (c) 2010 by Mofi
   Original:      http://www.ultraedit.com/files/scripts/FileNameFunctions.js
                  http://www.ultraedit.com/forums/viewtopic.php?t=6762

The function   GetFileName   returns the FILE NAME of the open file specified
by the document index number or from a string passed as input parameter to
the function WITHOUT the FILE EXTENSION. If the name of a file starts with a
point and does not contain any other point like the file   .htaccess   this
string will be interpreted as file name and not as file extension. By default
an empty string "" is returned if an error occurred. No checks are done to
validate if the string returned is really a valid file name. The errors are:

 1) The input string is empty.
 2) The input string is a path string.
 3) No file is open in UltraEdit/UEStudio.
 4) The document index number is invalid.
 5) The specified file is a new file not saved yet.

The errors 1) and 2) can occur only when passing a string to this function,
the errors 3) - 5) only when using this function with a document index number.

This function requires UltraEdit >= v13.10 or UEStudio >= v6.30.

As input parameter the string of a full file name can be specified.
Alternatively the document index can be specified as number parameter. If
no parameter is specified, or the document index is lower than 0, the name
of the active document is returned. If the document index is greater/equal
the number of open files, an empty string (default) is returned.

This function returns by default always the file name without the point
separating the name of a file into the parts file name and file extension.
You can change this by passing as second parameter to the function the
boolean value true. The second parameter is optional. It is not necessary
to call the function with value false as second parameter if the function
should return just the file name without point. A point is appended if the
file has no point (= no file extension) and the function is called with
boolean value true for the second parameter.

The third parameter is also optional. The function returns the file name
with the path if the calling routine calls the function with boolean value
true for the third parameter. It is required to call the function with
boolean value false or true for the second parameter when the function
should return the file name with the path. In other words the second
parameter is not optional when using the third parameter. The function
cannot determine the file path by itself if for example the function is
called with just the name of a file.

If a global variable named   g_nDebugMessage   exists and has the value 1
for debugging to output window or 2 for debugging with message boxes a
debug message is shown if an error condition is handled by the function.

This function is copyrighted by Mofi for free usage by UE/UES users.
The author cannot be responsible for any damage caused by this function.
You use it at your own risk. */

function GetFileName (CompleteFileNameOrDocIndexNumber, bWithPoint, bWithPath) {

   /* Change the initial string value for the file name variable if the
      function should return a default name instead of an empty string
      on an error. Note: A file with no file name part is not an error
      condition, just a very unusual name for a file in the Windows
      environment, but possible for other operating systems like
      the file with name   .htaccess   for Apache server. */
   var sNameOfFile = "";
   /* Change the initial string value for the file path variable if the
      function should return the file name with path and a default path
      should be used when the path could not be determined from source.
      The default file path must end with the directory delimiting
      character - backslash for Windows, forward slash for UNIX. */
   var sFilePath = "";
   var sFullFileName = "";
   var nLastDirDelim = -1;

   /* Determine the type of output for debug messages from the global
      variable g_nDebugMessage: 1 ... debug to output window, 2 ... debug
      to message dialog, all others ... no debug messages. If the global
      variable g_nDebugMessage does not exist, don't show debug messages. */
   var nOutputType = (typeof(g_nDebugMessage) == "number") ? g_nDebugMessage : 0;

   // Append a point on a default file name if the optional second parameter
   // is defined, is of type boolean and has the value true. And if optional
   // third parameter is also defined, is also of type boolean, has the value
   // true and a default file path is defined, the function should return the
   // default file name with the default path. In the case that a default
   // path is defined, but no default file name, the function should return
   // always an empty string on an error even when the third parameter is
   // true. Reason: The function is designed to return a file name and not
   // the default path.
   if (sNameOfFile.length) {
      if (typeof(bWithPoint) == "boolean") {
         if (bWithPoint) sNameOfFile += '.';
      }
      if (sFilePath.length && (typeof(bWithPath) == "boolean")) {
         if (bWithPath) sNameOfFile = sFilePath + sNameOfFile;
      }
   }

   if (typeof(CompleteFileNameOrDocIndexNumber) == "string") {

      /* The input parameter is a string. Interpret this string as full
         name of a file and the calling routine wants to know the file
         name part of this string. */
      sFullFileName = CompleteFileNameOrDocIndexNumber;

      if (sFullFileName == "") {                           // Error 1)
         if (nOutputType == 2) {
            UltraEdit.messageBox("The input string is an empty string!","GetFileName Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFileName: The input string is an empty string!");
         }
         return sNameOfFile;
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
               UltraEdit.messageBox("The input string is a path string!","GetFileName Error");
            } else if (nOutputType == 1) {
               if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
               UltraEdit.outputWindow.write("GetFileName: The input string is a path string!");
            }
            return sNameOfFile;
         }

         /* The name of the file is everything from string index after the
            last directory delimiter to end of the full name of the file. */
         nLastDirDelim++;
         sNameOfFile = sFullFileName.substring(nLastDirDelim);
         sFilePath = sFullFileName.substring(0,nLastDirDelim);
      }

   } else {

      /* The input parameter is not specified or is not a string. Run in
         this case the function with the more complex code to determine
         the file name from an opened file in UltraEdit/UEStudio specified
         by the document number or if missing from the active document. */

      // Return default name if no document is open in UltraEdit/UEStudio.
      if (UltraEdit.document.length < 1) {                 // Error 3)
         if (nOutputType == 2) {
            UltraEdit.messageBox("No document is open currently!","GetFileName Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFileName: No document is open currently!");
         }
         return sNameOfFile;
      }

      /* Validate input parameter and use default if the type is wrong
         or function called without any input parameter specified. */
      var nDocumentNumber = -1;
      if (typeof(CompleteFileNameOrDocIndexNumber) == "number") {
         nDocumentNumber = CompleteFileNameOrDocIndexNumber;
      }

      // Return default name if document index number is invalid.
      if (nDocumentNumber >= UltraEdit.document.length) {  // Error 4)
         if (nOutputType == 2) {
            UltraEdit.messageBox("A document with index number "+nDocumentNumber+" does not exist!","GetFileName Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFileName: A document with index number "+nDocumentNumber+" does not exist!");
         }
         return sNameOfFile;
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
            UltraEdit.messageBox("File name can't be determined from a new file!","GetFileName Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFileName: File name can't be determined from a new file!");
         }
         return sNameOfFile;
      }

      /* The name of the file is everything from string index after the
         last directory delimiter to end of the full name of the file. */
      nLastDirDelim++;
      sNameOfFile = sFullFileName.substring(nLastDirDelim);
      sFilePath = sFullFileName.substring(0,nLastDirDelim);

   }  // End of the input parameter evaluating code.

   /* Remove the file extension from the name of the file by truncating
      everything from the position of the last point to end of the name
      of the file. */
   var nLastPointPos = sNameOfFile.lastIndexOf(".");
   if (nLastPointPos <= 0) {
      // The file has no file extension.
      if (nLastPointPos == 0) {
         /* The file has no file name part which is very unusual in the Windows
            environment, but possible for other operating systems. Handle the
            string in this case as file name and not as file extension. But
            print a warning message if debugging is enabled. */
         if (nOutputType == 2) {
            UltraEdit.messageBox("File \""+sNameOfFile+"\" starts with a point!","GetFileName Warning");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFileName: File \""+sNameOfFile+"\" starts with a point!");
         }
      }
      // Append a point to the file name if the second parameter
      // is defined, is of type boolean and has the value true.
      if (typeof(bWithPoint) == "boolean") {
         if (bWithPoint) sNameOfFile += '.';
      }
      // Return the file name with or without the file path.
      if (typeof(bWithPath) != "boolean") return sNameOfFile;
      if (!bWithPath) return sNameOfFile;
      return sFilePath + sNameOfFile;
   }
   // The file is a typical file with a name and an extension.
   // Return the file name with the point if the second parameter
   // is defined, is of type boolean and has the value true.
   if (typeof(bWithPoint) == "boolean") {
      if (bWithPoint) nLastPointPos++;
   }
   // Copy just the file name to the other file name string variable.
   sFullFileName = sNameOfFile.substring(0,nLastPointPos);
   // Return the file name with or without the file path.
   if (typeof(bWithPath) != "boolean") return sFullFileName
   if (!bWithPath) return sFullFileName
   return sFilePath + sFullFileName;
}  // End of function GetFileName


/*** GetFilePath **********************************************************/

/* Script Name:   FileNameFunctions.js
   Creation Date: 2008-10-25
   Last Modified: 2009-02-20
   Copyright:     Copyright (c) 2009 by Mofi
   Original:      http://www.ultraedit.com/files/scripts/FileNameFunctions.js
                  http://www.ultraedit.com/forums/viewtopic.php?t=6762

The function   GetFilePath   returns the path of the open file specified
by the document index number, or the path from a string passed as input
parameter to the function. The path ends always with a backslash for local
and network files, or with a forward slash for files opened via FTP, or
depending on the input string. By default an empty string "" is returned
if a path could not be determined. No checks are done to validate if the
string returned is really a valid file path. The errors are:

 1) The input string does not contain a slash or backslash.
 2) No file is open in UltraEdit/UEStudio.
 3) The document index number is invalid.
 4) The specified file is a new file not saved yet.

The error 1) can occur only when passing a string to this function, the
errors 2) - 4) only when using this function with a document index number.

This function requires UltraEdit >= v13.10 or UEStudio >= v6.30.

As input parameter the string of a full file name can be specified.
Alternatively the document index can be specified as number parameter. If
no parameter is specified, or the document index is lower than 0, the path
of the active document is returned. If the document index is greater/equal
the number of open files, an empty string (default) is returned.

If a global variable named   g_nDebugMessage   exists and has the value 1
for debugging to output window or 2 for debugging with message boxes a
debug message is shown if an error condition is handled by the function.

This function is copyrighted by Mofi for free usage by UE/UES users.
The author cannot be responsible for any damage caused by this function.
You use it at your own risk. */

function GetFilePath (CompleteFileNameOrDocIndexNumber) {

   /* Change the initial string value for the file path variable if the
      function should return a default path instead of an empty string
      on an error. */
   var sFilePath = "";
   var sFullFileName = "";
   var nLastDirDelim = -1;

   /* Determine the type of output for debug messages from the global
      variable g_nDebugMessage: 1 ... debug to output window, 2 ... debug
      to message dialog, all others ... no debug messages. If the global
      variable g_nDebugMessage does not exist, don't show debug messages. */
   var nOutputType = (typeof(g_nDebugMessage) == "number") ? g_nDebugMessage : 0;

   if (typeof(CompleteFileNameOrDocIndexNumber) == "string") {

      /* The input parameter is a string. Interpret this string as full
         name of a file and the calling routine wants to know the file
         path part of this string. */
      sFullFileName = CompleteFileNameOrDocIndexNumber;

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

      /* If the file name does not contain a directory delimiter,
         the input string is not the full name of a saved file. */
      if (nLastDirDelim < 0) {                             // Error 1)
         if (nOutputType == 2) {
            UltraEdit.messageBox("File path can't be determined from \""+sFullFileName+"\"!","GetFilePath Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFilePath: File path can't be determined from \""+sFullFileName+"\"!");
         }
         return sFilePath;
      }

   } else {

      /* The input parameter is not specified or is not a string. Run in
         this case the function with the more complex code to determine
         the file path from an opened file in UltraEdit/UEStudio specified
         by the document number or if missing from the active document. */

      // Return default path if no document is open in UltraEdit/UEStudio.
      if (UltraEdit.document.length < 1) {                 // Error 2)
         if (nOutputType == 2) {
            UltraEdit.messageBox("No document is open currently!","GetFilePath Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFilePath: No document is open currently!");
         }
         return sFilePath;
      }

      /* Validate input parameter and use default if the type is wrong
         or function called without any input parameter specified. */
      var nDocumentNumber = -1;
      if (typeof(CompleteFileNameOrDocIndexNumber) == "number") {
         nDocumentNumber = CompleteFileNameOrDocIndexNumber;
      }

      // Return default path if document index number is invalid.
      if (nDocumentNumber >= UltraEdit.document.length) {  // Error 3)
         if (nOutputType == 2) {
            UltraEdit.messageBox("A document with index number "+nDocumentNumber+" does not exist!","GetFilePath Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFilePath: A document with index number "+nDocumentNumber+" does not exist!");
         }
         return sFilePath;
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
      if (nLastDirDelim < 0) {                             // Error 4)
         if (nOutputType == 2) {
            UltraEdit.messageBox("File path can't be determined from a new file!","GetFilePath Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetFilePath: File path can't be determined from a new file!");
         }
         return sFilePath;
      }

   }  // End of the input parameter evaluating code.

   /* The path of the file is everything from string index 0 to string index
      after the last directory delimiter in the full name of the file. */
   if (sFullFileName.charAt(nLastDirDelim) != '|') {
      nLastDirDelim++; // Keep the backslash of forward slash at the end.
      sFilePath = sFullFileName.substring(0,nLastDirDelim);
   } else {            // Use a forward slash instead of | at the end.
      sFilePath = sFullFileName.substring(0,nLastDirDelim) + "/";
   }
   return sFilePath;
}  // End of function GetFilePath


/*** GetNameOfFile ********************************************************/

/* Script Name:   FileNameFunctions.js
   Creation Date: 2008-10-25
   Last Modified: 2009-02-20
   Copyright:     Copyright (c) 2009 by Mofi
   Original:      http://www.ultraedit.com/files/scripts/FileNameFunctions.js
                  http://www.ultraedit.com/forums/viewtopic.php?t=6762

The function   GetNameOfFile   returns the FILE NAME of the open file
specified by the document index number or from a string passed as input
parameter to the function WITH the FILE EXTENSION. By default an empty
string "" is returned if an error occurred. No checks are done to validate
if the string returned is really a valid name of a file. The errors are:

 1) The input string is empty.
 2) The input string is a path string.
 3) No file is open in UltraEdit/UEStudio.
 4) The document index number is invalid.
 5) The specified file is a new file not saved yet.

The errors 1) and 2) can occur only when passing a string to this function,
the errors 3) - 5) only when using this function with a document index number.

This function requires UltraEdit >= v13.10 or UEStudio >= v6.30.

As input parameter the string of a full file name can be specified.
Alternatively the document index can be specified as number parameter. If
no parameter is specified, or the document index is lower than 0, the name
of the active document is returned. If the document index is greater/equal
the number of open files, an empty string (default) is returned.

If a global variable named   g_nDebugMessage   exists and has the value 1
for debugging to output window or 2 for debugging with message boxes a
debug message is shown if an error condition is handled by the function.

This function is copyrighted by Mofi for free usage by UE/UES users.
The author cannot be responsible for any damage caused by this function.
You use it at your own risk. */

function GetNameOfFile (CompleteFileNameOrDocIndexNumber) {

   /* Change the initial string value for the file name variable if the
      function should return a default name instead of an empty string
      on an error. */
   var sNameOfFile = "";
   var sFullFileName = "";
   var nLastDirDelim = -1;

   /* Determine the type of output for debug messages from the global
      variable g_nDebugMessage: 1 ... debug to output window, 2 ... debug
      to message dialog, all others ... no debug messages. If the global
      variable g_nDebugMessage does not exist, don't show debug messages. */
   var nOutputType = (typeof(g_nDebugMessage) == "number") ? g_nDebugMessage : 0;

   if (typeof(CompleteFileNameOrDocIndexNumber) == "string") {

      /* The input parameter is a string. Interpret this string as full
         name of a file and the calling routine wants to know the file
         name part of this string. */
      sFullFileName = CompleteFileNameOrDocIndexNumber;

      if (sFullFileName == "") {                           // Error 1)
         if (nOutputType == 2) {
            UltraEdit.messageBox("The input string is an empty string!","GetNameOfFile Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetNameOfFile: The input string is an empty string!");
         }
         return sNameOfFile;
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
               UltraEdit.messageBox("The input string is a path string!","GetNameOfFile Error");
            } else if (nOutputType == 1) {
               if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
               UltraEdit.outputWindow.write("GetNameOfFile: The input string is a path string!");
            }
            return sNameOfFile;
         }

         /* The name of the file is everything from string index after the
            last directory delimiter to end of the full name of the file. */
         nLastDirDelim++;
         sNameOfFile = sFullFileName.substring(nLastDirDelim);
      }

   } else {

      /* The input parameter is not specified or is not a string. Run in
         this case the function with the more complex code to determine
         the file name from an opened file in UltraEdit/UEStudio specified
         by the document number or if missing from the active document. */

      // Return default name if no document is open in UltraEdit/UEStudio.
      if (UltraEdit.document.length < 1) {                 // Error 3)
         if (nOutputType == 2) {
            UltraEdit.messageBox("No document is open currently!","GetNameOfFile Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetNameOfFile: No document is open currently!");
         }
         return sNameOfFile;
      }

      /* Validate input parameter and use default if the type is wrong
         or function called without any input parameter specified. */
      var nDocumentNumber = -1;
      if (typeof(CompleteFileNameOrDocIndexNumber) == "number") {
         nDocumentNumber = CompleteFileNameOrDocIndexNumber;
      }

      // Return default name if document index number is invalid.
      if (nDocumentNumber >= UltraEdit.document.length) {  // Error 4)
         if (nOutputType == 2) {
            UltraEdit.messageBox("A document with index number "+nDocumentNumber+" does not exist!","GetNameOfFile Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetNameOfFile: A document with index number "+nDocumentNumber+" does not exist!");
         }
         return sNameOfFile;
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
            UltraEdit.messageBox("File name can't be determined from a new file!","GetNameOfFile Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("GetNameOfFile: File name can't be determined from a new file!");
         }
         return sNameOfFile;
      }

      /* The name of the file is everything from string index after the
         last directory delimiter to end of the full name of the file. */
      nLastDirDelim++;
      sNameOfFile = sFullFileName.substring(nLastDirDelim);

   }  // End of the input parameter evaluating code.

   return sNameOfFile;
}  // End of function GetNameOfFile


/*** File Name Functions Demonstration ************************************/

// Some examples for demonstrating how to use the functions above.

var g_nDebugMessage = 2;  // Enable the debug messages in all functions
                          // and show them with message boxes.
var sDemoName = "";       // Contains the file name for next demo sequence.

UltraEdit.outputWindow.showStatus=false;
UltraEdit.outputWindow.clear();
if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);

UltraEdit.outputWindow.write("Result of the functions without any parameter specified - active file:");
UltraEdit.outputWindow.write("");
// 4 debug messages can be displayed now if no file is open.
UltraEdit.outputWindow.write("GetFilePath:   \""+GetFilePath()+"\"");
UltraEdit.outputWindow.write("GetNameOfFile: \""+GetNameOfFile()+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName()+"\"");
UltraEdit.outputWindow.write("GetFileExt:    \""+GetFileExt()+"\"");
UltraEdit.outputWindow.write("");
UltraEdit.outputWindow.write("The second call of the functions GetFileName and GetFileExt in the following");
UltraEdit.outputWindow.write("examples shows the result of the function called with boolean value true for");
UltraEdit.outputWindow.write("the optional second parameter named bWithPoint of these 2 functions.");
UltraEdit.outputWindow.write("");
UltraEdit.outputWindow.write("For function GetFileName an optional third parameter named bWithPath can be");
UltraEdit.outputWindow.write("used to get the file name with the file path. Because second parameter can");
UltraEdit.outputWindow.write("have the values false or true when calling the third parameter with boolean");
UltraEdit.outputWindow.write("value true, there are in total 4 different results possible for the function");
UltraEdit.outputWindow.write("GetFileName as demonstrated below.");
UltraEdit.outputWindow.write("");
if (UltraEdit.document.length >= 2) {
// 4 debug messages can be displayed now if document 2 is a new file.
   UltraEdit.outputWindow.write("Result of the functions for the second opened file:");
   UltraEdit.outputWindow.write("");
   UltraEdit.outputWindow.write("GetFilePath:   \""+GetFilePath(1)+"\"");
   UltraEdit.outputWindow.write("GetNameOfFile: \""+GetNameOfFile(1)+"\"");
   UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(1)+"\"");
   g_nDebugMessage = 0;   // No debug messages for the next 3 function calls.
   UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(1,true)+"\"");
   UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(1,false,true)+"\"");
   UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(1,true,true)+"\"");
   g_nDebugMessage = 2;
   UltraEdit.outputWindow.write("GetFileExt:    \""+GetFileExt(1)+"\"");
   g_nDebugMessage = 0;
   UltraEdit.outputWindow.write("GetFileExt:    \""+GetFileExt(1,true)+"\"");
   g_nDebugMessage = 2;
   UltraEdit.outputWindow.write("");
}
// The following 2 examples should never result in displaying a debug message.
sDemoName = "C:\\Temp\\Test.txt";
UltraEdit.outputWindow.write("Result of the functions for input string \""+sDemoName+"\":");
UltraEdit.outputWindow.write("");
UltraEdit.outputWindow.write("GetFilePath:   \""+GetFilePath(sDemoName)+"\"");
UltraEdit.outputWindow.write("GetNameOfFile: \""+GetNameOfFile(sDemoName)+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName)+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName,true)+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName,false,true)+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName,true,true)+"\"");
UltraEdit.outputWindow.write("GetFileExt:    \""+GetFileExt(sDemoName)+"\"");
UltraEdit.outputWindow.write("GetFileExt:    \""+GetFileExt(sDemoName,true)+"\"");
UltraEdit.outputWindow.write("");
sDemoName = "FTP::server\\/rootdir/subdir|index.html";
UltraEdit.outputWindow.write("Result of the functions for \""+sDemoName+"\":");
UltraEdit.outputWindow.write("");
UltraEdit.outputWindow.write("GetFilePath:   \""+GetFilePath(sDemoName)+"\"");
UltraEdit.outputWindow.write("GetNameOfFile: \""+GetNameOfFile(sDemoName)+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName)+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName,true)+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName,false,true)+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName,true,true)+"\"");
UltraEdit.outputWindow.write("GetFileExt:    \""+GetFileExt(sDemoName)+"\"");
UltraEdit.outputWindow.write("GetFileExt:    \""+GetFileExt(sDemoName,true)+"\"");
UltraEdit.outputWindow.write("");
// The following example will display 2 debug messages (warnings).
sDemoName = "ftp://server/directory/.htaccess";
UltraEdit.outputWindow.write("Result of the functions for \""+sDemoName+"\":");
UltraEdit.outputWindow.write("");
UltraEdit.outputWindow.write("GetFilePath:   \""+GetFilePath(sDemoName)+"\"");
UltraEdit.outputWindow.write("GetNameOfFile: \""+GetNameOfFile(sDemoName)+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName)+"\"");
g_nDebugMessage = 0;
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName,true)+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName,false,true)+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName,true,true)+"\"");
g_nDebugMessage = 2;
UltraEdit.outputWindow.write("GetFileExt:    \""+GetFileExt(sDemoName)+"\"");
g_nDebugMessage = 0;
UltraEdit.outputWindow.write("GetFileExt:    \""+GetFileExt(sDemoName,true)+"\"");
g_nDebugMessage = 2;
UltraEdit.outputWindow.write("");
// The following example will display 1 debug error message.
sDemoName = "Name of a file with no path.txt";
UltraEdit.outputWindow.write("Result of the functions for \""+sDemoName+"\":");
UltraEdit.outputWindow.write("");
UltraEdit.outputWindow.write("GetFilePath:   \""+GetFilePath(sDemoName)+"\"");
UltraEdit.outputWindow.write("GetNameOfFile: \""+GetNameOfFile(sDemoName)+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName)+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName,true)+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName,false,true)+"\"");
UltraEdit.outputWindow.write("GetFileName:   \""+GetFileName(sDemoName,true,true)+"\"");
UltraEdit.outputWindow.write("GetFileExt:    \""+GetFileExt(sDemoName)+"\"");
UltraEdit.outputWindow.write("GetFileExt:    \""+GetFileExt(sDemoName,true)+"\"");
UltraEdit.outputWindow.write("");
UltraEdit.outputWindow.write("End of the demonstration of the file name functions.");
