let {atom,regexp,Lexer,use} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PartOfEPC",regexp("[Pp]artie[ \xa0][IVX]+[ \xa0]de[ \xa0]la[ \xa0]CBE"));
//atom("ArticleFirst",regexp("(l')?article premier"));

module.exports = tihyLexer;
