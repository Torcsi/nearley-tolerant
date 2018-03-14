let {atom,regexp,Lexer,use} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOGLGeneralPartSection1",regexp("[pP]artie[ \xa0]générale,?[ \xa0][1-9][0-9]*")).afterSeparator();
atom("PCTEPOGLGeneralPartSection2",regexp("[pP]artie[ \xa0]générale,?[ \xa0][1-9][0-9]*\\.[1-9][0-9]*")).afterSeparator();


module.exports = tihyLexer;
