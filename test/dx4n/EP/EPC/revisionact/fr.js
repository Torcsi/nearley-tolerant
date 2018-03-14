let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("EPCRevisionActPostfix",regexp(" de l'[Aa]cte (de|portant) révision( de la CBE([ \xa0]1973)?)?"));
atom("EPCRevisionActTitle",regexp("^Acte portant révision de la Convention sur la délivrance de brevets européens[\\s\\S]*$","s")).context("TOC1");



module.exports = tihyLexer;
