let {atom,regexp,Lexer,use} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOGLPartNo",regexp("DIR/PCT-OEB[ \xa0][A-H]"));


module.exports = tihyLexer;
