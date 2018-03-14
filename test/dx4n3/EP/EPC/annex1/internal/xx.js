let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPC1973ArtPrefix",regexp("EPC1973Art[ \xa0]?"));
atom("EPC1973RefPrefix",regexp("EPC1973Reg[ \xa0]?"));
atom("EPCArtPrefix",regexp("EPCArt[ \xa0]?"));
atom("EPCRefPrefix",regexp("EPCReg[ \xa0]?"));

atom("EPCArtTextPrefix",regexp("Art\\.[ \xa0]:[ \xa0]"));
//atom("EPCRegTextPrefix",regexp("Art\\.[ \xa0]:[ \xa0]"));

module.exports = tihyLexer;
