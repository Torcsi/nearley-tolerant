let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);
atom("EPCLetterSingle",regexp("\\b[a-z]\\b"));
module.exports = tihyLexer;
