let {atom,regexp,Lexer,use} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("GuiexPointOfSection",regexp(",[ \xa0]point[ \xa0]\\(?[a-z]\\)"));

module.exports = tihyLexer;
