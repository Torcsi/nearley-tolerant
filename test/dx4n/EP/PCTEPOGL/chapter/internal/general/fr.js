let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOGLPartLetter",regexp("([A-H])")).afterSeparator().beforeSeparator();
atom("PCTEPOGLIntroduction",regexp("Introduction")).afterSeparator().beforeSeparator();

equivalences("PCTEPOGLPartLetter","LetterUpper");
equivalences("PCTEPOGLIntroduction","Introduction");

module.exports = tihyLexer;
