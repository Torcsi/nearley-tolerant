let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOGLTOCPart",regexp("^Partie[ \xa0][A-H]+(\t|[ \xa0]?–[ \xa0]).*$")).context({style:"TOC1-N"});
atom("PCTEPOGLTOCChapter",regexp("^Chapitre[ \xa0][IVX]+(\t|[ \xa0]?[-\u2011\xad–][ \xa0]).*$")).context({style:"TOC1"});
atom("PCTEPOGLTOCIntroduction",regexp("Introduction")).context({style:"TOC1"});
atom("PCTEPOGLTOCForeword",regexp("Avertissement")).context({style:"TOC1"});
atom("PCTEPOGLTOCAnnexNo",regexp("^Annexe[ \xa0][1-9]\t.*$")).context({style:"TOC2"});
atom("PCTEPOGLTOCAnnex",regexp("^Annexe\t.*$")).context({style:"TOC2"});


equivalences("PCTEPOGLTOCIntroduction","Introduction");


module.exports = tihyLexer;
