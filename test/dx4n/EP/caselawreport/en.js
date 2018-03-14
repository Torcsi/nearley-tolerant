let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("CaseLawSection5TocRef",regexp("^[a-z]\\)[\xa0\t].*$")).context({style:"TOC6"});
atom("CaseLawSection6TocRef",regexp("^[ivx]+\\)[\xa0\t].*$")).context({style:"TOC7"});

atom("CaseLawConcordanceTocRef",regexp("^CROSS-REFERENCE LIST.*$"));
atom("CaseLawForeword",regexp("^(Foreword to the |FOREWORD TO THE ).*$")).context({style:"TOC1"});
atom("CaseLawGuide",regexp("^(Reader's Guide|READER'S GUIDE).*$")).context({style:"TOC1"});
atom("CaseLawHeadnotes",regexp("^(REFERRALS TO THE|HEADNOTE OF OPINION|Headnote of opinion).*$")).context({style:"TOC1"});// is this the right place for Headnote of opinion?
atom("CaseLawAnnexes",regexp("^(ANNEXES|Annexes).*$")).context({style:"TOC1"});
atom("CaseLawDetailedToc",regexp("^(DETAILED TABLE OF CONTENTS|Detailed table of contents).*$")).context({style:"TOC1"});
atom("CaseLawKeywordIndex",regexp("General Index")).context({style:"TOC1"});

equivalences("CaseLawSecion5Id","CaseLawSecion6Id");
equivalences("CaseLawKeywordIndex","EPCKeywordIndex");

module.exports = tihyLexer;
