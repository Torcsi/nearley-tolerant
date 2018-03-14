let {atom,regexp,Lexer,use} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("PCTTEPOGLTOCSecton1",regexp("^[1-9][0-9]*\\.\t.*$")).context({style:"TOC2"});
atom("PCTTEPOGLTOCSecton2",regexp("^[1-9][0-9]*\\.[1-9][0-9]*\t.*$")).context({style:"TOC3"});
atom("PCTTEPOGLTOCSecton3",regexp("^[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\t.*$")).context({style:"TOC4"});
atom("PCTTEPOGLTOCSecton4",regexp("^[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\t.*$")).context({style:"TOC5"});

module.exports = tihyLexer;
