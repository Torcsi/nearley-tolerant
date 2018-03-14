let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOIITOCPart1",regexp("^Partie[ \xa0]([A-H])[ \xa0]–[ \xa0].*$")).context({style:"TOC1-N"})
atom("PCTEPOIITOCChapter",regexp("^Chapitre[ \xa0]([IVX]+)(\t|[ \xa0]–[ \xa0]).*$")).context({style:"TOC2C"});


module.exports = tihyLexer;
