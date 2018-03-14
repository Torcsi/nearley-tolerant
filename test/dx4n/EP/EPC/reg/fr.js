let {atom,regexp,Lexer,use} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCRegTitle",regexp("^Règlement[ \xa0]d'exécution[ \xa0]de[ \xa0]la[ \xa0]Convention[ \xa0]sur[ \xa0]la[ \xa0]délivrance[ \xa0]de[ \xa0]brevet[ \xa0]européens[\\s\\S]*$","s")).context({style:"TOC1"});
module.exports = tihyLexer;
