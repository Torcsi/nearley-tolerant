let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTTOCPartRoman",regexp("^Partie[ \xa0][A-Z][ \xa0]:.*$")).context({style:"TOC1"});
atom("PCTTOCRule",regexp("^Règle[ \xa0][1-9][0-9]*(bis|ter|quater)?\t.*$")).context({style:"TOC2"});
atom("PCTTOCSubrule",regexp("^[1-9][0-9]*(bis|ter|quater)?\\.[1-9][0-9]*(bis|ter|quater)?\t.*$")).context({style:"TOC3"});

module.exports = tihyLexer;
