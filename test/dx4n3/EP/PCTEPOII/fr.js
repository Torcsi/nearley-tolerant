let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

//atom("PCTEPOIIPrefix",regexp("DIR/PCT[-\u2011\xad–]OEB,?[ \xa0]")).afterSeparator(); // "DIR/OEB, ", "DIR/OEB "
//atom("PCTEPOIIPostfix",regexp("[ \xa0](des[ \xa0]Directives[ \xa0]relatives[ \xa0]à[ \xa0]l'examen[ \xa0]pratiqué[ \xa0]à[ \xa0]l'OEB|des[ \xa0]directives)")).beforeSeparator();

//atom("PCTEPOIIPartWithNo",regexp("[Pp]arties?[ \xa0]([A-H])")).afterSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
//atom("PCTEPOIIChapterWithNo",regexp("[Cc]hapitre[ \xa0]([IVX]+)")).afterSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
//atom("PCTEPOIIAnnexWithNo",regexp("([aA]nnexe|An\\.|l'annexe)[ \xa0][1-9]")).afterSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
//atom("PCTEPOIIAnnexWithNoAndPartChapter",regexp("(:[aA]nnexe|An\\.|l'annexe)[ \xa0][1-9][ \xa0]\\([A-H][-\u2011\xad][IVX]+\\)")).afterSeparator().issue("hint","use part-chapter as prefix").issueWhen(regexp(" "),true,"hint","use non-breaking space");
//atom("PCTEPOIIAnnexWithNoInPartChapter",regexp("(annexe|l'annexe)[ \xa0][da]u[ \xa0][Cc]hapitre[ \xa0][A-H][-\u2011\xad–][IVX]+")).afterSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
//atom("PCTEPOIIGeneralPartSection1",regexp("[pP]artie[ \xa0]générale,?[ \xa0][1-9][0-9]*")).afterSeparator();
//atom("PCTEPOIIGeneralPartSection2",regexp("[pP]artie[ \xa0]générale,?[ \xa0][1-9][0-9]*\\.[1-9][0-9]*")).afterSeparator();


//atom("PCTEPOIIIntroduction",regexp("(INTRODUCTION|Introduction)"));

equivalences("PCTEPOIIPartWithNo","GuiexPartWithNo");
equivalences("PCTEPOIIChapterWithNo","GuiexChapterWithNo");
module.exports = tihyLexer;
