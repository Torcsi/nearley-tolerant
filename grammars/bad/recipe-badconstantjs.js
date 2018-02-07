// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

    syntactically not js code
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "start", "symbols": ["ingredients"]},
    {"name": "start", "symbols": ["steps"]},
    {"name": "ingredients$ebnf$1$subexpression$1", "symbols": ["ingredient"]},
    {"name": "ingredients$ebnf$1", "symbols": ["ingredients$ebnf$1$subexpression$1"]},
    {"name": "ingredients$ebnf$1$subexpression$2", "symbols": ["ingredient"]},
    {"name": "ingredients$ebnf$1", "symbols": ["ingredients$ebnf$1", "ingredients$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ingredients", "symbols": [ingredients, "ingredients$ebnf$1"]},
    {"name": "ingredient", "symbols": [number, weight, name]},
    {"name": "ingredient", "symbols": [number, volume, name]},
    {"name": "steps$ebnf$1$subexpression$1", "symbols": ["step"]},
    {"name": "steps$ebnf$1", "symbols": ["steps$ebnf$1$subexpression$1"]},
    {"name": "steps$ebnf$1$subexpression$2", "symbols": ["step"]},
    {"name": "steps$ebnf$1", "symbols": ["steps$ebnf$1", "steps$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "steps", "symbols": [steps, "steps$ebnf$1"]},
    {"name": "step$subexpression$1", "symbols": ["steps"]},
    {"name": "step$subexpression$1", "symbols": ["sentence"]},
    {"name": "step", "symbols": [number, "step$subexpression$1"]},
    {"name": "sentence", "symbols": [verb, subject, "others"]},
    {"name": "others", "symbols": [preposition, name]}
]
  , ParserStart: "start"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
