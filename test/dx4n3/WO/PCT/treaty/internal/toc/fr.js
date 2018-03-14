let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTTOCIntroduction",regexp("^Dispositions introductives")).context({style:"TOC1"});
atom("PCTTOCChapter",regexp("^Chapitre[ \xa0][IVX]+:\t.*$")).context({style:"TOC1"});
atom("PCTTOCArticleNo",regexp("^Article[ \xa0][1-9][0-9]*(er)?\t.*$")).context({style:"TOC3"});

module.exports = tihyLexer;
