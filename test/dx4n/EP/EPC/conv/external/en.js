let {atom,regexp,Lexer,use} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PartOfEPC",regexp("[Pp]art[ \xa0][IVX]+[ \xa0]of[ \xa0]the[ \xa0]EPC"));
//atom("ArticleFirst",regexp("(l')?article premier"));

module.exports = tihyLexer;
