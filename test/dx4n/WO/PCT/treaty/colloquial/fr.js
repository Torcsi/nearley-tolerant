let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTChapterNo",regexp("([Cc]hapitre[s]?|CHAPITRE)[ \xa0][IVX]+")).afterSeparator().beforeSeparator();

module.exports = tihyLexer;
