let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("EPCOldPrefix",regexp("EPCO[ \xa0]?"));

module.exports = tihyLexer;
