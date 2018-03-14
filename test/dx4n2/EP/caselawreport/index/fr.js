let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("CaseLawReportTOCForeword",regexp("^Avant-propos.*$")).context({style:["TOC1","ITOC1"]});
//atom("CaseLawReportTOCGuide",regexp("^(Avertissement|AVERTISSEMENT).*$")).context({style:["TOC1","ITOC1"]});
atom("CaseLawReportTOCHeadWords",regexp("^(Sommaires des décisions|QUESTIONS SOUMISES À LA GRANDE CHAMBRE DE RECOURS|SOMMAIRE DE L'AVIS).*$")).context({style:["TOC1","ITOC1"]});
atom("CaseLawReportTOCListOfDecisions",regexp("^(Index des décisions citées|INDEX DES DÉCISIONS CITÉES).*$")).context({style:["TOC1","ITOC1"]});
atom("CaseLawReportTOCListOfProvisions",regexp("^(Liste des dispositions citées|LISTE DES DISPOSITIONS CITÉES).*$")).context({style:["TOC1","ITOC1"]});
atom("CaseLawReportTOCKeywords",regexp("^(Index alphabétique|INDEX ALPHABÉTIQUE)$")).context({style:["TOC1","ITOC1"]});
atom("CaseLawReportTOCDetailedTOC",regexp("^(Table des matières détaillée|TABLE DES MATIÈRES DÉTAILLÉE)$")).context({style:["TOC1","ITOC1"]});
atom("CaseLawReportTOCAnnexes",regexp("^(ANNEXES|Annexes)$")).context({style:["TOC1","ITOC1"]});

atom("CaseLawReportTOCPart",regexp("^[IVX]+\.[\t\xa0].*$")).context({style:["TOC1","ITOC1"]});
atom("CaseLawReportTOC",regexp("^$")).context({style:["TOC1","ITOC1"]});





module.exports = tihyLexer;
