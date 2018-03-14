let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("IntinstPartWithNo",regexp("[Pp]artie[ \xa0](I[A-H])")).afterSeparator().beforeSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
atom("IntinstAnnexWithNo",regexp("([aA]nnexe|An\\.|[Ll]'annexe)[ \xa0][IVX]+[a-z]?")).afterSeparator().beforeSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");
atom("IntinstAnnexWithNoPostfix",regexp("[ \xa0](de[ \xa0])?([aA]nnexe|An\\.|[Ll]'annexe)[ \xa0][IVX]+[a-z]?")).beforeSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space");


atom("IntInstAnnexVCPPrefix",regexp("PC[ \xa0\\-]")).beforeSeparator().afterSeparator();
atom("IntInstAnnexChapter1",regexp("[Cc]hapitre[s]?[ \xa0][1-9][0-9]*(?!\\.)"));
atom("IntInstAnnexChapter2",regexp("[Cc]hapitre[s]?[ \xa0][1-9][0-9]*\\.[1-9][0-9]*(?!\\.)"));
atom("IntInstAnnexChapter3",regexp("[Cc]hapitre[s]?[ \xa0][1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*(?!\\.)"));
atom("IntInstAnnexChapter4",regexp("[Cc]hapitre[s]?[ \xa0][1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*(?!\\.)"));


module.exports = tihyLexer;
