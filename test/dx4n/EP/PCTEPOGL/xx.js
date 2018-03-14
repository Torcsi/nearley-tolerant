let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOGLChapter",regexp("[A-H][-\u2011\xad–][IVX]+")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen"); // C-IV
atom("PCTEPOGLSection1",regexp("[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*[a-z]?(?!\\))")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // C-IV, 2; B-X 9
atom("PCTEPOGLSection1bis",regexp("[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*(bis|ter|quater)")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // C-IV, 2; B-X 9
atom("PCTEPOGLSection2",regexp("[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*\\.[1-9][0-9]*[a-z]?(?!\\))")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // C-IV, 2.3
atom("PCTEPOGLSection3",regexp("[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*[a-z]?(?!\\))")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // C-IV, 2.3.6
atom("PCTEPOGLSection4",regexp("[A-H][-\u2011\xad–][IVX]+,?[ \xa0]?[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*[a-z]?(?!\\))")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // C-IV, 2.3.6.5

atom("PCTEPOGLSectionBad1",regexp("[A-H][-\u2011\xad–][IVX]+\\.[1-9][0-9]*")).issue("warning","invalid '.' separator, separate section with comma-nonbreaking space"); // H-III.3
atom("PCTEPOGLSectionBad2",regexp("[A-H][-\u2011\xad–][IVX]+\\.[1-9][0-9]*\\.[1-9][0-9]*")).issue("warning","invalid '.' separator, separate section with comma-nonbreaking space"); // H-III.3

atom("PCTEPOGLInternalSection1",regexp("[1-9][0-9]*")).beforeSeparator().afterSeparator();
atom("PCTEPOGLInternalSection2",regexp("[1-9][0-9]*\\.[1-9][0-9]*")).beforeSeparator().afterSeparator();
atom("PCTEPOGLInternalSection3",regexp("[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*")).beforeSeparator().afterSeparator();
atom("PCTEPOGLInternalSection4",regexp("[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*")).beforeSeparator().afterSeparator();

atom("PCTEPOGLInternalChapter", regexp("[IVX]+"));

//equivalences("PCTEPOGLInternalSection1","number","ArtNoInSequence");
equivalences("PCTEPOGLInternalChapter","RomanUpper");
equivalences("PCTEPOGLChapter","GuiexChapter");
equivalences("PCTEPOGLSection1","GuiexSection1");
equivalences("PCTEPOGLSection1bis","GuiexSection1bis");
equivalences("PCTEPOGLSection2","GuiexSection2");
equivalences("PCTEPOGLSection3","GuiexSection3");
equivalences("PCTEPOGLSection4","GuiexSection4");
equivalences("PCTEPOGL","Guiex");
equivalences("PCTEPOGLSectionBad1","GuiexSectionBad1");
equivalences("PCTEPOGLSectionBad2","GuiexSectionBad2");
equivalences("PCTEPOGL","Guiex");
equivalences("PCTEPOGLInternalSection1","GuiexInternalSection1");
equivalences("PCTEPOGLInternalSection2","GuiexInternalSection2");
equivalences("PCTEPOGLInternalSection3","GuiexInternalSection3");
equivalences("PCTEPOGLInternalSection4","GuiexInternalSection4");
equivalences("PCTEPOGL","Guiex");
equivalences("PCTEPOGLInternalChapter","GuiexInternalChapter");

module.exports = tihyLexer;

