/*
 * Get selection or select line
 */
var line;
if (UltraEdit.activeDocument.isSel()) {
    line = UltraEdit.activeDocument.selection;
    
	var a = "{% highlight text %}\r\n";
	var b = "{% endhighlight %}";

    UltraEdit.activeDocument.findReplace.mode=1;
    UltraEdit.activeDocument.findReplace.replace(line, 
        a + line + b);

}
