let {atom,regexp,Lexer,use} = require('../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("commaSpace",regexp(",[ \xa0]")); // ", "
atom("comma",regexp(",")).issue("warning","space missing");
//atom("RomanUpper", regex("[IVX]+"));
module.exports = tihyLexer;
