let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("UPPGuideAnnexNo",regexp("Annexes?[ \xa0][IVX]+"));
atom("UPPGuideAnnexNoAlone",regexp("[IVX]+"));
atom("UPPGuidePointNo",regexp("point[s]?[ \xa0][1-9][0-9]*(bis|ter|quater)?"));

equivalences("UPPGuideAnnexNoAlone","RomanUpper");
equivalences("UPPGuidePointNo","PointNo");

module.exports = tihyLexer;
