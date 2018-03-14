let {atom,regexp,Lexer,use} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCAnnexRef",regexp("^Annex[ \xa0](I)+[\t\r\n].*$"));

module.exports = tihyLexer;
