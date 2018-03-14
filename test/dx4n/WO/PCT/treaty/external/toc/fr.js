let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTTreatyTOCArticle",regexp("Article[ \xa0][1-9][0-9]*(er)?\t.*$"));
atom("PCTTreatyTOCChapter",regexp("Chapitre[ \xa0][IVX]+\:\t.*$"));
atom("PCTTreatyIntroduction",regexp("Dispositions introductives"));

module.exports = tihyLexer;
