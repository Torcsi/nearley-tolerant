let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("EPCProRecogInternalArticle1",regexp("l['’]article[ \xa0]premier"));

module.exports = tihyLexer;
