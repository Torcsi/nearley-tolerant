let {atom,regexp,Lexer,use} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOGLTOCPartNo",regexp("(PARTIE|Parties?)[ \xa0][A-H]+.*$"));
atom("PCTEPOGLTOCChapterNo",regexp("(CHAPITRE|Chapitre)[ \xa0][IVX]+.*$"));
atom("PCTEPOGLTOCChapterAnnex",regexp("(CHAPITRE|Chapitre)[ \xa0][IVX]+[ \xa0][––][ \xa0][Aa]nnexe.*$"));
atom("PCTEPOGLTOCChapterAnnexNo",regexp("(CHAPITRE|Chapitre)[ \xa0][IVX]+[ \xa0][––][ \xa0][Aa]nnexe[ \xa0][1-9].*$"));
atom("PCTEPOGLTOCAnnexNo",regexp("^[Aa]nnexe[ \xa0][1-9].*$"));

atom("PCTEPOGLTOCSection1",regexp("^[1-9][0-9]*\\.*[^0-9].*$"));
atom("PCTEPOGLTOCSection2",regexp("^[1-9][0-9]*\\.*[1-9][0-9]*[^\\.].*$"));
atom("PCTEPOGLTOCSection3",regexp("^[1-9][0-9]*\\.*[1-9][0-9]*\\.*[1-9][0-9]*[^\\.].*$"));
atom("PCTEPOGLTOCSection4",regexp("^[1-9][0-9]*\\.*[1-9][0-9]\\.*[1-9][0-9]*\\.*[1-9][0-9]*[^\\.].*$"));


module.exports = tihyLexer;
