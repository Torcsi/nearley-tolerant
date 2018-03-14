let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTRegulationsPrefix",regexp("PCR[ \xa0]")).afterSeparator();

module.exports = tihyLexer;
