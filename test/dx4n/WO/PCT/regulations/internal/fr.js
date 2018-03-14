let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTRegInternalLetteredParagraph",regexp("([Ll](['’]|es[ \xa0]))?[Aa]linéas?[ \xa0][a-z]([-\u2011\xad–](bis|ter|quater|quinquies))?\\)"));
atom("PCTRegInternalNumberedParagraph",regexp("([Ll](['’]|es[ \xa0]))?[Aa]linéas?[ \xa0][0-9]\\)"));

module.exports = tihyLexer;
