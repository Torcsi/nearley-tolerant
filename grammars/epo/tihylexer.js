let {atom,regexp,Lexer,use} = require('../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);
// mandatory
atom("ANY",/./);

//COMMON
atom("openParenthesis","(");// simple string, "..."
atom("closeParenthesis",")");
atom("dot",".");
atom("number",regexp("[1-9][0-9]*")).overlaps("OJIssueNo").overlaps("OJArtPage");// regexp: /.../; 1 or more repetitions		KG: leading zeros suppressed?
atom("alpha",regexp("[a-z]"));
atom("roman", regexp("[ivx]"));	//taken from the Internet //regexp (IX|IV|V?I{0,3}) deferred
atom("anySpace",regexp("[ \xa0]")).overlaps("nbsp");// regexp: [] character set
atom("nbsp",regexp("[\xa0]")).overlaps("anySpace");// regexp: [] character set
atom("andortocomma",regexp("(:(:[ \\xa0](?:(and|or))[ \\xa0]:)|,[ \\xa0])"));
atom("of","of");
atom("per","/"); // "/"
atom("to", regexp("[ \\xa0]to[ \\xa0]")); // should include space before and after; to be extended (e.g. with "-")
atom("No",regexp("[Nn]o\\."));
atom("EPO","EPO");

//ARTICLE COMMON
atom("article","article");// direct string
atom("anyArt",regexp("[aA]rt\\."));// regexp: \. exactly 1 ., beware: . means any character	KG: add "A" - ref. to OJ article + in keyword index 
atom("Article","Article");
atom("Articles",regexp("Article[s]?"));
atom("anyArticle",{"Article":"","article":"","anyArt":"","Articles":""});
//choice, for the purpose of error reporting in context

atom("paragraph","paragraph[s]?");// regexp: plural optional
atom("subParagraph", "subparagraph[s]?");
atom("paragraphNumber",["number"]);// synonym, single element sequence, e.g. for error reporting
atom("paragraphRef",["openParenthesis","paragraphNumber","closeParenthesis"]);// e.g. (4)
atom("commaSpace",regexp(",[ \\xa0]"));


//EPC ARTICLES
atom("EPC", "EPC");
atom("EPCVersion",regexp("EPC[ \\xa0][0-9]{4}"));
atom("anyEPC",["EPCVersion","EPC"]); //regexp {"EPC":"","EPC1973":""} deferred 
atom("epcBis",regexp("[abcdefg]"));// regexp ? 0 or 1; !!! moo does not allow
atom("epcArticle",["anyArticle","anySpace","number","epcBis"]);	// sequence
atom("anyRFEE", regexp("RFee[sS]|Rules relating to Fees"));

//PCT ARTICLES
//atom("PCT","PCT");
atom("anyPCT","PCT");
atom("pctNumber",["openParenthesis","number","closeParenthesis"])
atom("pctBis",regexp("bis|ter|quater|quinquies"));// further to be added
atom("pctRoman", ["openParenthesis","roman","closeParenthesis"])
atom("pctAlpha",["openParenthesis","alpha","closeParenthesis"]);
atom("pctArticle",["anyArticle","anySpace","number","pctBis"]);
atom("pctParagraphNumber",["openParenthesis","pctNumber","closeParenthesis"]);

atom("pctArtNo","number");
atom("pctArtNoB",["number","pctBis"]);
atom("anyPctArtNo",{"pctArtNo":"","pctArtNoB":""});
/* LEXER vs RULE
atom("pctArtNo2",[/("anyPctArtNo")?/,"pctNumber"]);
atom("pctArtPara",[/("pctArtNo2")?/, "pctAlpha"]);
atom("pctArtPara2",[/("pctArtPara")?/,"pctRoman"]);
*/

//atom("pctParagraphRef", ["paragraph","anySpace","pctParagraphNumber","pctParagraphNumber","pctParagraphNumber"]); 
// ["paragraph","anySpace","pctParagraphNumber",("pctParagraphNumber","pctParagraphNumber":*):*]
//atom("pctItem",/item[s]?/);
//atom("pctItemRef",["pctItem", "anySpace", "of"]);
//atom("anyParent",/./); // regexp:deferred {"pctArticle":"","pctParagraphRef":""}

//atom("pctRuleNumber",["number","pctBis","dot","number","pctBis"]);
//atom("pctRule",["anyRule","anySpace","pctRuleNumber"]);

// megengedő verzió
// atom("pctNumber", {"number":"","alpha":"","roman":""});


// EPC RULES
atom("anyRule",{"rules":"","Rules":"", "anyR":""});
atom("anyR",/R\./)
atom("rule","rule");
atom("Rule","Rule");
atom("rules",/rule[s]?/);
atom("Rules",/Rule[s]?/);
atom("epcRule",["anyRule","anySpace","number","epcBis"]);

// RFEES
atom("point",/[pP]oint[s]?/);
atom("pctItem",/item[s]?/);

// OJ EXTERNAL
atom("OJShort","OJ");
atom("OJLong","Official Journal");
atom("OJ",{"OJShort":"","OJLong":""});
atom("OJEpo",["OJ","nbsp","EPO"]); // Mixed LEXER with PARSER!
atom("SEShort","SE");
atom("SELong",regexp("[Ss]pecial\xa0[Ee]dition"));
atom("SE",{"SEShort":"","SELong":""});
atom("OJSE",["OJ","nbsp","EPO","anySpace","SE"]); // Mixed LEXER with PARSER!
atom("OJSpecEd","OJSpecEd"); // selfref
atom("OJSupPub", "OJSupPub");
atom("OJSuppl","OJSuppl");

atom("SpecEd",/([Ss]pecial[ \xa0][Ed]ition|SE)/);
atom("OJSpecEd",["OJ","nbsp","SpecEd", "nbsp","No"]);
// atom("OJSupPub",[/[Ss]upplementary/,/[Pp]ublication]);
// atom("OJSuppl",["SupplementtoOJEPO"]); //is this (|) working here? ["Supplement to OJ EPO"|"supplement to OJ EPO"]

atom("OJYearBacklog",regexp("(19[0-9][0-9]|200[0-9]|201[0123])"));
atom("OJYear",regexp("201[456789]")); //hibajelzés!
atom("OJArtNo",regexp("A[1-9][0-9]*"));
//atom("OJSEArt","A."); // I think this is an error here
atom("OJArtPage",regexp("[1-9]{1,2}")).overlaps("OJIssueNo").overlaps("number");
atom("OJIssueNo",regexp("[1-9]{1,2}")).overlaps("OJArtPage").overlaps("number");

module.exports = tihyLexer;


