let {atom,regexp,Lexer,use} = require('../../lib/lexer-tolerant.js');
let myRecipeLexer = new Lexer("myRecipeLexer");
use(myRecipeLexer);
atom("measure",{"volume":"","weight":"","number":""}).substitute().beforeSeparator().afterSeparator();
atom("number",regexp("[1-9][0-9]*")).substitute();
atom("weightnumber",["number"]);
atom("weight",["weightnumber","space","weightunit"]).substitute((x)=>(x.weightnumber+"'"+x.weightunit)).beforeSeparator().afterSeparator()
atom("weightunit",regexp("(g|kg|oz)")).substitute().standalone().beforeSeparator()
atom("volumenumber",["number"]);
atom("volume",["volumenumber","space","volumeunit"]).substitute((x)=>(x.volumenumber+"'"+x.volumeunit)).beforeSeparator().afterSeparator()
atom("volumeunit",regexp("(l|ml)")).substitute().standalone().beforeSeparator()
atom("name",regexp("[a-z_]+")).substitute().beforeSeparator().afterSeparator();
atom("white",regexp("[ \\t\\n]+"));
atom("space",regexp("[ ]"));
atom("comma",regexp(",[ \\t\\n]+"));
atom("action",regexp("[A-Z]+"))
myRecipeLexer.setStart("measure");
module.exports = myRecipeLexer;