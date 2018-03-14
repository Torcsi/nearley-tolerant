let {atom,regexp,Lexer,use,equivalences} = require('../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("CaseLawReportTOCForeword",regexp("^Avant-propos.*$")).context({style:["TOC1","ITOC1"]});
//atom("CaseLawReportTOCGuide",regexp("^(Avertissement|AVERTISSEMENT).*$")).context({style:["TOC1","ITOC1"]});
atom("CaseLawReportTOCHeadWords",regexp("^(Sommaires des décisions|QUESTIONS SOUMISES À LA GRANDE CHAMBRE DE RECOURS|SOMMAIRE DE L'AVIS).*$")).context({style:["TOC1","ITOC1"]});
atom("CaseLawReportTOCListOfDecisions",regexp("^(Index des décisions citées|INDEX DES DÉCISIONS CITÉES).*$")).context({style:["TOC1","ITOC1"]});
atom("CaseLawReportTOCListOfProvisions",regexp("^(Liste des dispositions citées|LISTE DES DISPOSITIONS CITÉES).*$")).context({style:["TOC1","ITOC1"]});
atom("CaseLawReportTOCKeywords",regexp("^(Index alphabétique|INDEX ALPHABÉTIQUE).*$")).context({style:["TOC1","ITOC1"]});
atom("CaseLawReportTOCDetailedTOC",regexp("^(Table des matières détaillée|TABLE DES MATIÈRES DÉTAILLÉE)$")).context({style:["TOC1","ITOC1"]});
atom("CaseLawReportTOCAnnexes",regexp("^(ANNEXES|Annexes)$")).context({style:["TOC1","ITOC1"]});

atom("CaseLawReportTOCDecBoardD",regexp("^(Décisions de la Chambre de recours statuant en matière disciplinaire)$")).context({style:"TOC3"});
atom("CaseLawReportTOCDecBoardJ",regexp("^(Décisions de la Chambre de recours juridiques?)$")).context({style:"TOC3"});
atom("CaseLawReportTOCDecBoardT",regexp("^(Décisions des chambres de recours techniques)$")).context({style:"TOC3"});
atom("CaseLawReportTOCDecBoardR",regexp("^(Décisions de la Grande Chambre de recours concernant des requêtes en révision)$")).context({style:"TOC3"});
atom("CaseLawReportTOCDecBoardG",regexp("^(Décisions et avis de la Grande Chambre de recours concernant des saisines)$")).context({style:"TOC3"});
atom("CaseLawReportTOCPCT",regexp("^(PCT Réserves)$")).context({style:"TOC3"});

atom("CaseLawReportTOCPart",regexp("^[IVX]+\.[\t\xa0][\\s\\S]*$")).context({style:["TOC1","ITOC1"]});
atom("CaseLawReportTOCChapter",regexp("^[A-Z]+\.[ \t\xa0][\\s\\S]*$")).context({style:"TOC2"});
atom("CaseLawReportTOCPoint1",regexp("^[0-9]+\\.[ \t\xa0][\\s\\S]*$")).context({style:["TOC3","TOC2","TOC3a"]});
atom("CaseLawReportTOCPoint2",regexp("^[0-9]+\\.[0-9]+[ \t\xa0][\\s\\S]*$")).context({style:"TOC4"});
atom("CaseLawReportTOCPoint3",regexp("^[0-9]+\\.[0-9]+\\.[0-9]+[ \t\xa0][\\s\\S]*$")).context({style:"TOC5"});
atom("CaseLawReportTOCPoint4",regexp("^[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+[ \t\xa0][\\s\\S]*$")).context({style:"TOC6"});



module.exports = tihyLexer;
