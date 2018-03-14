let {atom,regexp,Lexer,use} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOIIPartNo",regexp("DIR/PCT-OEB[ \xa0][A-H]"));


module.exports = tihyLexer;
