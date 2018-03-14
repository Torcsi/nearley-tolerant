let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);
atom("DecisionMissingType20xx",regexp("([ \xa0]et|[ \xa0]ou|,)[ \xa0][1-9][0-9]*/[012][0-9](?![0-9])")).issue("warning","decision type missing");
atom("DecisionMissingType19xx",regexp("([ \xa0]et|[ \xa0]ou|,)[ \xa0][1-9][0-9]*/[789][0-9](?![0-9])")).issue("warning","decision type missing");
module.exports = tihyLexer;
