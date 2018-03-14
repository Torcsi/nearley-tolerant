let {atom,regexp,Lexer,use} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOGLPartNoWithoutPrefox",regexp("[A-H]"));
atom("PCEPOGLIntroduction",regexp("Introduction"));

module.exports = tihyLexer;
