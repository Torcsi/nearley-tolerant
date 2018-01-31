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
    {"name": "start", "symbols": [{"literal":"prefix"}, (lexer.has("foo") ? {type: "foo"} : foo), (lexer.has("bar") ? {type: "bar"} : bar)], "postprocess": function(data){ return interpreter.foobarStart(0,{"function":"foobarStart","foo":data[1],"bar":data[0],"any":[12.4,"abc",14],"some":"xxx"})}},
    {"name": "directFunction", "symbols": [(lexer.has("bar") ? {type: "bar"} : bar), (lexer.has("foo") ? {type: "foo"} : foo)], "postprocess": function(data){ return interpreter.start(data)}},
    {"name": "parametrizedFunction", "symbols": [(lexer.has("foo") ? {type: "foo"} : foo), (lexer.has("foo") ? {type: "foo"} : foo), (lexer.has("bar") ? {type: "bar"} : bar)], "postprocess": function(data){ return interpreter.parametrizedFunction(data[2],data[1],-1,"abc")},
    {"name": "noPostprocess", "symbols": [(lexer.has("bar") ? {type: "bar"} : bar), (lexer.has("bar") ? {type: "bar"} : bar)]},
    {"name": "choices", "symbols": [(lexer.has("bar") ? {type: "bar"} : bar), (lexer.has("bar") ? {type: "bar"} : bar)], "postprocess": function(data){ return interpreter.choice(data)}},
    {"name": "choices", "symbols": [(lexer.has("bar") ? {type: "bar"} : bar), (lexer.has("foo") ? {type: "foo"} : foo)], "postprocess": function(data){ return interpreter.choice(data)}},
    {"name": "choices", "symbols": [(lexer.has("bar") ? {type: "bar"} : bar), (lexer.has("foo") ? {type: "foo"} : foo)], "postprocess": function(data){ return interpreter.choice2(data)}},
    {"name": "choices", "symbols": [(lexer.has("bar") ? {type: "bar"} : bar), (lexer.has("foo") ? {type: "foo"} : foo)], "postprocess": function(data){ return interpreter.choice3(data)}},
    {"name": "noFuncNameSpecArray", "symbols": [(lexer.has("bar") ? {type: "bar"} : bar)], "postprocess": function(data){ return interpreter.noFuncNameSpecArray(data[1])},
    {"name": "noFuncNameSpecObject", "symbols": [(lexer.has("bar") ? {type: "bar"} : bar)], "postprocess": function(data){ return interpreter.noFuncNameSpecObject(0,{"bar":data[1]})}}
]
  , ParserStart: "start"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
