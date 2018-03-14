let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("OJIssue",regexp("([1-9][012]?|[1-9][012]*[-\u2011\xad][1-9][012]*)/"));
atom("OJBacklogYear",regexp("([1-9][0-9]{3}|200[1-9]|201[0123])")).overlaps("Number");
atom("PerOJBacklogYear",regexp("/([1-9][0-9]{3}|200[1-9]|201[0123])")).overlaps("Number");
atom("OJYear",regexp("(201[4-9]|20[23][0-9])")).overlaps("Number");
atom("OJYear2",regexp("[0-9]{2}")).setGroup("OJYear2").overlaps("Number").issue("hint","use 4 digit year");
atom("OJPerYear2",regexp("/[0-9]{2}")).setGroup("OJYear2").issue("hint","use 4 digit year");
atom("OJPageNo",regexp("[1-9][0-9]*"));
atom("OJArticleNo",regexp("A[1-9][0-9]*"));

equivalences("OJPageNo","number","OJBacklogYear","OJYear","OJYear2");
module.exports = tihyLexer;
