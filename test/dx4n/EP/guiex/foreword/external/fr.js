let {atom,regexp,Lexer,use} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("GuiexGeneralPartPostfix",regexp("[ \xa0](de la )?partie générale des directives")).beforeSeparator();
atom("GuiexGeneralPartSection1",regexp("[Pp]oint[ \xa0][1-9][0-9]*[ \xa0](de la )?partie générale des directives")).afterSeparator().beforeSeparator();
atom("GuiexGeneralPartSection2",regexp("[Pp]oint[ \xa0][1-9][0-9]*\\.[1-9][0-9]*[ \xa0](de la )?partie générale des directives")).afterSeparator().beforeSeparator();

module.exports = tihyLexer;
