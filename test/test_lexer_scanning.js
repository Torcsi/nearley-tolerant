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
        let oParse = new LexicalParser(lexer);
        oParse.init(aSample[i]);
        oParse.start(0);
        let aParseInfo = [];
        for (let i = 0; (m = oParse.next(hFilter)) != null; i++) {
            //console.log(i + ":" + m.type + ":" + m.at + ":" + m.end);
            aParseInfo.push([m.type,m.text,m.getValue?m.getValue():null]);
            oParse.blockMatch(m);
        }
        assert.deepStrictEqual(aResponse[i],aParseInfo);
    }
}


function Scan2Test(sCaption, lexer1, lexer2, aSample, aResponse1, aResponse2) {
    //let lexer = new LexicalUnits();
    //lexer.add(new Atom("Vowel", lexer.regexp("[aeiou]","gu")).afterSeparator().beforeSeparator().substitute("$0"));
    //lexer.setStart("Vowel");
    if (!compileLexer(sCaption, lexer1))
        return;
    if (!compileLexer(sCaption, lexer2))
        return;
    for (let i = 0; i < aSample.length; i++) {
      //console.log("### Scan 2, test "+i)
        let oParse = new LexicalParser(lexer1);
        oParse.init(aSample[i]);
        oParse.start(0);
        let aParseInfo = [];
        for (let i = 0; (m = oParse.next()) != null; i++) {
            //console.log(i + ":" + m.type + ":" + m.at + ":" + m.end);
            aParseInfo.push([m.type,m.text,m.getValue?m.getValue():null]);
            oParse.blockMatch(m);
        }
        assert.deepStrictEqual(aResponse1[i],aParseInfo,"Failure on test example:"+i+" step 1");
        //console.log("------------------------------------------------------------------------");
        oParse.setLexer(lexer2);
        oParse.start(0);
        aParseInfo = [];
        for (let i = 0; (m = oParse.next()) != null; i++) {
            //console.log(i + ":" + m.type + ":" + m.at + ":" + m.end);
            aParseInfo.push([m.type,m.text,m.getValue?m.getValue():null]);
            oParse.blockMatch(m);
        }
        assert.deepStrictEqual(aResponse2[i],aParseInfo,"Failure on test example:"+i+" step 2");

    }
}

describe("Lexer scanning tests", function(){
  describe('Basic successful scanning',
    function(){
      it("Single atom scanning",
        function(){
          let myLexer= new Lexer();
          use(myLexer);
          atom("Upper",regexp("[A-Z]","gu"))
          myLexer.setStart("Upper")
          ScanTest("Upper only",myLexer,["AB"],[[ ['Upper','A',null], ['Upper','B',null] ]]);
        }
      );
    }
  );

  describe('Basic scanning with NONE',
    function(){
      it("Single atom scanning with NONE in middle",
        function(){
          let myLexer= new Lexer();
          use(myLexer);
          atom("Upper",regexp("[A-Z]","gu"))
          myLexer.setStart("Upper")
          ScanTest("Middle",myLexer,["AxB"],[[ ['Upper','A',null], ['NONE','x',null],['Upper','B',null] ]]);
        },
      );
      it("Single atom scanning with NONE at begin",
        function(){
          let myLexer= new Lexer();
          use(myLexer);
          atom("Upper",regexp("[A-Z]","gu"))
          myLexer.setStart("Upper")
          ScanTest("Begin",myLexer,["xAB"],[[['NONE','x',null], ['Upper','A',null],['Upper','B',null] ]]);
        }
      );
      it("Single atom scanning with NONE at end",
        function(){
          let myLexer= new Lexer();
          use(myLexer);
          atom("Upper",regexp("[A-Z]","gu"))
          myLexer.setStart("Upper")
          ScanTest("Begin",myLexer,["ABx"],[[ ['Upper','A',null],['Upper','B',null] ]]);
        }
      );
    }
  );
  describe("Two-step scanning",
    function(){
      it("Scan step 1",
        function(){
          let ALexer= new Lexer();
          use(ALexer);
          atom("Aonly",regexp("A","gu"))
          ALexer.setStart("Aonly");

          ScanTest("Find A",ALexer,["AxB"],
          [
            [ ['Aonly','A',null]]
          ]
        );
        },
      );
      it("Jump over blocked",
        function(){
          let ALexer= new Lexer();
          use(ALexer);
          atom("Aonly",regexp("A","gu")); //.substitute(regexp('!','gu'));
          ALexer.setStart("Aonly");
          let upperLexer= new Lexer();
          use(upperLexer);
          atom("Upper",regexp("[A-Z]","gu"))
          upperLexer.setStart("Upper")
          Scan2Test("Skip found A",ALexer,upperLexer,
          ["xAB","AxB","BxA","BAx","0AA1B2A3"],
          [
            [
              ['NONE','x',null], ['Aonly','A',null]
            ],
            [
              ['Aonly','A',null], 
            ],
            [
              ['NONE','Bx',null], ['Aonly','A',null]
            ],
            [
              ['NONE','B',null], ['Aonly','A',null], 
            ],
            [
              ['NONE','0',null], ['Aonly','A',null], ['Aonly','A',null],['NONE','1B2',null],['Aonly','A',null],
            ],

          ],
          [
            [
              ['NONE','xA',null],['Upper','B',null]
            ],
            [
              ['NONE','Ax',null],['Upper','B',null]
            ],
            [
              ['Upper','B',null]
            ],
            [
              ['Upper','B',null]
            ],
            [
              ['NONE','0AA1',null],['Upper','B',null]
            ]
          ]
        );
        },
      );
    }
  );
  /** 
  describe.skip("Selective scanning",
    function(){
      it("Return NONE for selective scan (not yet implemented)",
        function(){
          let upperLexer= new Lexer();
          use(upperLexer);
          atom("Upper",regexp("[A-Z]","gu"));
          atom("Number",regexp("[0-9]","gu")).standalone();
          upperLexer.setStart("Upper");

          ScanTest("ScanNumber",upperLexer,["A0B"],[[ ['Upper','A',null],['Number','0',null],['Upper','B',null] ]]);
          ScanTest("DoNotScanNumber",upperLexer,["A0B"],[[ ['Upper','A',null],['NONE','0',null],['Upper','B',null] ]],{'Number':''});
        }
      )
    }
  )
  **/
});