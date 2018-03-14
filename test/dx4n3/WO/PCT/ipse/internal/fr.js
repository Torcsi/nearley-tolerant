let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("ISPETOCPartNo",regexp("(PREMIÈRE|(DEUX|TROIS|QUATR|CINQU|SIX|SEPT|HUIT|NEUV|DIX|ONZ|DOUZ)IÈME)[ \xa0]PARTIE[\\s\\S]*$"));


module.exports = tihyLexer;
