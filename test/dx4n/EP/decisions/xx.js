let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("DecisionNo19XX",regexp("[TJRWGD][ \xa0][1-9][0-9]*/[789][0-9]")).issueWhen(regexp(" "),true,"use non-breaking space").setGroup("DecisionNo");
atom("DecisionNo1999",regexp("[TJRWGD][ \xa0][1-9][0-9]*/19[789][0-9]")).issueWhen(regexp(" "),true,"use non-breaking space").setGroup("DecisionNo");
atom("DecisionNo20XX",regexp("[TJRWGD][ \xa0][1-9][0-9]*/[012][0-9]")).issueWhen(regexp(" "),true,"use non-breaking space").setGroup("DecisionNo");
atom("DecisionNo2000",regexp("[TJRWGD][ \xa0][1-9][0-9]*/20[012][0-9]")).issueWhen(regexp(" "),true,"use non-breaking space").setGroup("DecisionNo");

atom("DecisionMissingYear",regexp("[TJRWGD][ \xa0][1-9][0-9]*")).issue("warning","year missing from decision");
module.exports = tihyLexer;
