let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCTOCArticle1",regexp("Art\.[ \xa0]premier.*$")).setGroup("EPCTOCArticle");
atom("EPCTOCArticle",regexp("Art\.[ \xa0][0-9]+.*$")).setGroup("EPCTOCArticle");
atom("EPCTOCArticleBisTer",regexp("Art\.[ \xa0][0-9]+(bis|ter|quater|quinquies|sext?ies).*$")).setGroup("EPCTOCArticle");
atom("EPCTOCRu;e",regexp("R\.[ \xa0][0-9]+.*$")).setGroup("EPCTOCRule");
atom("EPCTOCRuleBisTer",regexp("R\.[ \xa0][0-9]+(bis|ter|quater|quinquies|sext?ies).*$")).setGroup("EPCTOCRule");
atom("EPCTOCPartNo",regexp("(PREMIÈRE|(DEUX|TROIS|QUATR|CINQU|SIX|SEPT|HUIT|NEUV|DIX|ONZ|DOUZ)IÈME)[ \xa0]PARTIE[\\s\\S]*$")).setGroup("EPCTOCPartNo");
atom("EPCTOCPartNoLower",regexp("(Première|(Deux|Trois|Quatr|Cinqu|Six|Sept|Huit|Neuv|Dix|Onz|Douz)ième)[ \xa0]partie[\\s\\S]*$")).setGroup("EPCTOCPartNo");
atom("EPCTOCChapter",regexp("Chapitre[ \xa0][IVX]+[\\s\\S]*$"));
atom("EPCTOCSection",regexp("Section[ \xa0][IVX]+[\\s\\S]*$"));

atom("EPCTOCPrepublished",regexp("\\["));


module.exports = tihyLexer;
