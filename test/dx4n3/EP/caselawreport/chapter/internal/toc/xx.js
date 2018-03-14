let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("CaseLawPartTocRef",regexp("^[IVX]+\\.[\xa0 \t][\\s\\S]*$")).context({style:"TOC1"});
atom("CaseLawChapterTocRef",regexp("^[A-Z]+\\.[ \xa0\t][\\s\\S]*$")).context({style:"TOC2"});
atom("CaseLawPoint1TocRef",regexp("^[0-9]+\\.[\xa0 \t][\\s\\S]*$")).context({style:"TOC3"});
atom("CaseLawPoint2TocRef",regexp("^[0-9]+\\.[0-9]+[\xa0 \t][\\s\\S]*$")).context({style:"TOC4"});
atom("CaseLawPoint3TocRef",regexp("^[0-9]+\\.[0-9]+\\.[0-9]+[\xa0 \t][\\s\\S]*$")).context({style:"TOC5"});
atom("CaseLawPoint4TocRef",regexp("^[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+[\xa0 \t][\\s\\S]*$")).context({style:"TOC6"});



module.exports = tihyLexer;
