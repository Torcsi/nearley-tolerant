let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("RDRRegulation",regexp("([rR]èglement en matière de discipline des mandataires agréés|RDMA)")).setGroup("RDRRegulation");
atom("RDRRegulationPostfix",regexp("[ \xa0]([rR]èglement en matière de discipline des mandataires agréés|RDMA)")).setGroup("RDRRegulation");

module.exports = tihyLexer;
