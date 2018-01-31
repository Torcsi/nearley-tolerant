// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

const moo = require("moo");

const lexer = moo.compile({
  foo:     /foo/,
  bar: /bar/
});

const interpreter = require("dummy-interpreter");
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "start", "symbols": [(lexer.has("foo") ? {type: "foo"} : foo), (lexer.has("bar") ? {type: "bar"} : bar)], "postprocess": function(data){ return interpreter.process({"foo":1,"bar":0})}}
]
  , ParserStart: "start"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
