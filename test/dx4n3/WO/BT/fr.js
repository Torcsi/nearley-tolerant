let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("BTTreaty",regexp("BT|Traité[ \xa0]de[ \xa0]Budapest"));
atom("BTTreatyPostfix",regexp("[ \xa0](BT|Traité[ \xa0]de[ \xa0]Budapest)"));
//atom("PCTPart",regexp("[Pp]artie[ \xa0][1-9][0-9]*")).afterSeparator().beforeSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
//atom("PCTChapter",regexp("[Cc]hapitre[ \xa0][IVX]+")).afterSeparator().beforeSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
//atom("PCTArticleDotParagraphNoParenthesis",regexp("([Ll]['’])?[Aa]rt(s?\\.|icles?)[ \xa0][1-9][0-9]*\\.[1-9][0-9]*[\\)\\.]")).afterSeparator().setGroup("PCTArticleDotParagraphNo").issue("hint","unusual PCT article format, use parenthesis for paragraph number");
//atom("BTArticleDotParagraphNo",regexp("([Ll]['’])?[Aa]rt(s?\\.|icles?)[ \xa0][1-9][0-9]*\\.[1-9][0-9]*")).afterSeparator().setGroup("PCTArticleDotParagraphNo").issue("hint","unusual PCT article format, use parenthesis for paragraph number");
//atom("BTDottedParagraphNoParenthesis",regexp("[1-9][0-9]*\\.[1-9][0-9]*[\\)\\.]")).afterSeparator().setGroup("PCTDottedParagraphNo").issue("hint","unusual PCT article format, use parenthesis for paragraph number");
atom("BTDottedParagraphNo",regexp("[1-9][0-9]*\\.[1-9][0-9]*")).afterSeparator().setGroup("PCTDottedParagraphNo").issue("hint","unusual PCT article format, use parenthesis for paragraph number");

//atom("PCTArticleDotParagraphRomanParenthesis",regexp("([Ll]['’])?[Aa]rt(s?\\.|icles?)[ \xa0][1-9][0-9]*\\.[ivx]+[\\)\\.]")).afterSeparator().setGroup("PCTArticleDotParagraphNo").issue("hint","unusual PCT article format, use parenthesis for paragraph number");


// Rules
//atom("PCTRuleNo",regexp("([rR]ègles?|RÈGLE)[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("PCTRule").context("Margin","warning","use short form");
//atom("PCTRuleNoBisTer",regexp("([rR]ègles?|RÈGLE)[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)")).afterSeparator().setGroup("PCTRule").context("Margin","warning","use short form");

//atom("PCTShortRuleNo",regexp("R\\.[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("PCTRule");
//atom("PCTShortRuleNoBisTer",regexp("R\\.[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)")).afterSeparator().setGroup("PCTRule");


atom("BTRuleNo",regexp("([rR]ègles?|RÈGLE|R\\.)[ \xa0][1-9][0-9]*")).afterSeparator();
atom("BTRuleNoDotParagraph",regexp("([rR]ègles?|RÈGLE)[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)?\\.[1-9][0-9]*(bis|ter|quater|quinquies)?\\)?")).afterSeparator().setGroup("PCTRuleNoDotParagraph").context("Margin","warning","use short form");
atom("BTDotSubparagraph",regexp("\\.[a-z]\\)")).issue("warning","dot unnecesary in FR");
atom("BTParenthesizedSubparagraph",regexp("\\(?[a-z]\\)")).issueWhen(regexp("\\("),true,"warning","( is not necessary in FR");

//atom("BTShortRuleNoDotParagraph",regexp("R.[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)?\\.[1-9][0-9]*(bis|ter|quater|quinquies)?\\)?")).afterSeparator().setGroup("PCTRuleNoDotParagraph");

//atom("PCTDottedParagraph",regexp("[1-9][0-9]*(bis|ter|quater|quinquies)?\\.[1-9][0-9]*(bis|ter|quater|quinquies)?\\)?")).afterSeparator();

//atom("PCTJustDotParagraph",regexp("\\.[1-9][0-9]*(bis|ter|quater|quinquies)?\\)?")).beforeSeparator().issue("warning","Rule number missing");



//atom("PCTDottedSubparagraphRoman",regexp("\\.([ivx]+)\\)")).issue("hint","use parenthesis instead of .").setGroup("PCTSubparagraph");
//atom("PCTSubparagraphRoman",regexp("([ivx]+)\\)")).setGroup("PCTSubparagraph");
//atom("PCTParenthesizedSubparagraphRoman",regexp("\\(([ivx]+)\\)")).setGroup("PCTSubparagraph");

//atom("PCTDottedSubparagraphLetter",regexp("\\.([a-z])([-\u2011\xad–](bis|ter|quater|quinquies))?\\)")).issue("hint","use parenthesis instead of .").setGroup("PCTSubparagraph");
//atom("PCTSubparagraphLetter",regexp("[ \xa0]?([a-z])([-\u2011\xad–](bis|ter|quater|quinquies))?\\)")).setGroup("PCTSubparagraph").issueWhen(regexp("[ \xa0]"),true,"hint","unnecessary space");
//atom("PCTParenthesizedSubparagraph",regexp("[ \xa0]?\\(([a-z])([-\u2011\xad–](bis|ter|quater|quinquies))?\\)")).setGroup("PCTSubparagraph").issueWhen(regexp("[ \xa0]"),true,"hint","unnecessary space");;

equivalences("BTRuleNo","EPCRuleNo");
equivalences("BTRuleNoDotParagraph","PCTRuleNoDotParagraph");
equivalences("BTDottedParagraphNo","PCTDottedParagraphNo");


module.exports = tihyLexer;
