let {atom,regexp,Lexer,use} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCParagraphFirst",regexp("[Pp]aragraph[ \xa0]1\\)")).setGroup("EPCParagraphNo");

module.exports = tihyLexer;
