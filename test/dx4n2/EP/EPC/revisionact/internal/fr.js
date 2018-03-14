let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("EPCRevisionActInternalArticle1",regexp("[Ll]['’]article[ \xa0]premier"));

module.exports = tihyLexer;
