let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTISPETOCAnnex",regexp("Annexe du chapitre[ \xa0][1-9][\r\n]?[\\s\\S]*$","s"));
atom("PCTISPETOCChapter",regexp("^Chapitre[ \xa0][1-9][0-9]*[\r\n][\\s\\S]*$","s")).context({style:"TOC3"});
atom("PCTISPETOCPoint",regexp("^[1-9][0-9]*\\.[ \xa0][\\s\\S]*$")).context({style:"TOC3"});
atom("PCTISPETOCNonIdentified",regexp("^.*$")).context({style:"TOC3"});

module.exports = tihyLexer;
