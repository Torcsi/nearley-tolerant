@{%
const moo = require("moo");
const lexer = moo.compile({
  foo:     /foo/,
  bar: /bar/
});
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

start -> %foo %bar
