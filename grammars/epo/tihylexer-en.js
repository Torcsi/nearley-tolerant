let {atom,regexp,Lexer,use} = require('../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);
// mandatory
//atom("ANY",regexp("."));

//COMMON
atom("openParenthesis","(");// simple string, "..."  // KG: should be avoided and instead added to (a), a) etc.
atom("closeParenthesis",")"); // KG: should be avoided and instead added to (a), a) etc.
atom("dot",".");
atom("number",regexp("[1-9][0-9]*")).overlaps("OJYear").overlaps("OJYearBacklog").overlaps("OJIssueNo").overlaps("OJArtPage").overlaps("paragraphNumber");// regexp: /.../; 1 or more repetitions		KG: leading zeros suppressed?
atom("alpha",regexp("[a-z]")).beforeSeparator().afterSeparator();
atom("roman", regexp("[ivx]")).beforeSeparator().afterSeparator();	//taken from the Internet //regexp (IX|IV|V?I{0,3}) deferred
atom("anySpace",regexp("[ \xa0]")).overlaps("nbsp").overlaps("space");// regexp: [] character set
atom("nbsp",regexp("[\xa0]")).overlaps("anySpace");// regexp: [] character set
atom("andortocomma",regexp("(:(:[ \\xa0](?:(and|or))[ \\xa0]:)|,[ \\xa0])")).overlaps("commaSpace");
atom("of","of").beforeSeparator().afterSeparator().setGroup("OF");
atom("per","/"); // "/"
atom("to", regexp("[ \\xa0]to[ \\xa0]")); // should include space before and after; to be extended (e.g. with "-")
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
atom("paragraphNumber",["number"]).overlaps("number");// synonym, single element sequence, e.g. for error reporting
atom("paragraphRef",["openParenthesis","paragraphNumber","closeParenthesis"]).overlaps("pctNumber");// e.g. (4)
atom("commaSpace",regexp(",[ \\xa0]")).overlaps("andortocomma");


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
atom("pctNumber",["openParenthesis","number","closeParenthesis"]).overlaps("paragraphRef");
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
atom("anyR",regexp("R\\."));
atom("rule","rule");
atom("Rule","Rule");
atom("rules",regexp("rule[s]?"));
atom("Rules",regexp("Rule[s]?"));
atom("epcRule",["anyRule","anySpace","number","epcBis"]);

// RFEES
atom("point",regexp("[pP]oint[s]?"));
atom("pctItem",regexp("item[s]?"));

// OJ EXTERNAL
atom("OJSupplTo",regexp("[sS]uppl(ement|\\.)[ \xa0]to")).setGroup("OJSuppl"); // Supplement to OJ EPO 1/2013, 10
atom("OJSuppl",regexp("([sS]upplement|[sS]uppl\\.)")).afterSeparator().setGroup("OJSuppl"); // Supplement to OJ EPO 1/2013, 10
// KG: OJSuppl -> %OJSuppl | %OJSupplTo
atom("OJSuppPubLong", regexp("[Ss]upplementary[ \xa0][Pp]ublication")).setGroup("OJSupplPub").context(true,"Margin","warning","use short form in margins"); //supplementary publication 1, OJ EPO 2014, 1
atom("OJSuppPubShort",regexp("([sS]uppl\\.[ \xa0][Pp]ubl\\.)")).afterSeparator().setGroup("OJSupplPub"); // Supplement to OJ EPO 1/2013, 10
// KG: OJSupplPub -> %OJSuppPubLong | %OJSuppPubShort

// atom("OJSupPub",[/[Ss]upplementary/,/[Pp]ublication]);
// atom("OJSuppl",["SupplementtoOJEPO"]); //is this (|) working here? ["Supplement to OJ EPO"|"supplement to OJ EPO"]

atom("OJYearBacklog",regexp("(19[0-9][0-9]|200[0-9]|201[0123])")).overlaps("number");
atom("OJYear",regexp("201[456789]")).overlaps("number"); //hibajelzés!
atom("OJArtNo",regexp("A[1-9][0-9]*"));
//atom("OJSEArt","A."); // I think this is an error here
atom("OJArtPage",regexp("[1-9]{1,2}")).overlaps("OJIssueNo").overlaps("number");
atom("OJIssueNo",regexp("[1-9]{1,2}")).overlaps("OJArtPage").overlaps("number");

// --- new added
atom("dash",regexp("-"));
atom("comma",regexp(",")); // warning: OJ EPO 2013,194
atom("space",regexp(" ")); // warning: OJ EPO 2013,194
atom("OJSupplNo",regexp("Supplement[ \xa0]No\\.")); // Supplement No. 2 to OJ EPO 3/2010
atom("the","the").beforeSeparator().afterSeparator();
atom("ofthe",regexp("of[ \xa0]the")).beforeSeparator().afterSeparator().setGroup("OF");
// KG: OF -> %of | %ofthe
atom("PagesText",regexp("(page[s]*|[p]?p\\.)")).afterSeparator().context(true,"Margin","warning","do not use 'page' or 'p' in margin");
atom("No",regexp("[Nn]o\\.")).afterSeparator().setGroup("OJNo");
atom("UnusualNo",regexp("(N\\.o|[Nn]\\.|[Nn]o)")).afterSeparator().issue("hint","use No. or no. instead").setGroup("OJNo");
// KG: use grammar rule OJNo -> %No | %UnusualNo
atom("issue",regexp("issue")).afterSeparator().beforeSeparator().issue("warning","unusual term in reference");

atom("OJShort","OJ").setGroup("OJ");
atom("OJLong","Official Journal").context(true,"Margin","warning","use short form of OJ instead").setGroup("OJ");
atom("OJ",{"OJShort":"","OJLong":""}).setGroup("OJ");
atom("OJEpo",["OJ","anySpace","EPO"]).afterSeparator().beforeSeparator().issueWhen(regexp("OJ "),true,"warning","use non-breaking space after OJ").setGroup("OJ");
// KG: use grammar rule instead
// atom("OJEpo",{"OJNbspEpo":"","OJSpaceEpo":""});
// OJ -> (%OJShort | %OJLong | %OJ | %OJEpo)

atom("SEShort","SE").afterSeparator().beforeSeparator().setGroup("OJSEText");
atom("SELong",regexp("[Ss]pecial[ \xa0][Ee]dition[s]*")).issueWhen(regexp("(spec|ed)"),true,"warning","use capitals for Special Edition").context(true,"Margin","hint","use short form in margins").setGroup("OJSEText");
atom("SpecEdShort",regexp("([Ss]pec\\.[ \xa0]?[Ee]d\\.)")).afterSeparator().issueWhen(regexp("\\.ed"),true,"space missing").setGroup("SPECED").issueWhen(regexp("[ \xa0]$"),false,"space missing at end").issueWhen(regexp("(spec|ed)"),true,"warning","use capitals for Special Edition");
atom("SpecEdLong",regexp("([Ss]pecial[ \xa0][eE]dition[s]*)")).issueWhen(regexp("\\.ed"),true,"warning","space missing").setGroup("SPECED").issueWhen(regexp("[ \xa0]$"),false,"warning","space missing at end");
atom("OJSpecEd",["OJ","nbsp","OJSE", "nbsp","No"]);
atom("OJSE",{"SEShort":"","SpecEdShort":"","SpecEdLong":""}).setGroup("OJSE").overlaps("SpecEdLong").overlaps("SpecEdShort");
atom("OJSEShort",["OJ","nbsp","OJSE"]);
atom("OJSENormal",["OJ","nbsp","EPO","anySpace","OJSE"]);
atom("OJSEReverse",["OJSE","anySpace","OJ","nbsp","EPO"]).issueWhen(regexp("^SE"),true,"error","SE OJ invalid");
// KG: use grammar rule instead
// OJSE -> %OJSENormal | %OJSEReversed
// atom("OJSE",["OJ","nbsp","EPO","anySpace","SE"]); // Mixed LEXER with PARSER!



// OJ Internal
atom("digit3",regexp("[0-9]{3}")).beforeSeparator().afterSeparator().context(false,"decisionlist","error","0-lead numbers are unusual (except in decision lists)");
atom("digit2",regexp("[0-9]{2}")).beforeSeparator().afterSeparator().issue("error","0-lead numbers are unusual");

module.exports = tihyLexer;


