let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTOCPart",regexp("^Partie[ \xa0][A-Z][ \xa0]:.*$"));
atom("PCTOCRule",regexp("^Règle[ \xa0][1-9][0-9]*(bis|ter|quater)?\t.*$"));
atom("PCTOCSubrule",regexp("^[1-9][0-9]*(bis|ter|quater)?\\.[1-9][0-9]*(bis|ter|quater)?\t.*$"));

module.exports = tihyLexer;
