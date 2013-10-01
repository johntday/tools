// http://stackoverflow.com/questions/646628/javascript-startswith
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}
/* The difference between substring and slice is basically that slice can take negative indexes, 
   to manipulate characters from the end of the string, for example you could write the counterpart endsWith method by:
*/

if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function (str){
    return this.slice(-str.length) == str;
  };
}

function parseBetweenChar(line, s) {
	var a = line.indexOf(s);
	//UltraEdit.outputWindow.write("a=[" + a + "]");
	if (a != -1) {
	    var b = line.indexOf(s, a+1);
	    //UltraEdit.outputWindow.write("b=[" + b + "]");
	    if (b != -1) {
	        line = line.substring(a+1, b);
	    }
	}
	return line;
}
 
/**
 * UltraEditLink object
 * {{context|name}}
 * context
 *   bm = bookmark
 */

