let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("PCTParagraph",regexp("paragraphe[s]?[ \xa0][ivx]+"));
atom("PCTPointNoPostfix",regexp("[ \xa0]point[s]?[ \xa0][ivx]+\\)"));

//equivalences("PCTPointNo","PointAlpha");

module.exports = tihyLexer;
