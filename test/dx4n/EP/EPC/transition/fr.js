let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);



atom("EPCTransitionTitle",regexp("^Décision du Conseil d'administration du 28[ \xa0]juin[ \xa0]2001 relative aux dispositions transitoires[\\s\\S]*$","s")).context("TOC1");



module.exports = tihyLexer;
