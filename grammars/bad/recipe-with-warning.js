// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

let {atom,regexp,Lexer,use} = require('../lib/lexer-tolerant.js');
let myRecipeLexer = new Lexer("myRecipeLexer");
use(myRecipeLexer);
atom("recipe","RECIPE").standalone().overlaps("verb").beforeSeparator().afterSeparator();
atom("ingredients","INGREDIENTS").standalone().overlaps("verb").beforeSeparator().afterSeparator();
atom("steps","STEPS").standalone().overlaps("verb").beforeSeparator().afterSeparator()
atom("number",regexp("[1-9][0-9]*")).standalone()
atom("weight",regexp("(g|kg|oz)")).standalone().beforeSeparator().afterSeparator()
atom("volume",regexp("(l|ml)")).standalone().beforeSeparator().afterSeparator()
atom("name",regexp("[a-z_]+")).standalone().overlaps("subject").overlaps("preposition");
atom("verb",regexp("[A-Z]+")).standalone().overlaps("recipe").overlaps("ingredients").overlaps("steps").overlaps("preposition");
atom("preposition",regexp("[A-Z]+")).standalone().overlaps("subject").overlaps("verb");
atom("subject",["name"]).standalone().overlaps("name").overlaps("preposition");
atom("white",regexp("[ \\t\\n]+")).standalone();
myRecipeLexer.setStart("recipe");
var grammar = {
    Lexer: myRecipeLexer,
    ParserRules: [
    {"name": "start", "symbols": ["ingredients"]},
    {"name": "start", "symbols": ["steps"]},
    {"name": "ingredients$ebnf$1$subexpression$1", "symbols": ["ingredient"]},
    {"name": "ingredients$ebnf$1", "symbols": ["ingredients$ebnf$1$subexpression$1"]},
    {"name": "ingredients$ebnf$1$subexpression$2", "symbols": ["ingredient"]},
    {"name": "ingredients$ebnf$1", "symbols": ["ingredients$ebnf$1", "ingredients$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ingredients", "symbols": [(myRecipeLexer.has("ingredients") ? {type: "ingredients"} : ingredients), "ingredients$ebnf$1"]},
    {"name": "ingredient", "symbols": [(myRecipeLexer.has("number") ? {type: "number"} : number), (myRecipeLexer.has("weight") ? {type: "weight"} : weight), (myRecipeLexer.has("name") ? {type: "name"} : name)]},
    {"name": "ingredient", "symbols": [(myRecipeLexer.has("number") ? {type: "number"} : number), (myRecipeLexer.has("volume") ? {type: "volume"} : volume), (myRecipeLexer.has("name") ? {type: "name"} : name)]},
    {"name": "steps$ebnf$1$subexpression$1", "symbols": ["step"]},
    {"name": "steps$ebnf$1", "symbols": ["steps$ebnf$1$subexpression$1"]},
    {"name": "steps$ebnf$1$subexpression$2", "symbols": ["step"]},
    {"name": "steps$ebnf$1", "symbols": ["steps$ebnf$1", "steps$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "steps", "symbols": [(myRecipeLexer.has("steps") ? {type: "steps"} : steps), "steps$ebnf$1"]},
    {"name": "step$subexpression$1", "symbols": ["steps"]},
    {"name": "step$subexpression$1", "symbols": ["sencence"]},
    {"name": "step", "symbols": [(myRecipeLexer.has("number") ? {type: "number"} : number), "step$subexpression$1"]},
    {"name": "sentence", "symbols": [(myRecipeLexer.has("verb") ? {type: "verb"} : verb), (myRecipeLexer.has("subject") ? {type: "subject"} : subject), "others"]},
    {"name": "others", "symbols": [(myRecipeLexer.has("preposition") ? {type: "preposition"} : preposition), (myRecipeLexer.has("name") ? {type: "name"} : name)]}
]
  , ParserStart: "start"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
