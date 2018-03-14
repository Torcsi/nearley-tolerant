let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("IntInstAnnexSection2",regexp("[1-9][0-9]*\\.[1-9][0-9]*")).afterSeparator().beforeSeparator();
atom("IntInstAnnexSection3",regexp("[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*")).afterSeparator().beforeSeparator();
atom("IntInstAnnexSection4",regexp("[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*")).afterSeparator().beforeSeparator();
	
equivalences("IntinstAnnexSection4","GuiexInternalSection4")
module.exports = tihyLexer;
