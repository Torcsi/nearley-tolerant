let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCProtCentSectionNoSingle",regexp("[IVX]+"));
atom("EPCProtCentSectionNoInternal",regexp("[Ss]ections?[ \xa0][IVX]+"));
atom("EPCProtCentSectionNoExternal",regexp("Prot\\.[ \xa0]Centr\.[ \xa0][IVX]+"));
atom("EPCProtCentTitle",regexp("^Protocole[ \xa0]sur[ \xa0]la[ \xa0]centralisation[ \xa0]et[ \xa0]l'introduction[ \xa0]du[ \xa0]système[ \xa0]européen[ \xa0]des[ \xa0]brevets[\\s\\S]*$","s"));

equivalences("EPCProtCentSectionNoSingle","RomanUpper");

module.exports = tihyLexer;
