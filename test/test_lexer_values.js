
var assert = require("assert");
const {Lexer,LexicalParser,use,atom,regexp} = require("../lib/lexer-tolerant");

function compileLexer(s,l)
{
  let aErrors = l.compile();
  assert.ok(aErrors==null,s+" compilation problems:"+JSON.stringify(aErrors));
  return true;
}

function ScanTest(sCaption, lexer, aSample, aResponse, hFilter) {
    //let lexer = new LexicalUnits();
    //lexer.add(new Atom("Vowel", lexer.regexp("[aeiou]","gu")).afterSeparator().beforeSeparator().substitute("$0"));
    //lexer.setStart("Vowel");
    if (!compileLexer(sCaption, lexer))
        return;
    for (let i = 0; i < aSample.length; i++) {
        let oParse = new LexicalParser(aSample[i]);
        oParse.start(lexer);
        let aParseInfo = [];
        for (let i = 0; (m = oParse.next(hFilter)) != null; i++) {
            //console.log(i + ":" + m.type + ":" + m.at + ":" + m.end);
            aParseInfo.push([m.type,m.text,m.getValue?m.getValue():null]);
            oParse.blockMatch(m);
        }
        assert.deepStrictEqual(aResponse[i],aParseInfo);
    }
}

describe("Lexer values tests"    , function(){
        describe("Single value string substitute",function(){
            it("Single atom scanning",function(){
                let myLexer= new Lexer();
                use(myLexer);
                atom("ALetter",regexp("A","gu")).substitute("a");
                myLexer.setStart("ALetter")
                ScanTest("Upper only",myLexer,["A"],[[ ['ALetter','A','a']]]);
            });
        });
        describe("Single, named value return",function(){
            it("Single atom scanning",function(){
                let myLexer= new Lexer();
                use(myLexer);
                atom("ALetter",regexp("A","gu")).substitute("${ALetter}");
                myLexer.setStart("ALetter")
                ScanTest("Upper only",myLexer,["A"],[[ ['ALetter','A','A']]]);
            });
        });
        describe("Id value return",function(){
            it("Id atom scanning",function(){
                let myLexer= new Lexer();
                use(myLexer);
                atom("ALetter",regexp("A","gu")).substitute();
                myLexer.setStart("ALetter")
                ScanTest("Upper only",myLexer,["A"],[[ ['ALetter','A','A']]]);
            });
        });
        describe("Id value regexp substitute should return compilation error",function(){
            it("Single atom replacement of found value",function(){
                let myLexer= new Lexer();
                use(myLexer);
                atom("ABLetters",regexp("(?<X>A)(?<Y>B)","gu")).substitute("${Y}${Y}-${X}");
                myLexer.setStart("ABLetters")
                ScanTest("ABSwap",myLexer,["AB"],[[ ['ABLetters','AB','BB-A']]]);
            });
        });
        describe("Singe value named substitute",function(){
            it("Single atom scanning",function(){
                let myLexer= new Lexer();
                use(myLexer);
                atom("ALetter",regexp("A","gu")).substitute("${ALetter}-${ALetter}");
                myLexer.setStart("ALetter")
                ScanTest("Upper only",myLexer,["A"],[[ ['ALetter','A','A-A']]]);
            });
        })
        describe("Singe value function substitute",function(){
            it("Single atom scanning",function(){
                let myLexer= new Lexer();
                use(myLexer);
                atom("ALetter",regexp("A","gu")).substitute((x)=>(x+"!"+x.toLowerCase()));
                myLexer.setStart("ALetter")
                ScanTest("Upper only",myLexer,["A"],[[ ['ALetter','A','A!a']]]);
            });
        })
        describe("Singe value sequence substitute",function(){
            it("Single atom sequence",function(){
                let myLexer= new Lexer();
                use(myLexer);
                atom("ALetter",regexp("A","gu")).substitute([(x)=>(x+"!"+x.toLowerCase()),(x)=>(x+"...")]);
                myLexer.setStart("ALetter")
                ScanTest("Upper only",myLexer,["A"],[[ ['ALetter','A','A!a...']]]);
            });
        })
        describe("Multiple value regexp substitute",function(){
            it("Part value refereces",function(){
                let myLexer= new Lexer();
                use(myLexer);
                atom("ALetter","A").substitute();
                atom("BLetter","B").substitute();
                atom("ABLetters",["ALetter","BLetter"]).substitute((x,d)=>(d.BLetter.toLowerCase()+":"+d.ALetter));
                myLexer.setStart("ABLetters")
                ScanTest("lower second and swap",myLexer,["AB"],[[ ['ABLetters','AB','b:A']]]);
            });
            it("Subpart value refereces",function(){
                let myLexer= new Lexer();
                use(myLexer);
                atom("ALetter","A").substitute();
                atom("BLetter","B").substitute();
                atom("CLetter","C").substitute();
                atom("ABLetters",["ALetter","BLetter"]).substitute((x,d)=>{let ret = d.BLetter.toLowerCase()+"_"+d.ALetter; d.BLetter="["+d.BLetter+"]"; return ret});
                atom("ABCLetters",["ABLetters","CLetter"]).substitute((x,d)=>{return d.ALetter+":"+d.BLetter+":"+d.CLetter+":"+d.ABLetters});
                myLexer.setStart("ABCLetters")
                ScanTest("lower second and swap",myLexer,["ABC"],[[ ['ABCLetters','ABC','A:[B]:C:b_A']]]);
            });
        })
    }
)
