let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("GuiexInternalChapterWithNo",regexp("([Cc]hapitres?)[ \xa0][IVX]+"));
atom("GuiexPointWithNo",regexp("(lettre[s]?|points?)[ \xa0]\\(?[a-z]\\)")).afterSeparator().issueWhen(regexp(" "),true,"hint","use non-breaking space").issueWhen(regexp("\\("),true,"hint","( not necessary");

module.exports = tihyLexer;
