let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("EPCKIArticle",regexp("A[ \xa0][1-9][0-9]*")).setGroup("EPCArticle");
atom("EPCKIArticleBisTer",regexp("A[ \xa0][1-9][0-9]*(bis|ter|quater)")).setGroup("EPCArticle");
atom("EPCKIRule",regexp("R[ \xa0][1-9][0-9]*")).setGroup("EPCRule");
atom("EPCKIRuleBisTer",regexp("R[ \xa0][1-9][0-9]*(bis|ter|quater)")).setGroup("EPCRule");
atom("EPCKIFees",regexp("R[TR]T[\\.\xa0 ][1-9][0-9]*")).setGroup("EPCArticle").issueWhen(regexp("RTT"),true,"warning","RRT insteadof RTT");;
atom("EPCKIFeesBisTer",regexp("R[TR]T\\.[1-9][0-9]*[a-z]")).setGroup("EPCArticle").issueWhen(regexp("RTT"),true,"warning","RRT insteadof RTT");
atom("EPCKIProPrimm",regexp("ProPrIm[ \xa0][1-9][0-9]*")).setGroup("EPCArticle");
atom("EPCKIProCen",regexp("(ProCen|PCen)[ \xa0][IVX]+")).setGroup("EPCArticle");
atom("EPCKIProRec",regexp("ProRec[ \xa0][1-9][0-9]*")).setGroup("EPCArticle");

atom("EPCKIA69",regexp("l'Article[ \xa0]69")).issue("hint","revise A69  link");
atom("EPCKIRoman",regexp("[IVX]+"));

equivalences("EPCIntroduction","Introduction")
equivalences("EPCKIRoman","RomanUpper")
module.exports = tihyLexer;
