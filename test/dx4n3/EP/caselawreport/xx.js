let {atom,regexp,Lexer,use,equivalences} = require('../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);

atom("CaseLawPart",regexp("[IVX]+")).beforeSeparator().afterSeparator();
atom("CaseLawChapterA",regexp("[IVX]+\\.[A-Z]")).beforeSeparator().afterSeparator();
atom("CaseLawChapter1",regexp("[IVX]+\\.[1-9][0-9]*")).beforeSeparator().afterSeparator();
atom("CaseLawChapterASection1",regexp("[IVX]+\\.[A-Z]\\.[1-9][0-9]*")).beforeSeparator().afterSeparator();
atom("CaseLawChapter1Section1",regexp("[IVX]+\\.[1-9][0-9]*\\.[1-9][0-9]*")).beforeSeparator().afterSeparator();
atom("CaseLawChapterASection2",regexp("[IVX]+\\.[A-Z]\\.[1-9][0-9]*\\.[1-9][0-9]*")).beforeSeparator().afterSeparator();
atom("CaseLawChapter1Section2",regexp("[IVX]+\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*")).beforeSeparator().afterSeparator();
atom("CaseLawChapterASection3",regexp("[IVX]+\\.[A-Z]\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*(\\.\\([a-z]\\))?")).beforeSeparator().afterSeparator();
atom("CaseLawChapter1Section3",regexp("[IVX]+\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*")).beforeSeparator().afterSeparator();
atom("CaseLawChapterASection4",regexp("[IVX]+\\.[A-Z]\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*")).beforeSeparator().afterSeparator();
atom("CaseLawChapter1Section4",regexp("[IVX]+\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*")).beforeSeparator().afterSeparator();

atom("CaseLawChapterASection1Letter",regexp("[IVX]+\\.[A-Z]\\.[1-9][0-9]*\\.[a-z]\\)?")).beforeSeparator().afterSeparator();
atom("CaseLawChapter1Section1Letter",regexp("[IVX]+\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[a-z]\\)?")).beforeSeparator().afterSeparator();
atom("CaseLawChapterASection2Letter",regexp("[IVX]+\\.[A-Z]\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[a-z]\\)?")).beforeSeparator().afterSeparator();
atom("CaseLawChapter1Section2Letter",regexp("[IVX]+\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[a-z]\\)?")).beforeSeparator().afterSeparator();
atom("CaseLawChapterASection3Letter",regexp("[IVX]+\\.[A-Z]\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[a-z]\\)?")).beforeSeparator().afterSeparator();
atom("CaseLawChapter1Section3Letter",regexp("[IVX]+\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[a-z]\\)?")).beforeSeparator().afterSeparator();
atom("CaseLawChapterASection4Letter",regexp("[IVX]+\\.[A-Z]\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[a-z]\\)?")).beforeSeparator().afterSeparator();
atom("CaseLawChapter1Section4Letter",regexp("[IVX]+\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[a-z]\\)?")).beforeSeparator().afterSeparator();

atom("CaseLawChapterSection1",regexp("[A-Z]\\.[1-9][0-9]*(?!\\.)"));
atom("CaseLawChapterSection2",regexp("[A-Z]\\.[1-9][0-9]*\\.[1-9][0-9]*(?!\\.)"));
atom("CaseLawChapterSection3",regexp("[A-Z]\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*(?!\\.)"));
atom("CaseLawChapterSection4",regexp("[A-Z]\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*(?!\\.)"));

atom("CaseLawSection2",regexp("[1-9][0-9]*\\.[1-9][0-9]*(?!\\.)"));
atom("CaseLawSection3",regexp("[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*(?!\\.)"));
atom("CaseLawSection4",regexp("[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*(?!\\.)"));


atom("CaseLawSection1Id",regexp("^[1-9][0-9]*\\.[\xa0\t].*$")).context({style:"TOC3"});
atom("CaseLawSection2Id",regexp("^[1-9][0-9]*\\.[1-9][0-9]*\\.?[\xa0\t].*$")).context({style:"TOC4"});
atom("CaseLawSection3Id",regexp("^[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*[\xa0\t].*$")).context({style:"TOC5"});
atom("CaseLawSection4Id",regexp("^[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*\\.[1-9][0-9]*[\xa0\t].*$")).context({style:"TOC6"});

equivalences("CaseLawPart","RomanUpper");
module.exports = tihyLexer;
