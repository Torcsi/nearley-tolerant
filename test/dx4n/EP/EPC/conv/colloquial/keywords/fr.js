let {atom,regexp,Lexer,use} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCArtShort",regexp("A[ \xa0][1-9][0-9]*"));
atom("EPCArtShortBis",regexp("A[ \xa0][1-9][0-9]*(bis|ter|quater)"));


module.exports = tihyLexer;
