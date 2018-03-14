let {atom,regexp,Lexer,use} = require('../../lib/lexer-tolerant.js');
let myRecipeLexer = new Lexer("myRecipeLexer");
use(myRecipeLexer);
atom("foo","foo");
atom("bar","bar");
myRecipeLexer.setStart("foo");
module.exports = myRecipeLexer;