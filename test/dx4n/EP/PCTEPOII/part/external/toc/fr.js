let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOIITOCPartNo",regexp("Partie [A-H] [-\u2011\xad–] .*$"));
atom("PCTEPOIITOCChapterNo",regexp("^Chapitre[ \xa0][IVX]+\t.*$"));

module.exports = tihyLexer;
