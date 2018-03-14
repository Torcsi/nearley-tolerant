let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("IntInstExternalPrefix",regexp("II/OEB[ \xa0]")).afterSeparator().beforeSeparator();

module.exports = tihyLexer;
