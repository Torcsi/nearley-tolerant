let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

// ==> TOC
atom("PCTISPEPART",regexp("^(PREMIÈRE|DEUXIÈME|TROISIÈME|QUATRIÈME|CINQUIÈME|SIXIÈME|SEPTIÈME|HUITIÈME)[ \xa0]PARTIE[\\s\\S]*$","s")).context({style:"TOC1"});

atom("PCTISPEInternalLetteredParagraph",regexp("([Ll](['’]|es[ \xa0]))?([Aa]linéas?|paragraphes?)[ \xa0][a-z]([-\u2011\xad–](bis|ter|quater|quinquies))?\\)"));
atom("PCTISPEInternalNumberedParagraph",regexp("([Ll](['’]|es[ \xa0]))?([Aa]linéas?|paragraphes?)[ \xa0][0-9]\\)"));

module.exports = tihyLexer;
