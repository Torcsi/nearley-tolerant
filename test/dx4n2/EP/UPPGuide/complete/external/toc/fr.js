let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("GuiAppTitle",regexp("^Protection uniforme et effets identiques$"));
atom("GuiAppAnnexTOC",regexp("^Annexes?[ \xa0][IVX]+.*$"));
atom("GuiAppChapterTOC",regexp("^[A-Z]\\.[\xa0\t].*$"));
atom("GuiAppSubchapterTOC",regexp("^[a-z]\\)[ \xa0\t].*$"));
atom("GuiAppNonNamedChapterTOC",regexp("^[A-ZÉ][a-zéù].*$")).context({style:"TOC3"});
module.exports = tihyLexer;
