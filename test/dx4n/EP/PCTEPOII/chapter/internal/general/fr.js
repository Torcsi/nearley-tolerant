let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOIIPartLetter",regexp("([A-H])")).afterSeparator().beforeSeparator();
atom("PCTEPOIIIntroduction",regexp("Introduction")).afterSeparator().beforeSeparator();

equivalences("PCTEPOIIPartLetter","LetterUpper");
equivalences("PCTEPOIIIntroduction","Introduction");

module.exports = tihyLexer;
