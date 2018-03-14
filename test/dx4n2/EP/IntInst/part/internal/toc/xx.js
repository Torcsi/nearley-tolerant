let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("IntInstSection1Ref",regexp("^[1-9][0-9]*\\.\t.*$")).context({style:"TOC3"});
atom("IntInstSection2Ref",regexp("^[1-9][0-9]*\\.[0-9]+\\.?\t.*$")).issueWhen(regexp("\\.\t"),true,". unnecessary before tab").context({style:"TOC4"});
atom("IntInstSection3Ref",regexp("^[1-9][0-9]*\\.[0-9]+\\.[0-9]+\\.?\t.*$")).issueWhen(regexp("\\.\t"),true,". unnecessary before tab").context({style:"TOC5"});
atom("IntInstSection4Ref",regexp("^[1-9][0-9]*\\.[0-9]+\\.[0-9]+\\.[0-9]+\\.?\t.*$")).issueWhen(regexp("\\.\t"),true,". unnecessary before tab").context({style:"TOC6"});
atom("IntInstSection5Ref",regexp("^[1-9][0-9]*\\.[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+\\.?\t.*$")).issueWhen(regexp("\\.\t"),true,". unnecessary before tab").context({style:"TOC7"});

module.exports = tihyLexer;
