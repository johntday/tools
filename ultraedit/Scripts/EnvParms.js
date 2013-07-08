//
// define env params for use by UltraEdit
//
var HOST           = "jtday-asus";
var SVN_BASE       = "C:\\mystuff";
var DOCUMENTS_BASE = "C:\\Users\\jtday\\Documents";
var WORKSPACE      = SVN_BASE + "\\workspace";
var uelogPath      = "C:\\logs\\UltraEdit\\";
var uelogfile      = uelogPath + "\\MyLog.txt";
var DROPBOX        = "V:\\Dropbox";
// ----------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------
function subEnvParms(myString) {
    myString = myString.replace("SVN_BASE",SVN_BASE)
                       .replace("DOCUMENTS_BASE",DOCUMENTS_BASE)
                       .replace("DROPBOX",DROPBOX);
    return myString;
}
