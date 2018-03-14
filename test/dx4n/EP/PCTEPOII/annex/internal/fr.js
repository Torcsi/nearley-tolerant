let {atom,regexp,Lexer,use} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOIIChapterNo",regexp("[Cc]hapitre[ \xa0][1-9][0-9]*"));
atom("PCTEPOIIChapterNo2",regexp("[Cc]hapitre[ \xa0][1-9][0-9]*\\.[1-9][0-9]*"));


module.exports = tihyLexer;
