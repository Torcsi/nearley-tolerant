let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTPostfix",regexp("[ \xa0]PCT")).setGroup("PCT").beforeSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
atom("PCT",regexp("PCT")).setGroup("PCT").afterSeparator().beforeSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
atom("PCTLong",regexp("Traité([ \xa0]de[ \xa0][Cc]oopération)?")).setGroup("PCT").afterSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
atom("PCTParagraphNo",regexp("[ \xa0]?(par\\.|[Pp]aragraphe[s]?)[ \xa0]([1-9]|\\([1-9]\\))")).setGroup("PCTParagraphNo");
atom("PCTParagraphNoParenthesized",regexp("[ \xa0]?[1-9][0-9]*\\)")).setGroup("PCTParagraphNo");

atom("PCTReg",regexp("règlement d'exécution du Traité de Coopération"));
atom("PCTSubsubparagraphNo",regexp("[ \xa0]?lettres?[ \xa0][a-z]\\)?"));
atom("PCTFees",regexp("[Bb]arème de taxes"));

// Articles
atom("PCTChapter",regexp("[Cc]hapitre[ \xa0][IVX]+")).afterSeparator().beforeSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
atom("PCTArticleDotParagraphNoParenthesis",regexp("([Ll]['’])?[Aa]rt(s?\\.|icles?)[ \xa0][1-9][0-9]*\\.[1-9][0-9]*[\\)\\.]")).afterSeparator().setGroup("PCTArticleDotParagraphNo").issue("hint","unusual PCT article format, use parenthesis for paragraph number");
atom("PCTArticleDotParagraphNo",regexp("([Ll]['’])?[Aa]rt(s?\\.|icles?)[ \xa0][1-9][0-9]*\\.[1-9][0-9]*")).afterSeparator().setGroup("PCTArticleDotParagraphNo").issue("hint","unusual PCT article format, use parenthesis for paragraph number");
atom("PCTDottedParagraphNoParenthesis",regexp("[1-9][0-9]*\\.[1-9][0-9]*[\\)\\.]")).afterSeparator().setGroup("PCTDottedParagraphNo").issue("hint","unusual PCT article format, use parenthesis for paragraph number");
atom("PCTDottedParagraphNo",regexp("[1-9][0-9]*\\.[1-9][0-9]*")).afterSeparator().setGroup("PCTDottedParagraphNo").issue("hint","unusual PCT article format, use parenthesis for paragraph number");

atom("PCTArticleDotParagraphRomanParenthesis",regexp("([Ll]['’])?[Aa]rt(s?\\.|icles?)[ \xa0][1-9][0-9]*\\.[ivx]+[\\)\\.]")).afterSeparator().setGroup("PCTArticleDotParagraphNo").issue("hint","unusual PCT article format, use parenthesis for paragraph number");


// Rules
atom("PCTRuleNo",regexp("([rR]ègles?|RÈGLE)[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("PCTRule").context("Margin","warning","use short form");
atom("PCTRuleNoBisTer",regexp("([rR]ègles?|RÈGLE)[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)")).afterSeparator().setGroup("PCTRule").context("Margin","warning","use short form");

atom("PCTShortRuleNo",regexp("R\\.[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("PCTRule");
atom("PCTShortRuleNoBisTer",regexp("R\\.[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)")).afterSeparator().setGroup("PCTRule");


atom("PCTRuleNoDotParagraph",regexp("([rR]ègles?|RÈGLE)[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)?\\.[1-9][0-9]*(bis|ter|quater|quinquies)?\\)?")).afterSeparator().setGroup("PCTRuleNoDotParagraph").context("Margin","warning","use short form");
atom("PCTShortRuleNoDotParagraph",regexp("R.[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)?\\.[1-9][0-9]*(bis|ter|quater|quinquies)?\\)?")).afterSeparator().setGroup("PCTRuleNoDotParagraph");

atom("PCTDottedParagraph",regexp("[1-9][0-9]*(bis|ter|quater|quinquies)?\\.[1-9][0-9]*(bis|ter|quater|quinquies)?\\)?")).afterSeparator();

atom("PCTJustDotParagraph",regexp("\\.[1-9][0-9]*(bis|ter|quater|quinquies)?\\)?")).beforeSeparator().issue("warning","Rule number missing");



atom("PCTDottedSubparagraphRoman",regexp("\\.([ivx]+)\\)")).issue("hint","use parenthesis instead of .").setGroup("PCTSubparagraph");
atom("PCTSubparagraphRoman",regexp("([ivx]+)\\)")).setGroup("PCTSubparagraph");
atom("PCTParenthesizedSubparagraphRoman",regexp("\\(([ivx]+)\\)")).setGroup("PCTSubparagraph");

atom("PCTDottedSubparagraphLetter",regexp("\\.([a-z])([-\u2011\xad–](bis|ter|quater|quinquies))?\\)")).issue("hint","use parenthesis instead of .").setGroup("PCTSubparagraph");
atom("PCTSubparagraphLetter",regexp("[ \xa0]?([a-z])([-\u2011\xad–](bis|ter|quater|quinquies))?\\)")).setGroup("PCTSubparagraph").issueWhen(regexp("[ \xa0]"),true,"hint","unnecessary space");
atom("PCTParenthesizedSubparagraph",regexp("[ \xa0]?\\(([a-z])([-\u2011\xad–](bis|ter|quater|quinquies))?\\)")).setGroup("PCTSubparagraph").issueWhen(regexp("[ \xa0]"),true,"hint","unnecessary space");;


equivalences("PCTRuleNo","RuleNo");
equivalences("PCTRuleNoBisTer","RuleNoBisTer");


module.exports = tihyLexer;
