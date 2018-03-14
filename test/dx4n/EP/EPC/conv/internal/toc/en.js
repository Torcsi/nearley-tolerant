let {atom,regexp,Lexer,use} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCPreambule",regexp("Preamble"));
atom("EPCTOCPart",regexp("(First|1st|Second|2nd|Third|3rd|(Four|Fif|Six|Seven|Eight|Nine|Ten)th)[ \xa0]part[\\s\\S]*$","s"));
atom("EPCTOCPartNo",regexp("[Pp]art[ \xa0][IVX]+[\\s\\S]*$","s"));
atom("EPCTOCChapter",regexp("Chapter[ \xa0][IVX]+[\\s\\S]*$","s"));
atom("EPCTOCArticle1",regexp("Art.[ \xa0]premier(\t.*)?$")).context({style:"TOC 2"}).setGroup("EPCTOCArticle");
atom("EPCTOCArticleNo",regexp("Art.[ \xa0][1-9][0-9]*(bis|ter|quater)?.*$")).context({style:"TOC 2"}).setGroup("EPCTOCArticle");

module.exports = tihyLexer;
