let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("IntInstAnnexRef",regexp("^Annexe\t.*$"));
atom("IntInstAnnexNoRef",regexp("^Annexe[ \xa0][1-9][ \xa0\t].*$"));
atom("IntInstSection1Ref",regexp("^[1-9][0-9]*\\.\t.*$"));
atom("IntInstSection2Ref",regexp("^[1-9][0-9]*\\.[0-9]+\\.?\t.*$")).issueWhen(regexp("\\.\t"),true,". unnecessary before tab");
atom("IntInstSection3Ref",regexp("^[1-9][0-9]*\\.[0-9]+\\.[0-9]+\\.?\t.*$")).issueWhen(regexp("\\.\t"),true,". unnecessary before tab");
atom("IntInstSection4Ref",regexp("^[1-9][0-9]*\\.[0-9]+\\.[0-9]+\\.[0-9]+\\.?\t.*$")).issueWhen(regexp("\\.\t"),true,". unnecessary before tab");
atom("IntInstSection5Ref",regexp("^[1-9][0-9]*\\.[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+\\.?\t.*$")).issueWhen(regexp("\\.\t"),true,". unnecessary before tab");

module.exports = tihyLexer;
