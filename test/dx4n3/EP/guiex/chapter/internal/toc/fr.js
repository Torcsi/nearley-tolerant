let {atom,regexp,Lexer,use} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("GuiexTOCPartNo",regexp("(PARTIE|Partie)[ \xa0][A-H]+.*$"));
atom("GuiexTOCChapterNo",regexp("(CHAPITRE|Chapitre)[ \xa0][IVX]+.*$"));
atom("GuiexTOCChapterAnnex",regexp("(CHAPITRE|Chapitre)[ \xa0][IVX]+[ \xa0][––][ \xa0][Aa]nnexe.*$"));
atom("GuiexTOCChapterAnnexNo",regexp("(CHAPITRE|Chapitre)[ \xa0][IVX]+[ \xa0][––][ \xa0][Aa]nnexe[ \xa0][1-9].*$"));
atom("GuiexTOCAnnexNo",regexp("^[Aa]nnexe[ \xa0][1-9].*$"));
atom("GuiexTOCAnnex",regexp("^(-[ \xa0])?[Aa]nnexe[ \xa0]*[\u2003\t].*$"));


atom("GuiexTOCSection1",regexp("^[1-9][0-9]*\\.*[^0-9].*$"));
atom("GuiexTOCSection2",regexp("^[1-9][0-9]*\\.*[1-9][0-9]*[^\\.].*$"));
atom("GuiexTOCSection3",regexp("^[1-9][0-9]*\\.*[1-9][0-9]*\\.*[1-9][0-9]*[^\\.].*$"));
atom("GuiexTOCSection4",regexp("^[1-9][0-9]*\\.*[1-9][0-9]\\.*[1-9][0-9]*\\.*[1-9][0-9]*[^\\.].*$"));

atom("GuiexPointWithNo",regexp("points?[ \xa0]\\(?[a-z]\\)")).afterSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space").issueWhen(regexp("\\("),true,"hint","( not necessary");

module.exports = tihyLexer;
