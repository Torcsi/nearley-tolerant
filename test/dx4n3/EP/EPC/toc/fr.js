let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("EPCTOCEndOfLine",regexp("[ \xa0]?.*$")).context("styles",["TOC1","TOC2","TOC3","TOC4"]);


module.exports = tihyLexer;
