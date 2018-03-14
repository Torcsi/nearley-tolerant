let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCRegShort",regexp("R[ \xa0][1-9][0-9]*"));
atom("EPCRegShortBis",regexp("R[ \xa0][1-9][0-9]*(bis|ter|quater)"));

module.exports = tihyLexer;
