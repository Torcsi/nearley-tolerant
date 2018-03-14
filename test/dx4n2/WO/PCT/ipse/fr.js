let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTISPEPrefix",regexp("DIR/ISPE,?[ \xa0]")).setGroup("PCTISPE");
atom("PCTISPEPrefixLong",regexp("[dD]irectives[ \xa0]ISPE,?[ \xa0]")).setGroup("PCTISPE").context("margin","warning","use short form");

atom("PCTISPENumber2",regexp("(DIR/ISPE|[dD]irectives[ \xa0]ISPE),?[ \xa0]A?[1-9][0-9]*\\.[0-9]{2}[A-Z]?")); // external
atom("PCTISPENumber3",regexp("(DIR/ISPE|[dD]irectives[ \xa0]ISPE),?[ \xa0]A?[1-9][0-9]*\\.[0-9]{2}\\.[0-9][0-9]*")); // external
atom("PCTISPENumber3Ext",regexp("(DIR/ISPE|[dD]irectives[ \xa0]ISPE),?[ \xa0]A?[1-9][0-9]*\\.[0-9]{2}\\[[0-9]+\\]")); // external
atom("PCTISPENumber4Ext",regexp("(DIR/ISPE|[dD]irectives[ \xa0]ISPE),?[ \xa0]A?[1-9][0-9]*\\.[0-9]{2}\\[[0-9]+\\]\\.[1-9][0-9]*")); // external
	
atom("PCTISPEInternalNumber2",regexp("A?[1-9][0-9]*\\.[0-9]{2}[A-Z]?")); // internal
atom("PCTISPEInternalNumber3",regexp("A?[1-9][0-9]*\\.[0-9]{2}\\.[0-9][0-9]*")); // internal
atom("PCTISPEInternalNumber3Ext",regexp("A?[1-9][0-9]*\\.[0-9]{2}\\[[0-9]+\\]")); // internal
atom("PCTISPEInternalNumber4Ext",regexp("A?[1-9][0-9]*\\.[0-9]{2}\\[[0-9]+\\]\\.[1-9][0-9]*")); // internal

atom("PCTISPEChapter",regexp("(DIR/ISPE|[dD]irectives[ \xa0]ISPE),?[ \xa0][Cc]hapitres?[ \xa0][1-9][0-9]*"));
atom("PCTISPEInternalChapter",regexp("[Cc]hapitres?[ \xa0][1-9][0-9]*"));

atom("PCTISPEDottedSubparagaphLetter",regexp("\\.[a-z]\\)"));
atom("PCTISPEDottedSubparagaphRoman",regexp("\\.[ivx]+\\)"));
module.exports = tihyLexer;
