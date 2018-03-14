let {atom,regexp,Lexer,use} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCPreambule",regexp("Pr[eé]ambule"));
atom("EPCTOCPart",regexp("^(Premi[eè]re)[ \xa0](partie)[\\s\\S]*$","s"));

module.exports = tihyLexer;
