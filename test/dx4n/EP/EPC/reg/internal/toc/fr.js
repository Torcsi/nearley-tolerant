let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCChapterTOC",regexp("^Chapitre[\ \xa0]([IVX]+)[\\s\\S]*$","s")).context({style:"TOC2"});
atom("EPCSectionTOC",regexp("^Section[\ \xa0]([IVX]+)[\\s\\S]*$","s")).context({style:"TOC2"});
atom("EPCRuleTOC",regexp("^R.[ \xa0][1-9][0-9]*(bis|ter|quater)?[\\s\\S]*$","s")).context({style:"TOC3"});


module.exports = tihyLexer;
