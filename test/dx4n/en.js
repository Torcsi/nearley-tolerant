let {atom,regexp,Lexer,use,equivalences} = require('../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("andor",regexp("[ \xa0](and|or|in conjunction with)[ \xa0]")); // " and "," or "
atom("to",regexp("([ \xa0](to|[-\u2011\xad–])[ \xa0]|[-\u2011\xad–])")); // " to "

atom("see",regexp("([Ss]ee[ \xa0]also|[Ss]ee|cf\.)[ \xa0]")).issueWhen(regexp(" "),true,"hint","use non-breaking space after 'see'");
atom("under",regexp("under[ \xa0]")).issueWhen(regexp(" "),true,"hint","use non-breaking space after 'under'");

atom("subparagraphRoman",regexp("[ \xa0]?[\\(]?[ivx]+\\)")).issueWhen(regexp("[ \xa0]"),true,"hint","space is not needed in French before lower-case Roman-prefixed subparagaphs").issueWhen(regexp("\\("),true,"hint","( not needed in French before lower-case Roman-prefixed subparagaphs");
atom("subparagraphLetter",regexp("[ \xa0]?[\\(]?[a-z]+\\)")).issueWhen(regexp("[ \xa0]"),true,"hint","space is not needed in French before lower-case letter-prefixed subparagaphs").issueWhen(regexp("\\("),true,"hint","( not needed in French before lower-case letter-prefixed subparagaphs");
equivalences("subparagraphRoman","subparagraphLetter");

atom("ofTheInfix",regexp("[ \xa0]of([ \xa0]the)?[ \xa0]")).setGroup("ofThe");
atom("ofThePostfix",regexp("[ \xa0]of([ \xa0]the)?")).setGroup("ofThe").beforeSeparator();
atom("ofThePrefix",regexp("of([ \xa0]the)?[ \xa0]")).setGroup("ofThe");
atom("ofThe",regexp("(de|du|dudit)([ \xa0]la)?")).setGroup("ofThe");

atom("theInfix",regexp("[ \xa0]the[ \xa0]")).setGroup("the");
atom("thePrefix",regexp("the[ \xa0]")).setGroup("the");
atom("thePostfix",regexp("[ \xa0]the")).setGroup("the");

// Law abbreviations
atom("RPBAPostfix",regexp("[ \xa0]RPBA([ \xa0][0-9]{4})?")).beforeSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space after 'see'").setGroup("RPBA");
atom("RPBAPostfixLong",regexp("[ \xa0]Rules of Procedure of the Boards of Appeal")).beforeSeparator().setGroup("RPBA");
atom("RPBA",regexp("RPCR")).beforeSeparator().afterSeparator();
atom("RPEBAPostfix",regexp("[ \xa0]RPEBA([ \xa0][0-9]{4})?")).beforeSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space after 'see'");
atom("RPEBA",regexp("RPEBA")).beforeSeparator().afterSeparator();


// Article
atom("ArtNo",regexp("([Aa]rt)\\.[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("Article").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("ArtNoBisTer",regexp("([Ll]['’]art\|[Aa]rt)\\.[ \xa0][1-9][0-9]*(a|b|c|d)")).afterSeparator().setGroup("Article").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("ArticleNo",regexp("([Ll]['’]a|[Aa])rticles?[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("Article").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("ArticleNoBisTer",regexp("([Ll]['’]a|[Aa])rticles?[ \xa0][1-9][0-9]*(a|b|c)")).afterSeparator().setGroup("Article").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("ARTICLENO",regexp("([L]['’])?ARTICLES?[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("Article").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe").issue("warning","full-caps ARTICLE");

// Rule
atom("RuleNo",regexp("([rR]ègles?)[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("Rule").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("RuleNoBisTer",regexp("([rR]ègles?)[ \xa0][1-9][0-9]*(a|b|c|d)")).afterSeparator().setGroup("Rule").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");


// Article, rule no. in sequence
atom("ArtNoInSequence",regexp("[1-9][0-9]*")).afterSeparator();
atom("ArtNoBisTerInSequence",regexp("[1-9][0-9]*(a|b|c|d)")).afterSeparator().beforeSeparator();

// Subparagraph immediately after article
atom("Subparagraph",regexp("[ \xa0]?\\([1-9][0-9]*\\)")).issueWhen(regexp("[ \xa0]"),false,"space or non-breaking space missing").issueWhen(regexp(" "),true,"use non-breaking space");

// Point number
atom("PointNo",regexp("point[s]?[ \xa0][1-9](\\.[1-9](\\.[1-9])?)?")); // for caselawreport: "point 1.9.2"

// sentences
atom("SentenceNumber",regexp("[ \xa0]?(first|1st|second|2nd|third|3rd|fourth|last)([ \xa0]part of)?"));
atom("SentenceNumberSimple",regexp("[ \xa0]?[1-9]"));
atom("SentenceType",regexp("[,]?[ \xa0](half([ \xa0]|[-\u2011\xad–]))?sentence[s]?[,]?([ \xa0](half([ \xa0]|[-\u2011\xad–]))?sentence[s]?[,]?)*"));
atom("ParagraphEPC",regexp("[ \xa0]?[Pp]aragraph[s]?[ \xa0]\\([a-z]\\)"));

atom("SentenceFillerSingle",["SentenceNumber","SentenceType"]);
atom("SentenceNoAfter",["SentenceType","SentenceNumberSimple"]);
module.exports = tihyLexer;
