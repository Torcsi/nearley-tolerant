let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPC",regexp("(CBE([ \xa0](2000|1973|2010|2007))?|de[ \xa0]la[ \xa0][Cc]onvention( sur[ \xa0]le brevet européen)?)")).setGroup("EPC");
atom("EPCPostfix",regexp("[ \xa0](CBE([ \xa0](2000|1973|2010|2007))?|de la Convention sur[ \xa0]le brevet européen|de[ \xa0]la[ \xa0][Cc]onvention)")).setGroup("EPC");
atom("EPCReg",regexp("du[ \xa0]règlement[ \xa0]d['’]exécution([ \xa0]de[ \xa0]la[ \xa0]CBE|[ \xa0]de[ \xa0]la[ \xa0]Convention([ \xa0]sur[ \xa0]la[ \xa0]délivrance[ \xa0]de[ \xa0]brevets[ \xa0]européens|[ \xa0]sur[ \xa0]le[ \xa0]brevet[ \xa0]européen)?)?")).setGroup("EPC");
atom("EPCRegPostfix",regexp("[ \xa0]du[ \xa0]règlement[ \xa0]d['’]exécution([ \xa0]de[ \xa0]la[ \xa0]CBE|[ \xa0]de[ \xa0]la[ \xa0]Convention([ \xa0]sur[ \xa0]la[ \xa0]délivrance[ \xa0]de[ \xa0]brevets[ \xa0]européens|[ \xa0]sur[ \xa0]le[ \xa0]brevet[ \xa0]européen)?)?")).setGroup("EPC");
atom("EPCRegPrefix",regexp("CBE[ \xa0]")).setGroup("EPC");
atom("EPCRegUPPER",regexp("[ \xa0]?DE LA CONVENTION( SUR LE BREVET EUROPEEN)?")).setGroup("EPC");


atom("EPCRFees",regexp("((RRT|RTT)([ \xa0](2000|1973|2010|2007))?|[Rr]èglement relatif aux taxes|R[ÈE]GLEMENT RELATIF AUX TAXES)")).setGroup("EPCRFees").issueWhen(regexp("RTT"),true,"warning","extension should be RRT");
atom("EPCRFeesPrefix",regexp("(RRT|RTT|FEE)[ \xa0]")).setGroup("EPCRFees").issueWhen(regexp("RTT|FEE"),true,"warning","prefix should be RRT");
atom("EPCRFeesPostfix",regexp("[ \xa0]((RRT|RTT|FEE)([ \xa0](2000|1973|2010|2007))?|((du|de son)[ \xa0])?[Rr]èglement relatif aux taxes)")).setGroup("EPCRFees").issueWhen(regexp("RTT|FEE"),true,"warning","postfix should be RRT");
atom("EPCRFeesPostfixOf",regexp("(du|de[ \xa0]son)[ \xa0][Rr]èglement relatif aux taxes")).setGroup("EPCRFees");

atom("EPCProtImmPostfix",regexp("[ \xa0]((du|,)[ \xa0])?[Pp]rotocole sur les privilèges et immunités"));
atom("EPCProtArt69",regexp("(Prot\\.[ \xa0]Art\\.[ \xa0]69|[Pp]rotocole interprétatif de l'article[ \xa0]69[ \xa0]CBE)"));
atom("EPCProtCent",regexp("Prot\\.[ \xa0]Centr\."));
atom("EPCRevisionAct",regexp("[ \xa0]?(REV|l'[Aa]cte de révision|l'Acte (portant )?révision de la[ \xa0]CBE([ \xa0]1973)?)"));

// Part
atom("EPCPartNo",regexp("[Pp]artie[ \xa0]([IVX]+)"));

// Article
atom("EPCArtNo",regexp("([Ll]['’]arts?\|[Aa]rts?|ART)\\.[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("EPCArticle").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("EPCArtNoBisTer",regexp("([Ll]['’]arts?\|[Aa]rt|ART)\\.[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)")).afterSeparator().setGroup("EPCArticle").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("EPCArticleNo",regexp("([Ll]['’]a|[Aa])rticles?[ \xa0](\\x3a[ \xa0])?[1-9][0-9]*")).afterSeparator().setGroup("EPCArticle").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("EPCArticleNoBisTer",regexp("([Ll]['’]a|[Aa])rticles?[ \xa0](\\x3a[ \xa0])?[1-9][0-9]*(bis|ter|quater|quinquies)")).afterSeparator().setGroup("EPCArticle").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("EPCARTICLENO",regexp("([L]['’])?ARTICLES?[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("EPCArticle").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe").issue("warning","full-caps ARTICLE");
atom("EPCArticleDotParagraphNo",regexp("([Ll]['’])?[Aa]rt(s?\\.|icles?)[ \xa0][1-9][0-9]*\\.[1-9][0-9]*(bis|ter|quater)?")).afterSeparator().setGroup("PCTArticleDotParagraphNo").issue("hint","unusual PCT article format, use parenthesis for paragraph number");
// Rule
atom("EPCRuleNo",regexp("([rR]ègles?|R\\.|R[EÈ]GLE[S]?)[ \xa0]([1-9][0-9]*)")).afterSeparator().setGroup("EPCRule").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("EPCRuleNoBisTer",regexp("([rR]ègles?|R\\.|R[EÈ]GLE[S]?)[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies|sexiest?)")).afterSeparator().setGroup("EPCRule").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");

atom("EPCParagraphNo",regexp("[ \xa0]?(par\\.|[Pp]aragraphe[s]?|PARAGRAPHE[S]?)[ \xa0]([1-9]|\\([1-9]\\))")).setGroup("EPCParagraphNo");
atom("EPCSubparagraphNo",regexp("[ \xa0]?(alinéas?|lettre[s]?)[ \xa0]\\(?[a-z]\\)?")).setGroup("EPCSubparagraphNo");
atom("EPCSubparagraphNoUpper",regexp("[ \xa0]?LETTRES?[ \xa0]\\(?([A-Z])\\)?")).setGroup("EPCSubparagraphNo");
atom("EPCPointNo",regexp("[ \xa0]?(points?|n°)[ \xa0][1-9][0-9]*(bis|ter|quater)?"));

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
equivalences("EPCParagraphNo","ParagraphNo");

equivalences("EPCPointNo","PointNo");
equivalences("EPCArticleDotParagraphNo","PCTArticleDotParagraphNo")
module.exports = tihyLexer;
