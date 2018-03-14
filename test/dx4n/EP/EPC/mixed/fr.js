let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

// Article
atom("EPCShortArtNo",regexp("A[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("EPCShortArticle");
atom("EPCShortArtNoBisTer",regexp("A[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)")).afterSeparator().setGroup("EPCShortArticle");

// Rule
atom("EPCShortRuleNo",regexp("R[ \xa0][1-9][0-9]*")).afterSeparator().setGroup("EPCShortRule");
atom("EPCShortRuleNoBisTer",regexp("R[ \xa0][1-9][0-9]*(bis|ter|quater|quinquies)")).afterSeparator().setGroup("EPCShortRule");


module.exports = tihyLexer;
