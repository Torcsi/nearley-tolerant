let {atom,regexp,Lexer,use} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("GuiexChapter",regexp("[A-H][-\u2011\xad][IVX]+")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen"); // C-IV
atom("GuiexSection1",regexp("[A-H][-\u2011\xad][IVX]+,?[ \xa0]?[1-9][0-9]*[a-z]?")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // C-IV, 2; B-X 9
atom("GuiexSection2",regexp("[A-H][-\u2011\xad][IVX]+,?[ \xa0]?[1-9][0-9]*\\.[1-9][0-9]*[a-z]?")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // C-IV, 2.3
atom("GuiexSection3",regexp("[A-H][-\u2011\xad][IVX]+,?[ \xa0]?[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*[a-z]?")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // C-IV, 2.3.6
atom("GuiexSection4",regexp("[A-H][-\u2011\xad][IVX]+,?[ \xa0]?[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*[a-z]?")).beforeSeparator().afterSeparator().issueWhen(regexp("-"),true,"warning","use non-breaking hyphen").issueWhen(regexp(" "),true,"warning","use non-breaking space").issueWhen(regexp("[ \xa0]"),false,"error","use non-breaking space").issueWhen(regexp(","),false,"error","use comma for separating sections"); // C-IV, 2.3.6.5

atom("GuiexSectionBad1",regexp("[A-H][-\u2011\xad][IVX]+\\.[1-9][0-9]*")).issue("warning","invalid '.' separator, separate section with comma-nonbreaking space"); // H-III.3
atom("GuiexSectionBad2",regexp("[A-H][-\u2011\xad][IVX]+\\.[1-9][0-9]*\\.[1-9][0-9]*")).issue("warning","invalid '.' separator, separate section with comma-nonbreaking space"); // H-III.3

module.exports = tihyLexer;
