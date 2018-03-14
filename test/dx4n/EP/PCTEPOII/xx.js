let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOIIChapter",regexp("I[A-H][-\u2011\xad–][IVX]+")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen"); // C-IV
atom("PCTEPOIISection1",regexp("I[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*[a-z]?(?!\\))")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // C-IV, 2; B-X 9
//atom("PCTEPOIISection1bis",regexp("I[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*(bis|ter|quater)")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // C-IV, 2; B-X 9
atom("PCTEPOIISection2",regexp("I[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*\\.[1-9][0-9]*[a-z]?(?!\\))")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // C-IV, 2.3
atom("PCTEPOIISection3",regexp("I[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*[a-z]?(?!\\))")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // C-IV, 2.3.6
atom("PCTEPOIISection4",regexp("I[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*[a-z]?(?!\\))")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // C-IV, 2.3.6.5


atom("PCTEPOIIInternalSection1",regexp("[1-9][0-9]*")).beforeSeparator().afterSeparator();
atom("PCTEPOIIInternalSection2",regexp("[1-9][0-9]*\\.[1-9][0-9]*")).beforeSeparator().afterSeparator();
atom("PCTEPOIIInternalSection3",regexp("[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*")).beforeSeparator().afterSeparator();
atom("PCTEPOIIInternalSection4",regexp("[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*")).beforeSeparator().afterSeparator();
atom("PCTEPOIIInternalSection5",regexp("[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*")).beforeSeparator().afterSeparator();

atom("PCTEPOIIInternalChapter", regexp("[IVX]+"));

//equivalences("PCTEPOIIInternalSection1","number","ArtNoInSequence");
equivalences("PCTEPOIIInternalChapter","RomanUpper");
equivalences("PCTEPOIIChapter","IntinstChapter");
equivalences("PCTEPOIISection1","IntinstSection1");
//equivalences("PCTEPOIISection1bis","GuiexSection1bis");
equivalences("PCTEPOIISection2","IntinstSection2");
equivalences("PCTEPOIISection3","IntinstSection3");
equivalences("PCTEPOIISection4","IntinstSection4");
equivalences("PCTEPOIIInternalSection1","GuiexInternalSection1","IntinstInternalSection1");
equivalences("PCTEPOIIInternalSection2","GuiexInternalSection2","IntinstInternalSection2");
equivalences("PCTEPOIIInternalSection3","GuiexInternalSection3","IntinstInternalSection3");
equivalences("PCTEPOIIInternalSection4","GuiexInternalSection4","IntinstInternalSection4");
equivalences("PCTEPOIIInternalChapter","GuiexInternalChapter");

module.exports = tihyLexer;

