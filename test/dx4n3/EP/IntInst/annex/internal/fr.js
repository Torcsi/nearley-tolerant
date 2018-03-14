let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("IntInstAnnexOfChapter",regexp("[Aa]nnexe[ \xa0]au[ \xa0]I([A-H])[-\u2011\xad–]([IVX]+)"));


atom("IntInstSeeAnnexChapter1",regexp("[Vv]oir[ \xa0][1-9][0-9]*(?!\\.)"));
atom("IntInstSeeAnnexChapter2",regexp("[Vv]oir[ \xa0][1-9][0-9]*\\.[1-9][0-9]*(?!\\.)"));
atom("IntInstSeeAnnexChapter3",regexp("[Vv]oir[ \xa0][1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*(?!\\.)"));
atom("IntInstSeeAnnexChapter4",regexp("[Vv]oir[ \xa0][1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*(?!\\.)"));

module.exports = tihyLexer;
