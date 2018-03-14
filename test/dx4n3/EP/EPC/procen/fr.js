let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("EPCProCenNo",regexp("Prot.[ \xa0]Centr.[ \xa0]([IVX]+)"));
atom("EPCProCenSectionNo",regexp("([IVX]+)"));
equivalences("EPCProCenSectionNo","RomanUpper")

equivalences("EPCIntroduction","Introduction")
module.exports = tihyLexer;
