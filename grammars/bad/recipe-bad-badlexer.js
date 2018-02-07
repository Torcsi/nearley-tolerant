// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

    let mylexer = function(){};
var grammar = {
    Lexer: mylexer,
    ParserRules: [
    {"name": "start", "symbols": ["ingredients"]},
    {"name": "start", "symbols": ["steps"]},
    {"name": "ingredients$ebnf$1$subexpression$1", "symbols": ["ingredient"]},
    {"name": "ingredients$ebnf$1", "symbols": ["ingredients$ebnf$1$subexpression$1"]},
    {"name": "ingredients$ebnf$1$subexpression$2", "symbols": ["ingredient"]},
    {"name": "ingredients$ebnf$1", "symbols": ["ingredients$ebnf$1", "ingredients$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ingredients", "symbols": [(mylexer.has("ingredients") ? {type: "ingredients"} : ingredients), "ingredients$ebnf$1"]},
    {"name": "ingredient", "symbols": [(mylexer.has("number") ? {type: "number"} : number), (mylexer.has("weight") ? {type: "weight"} : weight), (mylexer.has("name") ? {type: "name"} : name)]},
    {"name": "ingredient", "symbols": [(mylexer.has("number") ? {type: "number"} : number), (mylexer.has("volume") ? {type: "volume"} : volume), (mylexer.has("name") ? {type: "name"} : name)]},
    {"name": "steps$ebnf$1$subexpression$1", "symbols": ["step"]},
    {"name": "steps$ebnf$1", "symbols": ["steps$ebnf$1$subexpression$1"]},
    {"name": "steps$ebnf$1$subexpression$2", "symbols": ["step"]},
    {"name": "steps$ebnf$1", "symbols": ["steps$ebnf$1", "steps$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "steps", "symbols": [(mylexer.has("steps") ? {type: "steps"} : steps), "steps$ebnf$1"]},
    {"name": "step$subexpression$1", "symbols": ["steps"]},
    {"name": "step$subexpression$1", "symbols": ["sentence"]},
    {"name": "step", "symbols": [(mylexer.has("number") ? {type: "number"} : number), "step$subexpression$1"]},
    {"name": "sentence", "symbols": [(mylexer.has("verb") ? {type: "verb"} : verb), (mylexer.has("subject") ? {type: "subject"} : subject), "others"]},
    {"name": "others", "symbols": [(mylexer.has("preposition") ? {type: "preposition"} : preposition), (mylexer.has("name") ? {type: "name"} : name)]}
]
  , ParserStart: "start"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
