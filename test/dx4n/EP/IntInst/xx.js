let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("IntinstChapter",regexp("I[A-H][-\u2011\xad–][IVX]+")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen"); // C-IV
atom("IntinstChapterAnnex",regexp("I[A-H][-\u2011\xad–][IVX]+,[ \xa0][Aa]nnexe")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen"); // C-IV
atom("IntinstSection1",regexp("I[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*[a-z]?(?!\\))")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // IC-IV, 2bis
atom("IntinstSection1bis",regexp("I[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*(bis|ter|quater)")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // C-IV, 2; IB-X 9
atom("IntinstSection2",regexp("I[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*\\.[0-9]+[a-z]?(?!\\))")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // IC-IV, 2.3
atom("IntinstSection3",regexp("I[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*\\.[0-9]+\\.[0-9]+[a-z]?(?!\\))")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // IC-IV, 2.3.6 IH-VI, 3.0.1
atom("IntinstSection4",regexp("I[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*\\.[0-9]+\\.[0-9]+\\.[0-9]+[a-z]?(?!\\))")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // IC-IV, 2.3.6.5
atom("IntinstSection5",regexp("I[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*\\.[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+[a-z]?(?!\\))")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // IC-IV, 2.3.6.5.3

atom("IntinstSectionBad1",regexp("I[A-H][-\u2011\xad–][IVX]+\\.[1-9][0-9]*")).issue("warning","invalid '.' separator, separate section with comma-nonbreaking space"); // H-III.3
atom("IntinstSectionBad2",regexp("I[A-H][-\u2011\xad–][IVX]+\\.[1-9][0-9]*\\.[1-9][0-9]*")).issue("warning","invalid '.' separator, separate section with comma-nonbreaking space"); // H-III.3

atom("IntinstInternalSection1",regexp("[1-9][0-9]*")).beforeSeparator().afterSeparator();
atom("IntinstInternalSection2",regexp("[1-9][0-9]*\.[0-9]+")).beforeSeparator().afterSeparator();
atom("IntinstInternalSection3",regexp("[1-9][0-9]*\.[0-9]+\.[0-9]+")).beforeSeparator().afterSeparator();
atom("IntinstInternalSection4",regexp("[1-9][0-9]*\.[0-9]+\.[0-9]+\.[0-9]+")).beforeSeparator().afterSeparator();
atom("IntinstInternalSection5",regexp("[1-9][0-9]*\.[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+")).beforeSeparator().afterSeparator();

atom("IntinstInternalChapter", regexp("[IVX]+"));

equivalences("IntinstInternalSection1","number","ArtNoInSequence","GuiexInternalSection1","IntInstAnnexInternalSection1");
equivalences("IntinstInternalSection2","GuiexInternalSection2","IntInstAnnexInternalSection2");
equivalences("IntinstInternalSection3","GuiexInternalSection3","IntInstAnnexInternalSection3");
equivalences("IntinstInternalSection4","GuiexInternalSection4","IntInstAnnexInternalSection4");

equivalences("IntinstInternalChapter","GuiexInternalChapter");

module.exports = tihyLexer;
