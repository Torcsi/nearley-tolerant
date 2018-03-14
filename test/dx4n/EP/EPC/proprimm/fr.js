let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

//atom("EPCProtCentSectionNoSingle",regexp("[IVX]+"));
//atom("EPCProtCentSectionNoInternal",regexp("[Ss]ections?[ \xa0][IVX]+"));
//atom("EPCProtCentSectionNoExternal",regexp("Prot\\.[ \xa0]Centr\.[ \xa0][IVX]+"));
atom("EPCProtImmTitle",regexp("^Protocole sur les privilèges et immunités de l'Organisation européenne des brevets[\\s\\S]*$","s"));



module.exports = tihyLexer;
