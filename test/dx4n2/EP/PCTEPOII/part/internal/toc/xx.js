let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOIITOCSection1",regexp("^[1-9][0-9]*\\.\t.*$")).context({style:"TOC2"});
atom("PCTEPOIITOCSection2",regexp("^([1-9][0-9]*)\\.([1-9][0-9]*)\t.*$")).context({style:"TOC3"});
atom("PCTEPOIITOCSection3",regexp("^([1-9][0-9]*)\\.([1-9][0-9]*)\\.([1-9][0-9]*)\\.?\t.*$")).context({style:"TOC4"}).issueWhen(regexp("\\.\t"),true,"hint","unnecessary dot before tab");
atom("PCTEPOIITOCSection4",regexp("^([1-9][0-9]*)\\.([1-9][0-9]*)\.([1-9][0-9]*)\\.([1-9][0-9]*)\\.?\t.*$")).context({style:"TOC5"}).issueWhen(regexp("\\.\t"),true,"hint","unnecessary dot before tab");

module.exports = tihyLexer;
