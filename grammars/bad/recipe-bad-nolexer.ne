@{%
    let a = "123";
    let mylexer = function(){};
%}
start -> ingredients | steps
ingredients -> %ingredients (ingredient):+
ingredient -> %number %weight %name | %number %volume %name
steps -> %steps (step):+
step -> %number (steps | sentence)
sentence -> %verb %subject others
others -> %preposition %name