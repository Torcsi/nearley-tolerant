let {atom,regexp,Lexer,use} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOIIPartNo",regexp("II/PCT.OEB,?[ \xa0]I[A-H]"));


module.exports = tihyLexer;
