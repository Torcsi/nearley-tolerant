let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("EQERegulation",regexp("(règlement relatif à l[’']examen européen de qualification|REE)")).setGroup("EQERegulation");
atom("EQERegulationPostfix",regexp("[ \xa0](règlement relatif à l[’']examen européen de qualification|REE)")).setGroup("EQERegulation");
atom("EQERegulationExecution",regexp("(dispositions d'exécution du REE|dispositions d'exécution du règlement relatif à l'examen européen de qualification|DEREE)")).setGroup("EQERegulationExecution");
atom("EQERegulationExecutionPostfix",regexp("[ \xa0](dispositions d'exécution du REE|dispositions d'exécution du règlement relatif à l'examen européen de qualification|DEREE)")).setGroup("EQERegulationExecution");

atom("EQEParagraphNo",regexp("[ \xa0]?(par\\.|[Pp]aragraphe[s]?|PARAGRAPHE[S]?)[ \xa0]([1-9]|\\([1-9]\\))")).setGroup("EPCParagraphNo");

equivalences("EQEParagraphNo","ParagraphNo");

module.exports = tihyLexer;
