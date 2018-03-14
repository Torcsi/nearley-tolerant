let {atom,regexp,Lexer,use} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCPreambule",regexp("Preamble"));
atom("EPCTOCPart",regexp("^(Premi[eè]re)[ \xa0](partie)[\\s\\S]*$","s"));

module.exports = tihyLexer;
