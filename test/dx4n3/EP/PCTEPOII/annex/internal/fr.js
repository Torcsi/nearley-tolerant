let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTEPOIIAnnexNo",regexp("([Ll]')?[Aa]nnexe[ \xa0]([IVX]+)"));
atom("PCTEPOIIChapitreNo1",regexp("[Cc]hapitre[ \xa0]([1-9][0-9]*)(?!\\.)"));
atom("PCTEPOIIChapitreNo2",regexp("[Cc]hapitre[ \xa0]([1-9][0-9]*)\\.([1-9][0-9]*)"));

module.exports = tihyLexer;
