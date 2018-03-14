let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("CaseLawSection5TocRef",regexp("^[a-z]\\)[\xa0\t].*$")).context({style:"TOC6"});
atom("CaseLawSection6TocRef",regexp("^[ivx]+\\)[\xa0\t].*$")).context({style:"TOC7"});

atom("CaseLawConcordanceTocRef",regexp("^LISTE DE CORRESPONDANCE.*$"));
atom("CaseLawForeword",regexp("^(Avant.propos de la.*|AVANT.PROPOS DE LA).*$")).context({style:"TOC1"});
atom("CaseLawGuide",regexp("^(Avertissement|AVERTISSEMENT).*$")).context({style:"TOC1"});
atom("CaseLawHeadnotes",regexp("^(QUESTIONS SOUMISES|SOMMAIRE DE L'AVIS|Sommaire de l'avis).*$")).context({style:"TOC1"});
atom("CaseLawAnnexes",regexp("^(ANNEXES|Annexes).*$")).context({style:"TOC1"});
atom("CaseLawDetailedToc",regexp("^(TABLE DES MAT|Table des mat).*$")).context({style:"TOC1"});
atom("CaseLawKeywordIndex",regexp("Index alphabétique")).context({style:"TOC1"});


atom("CaseLawPoint1",regexp("(chapitre|point)s?[ \xa0]([1-9][0-9]*)(?!\\.)")).setGroup("CaseLawPoint1");
atom("CaseLawPoint1Dot",regexp("(chapitre|point)s?[ \xa0]([1-9][0-9]*\\.)(?![0-9])")).setGroup("CaseLawPoint1");
atom("CaseLawPoint2",regexp("(chapitre|point)s?[ \xa0]([1-9][0-9]*)\\.([1-9][0-9]*)(?!\\.)")).setGroup("CaseLawPoint2");
atom("CaseLawPoint2Dot",regexp("(chapitre|point)s?[ \xa0]([1-9][0-9]*)\\.([1-9][0-9]*\\.)(?![0-9])")).setGroup("CaseLawPoint2");
atom("CaseLawPoint3",regexp("(chapitre|point)s?[ \xa0]([1-9][0-9]*)\\.([1-9][0-9]*)\\.([1-9][0-9]*)(?!\\.)"));
atom("CaseLawPoint4",regexp("(chapitre|point)s?[ \xa0]([1-9][0-9]*)\\.([1-9][0-9]*)\\.([1-9][0-9]*)\\.([1-9][0-9]*)(?!\\.)"));


equivalences("CaseLawSecion5Id","CaseLawSecion6Id");
equivalences("CaseLawKeywordIndex","EPCKeywordIndex");
equivalences("CaseLawPoint1","PointNo");

module.exports = tihyLexer;
