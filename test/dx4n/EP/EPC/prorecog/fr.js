let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

//atom("EPCProtCentSectionNoSingle",regexp("[IVX]+"));
//atom("EPCProtCentSectionNoInternal",regexp("[Ss]ections?[ \xa0][IVX]+"));
//atom("EPCProtCentSectionNoExternal",regexp("Prot\\.[ \xa0]Centr\.[ \xa0][IVX]+"));
atom("EPCProtRecTitle",regexp("^Protocole sur la compétence judiciaire et la reconnaissance[\\s\\S]*$","s"));



module.exports = tihyLexer;
