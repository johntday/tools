
// This script file can be executed to see a demonstration of the functions.

/*** FindSelectInner ******************************************************/

/* Script Name:   FindSelectInnerOuter.js
   Creation Date: 2008-04-16
   Last Modified: 2010-03-16
   Copyright:     Copyright (c) 2010 by Mofi
   Original:      http://www.ultraedit.com/files/scripts/FindSelectInnerOuter.js
                  http://www.ultraedit.com/forums/viewtopic.php?t=5421

The function   FindSelectInner   selects a block

   a) from end of a first to start of a second found string,
   b) from end of a first found string to end of the file,
   c) from current cursor position to start of a found string,
   d) from current cursor position to end of the file.

It works for ASCII files as well as for Unicode files with UE >= v13.20
or UES >= 6.40. But it does currently (UE v13.20a or UES v6.40a) not work
for UTF-8 and ASCII Escaped Unicode files opened in Unicode mode, except
you use the "bUseCut" option. With disabling the auto detection of UTF-8
and ASCII Escaped Unicode files to open such files always in ASCII mode
it would work also for these files without using "bUseCut". It can be
used on the active document or any other opened document.

The return value of the function is   true   if a block is
selected or   false   if it failed to select the required block.

As input parameters the function requires 2 strings, 2 numbers and 1 boolean:

  1) sSearchString1 - is the search string used for first search.
     If this string is empty, the current cursor position is used as
     start position for the block selection. This parameter should be
     always specified. If it is not specified, an empty string is used.

  2) sSearchString2 - is the search string used for second search.
     If this string is empty, the end of the file is used as end position
     for the block selection. This parameter should be always specified.
     If it is not specified, an empty string is used.

  3) nDocumentNumber - index number of the document in which the
     block should be selected. Use  -1  for the active document
     which is also the default if this parameter is not specified.

  4) bUseCut - true or false to use cut to clipboard 7 to get position
     of start of found string. You must use this method if your file is
     a UTF-8 or ASCII Escaped Unicode file opened in Unicode mode. The
     advantage is that no hex mode switching is needed with that option
     set to true (false is default). The disadvantages are that the file
     cannot be read-only, care must be taken when using clipboard 7 in
     other script parts because it is used in this function too and the
     function selects always the Windows clipboard when it is forced to
     use temporarily user clipboard 7 if no other clipboard is specified
     on function call. Also the file is always handled further as modified
     although nothing is really changed. This parameter is optional.

  5) nClipNumber - clipboard number 0-9 to switch back to the preferred
     clipboard after temporary usage of clipboard 7. This parameter is only
     used if bUseCut is true on function call. This parameter is optional.

The searches are always downwards in text edit mode. Every other search
option must be specified in the calling routine and are used for both
searches. The searches can be also regular expression searches. It is
extremly important that any regular expression engine is set active at
start of the script even when no regular expression searches are used.

Note: In some cases with bUseCut == false a switch to hex edit mode is
necessary which breaks the undo chain. Save the file before executing
a script with this function to be able to restore the original content.

If a global variable named   g_nDebugMessage   exists and has the value 1
for debugging to output window or 2 for debugging with message boxes a
debug message is shown if an error condition is handled by the function.

This function is copyrighted by Mofi for free usage by UE/UES users.
The author cannot be responsible for any damage caused by this function.
You use it at your own risk. */

