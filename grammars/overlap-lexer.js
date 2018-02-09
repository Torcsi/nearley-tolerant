let {atom,regexp,Lexer,use} = require('../lib/lexer-tolerant.js');
let myWeightLexer = new Lexer("myRecipeLexer");
use(myWeightLexer);
atom("number",regexp("[1-9][0-9]*")).substitute().overlaps("kgWeight").overlaps("gramWeight"); // substitute: return matched value
atom("space",regexp("[ ]"));
atom("comma",regexp(",[ \\t\\n]+"));
atom("g",regexp("[ ]*g"))
atom("kg",regexp("[ ]*kg"))
atom("gpl",regexp("[ ]*g/l"))
atom("gramWeight",["number"]).overlaps("kgWeight").overlaps("number")
atom("kgWeight",["number"]).substitute((m)=>(JSON.stringify(m)+":"+parseInt(m)*1000)).overlaps("gramWeight").overlaps("number")

module.exports = myWeightLexer;