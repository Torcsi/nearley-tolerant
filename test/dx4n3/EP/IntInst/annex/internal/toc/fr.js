let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("IntInstAnnexPCRef",regexp("^PC-[1-9][0-9]*[ \xa0]*:\t.*$"));
	
module.exports = tihyLexer;
