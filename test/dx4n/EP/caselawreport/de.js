let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("CaseLawSection5TocRef",regexp("^[a-z]\\)[\xa0\t].*$")).context({style:"TOC6"});
atom("CaseLawSection6TocRef",regexp("^[ivx]+\\)[\xa0\t].*$")).context({style:"TOC7"});

atom("CaseLawConcordanceTocRef",regexp("^LISTE DE CORRESPONDANCE.*$"));
atom("CaseLawForeword",regexp("^(Vorwort zur |VORWORT ZUR ).*$")).context({style:"TOC1"});
atom("CaseLawGuide",regexp("^(Hinweise für die Benutzung|HINWEISE FÜR DIE BENUTZUNG).*$")).context({style:"TOC1"});
atom("CaseLawHeadnotes",regexp("^(VORLAGEN|LEITSÄTZE DER STELLUNGNAHME|Leitsätze der Stellungnahme).*$")).context({style:"TOC1"});
atom("CaseLawAnnexes",regexp("^(ANHÄNGE|Anhänge).*$")).context({style:"TOC1"});
atom("CaseLawDetailedToc",regexp("^(DETAILLIERTES INHALTSVERZEICHNIS|Detailliertes Inhaltsverzeichnis).*$")).context({style:"TOC1"});
atom("CaseLawKeywordIndex",regexp("Stichwortverzeichnis")).context({style:"TOC1"});

equivalences("CaseLawSecion5Id","CaseLawSecion6Id");
equivalences("CaseLawKeywordIndex","EPCKeywordIndex");

module.exports = tihyLexer;
