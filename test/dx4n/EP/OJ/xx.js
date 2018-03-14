let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("OJPageNo",regexp("[1-9][0-9]*"));
atom("OJArticleNo",regexp("A[1-9][0-9]*"));

equivalences("OJPageNo","number");
module.exports = tihyLexer;
