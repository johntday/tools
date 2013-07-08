/*
 * Get selection or select line // include matchRecursiveRegExp.js
 */
var line;
if (UltraEdit.activeDocument.isSel()) {
} else {
    UltraEdit.activeDocument.selectLine();
}
line = UltraEdit.activeDocument.selection;

var mymatches = matchRecursiveRegExp("<t<<e>><s>>t<>", "<", ">", "g");

UltraEdit.outputWindow.write("-- start");
for (i=0; i < mymatches.length; i++) {
	UltraEdit.outputWindow.write( "["+i+"]="+mymatches[i] );
}
UltraEdit.outputWindow.write("-- end");


function matchRecursiveRegExp (str, left, right, flags) {
	var	f = flags || "";
	var g = f.indexOf("g") > -1;
	var x = new RegExp(left + "|" + right, "g" + f);
	var l = new RegExp(left, f.replace(/g/g, ""));
	var a = [];
	var t, s, m;
	
UltraEdit.activeDocument.findReplace.matchCase = false;
UltraEdit.activeDocument.findReplace.matchWord = false;
UltraEdit.activeDocument.findReplace.regExp = true;
UltraEdit.activeDocument.findReplace.searchDown = true;

UltraEdit.activeDocument.gotoLine(1);
UltraEdit.activeDocument.findReplace.find(str);


	do {
		t = 0;
		while (m = x.exec(str)) {
			if (l.test(m[0])) {
				if (!t++) s = x.lastIndex;
			} else if (t) {
				if (!--t) {
					a.push(str.slice(s, m.index));
					if (!g) return a;
				}
			}
		}
	} while (t && (x.lastIndex = s));

	return a;
}
