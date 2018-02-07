let {atom,regexp,Lexer,use} = require('../../lib/lexer-tolerant.js');
let myRecipeLexer = new Lexer("myRecipeLexer");
use(myRecipeLexer);
atom("recipe","recipe");
atom("ingredients","ingredients");
atom("steps","steps")
atom("number",regexp("[1-9][0-9]*"))
atom("weight",regexp("g|kg|oz"))
atom("volume",regexp("l|ml"))
atom("name",regexp("[a-zA-Z]+"));
atom("verb",regexp("[a-zA-Z]+"));
//atom("preposition",regexp("[a-zA-Z]+"));
atom("subject",["name"]);
atom("white",regexp("[ \\t\\n]+"));
module.exports = myRecipeLexer;