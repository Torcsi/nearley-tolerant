@include "../recipe-lexer.ne"

start -> ingredients | steps
ingredients -> %ingredients (ingredient):+
ingredient -> %number %weight %name | %number %volume %name
steps -> %steps (step):+
step -> %number (steps | sencence)
sentence -> %verb %subject others
others -> %preposition %name