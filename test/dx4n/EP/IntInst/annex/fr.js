let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("IntInstSeeAnnexChapter1",regexp("[Vv]oir[ \xa0][1-9][0-9]*(?!\\.)"));
atom("IntInstSeeAnnexChapter2",regexp("[Vv]oir[ \xa0][1-9][0-9]*\\.[1-9][0-9]*(?!\\.)"));
atom("IntInstSeeAnnexChapter3",regexp("[Vv]oir[ \xa0][1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*(?!\\.)"));
atom("IntInstSeeAnnexChapter4",regexp("[Vv]oir[ \xa0][1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*(?!\\.)"));

module.exports = tihyLexer;
