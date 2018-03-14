let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("PCTChapter",regexp("([Cc]hapitres?|CHAPITRE)?[ \xa0][IVX]+"));

//equivalences("PCTPointNo","PointAlpha");

module.exports = tihyLexer;
