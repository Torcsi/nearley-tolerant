let {atom,regexp,Lexer,use} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOIIGeneralPart",regexp("[pP]artie[ \xa0]générale")).afterSeparator().beforeSeparator();



module.exports = tihyLexer;
