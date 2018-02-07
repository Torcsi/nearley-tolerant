@include "recipe-lexer.ne"
@interpreter recipeInterpreter
start -> %recipe %white %name %white ingredients  steps
ingredients -> %ingredients %white ingredientlist
ingredientlist -> (ingredient):+
ingredient -> %number %white %weight %white %name %white | %number %white %volume %white %name %white
steps -> %steps (%white step):+
# step -> %number %white  (steps | sentence)
step -> %number %white sentence
# sentence -> %verb (%white  %subject others):?
# others -> (%white %preposition %white %name):?
sentence -> %verb %white %subject
