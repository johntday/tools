/**----------------------------------------------------------------------------
 * If a global variable named   g_nDebugMessage   exists and has the value 1
 * for debugging to output window or 2 for debugging with message boxes a
 * debug message is shown if an error condition is handled by the function.
----------------------------------------------------------------------------*/


/**
 * Write error.
 */
function ErrorHandler (whereErrorOccured, message, nOutputType) {
    if (nOutputType == 2) {
        UltraEdit.messageBox(message, whereErrorOccured+" Error");
    } else if (nOutputType == 1) {
        if (UltraEdit.outputWindow.visible == false) 
            UltraEdit.outputWindow.showWindow(true);
        UltraEdit.outputWindow.write(whereErrorOccured+": "+message);
    }
}


/**
 * Get first substring found between two tokens.
 */
function GetSubstringBetween (myString, startToken, endToken) {
    /* DECLARATIONS */
    var FUNCTIONNAME = "GetSubstringBetween";
    var nOutputType = (typeof(g_nDebugMessage) == "number") ? g_nDebugMessage : 0;
    var nStart;
    var nEnd;
    var outString;

    /* validate input */
    if (myString == "") {
        ErrorHandler(FUNCTIONNAME,"myString is empty", nOutputType);
        return "";
    }
    if (startToken == "") {
        ErrorHandler(FUNCTIONNAME,"startToken is empty", nOutputType);
        return "";
    }
    if (endToken == "") {
        ErrorHandler(FUNCTIONNAME,"endToken is empty", nOutputType);
        return "";
    }
    
    nStart = myString.indexOf(startToken);
    if (nStart == -1) {
        ErrorHandler(FUNCTIONNAME,"Token \""+startToken+"\" not found", nOutputType);
        return "";
    }
    nEnd = myString.lastIndexOf(endToken);
    if (nEnd == -1) {
        ErrorHandler(FUNCTIONNAME,"Last token \""+endToken+"\" not found", nOutputType);
        return "";
    }
    outString = myString.substring(nStart+1, nEnd);
    //ErrorHandler(FUNCTIONNAME, outString, nOutputType);
    return outString;
}


/**
 * Get substring found between start-of-string to first token found.
 */
function GetPrefix (myString, myToken) {
    /* DECLARATIONS */
    var FUNCTIONNAME = "GetPrefix";
    var nOutputType = (typeof(g_nDebugMessage) == "number") ? g_nDebugMessage : 0;
    var nEnd;
    var outString;

    /* validate input */
    if (myString == "") {
        ErrorHandler(FUNCTIONNAME,"myString is empty", nOutputType);
        return "";
    }
    if (myToken == "") {
        ErrorHandler(FUNCTIONNAME,"myToken is empty", nOutputType);
        return "";
    }
    
    nEnd = myString.indexOf(myToken);
    if (nEnd == -1) {
        ErrorHandler(FUNCTIONNAME,"Token \""+myToken+"\" not found", nOutputType);
        return "";
    }
    
    outString = myString.substring(0, nEnd);
    //ErrorHandler(FUNCTIONNAME, outString , nOutputType);
    return outString;
}
