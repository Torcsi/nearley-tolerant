let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("GuiAppAnnexNo",regexp("Annexes?[ \xa0][IVX]+"));
atom("GuiAppAnnexNoAlone",regexp("[IVX]+"));
atom("GuiAppPointNo",regexp("point[s]?[ \xa0][1-9][0-9]*(bis|ter|quater)?"));
equivalences("GuiAppAnnexNoAlone","RomanUpper");
equivalences("GuiAppPointNo","PointNo");

module.exports = tihyLexer;
