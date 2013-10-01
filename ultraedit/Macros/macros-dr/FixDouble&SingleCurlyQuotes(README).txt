============================================================================
====
MACRO: FixDouble&SingleCurlyQuotes.mac
============================================================================
====
Place your cursor ANYWHERE and it will run with the "Find MatchCase" command
and do a "Replace All" command from beginning of file to end of file and
replace
all curly single and double quotes with standard single and double quotes.
It replaces ALL “ ” and ‘ ’ with " " and ' '.
----------------------------------------------------------------------------
----
OUTPUT OF MACRO WITH USER INPUT OF INTEGER PLUS PERCENT SYMBOL BY MACRO
----------------------------------------------------------------------------
----

Changes ALL single and double curly quotes to standard single and double
quotes.

----------------------------------------------------------------------------
----
MACRO CODE:
----------------------------------------------------------------------------
----
InsertMode
ColumnModeOff
HexOff
Key Ctrl+HOME
UltraEditReOn
Find MatchCase "“"
Replace All """
Find MatchCase "”"
Replace All """
Find MatchCase "‘"
Replace All "'"
Find MatchCase "’"
Replace All "'"
EndSelect
============================================================================
====
PLEASE NOTE: The below can be used in the Macro Code above instead the
actual
quotes if the user so desires. Either will work just as well.
============================================================================
====
&#145; Left Single Quote = ‘
&#146; Right Single Quote = ’
&#147; Left Double Quote = “
&#148; Right Double Quote = ”
============================================================================
====

