let {atom,regexp,Lexer,use,equivalences} = require('../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("andor",regexp("[ \xa0](et|ou|ensemble)[ \xa0]")); // " et "," ou "
atom("to",regexp("([ \xa0](à|[-\u2011\xad–])[ \xa0]|[-\u2011\xad–][ \xa0]|[-\u2011\xad–])")).issueWhen(regexp("^[-\u2011\xad–][ \xa0]"),true,"hint","remove space after dash"); // " à "
	
atom("see",regexp("cf\.[ \xa0](cependant[ \xa0])?")).issueWhen(regexp(" "),true,"hint","use non-breaking space after 'see'");

atom("subparagraphRoman",regexp("[ \xa0]?[\\(]?[ivx]+\\)")).issueWhen(regexp("[ \xa0]"),true,"hint","space is not needed in French before lower-case Roman-prefixed subparagaphs").issueWhen(regexp("\\("),true,"hint","( not needed in French before lower-case Roman-prefixed subparagaphs");
atom("subparagraphLetter",regexp("[ \xa0]?[\\(]?[a-z]+\\)")).issueWhen(regexp("[ \xa0]"),true,"hint","space is not needed in French before lower-case letter-prefixed subparagaphs").issueWhen(regexp("\\("),true,"hint","( not needed in French before lower-case letter-prefixed subparagaphs");
equivalences("subparagraphRoman","subparagraphLetter");

atom("ofTheInfix",regexp("[ \xa0](de([ \xa0]ce)?|du([ \xa0]même)?|dudit|des|dans le)([ \xa0]la)?[ \xa0]")).setGroup("ofThe");
atom("ofThePostfix",regexp("[ \xa0](de([ \xa0]ce)?|du([ \xa0]même)?|dudit|des|dans le)([ \xa0]la)?")).setGroup("ofThe").beforeSeparator();
atom("ofThePrefix",regexp("(de([ \xa0]ce)?|du([ \xa0]même)?|dudit|des|dans le)([ \xa0]la)?[ \xa0]")).setGroup("ofThe");
atom("ofThe",regexp("(de([ \xa0]ce)?|du([ \xa0]même)?|dudit|des|dans le)([ \xa0]la)?")).setGroup("ofThe");


atom("theInfix",regexp("[ \xa0](les|la|le)[ \xa0]")).setGroup("the");
atom("thePrefix",regexp("(les|la|le)[ \xa0]")).setGroup("the");
atom("thePostfix",regexp("[ \xa0](les|la|le)")).setGroup("the");

// Law abbreviations
atom("RPBAPostfix",regexp("[ \xa0]RPCR([ \xa0][0-9]{4})?")).beforeSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space after 'see'").setGroup("RPBA");
atom("RPBAPostfixLong",regexp("[ \xa0]du règlement de procédure des chambres de recours")).beforeSeparator().setGroup("RPBA");
atom("RPBA",regexp("RPCR([ \xa0][0-9]{4})?")).beforeSeparator().afterSeparator().setGroup("RPBA");
atom("RPBATitle",regexp("[Rr]èglement de procédure des chambres de recours")).beforeSeparator().afterSeparator().setGroup("RPBA");
atom("RPBATitlePostfix",regexp("[ \xa0][Rr]èglement de procédure des chambres de recours")).beforeSeparator().setGroup("RPBA");
atom("RPEBAPostfix",regexp("[ \xa0]RPGCR([ \xa0][0-9]{4})?")).beforeSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space after 'see'").setGroup("RPEBA");
atom("RPEBA",regexp("RPGCR")).beforeSeparator().afterSeparator().setGroup("REPBA");

// Preambule
atom("Preambule",regexp("(PR[EÉ]AMB[U]?LE|Pr[eé]amb[u]?le)"));

// Article
atom("ArtNo",regexp("([Ll]['’]art\|[Aa]rt)\\.[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("Article").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("ArtNoBisTer",regexp("([Ll]['’]art\|[Aa]rt)\\.[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)")).afterSeparator().setGroup("Article").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("ArticleNo",regexp("([Ll]['’]a|[Aa])rticles?[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("Article").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("ArticleNoBisTer",regexp("([Ll]['’]a|[Aa])rticles?[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)")).afterSeparator().setGroup("Article").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("ARTICLENO",regexp("([L]['’])?ARTICLES?[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("Article").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe").issue("warning","full-caps ARTICLE");

// Rule
atom("RuleNo",regexp("([rR]ègles?)[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("Rule").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");
atom("RuleNoBisTer",regexp("([rR]ègles?)[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)")).afterSeparator().setGroup("Rule").context("Margin","warning","use short form").issueWhen(regexp("’"),true,"hint","use straight apostrophe");


// Article, rule no. in sequence
atom("ArtNoInSequence",regexp("[1-9][0-9]*")).afterSeparator();
atom("ArtNoBisTerInSequence",regexp("[1-9][0-9]*(bis|ter|quater|quinquies|sext?ies)")).afterSeparator().beforeSeparator();

// Subparagraph immediately after article
atom("Subparagraph",regexp("[ \xa0]?\\([1-9][0-9]*(bis|ter|quater)?\\)")).setGroup("Subparagraph").issueWhen(regexp("[ \xa0]"),false,"space or non-breaking space missing").issueWhen(regexp(" "),true,"use non-breaking space");
atom("SubparagraphPostfix",regexp("[ \xa0]\\(?[1-9][0-9]*(bis|ter|quater)?\\)")).setGroup("Subparagraph").issueWhen(regexp("[ \xa0]"),false,"space or non-breaking space missing").issueWhen(regexp(" "),true,"use non-breaking space");

// Point number
atom("PointNo",regexp("point[s]?[ \xa0][1-9]"));

// sentences
atom("SentenceNumber",regexp("[ \xa0]?(premier|première|1re|1ère|deuxième|second[e]?|2e|troisième|3e|quatrième|4e|dernière)")).beforeSeparator();
atom("SentenceType",regexp("[ \xa0]((membre|partie)[ \xa0]de([ \xa0]la)?[ \xa0])?(phrase)"));
atom("SentenceFillerSingle",["SentenceNumber","SentenceType"]);

// see
atom("SeePrefix",regexp("([Cc]f\.|[Vv]oir)([ \xa0](également|aussi))?[ \xa0]([ \xa0]le)?"));

// ff, f
atom("FurtherPostfix",regexp("[ \xa0](s\\.)|[ \xa0]et[ \xa0]s[.]"));
atom("FurtherWord",regexp("(s\\.)|[ \xa0]et[ \xa0]s\\."));

// Numero
atom("NumeroPrefix",regexp("([Nn][o°º]?\\.?)[ \xa0]?"));
atom("NumeroPostfix",regexp("[ \xa0]([Nn][o°º]?\\.?)[ \xa0]?"));
module.exports = tihyLexer;
