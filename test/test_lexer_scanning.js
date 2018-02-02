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


function Scan2Test(sCaption, lexer1, lexer2, aSample, aResponse1, aResponse2) {
    //let lexer = new LexicalUnits();
    //lexer.add(new Atom("Vowel", lexer.regexp("[aeiou]","gu")).afterSeparator().beforeSeparator().substitute("$0"));
    //lexer.setStart("Vowel");
    if (!compileLexer(sCaption, lexer1))
        return;
    if (!compileLexer(sCaption, lexer2))
        return;
    for (let i = 0; i < aSample.length; i++) {
        let oParse = new LexicalParser(aSample[i]);
        oParse.start(lexer1);
        let aParseInfo = [];
        for (let i = 0; (m = oParse.next()) != null; i++) {
            //console.log(i + ":" + m.type + ":" + m.at + ":" + m.end);
            aParseInfo.push([m.type,m.text,m.getValue?m.getValue():null]);
            oParse.blockMatch(m);
        }
        assert.deepStrictEqual(aResponse1[i],aParseInfo);
        //console.log("------------------------------------------------------------------------");
        oParse.start(lexer2);
        aParseInfo = [];
        for (let i = 0; (m = oParse.next()) != null; i++) {
            //console.log(i + ":" + m.type + ":" + m.at + ":" + m.end);
            aParseInfo.push([m.type,m.text,m.getValue?m.getValue():null]);
            oParse.blockMatch(m);
        }
        assert.deepStrictEqual(aResponse2[i],aParseInfo);

    }
}

describe.skip("Lexer scanning tests", function(){
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
          ScanTest("Begin",myLexer,["ABx"],[[ ['Upper','A',null],['Upper','B',null], ['NONE','x',null] ]]);
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
            [ ['Aonly','A',null], ['NONE','xB',null] ]
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
          ["AxB","xAB","BxA","BAx","0AA1B2A3"],
          [
            [
              ['Aonly','A',null], ['NONE','xB',null]
            ],
            [
              ['NONE','x',null], ['Aonly','A',null], ['NONE','B',null]
            ],
            [
              ['NONE','Bx',null], ['Aonly','A',null]
            ],
            [
              ['NONE','B',null], ['Aonly','A',null], ['NONE','x',null]
            ],
            [
              ['NONE','0',null], ['Aonly','A',null], ['Aonly','A',null],['NONE','1B2',null],['Aonly','A',null],['NONE','3',null],
            ],

          ],
          [
            [
              ['NONE','Ax',null],['Upper','B',null]
            ],
            [
              ['NONE','xA',null],['Upper','B',null]
            ],
            [
              ['Upper','B',null],['NONE','xA',null]
            ],
            [
              ['Upper','B',null],['NONE','Ax',null]
            ],
            [
              ['NONE','0AA1',null],['Upper','B',null],['NONE','2A3',null]
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