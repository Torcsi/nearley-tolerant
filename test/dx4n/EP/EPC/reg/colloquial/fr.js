let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCParagraphLetter",regexp("[a-z]")).afterSeparator().beforeSeparator();

module.exports = tihyLexer;
