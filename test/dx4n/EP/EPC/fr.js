let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPC",regexp("(CBE([ \xa0](2000|1973))?|de[ \xa0]la[ \xa0][Cc]onvention)"));
atom("EPCPostfix",regexp("[ \xa0](CBE([ \xa0](2000|1973))?|de la Convention sur le brevet européen|de[ \xa0]la[ \xa0][Cc]onvention)"));
atom("EPCReg",regexp("du[ \xa0]règlement[ \xa0]d'exécution([ \xa0]de[ \xa0]la[ \xa0]CBE|[ \xa0]de[ \xa0]la[ \xa0]Convention([ \xa0]sur[ \xa0]la[ \xa0]délivrance[ \xa0]de[ \xa0]brevets[ \xa0]européens|[ \xa0]sur[ \xa0]le[ \xa0]brevet[ \xa0]européen)?)?"));
atom("EPCRegPostfix",regexp("[ \xa0]du[ \xa0]règlement[ \xa0]d'exécution([ \xa0]de[ \xa0]la[ \xa0]CBE|[ \xa0]de[ \xa0]la[ \xa0]Convention([ \xa0]sur[ \xa0]la[ \xa0]délivrance[ \xa0]de[ \xa0]brevets[ \xa0]européens|[ \xa0]sur[ \xa0]le[ \xa0]brevet[ \xa0]européen)?)?"));

atom("EPCRFees",regexp("((RRT)([ \xa0](2000|1973))?|[Rr]èglement relatif aux taxes)"));
atom("EPCRFeesPrefix",regexp("RRT[ \xa0]"));
atom("EPCRFeesPostfix",regexp("[ \xa0](RRT([ \xa0](2000|1973))?|((du|de son)[ \xa0])?[Rr]èglement relatif aux taxes)")).setGroup("EPCRFeesPostfix");
atom("EPCRFeesPostfixOf",regexp("(du|de[ \xa0]son)[ \xa0][Rr]èglement relatif aux taxes")).setGroup("EPCRFeesPostfix");

atom("EPCProtImmPostfix",regexp("[ \xa0]((du|,)[ \xa0])?[Pp]rotocole sur les privilèges et immunités"));
atom("EPCProtArt69",regexp("(Prot\\.[ \xa0]Art\\.[ \xa0]69|[Pp]rotocole interprétatif de l'article[ \xa0]69[ \xa0]CBE)"));
atom("EPCProtCent",regexp("Prot\\.[ \xa0]Centr\."));

// Article
atom("EPCArtNo",regexp("([Ll]['’]art|[Aa]rt)\\.[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("EPCArticle").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("EPCArtNoBisTer",regexp("([Ll]['’]art\|[Aa]rt)\\.[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)")).afterSeparator().setGroup("EPCArticle").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("EPCArticleNo",regexp("([Ll]['’]a|[Aa])rticles?[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("EPCArticle").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("EPCArticleNoBisTer",regexp("([Ll]['’]a|[Aa])rticles?[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)")).afterSeparator().setGroup("EPCArticle").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("EPCARTICLENO",regexp("([L]['’])?ARTICLES?[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("EPCArticle").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe").issue("warning","full-caps ARTICLE");

// Rule
atom("EPCRuleNo",regexp("([rR]ègles?|R\\.)[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("EPCRule").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("EPCRuleNoBisTer",regexp("([rR]ègles?|R\\.)[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)")).afterSeparator().setGroup("EPCRule").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");

atom("EPCParagraphNo",regexp("[ \xa0]?(par\\.|[Pp]aragraphe[s]?)[ \xa0]([1-9]|\\([1-9]\\))")).setGroup("EPCParagraphNo");
atom("EPCSubparagraphNo",regexp("[ \xa0]?lettre[s]?[ \xa0][a-z]\\)?"));
atom("EPCPointNo",regexp("(point|n°)[ \xa0][1-9][0-9]*(bis|ter|quater)?"));

atom("EPCArticle1",regexp("(l')?art(\.|icle)[ \xa0]premier"));
atom("EPCArticleRuleNo",regexp("([1-9][0-9]*)(bis|ter|quarter|quinquies)?")).setGroup("EPCArticleRuleNo");
//atom("EPCArticleRuleNoLetter",regexp("([1-9][0-9]*)([a-z])")).setGroup("EPCArticleRuleNo").issue("error","in FR bis/ter/quater should be used");

// Index
atom("EPCIntroduction",regexp("Introduction"));
atom("EPCPresPre",regexp("Avant-propos du Président"));
atom("EPCKeywordIndex",regexp("Index alphabétique"));


// RFees
atom("EPCShortRFeesNo",regexp("RRT[ \xa0][1-9][0-9]*")).afterSeparator();
atom("EPCShortRFeesItem",regexp("\\.[1-9][0-9]*(bis|ter|quater)?"));

// Protocols
atom("EPCShortProtImp",regexp("PPI[ \xa0][1-9][0-9]*")).afterSeparator();
atom("EPCShortProtCent",regexp("PCen[ \xa0][IVX]+")).afterSeparator();
atom("EPCShortProtRec",regexp("PR[ \xa0][1-9][0-9]*")).afterSeparator();

equivalences("EPCArtNo","ArtNo");
equivalences("EPCArtNoBisTer","ArtNoBisTer");
equivalences("EPCArticleNo","ArticleNo");
equivalences("EPCArticleNoBisTer","ArticleNoBisTer");
equivalences("EPCARTICLENO","ARTICLENO");

equivalences("EPCRuleNo","RuleNo");
equivalences("EPCRuleNoBisTer","RuleNoBisTer");


equivalences("EPCIntroduction","Introduction");
equivalences("EPCParagraphNo","PCTParagraphNo");

module.exports = tihyLexer;
