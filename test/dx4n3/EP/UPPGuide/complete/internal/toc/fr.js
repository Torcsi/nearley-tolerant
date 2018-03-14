let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("UPPGuideTOCPart",regexp("^[A-Z]\.\t.*$")).constraint({style:"TOC1"});
atom("UPPGuideTOCChapter",regexp("^[IVX]+\.\t.*$")).constraint({style:"TOC2"});
atom("UPPGuideTOCSubchapter",regexp("^.*$")).constraint({style:"TOC3"});
module.exports = tihyLexer;
