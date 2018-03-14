let {atom,regexp,Lexer,use} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCAnnexRef",regexp("^Anhang[ \xa0](I)[\t\r\n].*$"));

module.exports = tihyLexer;
