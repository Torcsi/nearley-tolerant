let {atom,regexp,Lexer,use} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCAnnexRef",regexp("^Annex[ \xa0](II)[\t\r\n].*$"));
atom("EPCAbbreviations",regexp("Abbreviations"));
module.exports = tihyLexer;
