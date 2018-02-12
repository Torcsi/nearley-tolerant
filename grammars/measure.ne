@lexer measureLexer
start -> ingredient moreIngredients actions {%"repeat"%}
actions -> action:*
moreIngredients -> (%comma ingredient):* 
ingredient -> %measure %space %name {%{ "function": "unit","unitType":"ingredient", "fields":{"measure":0,"name":2} }%}
action -> %action