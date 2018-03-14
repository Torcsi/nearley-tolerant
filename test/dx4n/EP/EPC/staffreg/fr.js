let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);



atom("EPCStaffRefTitle",regexp("^Protocole sur les effectifs de l'Office européen des brevets[\\s\\S]*$","s")).context("TOC1");



module.exports = tihyLexer;
