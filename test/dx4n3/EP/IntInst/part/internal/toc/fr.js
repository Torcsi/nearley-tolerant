let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("IntInstTOCAnnexRef",regexp("^Annexe\t.*$")).context({style:"TOC2"});
atom("IntInstTOCAnnexNoRef",regexp("^Annexe[ \xa0][1-9][ \xa0\t].*$")).context({style:"TOC2"});
atom("IntInstTOCChapter",regexp("^Chapitre[ \xa0][IVX]+(\t|[ \xa0]?[-\u2011\xad–][ \xa0]).*$")).context({style:"TOC1"});


module.exports = tihyLexer;
