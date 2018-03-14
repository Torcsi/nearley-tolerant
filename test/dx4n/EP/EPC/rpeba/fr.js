let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);



atom("EPCREPBATitle",regexp("^Règlement de procédure de la Grande Chambre de recours[\\s\\S]*$","s")).context("TOC1");



module.exports = tihyLexer;
