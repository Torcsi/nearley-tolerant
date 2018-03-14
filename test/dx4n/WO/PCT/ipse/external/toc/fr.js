let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTISPETOCNonIdentified",regexp("^.*$")).context({style:"TOC3"});

module.exports = tihyLexer;
