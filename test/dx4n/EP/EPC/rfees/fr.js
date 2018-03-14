let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("EPCRFeesPointNo",regexp("[ \xa0]?(points?|no|n°)[ \xa0][1-9][0-9]*(bis|ter|quater)?"));
atom("EPCRFeesTitle",regexp("^(R[ÈE]GLEMENT RELATIF AUX TAXES)[\\s\\S]*$","s")).context("TOC1");



module.exports = tihyLexer;
