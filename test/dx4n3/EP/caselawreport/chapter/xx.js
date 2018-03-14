let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("CaseLawPartTocRef",regexp("^[IVX]+\\.[\xa0\t].*$")).context({style:"TOC1"});
atom("CaseLawChapterTocRef",regexp("^[A-Z]+\\.[\xa0\t].*$")).context({style:"TOC2"});



module.exports = tihyLexer;
