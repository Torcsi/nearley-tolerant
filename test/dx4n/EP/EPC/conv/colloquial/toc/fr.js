let {atom,regexp,Lexer,use} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPCTitle",regexp("^Convention[ \xa0]sur[ \xa0]la[ \xa0]délivrance[ \xa0]de[ \xa0]brevets[ \xa0]européens[\\r\\n].*$","s")).context({style:"TOC1"});

module.exports = tihyLexer;
