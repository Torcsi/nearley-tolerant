let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTChapterRoman",regexp("[Cc]hapitre[s]?[ \xa0][IVX]+"));
atom("PCTPointRoman",regexp("point[s]?[ \xa0][ivx]+\\)"));
atom("PCTParagraphLettered",regexp("([Ll][’']|[Ll]es[ \xa0])?alinéa[s]?[ \xa0][a-z](-(bis|ter|quater))?\\)"));
atom("PCTParagraphNumbered",regexp("([Ll][’']|[Ll]es[ \xa0])?alinéa[s]?[ \xa0][0-9]\\)"));
atom("PCTSubparagraphLettered",regexp("sous.alinéas?[ \xa0][a-z]\\)"));
atom("PCTSubparagraphLetteredPostfix",regexp("[ \xa0]sous.alinéas?[ \xa0][a-z]\\)"));

atom("PCTRoman",regexp("[IVX]+"));

equivalences("PCTRoman","RomanUpper");

module.exports = tihyLexer;
