let {atom,regexp,Lexer,use} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOIITOCPartNo",regexp("^(PARTIE|Parties?)[ \xa0][A-H]+.*$"));
atom("PCTEPOIITOCChapterNo",regexp("^(CHAPITRE|Chapitre)[ \xa0][IVX]+.\t*$"));
atom("PCTEPOIITOCChapterAnnex",regexp("^(CHAPITRE|Chapitre)[ \xa0][IVX]+[ \xa0][––][ \xa0][Aa]nnexe.*$"));
atom("PCTEPOIITOCChapterAnnexNo",regexp("^(CHAPITRE|Chapitre)[ \xa0][IVX]+[ \xa0][––][ \xa0][Aa]nnexe[ \xa0][1-9].*$"));
atom("PCTEPOIITOCAnnexNo",regexp("^[Aa]nnexe[ \xa0][1-9].*$"));

atom("PCTEPOIITOCSection1",regexp("^[1-9][0-9]*\\.*[^0-9].*$"));
atom("PCTEPOIITOCSection2",regexp("^[1-9][0-9]*\\.*[1-9][0-9]*[^\\.].*$"));
atom("PCTEPOIITOCSection3",regexp("^[1-9][0-9]*\\.*[1-9][0-9]*\\.*[1-9][0-9]*[^\\.].*$"));
atom("PCTEPOIITOCSection4",regexp("^[1-9][0-9]*\\.*[1-9][0-9]\\.*[1-9][0-9]*\\.*[1-9][0-9]*[^\\.].*$"));

atom("PCTEPOIITOCAnnexNo",regexp("^Annexe[ \xa0][1-9]\t.*$"));
atom("PCTEPOIITOCAnnex",regexp("^Annexe\t.*$"));
atom("PCTEPOIITOCForeword",regexp("^Avertissement"));

module.exports = tihyLexer;
