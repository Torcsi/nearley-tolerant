let {atom,regexp,Lexer,use} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCParagraphFirst",regexp("[Pp]aragraphe[ \xa0]premier")).setGroup("EPCParagraphNo");

module.exports = tihyLexer;
