// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "start$string$1", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "start$string$2", "symbols": [{"literal":"b"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "start", "symbols": ["start$string$1", "start$string$2"]}
]
  , ParserStart: "start"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
