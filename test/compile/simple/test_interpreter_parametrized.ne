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

start -> "prefix" %foo %bar {%{"function":"foobarStart","foo":1,"bar":0,"any":[12.4,"abc",14],"some":"xxx"}%} # call interpreter.foobarstart({"foo":data[1],"bar":data[0]})
directFunction -> %bar %foo {%"start"%} # call a simple function interpreter.start
parametrizedFunction -> %foo %foo %bar {%[2,1,-1,"abc"]%}
noPostprocess -> %bar %bar
choices -> %bar %bar {%"choice"%} | %bar %foo {%"choice"%}
choices -> %bar %foo {%"choice2"%} | %bar %foo {%"choice3"%}
noFuncNameSpecArray -> %bar {%[1]%}
noFuncNameSpecObject -> %bar {%{"bar":1}%}
