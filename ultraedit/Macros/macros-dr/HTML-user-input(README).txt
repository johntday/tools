============================================================================
====
					MACRO FILENAME FOR ALL FOUR MACROS:  HTML-user-input.mac
============================================================================
====

============================================================================
====
MACRO: HTML font C?F?S? (where ? indicates user input)
============================================================================
====
If you have highlighted the text for the font codes to be applied to,
the macro will "cut" the text and then paste it back in in the
appropriate place between the paired codes as show by the position
of your cursor represented by the "|" shown below. This will NOT
be written by your macro but is a representataion of the cursor
position.
----------------------------------------------------------------------------
----
OUTPUT WITH COLOR "NAME" OR "#NUMBER", FONT "NAME" , FONT "SIZE,
+SIZE, -SIZE"
----------------------------------------------------------------------------
----

<font color="red" face="Times New Roman" size="+1">|</font>

<font color="#FF0000" face="Times New Roman" size="12">|</font>

----------------------------------------------------------------------------
----
MACRO CODE:
----------------------------------------------------------------------------
----
InsertMode
ColumnModeOff
HexOff
Cut
"<font color= face= size=></font>"
Loop 7
Key LEFT ARROW
EndLoop
Paste
Find Up "color="
Key LEFT ARROW
Key RIGHT ARROW
"""
GetString "Font COLOR Name or HTML #??????, use # sign if needed."
"""
Find "face="
Key LEFT ARROW
Key RIGHT ARROW
"""
GetString "Font FACE: Quotes around your text will be applied for you."
"""
Find "size="
Key LEFT ARROW
Key RIGHT ARROW
"""
GetString "Font SIZE: Enter integer size #, size +#, or size -#"
"""
Find "</font>"
Key LEFT ARROW
Key RIGHT ARROW
Loop 7
Key LEFT ARROW
EndLoop
ClearClipboard
============================================================================
====

****************************************************************************
****

============================================================================
====
MACRO: height="?" (where ? indicates user input)
============================================================================
====
Place your cursor where you want the start of the code written and review
the
output of the macro below. ***This one is normally used with "img" codes!
----------------------------------------------------------------------------
----
OUTPUT OF MACRO WITH USER INPUT OF INTEGER
----------------------------------------------------------------------------
----

height="140"

----------------------------------------------------------------------------
----
MACRO CODE:
----------------------------------------------------------------------------
----
InsertMode
ColumnModeOff
HexOff
"height=""
GetString "? Integer # pixels [height="#"] (Quotes added 4 U)"
"""
============================================================================
====

****************************************************************************
****

============================================================================
====
MACRO: W="?" H="?" (where ? indicates user input)
============================================================================
====
Place your cursor where you want the start of the code written and review
the
output of the macro below. ***This one is normally used with "img" codes!
----------------------------------------------------------------------------
----
OUTPUT OF MACRO WITH USER INPUT OF INTEGER FOR WIDTH AND HEIGTH
----------------------------------------------------------------------------
----

width="30" height="40"

----------------------------------------------------------------------------
----
MACRO CODE:
----------------------------------------------------------------------------
----
InsertMode
ColumnModeOff
HexOff
"width=""
GetString "? Integer # of pixels [width="#"] (Quotes added 4 U)"
"" height=""
GetString "? Integer # of pixels [height="#"] (Quotes added 4 U)"
"""
============================================================================
====

****************************************************************************
****

============================================================================
====
MACRO: width="?" (where ? indicates user input integer)
============================================================================
====
Place your cursor where you want the start of the code written and review
the
output of the macro below. ***This one is normally used with "table" codes!
----------------------------------------------------------------------------
----
OUTPUT OF MACRO WITH USER INPUT OF WITH IN INTEGER
----------------------------------------------------------------------------
----

width="320"

----------------------------------------------------------------------------
----
MACRO CODE:
----------------------------------------------------------------------------
----
InsertMode
ColumnModeOff
HexOff
"width=""
GetString "? Integer # pixels [width="#"] (Quotes added 4 U)"
"""
============================================================================
====

****************************************************************************
****

============================================================================
====
MACRO: width="?%"(where ? indicates user input integer)
============================================================================
====
Place your cursor where you want the start of the code written and review
the
output of the macro below. ***This one is normally used in table codes!
----------------------------------------------------------------------------
----
OUTPUT OF MACRO WITH USER INPUT OF INTEGER PLUS PERCENT SYMBOL BY MACRO
----------------------------------------------------------------------------
----

width="75%"

----------------------------------------------------------------------------
----
MACRO CODE:
----------------------------------------------------------------------------
----
InsertMode
ColumnModeOff
HexOff
"width=""
GetString "? Integer #% [width="#%"] (Quotes and % added 4 U)"
"%""
============================================================================
====

