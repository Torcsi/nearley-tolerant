let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EQERuleNo",regexp("R\\.[ \xa0][1-9][0-9]*")).afterSeparator();


module.exports = tihyLexer;
