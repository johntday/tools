/*
 * catme
 * @see links.md
 * cat-markdown: "<a href='/categories.html#markdown-ref'><span class='badge badge-success'>markdown</span></a>"
 */
var s;
var eol = "\r\n";
if (UltraEdit.activeDocument.isSel()) {
    s = UltraEdit.activeDocument.selection;
    
//    if (UltraEdit.outputWindow.visible == false) 
//        UltraEdit.outputWindow.showWindow(true);
//    UltraEdit.outputWindow.write("line="+line);
    UltraEdit.activeDocument.findReplace.mode=1;
    UltraEdit.activeDocument.findReplace.replace(s, 
    	"tag-"+ s + ": \"<a href='/categories.html#" + s + "-ref'><span class='badge badge-success'>" + s + "</span></a>\""
    );
}