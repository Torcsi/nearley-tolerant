@lexer measureLexer
start -> ingredient (moreIngredients | action )
moreIngredients -> (%comma ingredient):* 
ingredient -> %measure %space %name
action -> %action