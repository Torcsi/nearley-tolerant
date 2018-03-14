let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("IntInstAnnexSection1Ref",regexp("^[1-9][0-9]*\\.\t.*$"));
atom("IntInstAnnexSection2Ref",regexp("^[1-9][0-9]*\\.[1-9][0-9]*\\.?\t.*$")).issueWhen(regexp("\\.\t"),true,". unnecessary before tab");
atom("IntInstAnnexSection3Ref",regexp("^[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.?\t.*$")).issueWhen(regexp("\\.\t"),true,". unnecessary before tab");
atom("IntInstAnnexSection4Ref",regexp("^[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.?\t.*$")).issueWhen(regexp("\\.\t"),true,". unnecessary before tab");
	
module.exports = tihyLexer;
