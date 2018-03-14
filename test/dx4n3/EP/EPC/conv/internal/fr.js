let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("EPCInternalParagraph1",regexp("[Pp]aragraphe[ \xa0]premier"));

module.exports = tihyLexer;
