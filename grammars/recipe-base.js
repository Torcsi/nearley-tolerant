// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

let {atom,regexp,Lexer,use} = require('../lib/lexer-tolerant.js');
let myRecipeLexer = new Lexer("myRecipeLexer");
use(myRecipeLexer);
atom("recipe","RECIPE").standalone().overlaps("verb");
atom("ingredients","INGREDIENTS").standalone().overlaps("verb");
atom("steps","STEPS").standalone().overlaps("verb")
atom("number",regexp("[1-9][0-9]*")).standalone()
atom("weight",regexp("g|kg|oz")).standalone()
atom("volume",regexp("l|ml")).standalone()
atom("name",regexp("[a-z_]+")).standalone().overlaps("subject").overlaps("preposition");
atom("verb",regexp("[A-Z]+")).standalone().overlaps("recipe").overlaps("ingredients").overlaps("steps").overlaps("preposition");
atom("preposition",regexp("[A-Z]+")).standalone().overlaps("subject").overlaps("verb");
atom("subject",["name"]).standalone().overlaps("name").overlaps("preposition");
atom("white",regexp("[ \\t\\n]+")).standalone();
myRecipeLexer.setStart("recipe");
var grammar = {
    Lexer: myRecipeLexer,
    ParserRules: [
    {"name": "start", "symbols": [(myRecipeLexer.has("recipe") ? {type: "recipe"} : recipe), (myRecipeLexer.has("white") ? {type: "white"} : white), (myRecipeLexer.has("name") ? {type: "name"} : name), (myRecipeLexer.has("white") ? {type: "white"} : white), "ingredients", "steps"]},
    {"name": "ingredients$ebnf$1$subexpression$1", "symbols": ["ingredient"]},
    {"name": "ingredients$ebnf$1", "symbols": ["ingredients$ebnf$1$subexpression$1"], "postprocess": ["null"]},
    {"name": "ingredients$ebnf$1$subexpression$2", "symbols": ["ingredient"]},
    {"name": "ingredients$ebnf$1", "symbols": ["ingredients$ebnf$1", "ingredients$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ingredients", "symbols": [(myRecipeLexer.has("ingredients") ? {type: "ingredients"} : ingredients), (myRecipeLexer.has("white") ? {type: "white"} : white), "ingredients$ebnf$1"]},
    {"name": "ingredient", "symbols": [(myRecipeLexer.has("number") ? {type: "number"} : number), (myRecipeLexer.has("white") ? {type: "white"} : white), (myRecipeLexer.has("weight") ? {type: "weight"} : weight), (myRecipeLexer.has("white") ? {type: "white"} : white), (myRecipeLexer.has("name") ? {type: "name"} : name), (myRecipeLexer.has("white") ? {type: "white"} : white)]},
    {"name": "ingredient", "symbols": [(myRecipeLexer.has("number") ? {type: "number"} : number), (myRecipeLexer.has("white") ? {type: "white"} : white), (myRecipeLexer.has("volume") ? {type: "volume"} : volume), (myRecipeLexer.has("white") ? {type: "white"} : white), (myRecipeLexer.has("name") ? {type: "name"} : name), (myRecipeLexer.has("white") ? {type: "white"} : white)]},
    {"name": "steps$ebnf$1$subexpression$1", "symbols": [(myRecipeLexer.has("white") ? {type: "white"} : white), "step"]},
    {"name": "steps$ebnf$1", "symbols": ["steps$ebnf$1$subexpression$1"], "postprocess": ["null"]},
    {"name": "steps$ebnf$1$subexpression$2", "symbols": [(myRecipeLexer.has("white") ? {type: "white"} : white), "step"]},
    {"name": "steps$ebnf$1", "symbols": ["steps$ebnf$1", "steps$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "steps", "symbols": [(myRecipeLexer.has("steps") ? {type: "steps"} : steps), "steps$ebnf$1"]},
    {"name": "step", "symbols": [(myRecipeLexer.has("number") ? {type: "number"} : number), (myRecipeLexer.has("white") ? {type: "white"} : white), "sentence"]},
    {"name": "sentence", "symbols": [(myRecipeLexer.has("verb") ? {type: "verb"} : verb), (myRecipeLexer.has("white") ? {type: "white"} : white), (myRecipeLexer.has("subject") ? {type: "subject"} : subject)]}
]
  , ParserStart: "start"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar1 = grammar;
}
})();
