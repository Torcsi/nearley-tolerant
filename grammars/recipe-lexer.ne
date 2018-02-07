@{%
let {atom,regexp,Lexer,use} = require('../lib/lexer-tolerant.js');
let myRecipeLexer = new Lexer("myRecipeLexer");
use(myRecipeLexer);
atom("recipe","RECIPE").standalone().overlaps("verb").beforeSeparator().afterSeparator();
atom("ingredients","INGREDIENTS").standalone().overlaps("verb").beforeSeparator().afterSeparator();
atom("steps","STEPS").standalone().overlaps("verb").beforeSeparator().afterSeparator()
atom("number",regexp("[1-9][0-9]*")).standalone()
atom("weight",regexp("(g|kg|oz)")).standalone().beforeSeparator().afterSeparator()
atom("volume",regexp("(l|ml)")).standalone().beforeSeparator().afterSeparator()
atom("name",regexp("[a-z_]+")).standalone().overlaps("subject").overlaps("preposition");
atom("verb",regexp("[A-Z]+")).standalone().overlaps("recipe").overlaps("ingredients").overlaps("steps").overlaps("preposition");
atom("preposition",regexp("[A-Z]+")).standalone().overlaps("subject").overlaps("verb");
atom("subject",["name"]).standalone().overlaps("name").overlaps("preposition");
atom("white",regexp("[ \\t\\n]+")).standalone();
myRecipeLexer.setStart("recipe");
%}
@lexer myRecipeLexer