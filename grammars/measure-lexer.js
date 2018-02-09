let {atom,regexp,Lexer,use} = require('../lib/lexer-tolerant.js');
let myRecipeLexer = new Lexer("myRecipeLexer");
use(myRecipeLexer);
atom("measure",{"volume":"","weight":"","number":""}).beforeSeparator().afterSeparator();
atom("number",regexp("[1-9][0-9]*"));
atom("weight",["number","space","weightunit"]).beforeSeparator().afterSeparator()
atom("weightunit",regexp("(g|kg|oz)")).standalone().beforeSeparator()
atom("volume",["number","space","volumeunit"]).beforeSeparator().afterSeparator()
atom("volumeunit",regexp("(l|ml)")).standalone().beforeSeparator()
atom("name",regexp("[a-z_]+")).beforeSeparator().afterSeparator();
atom("white",regexp("[ \\t\\n]+"));
atom("space",regexp("[ ]"));
atom("comma",regexp(",[ \\t\\n]+"));
atom("action",regexp("[A-Z]+"))
myRecipeLexer.setStart("recipe");
module.exports = myRecipeLexer;