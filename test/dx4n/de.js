let {atom,regexp,Lexer,use,equivalences} = require('../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("andor",regexp("[ \xa0](und|oder|bzw.|sowie)[ \xa0]")); // " und " " oder " " bzw. " " sowie "
atom("to",regexp("([ \xa0](zu|bis|[-\u2011\xad–])[ \xa0]|[-\u2011\xad–])")); // " zu " " bis "

atom("see",regexp("(cf\.|[Ss](iehe|\\.))([ \xa0]auch)?([ \xa0](oben|unten))?[ \xa0]")).issueWhen(regexp(" "),true,"hint","use non-breaking space after 'see'");

atom("subparagraphRoman",regexp("[ \xa0]?[\\(]?[ivx]+\\)")).issueWhen(regexp("[ \xa0]"),true,"hint","space is not needed in French before lower-case Roman-prefixed subparagaphs").issueWhen(regexp("\\("),true,"hint","( not needed in French before lower-case Roman-prefixed subparagaphs");
atom("subparagraphLetter",regexp("[ \xa0]?[\\(]?[a-z]+\\)")).issueWhen(regexp("[ \xa0]"),true,"hint","space is not needed in French before lower-case letter-prefixed subparagaphs").issueWhen(regexp("\\("),true,"hint","( not needed in French before lower-case letter-prefixed subparagaphs");
equivalences("subparagraphRoman","subparagraphLetter");

atom("ofTheInfix",regexp("[ \xa0](der|des)[ \xa0]")).setGroup("ofThe");
atom("ofThePostfix",regexp("[ \xa0](der|des)")).setGroup("ofThe").beforeSeparator();
atom("ofThePrefix",regexp("(der|des)[ \xa0]")).setGroup("ofThe");
atom("ofThe",regexp("(der|des)")).setGroup("ofThe");


atom("theInfix",regexp("[ \xa0](les|la|le)[ \xa0]")).setGroup("the");
atom("thePrefix",regexp("(les|la|le)[ \xa0]")).setGroup("the");
atom("thePostfix",regexp("[ \xa0](les|la|le)")).setGroup("the");

// Law abbreviations
atom("RPBAPostfix",regexp("[ \xa0]?VOBK([ \xa0][0-9]{4})?")).beforeSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space after 'see'").setGroup("RPBA");
atom("RPBAPostfixLong",regexp("[ \xa0]der Verfahrensordnung der Beschwerdekammern")).beforeSeparator().setGroup("RPBA");
atom("RPBA",regexp("VOBK")).beforeSeparator().afterSeparator();
atom("RPEBAPostfix",regexp("[ \xa0]VOGBK([ \xa0][0-9]{4})?")).beforeSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space after 'see'");
atom("RPEBA",regexp("VOGBK")).beforeSeparator().afterSeparator();


// Article
atom("ArtNo",regexp("([Aa]rt)\\.[ \xa0][1-9][1-9]*([ \xa0]\\([0-9]\\))*")).afterSeparator().setGroup("Article");
atom("ArtNoBisTer",regexp("([Aa]rt)\\.[ \xa0][1-9][0-9]*[a-z]")).afterSeparator().setGroup("Article");
atom("ArticleNo",regexp("([Aa])rtikel[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("Article").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("ArticleNoBisTer",regexp("([Aa])rtikel[ \xa0][1-9][0-9]*([a-z])")).afterSeparator().setGroup("Article").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("ARTICLENO",regexp("([L]['’])?ARTICLES?[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("Article").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe").issue("warning","full-caps ARTICLE");

// Rule
atom("RuleNo",regexp("([rR]ègles?)[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("Rule").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("RuleNoBisTer",regexp("([rR]ègles?)[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)")).afterSeparator().setGroup("Rule").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");


// Article, rule no. in sequence
atom("ArtNoInSequence",regexp("[1-9][0-9]*")).afterSeparator();
atom("ArtNoBisTerInSequence",regexp("[1-9][0-9]*[a-z]")).afterSeparator().beforeSeparator();

// Subparagraph immediately after article
atom("Subparagraph",regexp("[ \xa0]?\\([1-9][0-9]*\\)")).issueWhen(regexp("[ \xa0]"),false,"space or non-breaking space missing").issueWhen(regexp(" "),true,"use non-breaking space");

// Point number
atom("PointNo",regexp("([Pp]unkt|Nr\\.)[ \xa0][1-9](\\.[1-9](\\.[1-9])?)?"));

// sentences
atom("SentenceNumber",regexp("[0-9][0-9]*"));
atom("SentenceType",regexp("[ \xa0](Satz|Halbsatz)[ \xa0]"));

atom("SentenceOrderNo",regexp("[ \xa0]([Zz]weiter)"));

atom("SentenceFillerSingle","SentenceType","SentenceNumber");
atom("SentenceFillerSingleOrder","SentenceOrderNo","SentenceType");

module.exports = tihyLexer;
