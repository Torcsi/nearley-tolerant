let {atom,regexp,Lexer,use} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("OJYear2",regexp("[0-9]{2}")).overlaps("Number").issue("warning","use 4 digit year");

/*
atom("OJWithYear",regexp("JO([ \xa0]OEB)?[ \xa0](20[2-9][0-9]|201[4-9])"));
atom("OJIssueWithYear",regexp("JO([ \xa0]OEB)?[ \xa0]([1-9][012]?|[1-9][012]*[-\u2011\xad][1-9][012]*)/(20[2-9][0-9]|201[4-9])"));
atom("OJSupplementIssueWithYear",regexp("([sS]upplément|[Pp]ublication supplémentaire)[ \xa0][1-9][0-9]*[ \xa0](du|au)[ \xa0](Journal officiel)[ \xa0](20[2-9][0-9]|201[4-9])")).context("margin",true,"warning","use the short form");
atom("OJSupplIssueWithYear",regexp("(Publ\.[ \xa0][Ss]uppl\.|[Ss]uppl\.)[ \xa0][1-9][0-9]*([ \xa0](du|au)|,)[ \xa0](JO([ \xa0]OEB)?)[ \xa0](20[2-9][0-9]|201[4-9])"));
atom("OJBacklogWithYear",regexp("(JO|Journal officiel([ \xa0]de l[’']OEB)?)([ \xa0]OEB)?[ \xa0](19[0-9]{2}|200[0-9]|201[0-3])"));
atom("OJBacklogIssueWithYear",regexp("(Journal officiel([ \xa0]de l[’']OEB)?|JO([ \xa0]OEB)?|J\\.O\\.)([ \xa0][Nn][o°º]?\\.?)?[ \xa0]([1-9][012]?|[1-9][012]*[-\u2011\xad][1-9][012]*)/(19[0-9]{2}|200[0-9]|201[0-3])"));
atom("OJBacklogIssueWithYear2",regexp("(Journal officiel([ \xa0]de l[’']OEB)?|JO([ \xa0]OEB)?|J\\.O\\.)([ \xa0][Nn][o°º]?\\.?)?[ \xa0]([1-9][012]?|[1-9][012]*[-\u2011\xad][1-9][012]*)/([789][0-9])"));
atom("OJBacklogSupplIssueWithYear",regexp("([sS]upplément|Supp\\.)[ \xa0]au[ \xa0]JO([ \xa0]OEB)?[ \xa0]((nº|no\\.?)[ \xa0])?([1-9][0-9]*)/(19[0-9]{2}|200[0-9]|201[0-3])"));
atom("OJBacklogSupplIssueNoWithYear",regexp("([sS]upplément|Supp\\.)[ \xa0](nº|no\\.?)[ \xa0]([1-9])[ \xa0]au[ \xa0]JO([ \xa0]OEB)?[ \xa0]([1-9][0-9]*)/(19[0-9]{2}|200[0-9]|201[0-3])"));
atom("OJBacklogSupplIssueNoWithYear1",regexp("([sS]upplément|Supp\\.)[ \xa0](nº|no\\.?)[ \xa0]([1-9])[ \xa0]au[ \xa0]JO([ \xa0]OEB)?[ \xa0]([1-9][0-9]*)/([0-9]{2})(?![0-9])"));
atom("OJReverseIssueWithYear",regexp("([1-9][012]?|[1-9][012]*[-\u2011\xad][1-9][012]*)/(19[0-9]{2}|200[0-9]|201[0-3])[ \xa0](du[ \xa0])?(JO([ \xa0]OEB)?|Journal[ \xa0]officiel([ \xa0]OEB)?)"));

//atom("test",regexp("(Journal officiel([ \xa0]de l[’']OEB)?)|JO([ \xa0]OEB)?)[ \xa0]([Nn][o°º]\.?[ \xa0])?"));

atom("OJBacklogNoIssueWithYear",regexp("nº ([1-9][012]?|[1-9][012]*[-\u2011\xad][1-9][012]*)/(19[0-9]{2}|200[0-9]|201[0-3])[ \xa0]du[ \xa0]Journal[ \xa0]officiel"));

atom("OJPublSupplNo",regexp("[Pp]ublication[ \xa0]supplémentaire[ \xa0][1-9][0-9]*"));
*/
module.exports = tihyLexer;
