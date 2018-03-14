let {atom,regexp,Lexer,use} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOIIGeneralPart",regexp("Partie[ \xa0]générale"));

module.exports = tihyLexer;
