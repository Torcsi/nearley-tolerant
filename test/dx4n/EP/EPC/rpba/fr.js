let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);



atom("EPCRPBATitle",regexp("^Règlement de procédure des chambres de recours[\\s\\S]*$","s")).context("TOC1");



module.exports = tihyLexer;
