/*
 * Get selection or select line
 */
var line;
if (UltraEdit.activeDocument.isSel()) {
    line = UltraEdit.activeDocument.selection;
    
    UltraEdit.activeDocument.findReplace.mode=1;
    UltraEdit.activeDocument.findReplace.replace(line, "`" + line + "`");

}
