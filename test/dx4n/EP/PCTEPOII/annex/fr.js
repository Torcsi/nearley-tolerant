let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOIIAnnex",regexp("(l')?annexe[ \xa0]([IVX]+)"));
module.exports = tihyLexer;
