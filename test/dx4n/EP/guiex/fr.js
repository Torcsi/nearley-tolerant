let {atom,regexp,Lexer,use} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("GuiexPrefix",regexp("DIR/OEB,?[ \xa0]")).afterSeparator().issueWhen(regexp(","),true,"hint","comma is not necessary"); // "DIR/OEB, ", "DIR/OEB "
atom("GuiexPostfix",regexp("[ \xa0](des[ \xa0]Directives[ \xa0]relatives[ \xa0]à[ \xa0]l'examen[ \xa0]pratiqué[ \xa0]à[ \xa0]l'OEB|des[ \xa0]directives)")).beforeSeparator();

atom("GuiexPartWithNo",regexp("[Pp]artie[ \xa0]([A-H])")).afterSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
atom("GuiexChapterWithNo",regexp("[Cc]hapitre[ \xa0]([IVX]+)")).afterSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
atom("GuiexAnnexWithNo",regexp("([aA]nnexe|An\\.|l'annexe)[ \xa0][1-9]")).afterSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
atom("GuiexAnnexWithNoAndPartChapter",regexp("(:[aA]nnexe|An\\.|l'annexe)[ \xa0][1-9][ \xa0]\\([A-H][-\u2011\xad][IVX]+\\)")).afterSeparator().issue("hint","use part-chapter as prefix").issueWhen(regexp(" "),true,"hint","use non-breaking space");
atom("GuiexAnnexWithNoInPartChapter",regexp("(annexe|l'annexe)[ \xa0][da]u[ \xa0][Cc]hapitre[ \xa0][A-H][-\u2011\xad–][IVX]+")).afterSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
atom("GuiexGeneralPartSection1",regexp("[pP]artie[ \xa0]générale,?[ \xa0][1-9][0-9]*")).afterSeparator();
atom("GuiexGeneralPartSection2",regexp("[pP]artie[ \xa0]générale,?[ \xa0][1-9][0-9]*\\.[1-9][0-9]*")).afterSeparator();


atom("GuiexIntroduction",regexp("(INTRODUCTION|Introduction)"));


module.exports = tihyLexer;
