let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("ISPEChapter",regexp("^Chapitre[ \xa0][0-9]+[\\s\\S]*$")).context({style:"TOC2"});
atom("ISPEChapterAnnex",regexp("^Annexe du chapitre[ \xa0][0-9]+[\\s\\S]*$")).context({style:"TOC2"}).setGroup("ISPEChapterAnnex");
atom("ISPEChapterAnnexA",regexp("^A[0-9]\xa0[\\s\\S]*$")).context({style:"TOC2"}).setGroup("ISPEChapterAnnex");
atom("ISPESubchapter1",regexp("[A]?[1-9][--][A-Z][\xa0].*$")).context({style:"TOC3"});
atom("ISPESubchapter2",regexp("[A]?[1-9][--][A-Z][--][1-9].*$")).context({style:"TOC4"});
atom("ISPESubchapter3",regexp("[1-9][0-9]*\\. .*$")).context({style:"TOC4"});


module.exports = tihyLexer;