function FindSelectInner (sSearchString1, sSearchString2, nDocumentNumber, bUseCut, nClipNumber) {

   /* Determine the type of output for debug messages from the global
      variable g_nDebugMessage: 1 ... debug to output window, 2 ... debug
      to message dialog, all others ... no debug messages. If the global
      variable g_nDebugMessage does not exist, don't show debug messages. */
   var nOutputType = (typeof(g_nDebugMessage) == "number") ? g_nDebugMessage : 0;

   // Validate input parameters and use defaults if wrong.
   if (typeof(sSearchString1) != "string") sSearchString1 = "";
   if (typeof(sSearchString2) != "string") sSearchString2 = "";
   if (typeof(nDocumentNumber) != "number") nDocumentNumber = -1;
   if (typeof(bUseCut) != "boolean") bUseCut = false;
   if (bUseCut) {
      if (typeof(nClipNumber) != "number") nClipNumber = 0;
      else if ((nClipNumber < 0) || (nClipNumber > 9)) nClipNumber = 0;
   }

   // Return false if no document is open in UltraEdit/UEStudio.
   if (UltraEdit.document.length < 1) {
      if (nOutputType == 2) {
         UltraEdit.messageBox("No document is open currently!","FindSelectInner Error");
      } else if (nOutputType == 1) {
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("FindSelectInner: No document is open currently!");
      }
      return false;
   }

   if (nDocumentNumber < 0) var WorkingFile = UltraEdit.activeDocument;
   else if (nDocumentNumber >= UltraEdit.document.length) {
      if (nOutputType == 2) {
         UltraEdit.messageBox("A document with index number "+nDocumentNumber+" does not exist!","FindSelectInner Error");
      } else if (nOutputType == 1) {
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("FindSelectInner: A document with index number "+nDocumentNumber+" does not exist!");
      }
      return false;
   } else var WorkingFile = UltraEdit.document[nDocumentNumber];

   // Specify the working environment: text mode and search downwards.
   WorkingFile.hexOff();
   WorkingFile.findReplace.searchDown=true;

   // If first searched string is an empty string, block start is
   if (sSearchString1 == "") {     // the current cursor position.

      // If second searched string is also an empty string, simply
      if (sSearchString2 == "") {  // select to end of the file.
         if (WorkingFile.isEof()) {
            if (nOutputType == 2) {
               UltraEdit.messageBox("Cursor is at end of file!","FindSelectInner Error");
            } else if (nOutputType == 1) {
              if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
              UltraEdit.outputWindow.write("FindSelectInner: Cursor is at end of file!");
            }
            return false;
         }
         WorkingFile.selectToBottom();
         return true;
      }
      // Select from current cursor position to start of found string.
      var nStartLine   = WorkingFile.currentLineNum;
      var nStartColumn = WorkingFile.currentColumnNum;
      if (typeof(UltraEdit.activeDocumentIdx) == "undefined") nStartColumn++;

      WorkingFile.findReplace.find(sSearchString2);

      if (WorkingFile.isNotFound()) {
         if (nOutputType == 2) {
            UltraEdit.messageBox("Second search string not found!","FindSelectInner Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("FindSelectInner: Second search string not found!");
         }
         return false;
      }
      if(!bUseCut) {
      /* The cursor is at end of the found string and this position would
         be returned by currentLineNum and currentColumnNum. But needed is
         the position at start of the found string. The byte offset property
         contains the number of bytes from top of the file to start of the
         found string. That position is needed for selecting the block. */
      // var nBytePosition = WorkingFile.currentPos;

      /* There is no go to byte position in text mode. But in hex edit
         mode the gotoPage command is in real the go to byte position. */
      // WorkingFile.hexOn();
      // WorkingFile.gotoPage(nBytePosition);
      // WorkingFile.hexOff();

      /* Above is true, but would never work for UTF-8 and ASCII Escaped
         Unicode files. The byte position in text mode is for Unicode files
         always the Unicode position, but in hex edit mode since UE v13.00
         and UES v6.20 these 2 type of Unicode files are displayed as really
         stored and therefore the byte position returned from text mode is
         completely wrong in hex edit mode. But there is a simple trick.
         Switching to hex edit mode and back to text mode unselects the
         current selection, but sets the cursor to start of the selection.
         This method works for ASCII and UTF-16. Currently it is only not
         working for UTF-8 and ASCII Escaped Unicode files. UE v13.20a sets
         the cursor always to top of the file when switching to hex edit
         mode if the file is an ASCII Escaped Unicode file opened in Unicode
         mode. And for UTF-8 files this trick works when doing it manually,
         but not within a script (a synchronization problem - the script
         continues before the conversions necessary while switching to and
         from hex edit mode have finished). A simple workaround for working
         with UTF-8 and ASCII Escaped Unicode files: disable the automatic
         detection of these files and UltraEdit will open these files always
         as ASCII and this avoids lots of problems when working on such
         files with scripts. */
         WorkingFile.hexOn();
         WorkingFile.hexOff();

      /* Back in text edit mode remember the current line and column
         number to select the block from upper to lower position. */
         var nEndLine   = WorkingFile.currentLineNum;
         var nEndColumn = WorkingFile.currentColumnNum;
         if (typeof(UltraEdit.activeDocumentIdx) == "undefined") nEndColumn++;

      /* This elegant method cannot be used for UTF-8 and ASCII Escaped
         Unicode files opened in Unicode because of the problems described
         above. A workaround is to temporarily cut the found string,
         remember the position and paste back the found string. */
      } else {
         // Cut the found string to move cursor to start of found string.
         UltraEdit.selectClipboard(7);
         WorkingFile.cut();
         /* Before UltraEdit v13.20+3 the column number was not
            updated immediately after cutting a text. So insert
            a space and delete it to get correct column number. */
         var bEditInsertMode = UltraEdit.insOvrMode;
         UltraEdit.insertMode();
         WorkingFile.write(" ");
         WorkingFile.key("BACKSPACE");
         // Save the line and column number of start of found string.
         var nEndLine   = WorkingFile.currentLineNum;
         var nEndColumn = WorkingFile.currentColumnNum;
         if (typeof(UltraEdit.activeDocumentIdx) == "undefined") nEndColumn++;

         // Paste back cutted text.
         WorkingFile.paste();
         // Clear clipboard 7 and switch back to preferred clipboard.
         UltraEdit.clearClipboard();
         UltraEdit.selectClipboard(nClipNumber);
         // Restore overstrike mode if it was active.
         if(!bEditInsertMode) UltraEdit.overStrikeMode();
      }

      /* If the searched string was found on the initial cursor
         position nothing could be selected in the next step. */
      if ((nStartLine==nEndLine) && (nStartColumn==nEndColumn)) {
         if (nOutputType == 2) {
            UltraEdit.messageBox("Second search string found on initial cursor position!","FindSelectInner Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("FindSelectInner: Second search string found on initial cursor position!");
         }
         return false;
      }
      WorkingFile.gotoLine(nStartLine,nStartColumn);
      WorkingFile.gotoLineSelect(nEndLine,nEndColumn);
      return true;
   }
   // Otherwise search for first string with the current search options.

   /* Remember current line and column in case of not being able
      to select the block of interest after the first search. */
   var nInitialLine   = WorkingFile.currentLineNum;
   var nInitialColumn = WorkingFile.currentColumnNum;
   if (typeof(UltraEdit.activeDocumentIdx) == "undefined") nInitialColumn++;

   WorkingFile.findReplace.find(sSearchString1);

   // If the searched string is not found, there is no block to select.
   if (WorkingFile.isNotFound()) {
      if (nOutputType == 2) {
         UltraEdit.messageBox("First search string not found!","FindSelectInner Error");
      } else if (nOutputType == 1) {
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("FindSelectInner: First search string not found!");
      }
      return false;
   }
   /* The cursor is at end of the found string and this position is also
      needed for the selection after second search. But there is a problem
      in some cases because of a bug in UltraEdit detected with v14.20.1
      and existing also in former versions. If the found string ends with
      line ending character(s) and so the cursor is at start of the line
      below the selection, UltraEdit returns the wrong line number. As
      workaround the cursor is moved to end of the line and back to start
      of the line to update the line number property and unselect the
      found string in this special case. */
   var nStartColumn = WorkingFile.currentColumnNum;
   if (typeof(UltraEdit.activeDocumentIdx) == "undefined") nStartColumn++;

   if (nStartColumn == 1) {
      WorkingFile.key("END");
      WorkingFile.key("HOME");
      if (WorkingFile.isColNumGt(1)) WorkingFile.key("HOME");
   }
   var nStartLine = WorkingFile.currentLineNum;

   if (sSearchString2 == "") {  // Select from end of already
                                // found string to end of the file.
      if (WorkingFile.isEof()) {
         if (nOutputType == 2) {
            UltraEdit.messageBox("First found string ends at end of file!","FindSelectInner Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("FindSelectInner: First found string ends at end of file!");
         }
         WorkingFile.gotoLine(nInitialLine,nInitialColumn);
         return false;
      }
      /* The found string must be unselected before the selection to
         bottom of the file is done or the existing selection would
         be expanded. Therefore a cursor movement must be done. */
      WorkingFile.bottom();
      WorkingFile.gotoLine(nStartLine,nStartColumn);
      WorkingFile.selectToBottom();
      return true;
   }
   // Select from end of first found string to start of second found string.

   WorkingFile.findReplace.find(sSearchString2);
   if (WorkingFile.isNotFound()) {
      if (nOutputType == 2) {
         UltraEdit.messageBox("Second search string not found!","FindSelectInner Error");
      } else if (nOutputType == 1) {
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("FindSelectInner: Second search string not found!");
      }
      // Second string was not found, set cursor back to original position.
      WorkingFile.gotoLine(nInitialLine,nInitialColumn);
      return false;
   }

   if(!bUseCut) {  // See same code part above for the comments.
      /* Switch to hex edit mode and back to unselect the selection and
         position the cursor to start of found string. This trick works
         currently (UE v13.20a) for all files except UTF-8 and ASCII
         Escaped Unicode files opened in Unicode mode. */
      WorkingFile.hexOn();
      WorkingFile.hexOff();

      // Remember start position of second found string.
      var nEndLine   = WorkingFile.currentLineNum;
      var nEndColumn = WorkingFile.currentColumnNum;
      if (typeof(UltraEdit.activeDocumentIdx) == "undefined") nEndColumn++;
   } else {
      UltraEdit.selectClipboard(7);
      WorkingFile.cut();
      var bEditInsertMode = UltraEdit.insOvrMode;
      UltraEdit.insertMode();
      WorkingFile.write(" ");
      WorkingFile.key("BACKSPACE");
      var nEndLine   = WorkingFile.currentLineNum;
      var nEndColumn = WorkingFile.currentColumnNum;
      if (typeof(UltraEdit.activeDocumentIdx) == "undefined") nEndColumn++;
      WorkingFile.paste();
      UltraEdit.clearClipboard();
      UltraEdit.selectClipboard(nClipNumber);
      if(!bEditInsertMode) UltraEdit.overStrikeMode();
   }

   /* If the position of the start of the second found string is identical
      with the position of the end of first found string, nothing can be
      selected and so cursor is set back to initial cursor position. */
   if ((nStartLine==nEndLine) && (nStartColumn==nEndColumn)) {
      WorkingFile.gotoLine(nInitialLine,nInitialColumn);
      if (nOutputType == 2) {
         UltraEdit.messageBox("Second found string starts at end of first found string!","FindSelectInner Error");
      } else if (nOutputType == 1) {
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("FindSelectInner: Second found string starts at end of first found string!");
      }
      return false;
   }
   WorkingFile.gotoLine(nStartLine,nStartColumn);
   WorkingFile.gotoLineSelect(nEndLine,nEndColumn);
   return true;
}  // End of function FindSelectInner


/*** FindSelectOuter ******************************************************/

/* Script Name:   FindSelectInnerOuter.js
   Creation Date: 2008-04-16
   Last Modified: 2009-02-20
   Copyright:     Copyright (c) 2009 by Mofi
   Original:      http://www.ultraedit.com/files/scripts/FindSelectInnerOuter.js
                  http://www.ultraedit.com/forums/viewtopic.php?t=5421

The function   FindSelectOuter   selects a block

   a) from start of a first to end of a second found string,
   b) from start of a first found string to end of the file,
   c) from current cursor position to end of a found string,
   d) from current cursor position to end of the file.

It works for ASCII files as well as for Unicode files with UE >= v13.20
or UES >= 6.40. But it does currently (UE v13.20a or UES v6.40a) not work
for UTF-8 and ASCII Escaped Unicode files opened in Unicode mode, except
you use the "bUseCut" option. With disabling the auto detection of UTF-8
and ASCII Escaped Unicode files to open such files always in ASCII mode
it would work also for these files without using "bUseCut". It can be
used on the active document or any other opened document.

The return value of the function is   true   if a block is
selected or   false   if it failed to select the required block.

As input parameters the function requires 2 strings, 2 numbers and 1 boolean:

  1) sSearchString1 - is the search string used for first search.
     If this string is empty, the current cursor position is used as
     start position for the block selection. This parameter should be
     always specified. If it is not specified, an empty string is used.

  2) sSearchString2 - is the search string used for second search.
     If this string is empty, the end of the file is used as end position
     for the block selection. This parameter should be always specified.
     If it is not specified, an empty string is used.

  3) nDocumentNumber - index number of the document in which the
     block should be selected. Use  -1  for the active document
     which is also the default if this parameter is not specified.

  4) bUseCut - true or false to use cut to clipboard 7 to get position
     of start of found string. You must use this method if your file is
     a UTF-8 or ASCII Escaped Unicode file opened in Unicode mode. The
     advantage is that no hex mode switching is needed with that option
     set to true (false is default). The disadvantages are that the file
     cannot be read-only, care must be taken when using clipboard 7 in
     other script parts because it is used in this function too and the
     function selects always the Windows clipboard when it is forced to
     use temporarily user clipboard 7 if no other clipboard is specified
     on function call. Also the file is always handled further as modified
     although nothing is really changed. This parameter is optional.

  5) nClipNumber - clipboard number 0-9 to switch back to the preferred
     clipboard after temporary usage of clipboard 7. This parameter is only
     used if bUseCut is true on function call. This parameter is optional.

The searches are always downwards in text edit mode. Every other search
option must be specified in the calling routine and are used for both
searches. The searches can be also regular expression searches. It is
extremly important that any regular expression engine is set active at
start of the script even when no regular expression searches are used.

Note: In some cases with bUseCut == false a switch to hex edit mode is
necessary which breaks the undo chain. Save the file before executing
a script with this function to be able to restore the original content.

If a global variable named   g_nDebugMessage   exists and has the value 1
for debugging to output window or 2 for debugging with message boxes a
debug message is shown if an error condition is handled by the function.

This function is copyrighted by Mofi for free usage by UE/UES users.
The author cannot be responsible for any damage caused by this function.
You use it at your own risk. */

function FindSelectOuter (sSearchString1, sSearchString2, nDocumentNumber, bUseCut, nClipNumber) {

   /* Determine the type of output for debug messages from the global
      variable g_nDebugMessage: 1 ... debug to output window, 2 ... debug
      to message dialog, all others ... no debug messages. If the global
      variable g_nDebugMessage does not exist, don't show debug messages. */
   var nOutputType = (typeof(g_nDebugMessage) == "number") ? g_nDebugMessage : 0;

   // Validate input parameters and use defaults if wrong.
   if (typeof(sSearchString1) != "string") sSearchString1 = "";
   if (typeof(sSearchString2) != "string") sSearchString2 = "";
   if (typeof(nDocumentNumber) != "number") nDocumentNumber = -1;
   if (typeof(bUseCut) != "boolean") bUseCut = false;
   if (bUseCut) {
      if (typeof(nClipNumber) != "number") nClipNumber = 0;
      else if ((nClipNumber < 0) || (nClipNumber > 9)) nClipNumber = 0;
   }

   // Return false if no document is open in UltraEdit/UEStudio.
   if (UltraEdit.document.length < 1) {
      if (nOutputType == 2) {
         UltraEdit.messageBox("No document is open currently!","FindSelectOuter Error");
      } else if (nOutputType == 1) {
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("FindSelectOuter: No document is open currently!");
      }
      return false;
   }

   if (nDocumentNumber < 0) var WorkingFile = UltraEdit.activeDocument;
   else if (nDocumentNumber >= UltraEdit.document.length) {
      if (nOutputType == 2) {
         UltraEdit.messageBox("A document with index number "+nDocumentNumber+" does not exist!","FindSelectOuter Error");
      } else if (nOutputType == 1) {
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("FindSelectOuter: A document with index number "+nDocumentNumber+" does not exist!");
      }
      return false;
   } else var WorkingFile = UltraEdit.document[nDocumentNumber];

   // Specify the working environment: text mode and search downwards.
   WorkingFile.hexOff();
   WorkingFile.findReplace.searchDown=true;

   // If first searched string is an empty string, block start is
   if (sSearchString1 == "") {     // the current cursor position.

      // If second searched string is also an empty string, simply
      if (sSearchString2 == "") {  // select to end of the file.

         if (WorkingFile.isEof()) {
            if (nOutputType == 2) {
               UltraEdit.messageBox("Cursor is at end of file!","FindSelectOuter Error");
            } else if (nOutputType == 1) {
               if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
               UltraEdit.outputWindow.write("FindSelectOuter: Cursor is at end of file!");
            }
            return false;
         }
         WorkingFile.selectToBottom();
         return true;
      }
      // Select from current cursor position to end of found string.
      var nStartLine   = WorkingFile.currentLineNum;
      var nStartColumn = WorkingFile.currentColumnNum;
      if (typeof(UltraEdit.activeDocumentIdx) == "undefined") nStartColumn++;

      WorkingFile.findReplace.find(sSearchString2);

      if (WorkingFile.isNotFound()) {
         if (nOutputType == 2) {
            UltraEdit.messageBox("Second search string not found!","FindSelectOuter Error");
         } else if (nOutputType == 1) {
            if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
            UltraEdit.outputWindow.write("FindSelectOuter: Second search string not found!");
         }
         return false;
      }
      /* The second found string is now selected. It is not possible to run
         the gotoLineSelect command directly from end of the found string
         because that would result in a selection from start of first found
         string to start of second found string instead of end of second
         found string. So it is necessary to remember the position at the
         end of the second found string and select from the upper position
         to this position. That is also better for the calling function.
         But there is a problem in some cases because of a bug in UltraEdit
         detected with v14.20.1 and existing also in former versions. If the
         found string ends with line ending character(s) and so the cursor
         is at start of the line below the selection, UltraEdit returns the
         wrong line number. As workaround the cursor is moved to end of the
         line and back to start of the line to update the line number
         property and unselect the found string in this special case. */
      var nEndColumn = WorkingFile.currentColumnNum;
      if (typeof(UltraEdit.activeDocumentIdx) == "undefined") nEndColumn++;
      if (nEndColumn == 1) {
         WorkingFile.key("END");
         WorkingFile.key("HOME");
         if (WorkingFile.isColNumGt(1)) WorkingFile.key("HOME");
      }
      var nEndLine = WorkingFile.currentLineNum;
      WorkingFile.gotoLine(nStartLine,nStartColumn);
      WorkingFile.gotoLineSelect(nEndLine,nEndColumn);
      return true;
   }
   // Otherwise search for first string with the current search options.

   /* Remember current line and column in case of not being able
      to select the block of interest after the first search. */
   var nLineNumber   = WorkingFile.currentLineNum;
   var nColumnNumber = WorkingFile.currentColumnNum;
   if (typeof(UltraEdit.activeDocumentIdx) == "undefined") nColumnNumber++;

   WorkingFile.findReplace.find(sSearchString1);

   // If the searched string is not found, there is no block to select.
   if (WorkingFile.isNotFound()) {
      if (nOutputType == 2) {
         UltraEdit.messageBox("First search string not found!","FindSelectOuter Error");
      } else if (nOutputType == 1) {
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("FindSelectOuter: First search string not found!");
      }
      return false;
   }

   if(!bUseCut) {
   /* The cursor is at end of the found string and this position would be
      returned by currentLineNum and currentColumnNum. But needed is the
      position at start of the found string. Switch to hex edit mode and
      back to unselect the selection and position the cursor to start of
      found string. This trick works currently (UE v13.20a) for all files
      except UTF-8 and ASCII Escaped Unicode files opened in Unicode mode. */
      WorkingFile.hexOn();
      WorkingFile.hexOff();

   // Remember start position of first found string.
      var nStartLine   = WorkingFile.currentLineNum;
      var nStartColumn = WorkingFile.currentColumnNum;
      if (typeof(UltraEdit.activeDocumentIdx) == "undefined") nStartColumn++;
   // Move cursor right to be able to search for the same string again.
      WorkingFile.key("RIGHT ARROW");

   /* This elegant method cannot be used for UTF-8 and ASCII Escaped
      Unicode files opened in Unicode because of the problems described
      above. A workaround is to temporarily cut the found string,
      remember the position and paste back the found string. */
   } else {
      // Cut the found string to move cursor to start of found string.
      UltraEdit.selectClipboard(7);
      WorkingFile.cut();
      /* Before UltraEdit v13.20+3 the column number was not
         updated immediately after cutting a text. So insert
         a space and delete it to get correct column number. */
      var bEditInsertMode = UltraEdit.insOvrMode;
      UltraEdit.insertMode();
      WorkingFile.write(" ");
      WorkingFile.key("BACKSPACE");
      // Save the line and column number at start of found string.
      var nStartLine   = WorkingFile.currentLineNum;
      var nStartColumn = WorkingFile.currentColumnNum;
      if (typeof(UltraEdit.activeDocumentIdx) == "undefined") nStartColumn++;
      // Paste back cutted text.
      WorkingFile.paste();
      // Clear clipboard 7 and switch back to preferred clipboard.
      UltraEdit.clearClipboard();
      UltraEdit.selectClipboard(nClipNumber);
      // Restore overstrike mode if it was active.
      if(!bEditInsertMode) UltraEdit.overStrikeMode();
   }

   if (sSearchString2 == "") {  // Select from start of already
                                // found string to end of the file.
      WorkingFile.gotoLine(nStartLine,nStartColumn);
      WorkingFile.selectToBottom();
      return true;
   }

   // Select from start of first found string to end of second found string.
   WorkingFile.findReplace.find(sSearchString2);
   if (WorkingFile.isNotFound()) {
      if (nOutputType == 2) {
         UltraEdit.messageBox("Second search string not found!","FindSelectOuter Error");
      } else if (nOutputType == 1) {
         if (UltraEdit.outputWindow.visible == false) UltraEdit.outputWindow.showWindow(true);
         UltraEdit.outputWindow.write("FindSelectOuter: Second search string not found!");
      }
      // Second string was not found, set cursor back to original position.
      WorkingFile.gotoLine(nLineNumber,nColumnNumber);
      return false;
   }
   /* Second searched string also found. Remember the current
      cursor position at the end of the found string. */
   nColumnNumber = WorkingFile.currentColumnNum;
   if (typeof(UltraEdit.activeDocumentIdx) == "undefined") nColumnNumber++;
   if (nColumnNumber == 1) {
      WorkingFile.key("END");
      WorkingFile.key("HOME");
      if (WorkingFile.isColNumGt(1)) WorkingFile.key("HOME");
   }
   nLineNumber = WorkingFile.currentLineNum;
   // Position the cursor back to start of first found string.
   WorkingFile.gotoLine(nStartLine,nStartColumn);
   // Select now to end of second found string.
   WorkingFile.gotoLineSelect(nLineNumber,nColumnNumber);
   return true;
}  // End of function FindSelectOuter


/*** FindSelectInner/Outer Demonstration **********************************/

// An example for demonstrating how to use the functions above.

if (UltraEdit.outputWindow.visible) UltraEdit.outputWindow.showWindow(false);

// Create a new file, make sure it uses DOS line endings and insert some content.
UltraEdit.newFile();
UltraEdit.activeDocument.unixMacToDos();
UltraEdit.activeDocument.write("This is an example for demonstrating the usage of the functions\r\n");
UltraEdit.activeDocument.write("FindSelectInner and FindSelectOuter. Very often block selections\r\n");
UltraEdit.activeDocument.write("must be done in HTML and XML files. Therefore this demonstration\r\n");
UltraEdit.activeDocument.write("shows the usage of the 2 functions on a HTML example.\r\n\r\n<html>\r\n");
UltraEdit.activeDocument.write("<head>\r\n <title>FindSelectInner and FindSelectOuter</title>\r\n</head>\r\n<body>\r\n");
UltraEdit.activeDocument.write("<table cellspacing=0 cellpadding=3 border=1 summary=\"Function parameters\">\r\n");
UltraEdit.activeDocument.write("<tr>\r\n <th rowspan=2>Function</th><th colspan=2>1st parameter</th>\r\n");
UltraEdit.activeDocument.write(" <th colspan=2>2nd parameter</th><th colspan=2>3rd parameter</th>\r\n");
UltraEdit.activeDocument.write(" <th colspan=2>4th parameter</th><th colspan=2>5th parameter</th>\r\n");
UltraEdit.activeDocument.write("</tr>\r\n<tr>\r\n <th>Name</th><th>Type</th>\r\n");
UltraEdit.activeDocument.write(" <th>Name</th><th>Type</th><th>Name</th><th>Type</th>\r\n");
UltraEdit.activeDocument.write(" <th>Name</th><th>Type</th><th>Name</th><th>Type</th>\r\n");
UltraEdit.activeDocument.write("</tr>\r\n<tr>\r\n <td>FindSelectInner</td><td>sSearchString1</td><td>string</td>\r\n");
UltraEdit.activeDocument.write(" <td>sSearchString2</td><td>string</td><td>nDocumentNumber</td><td>number</td>\r\n");
UltraEdit.activeDocument.write(" <td>bUseCut</td><td>boolean</td><td>nClipNumber</td><td>number</td>\r\n");
UltraEdit.activeDocument.write("</tr>\r\n<tr>\r\n <td>FindSelectOuter</td><td>sSearchString1</td><td>string</td>\r\n");
UltraEdit.activeDocument.write(" <td>sSearchString2</td><td>string</td><td>nDocumentNumber</td><td>number</td>\r\n");
UltraEdit.activeDocument.write(" <td>bUseCut</td><td>boolean</td><td>nClipNumber</td><td>number</td>\r\n");
UltraEdit.activeDocument.write("</tr>\r\n</table>\r\n\r\n");
UltraEdit.activeDocument.write("<p>This file will be closed without saving.</p>\r\n\r\n</body>\r\n</html>\r\n");

// Set working environment for the example script part.
UltraEdit.insertMode();
UltraEdit.columnModeOff();
UltraEdit.ueReOn();
UltraEdit.activeDocument.findReplace.matchCase=true;
UltraEdit.activeDocument.findReplace.matchWord=false;
UltraEdit.activeDocument.findReplace.regExp=false;
UltraEdit.activeDocument.findReplace.mode=0;

UltraEdit.activeDocument.top();
FindSelectInner("<body>^p","</body>");
UltraEdit.messageBox("Example 1 shows how FindSelectInner is used to select the body content of a HTML file.\n\n\Used command:   FindSelectInner(\"<body>^p\",\"</body>\");","Example 1: FindSelectInner selects body content");

UltraEdit.activeDocument.top();
UltraEdit.activeDocument.findReplace.regExp=true;
FindSelectOuter("<table*>","</table>",-1,true);
UltraEdit.messageBox("Example 2 shows how FindSelectOuter is used to select an entire table in a HTML file.\n\nUsed command:   FindSelectOuter(\"<table*>\",\"</table>\",-1,true);\n\nThe UltraEdit regular expression engine is used here too.","Example 2: FindSelectOuter selects entire table");

UltraEdit.activeDocument.top();
UltraEdit.activeDocument.gotoLine(7,1);
FindSelectInner("","<body",-1,true,0);
UltraEdit.messageBox("Example 3 shows how FindSelectInner is used to select entire HTML head in this example file\nby positioning the cursor at start of the head and select everything to begin of the found string.\n\nUsed command:   FindSelectInner(\"\",\"<body\",-1,true,0);","Example 3: FindSelectInner selects from cursor position to begin of found string");

UltraEdit.activeDocument.top();
UltraEdit.activeDocument.findReplace.regExp=false;
FindSelectOuter("<html>","",-1);
UltraEdit.messageBox("Example 4 shows how FindSelectOuter is used to select entire HTML content in this example\nfile by searching from top of the file for <html> and select everything to end of the file.\n\nUsed command:   FindSelectOuter(\"<html>\",\"\",-1);","Example 4: FindSelectOuter selects from begin of found string to end of file");

UltraEdit.closeFile(UltraEdit.activeDocument.path,2);
