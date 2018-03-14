let {atom,regexp,Lexer,use} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOGLGeneralPart",regexp("Partie générale"));


module.exports = tihyLexer;
