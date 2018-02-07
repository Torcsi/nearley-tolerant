@{%
let {atom,regexp,Lexer,use} = require('../../lib/lexer-tolerant.js');
let myRecipeLexer = new Lexer();
use(myRecipeLexer);
atom("ingredients","ingredients");
atom("steps","steps")
atom("number",regexp("[1-9][0-9]*"))
atom("weight",regexp("g|kg|oz"))
atom("name",regexp("[a-zA-Z]+"));
atom("verb",regexp("[a-zA-Z]+"));
atom("preposition",regexp("[a-zA-Z]+"));
atom("subject",["name"]);
// missing token "volume" required by grammar
%}
@lexer myRecipeLexer