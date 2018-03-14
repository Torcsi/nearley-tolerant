let {atom,regexp,Lexer,use} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EPC",regexp("(EPC([ \xa0](2000|1973))?|[Cc]onvention)"));
//atom("Foreword",regexp("Foreword"));

module.exports = tihyLexer;
