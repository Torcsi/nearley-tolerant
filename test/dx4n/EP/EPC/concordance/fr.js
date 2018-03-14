let {atom,regexp,Lexer,use} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCAnnexRef",regexp("^Annexe[ \xa0](II)[\t\r\n].*$"));
atom("EPCAbbreviations",regexp("Abréviations"));
module.exports = tihyLexer;
