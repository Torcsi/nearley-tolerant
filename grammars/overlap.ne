@lexer overlapLexer
start -> weight (%comma weight):*
weight -> %gramWeight %g | %kgWeight %kg | %number %gpl
