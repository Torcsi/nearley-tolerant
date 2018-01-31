@{%
const moo = require("moo");

const lexer = moo.compile({
  foo:     /foo/,
  bar: /bar/
});

const interpreter = require("dummy-interpreter");
%}

# Pass your lexer object using the @lexer option:
@lexer lexer
@interpreter interpreter

start -> %foo %bar {%"start"%}
