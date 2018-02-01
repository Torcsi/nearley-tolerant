var assert = require("assert");
const {Lexer,LexicalParser,use,atom,regexp} = require("../lib/lexer-tolerant");

describe('Creation and basic operations',
  function(){
    it("Create lexer and add an atom",
      function(){
        let myLexer= new Lexer();
        use(myLexer);
        atom("Upper",regexp("[A-Z]","gu"))
        myLexer.setStart("Upper");
        let aErrors = myLexer.compile();
        assert.ok(aErrors==null,"some errors reported "+JSON.stringify(aErrors));
      }
    ),

    it("Add a string, a regexp, a synonym, a choice, a sequence",
      function(){
        let myLexer= new Lexer();
        use(myLexer);
        atom("var","var");
        atom("def",["var"],"gu");
        atom("spaces",regexp("[ \t]+","gu"));
        atom("upper",regexp("[A-Z]","gu"));
        atom("lower",regexp("[a-z]","gu"));
        atom("letter",{upper:"",lower:""});
        atom("varDecl",["var","spaces","letter"]);
        myLexer.setStart("upper");
        myLexer.setStart("varDecl");
        let aErrors = myLexer.compile();
        assert.ok(aErrors==null,"some errors reported "+JSON.stringify(aErrors));
      }
    )
  }
);

  describe("Undefined reference",
    function(){
      it("Synonym",
        function(){
          let myLexer= new Lexer();
          use(myLexer);
          atom("def",["var"],"gu");
          let aErrors = myLexer.compile();
          assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("no synon")>=0,"missing synonym  not reported");
        }
      ),
      it("Choice",
        function(){
          let myLexer= new Lexer();
          use(myLexer);
          atom("def",{var:""},"gu");
          let aErrors = myLexer.compile();
          assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("no choi")>=0,"missing choice element reported");
        }
      ),
      it("Overlap",
        function(){
          let myLexer= new Lexer();
          use(myLexer);
          atom("def","abc","gu").overlaps("undefinedOverlapping");
          let aErrors = myLexer.compile();
          assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("no overl")>=0,"missing overlapping element not reported");
        }
      )
    }


);
describe("Circular reference",
  function(){
    it("Synonym",
      function(){
        let myLexer= new Lexer();
        use(myLexer);
        atom("var",["def"])
        atom("def",["var"],"gu");
        let aErrors = myLexer.compile();
        assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("circular")>=0,"circular synonym not reported");
      }
    ),
    it("Choice",
      function(){
        let myLexer= new Lexer();
        use(myLexer);
        atom("var",["def"])
        atom("def",{var:""},"gu");
        let aErrors = myLexer.compile();
        assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("circular")>=0,"cirtcular choice not reported"+JSON.stringify(aErrors));
      }
    ),
    it("Sequence",
      function(){
        let myLexer= new Lexer();
        use(myLexer);
        atom("my",["def"]);
        atom("var","var");
        atom("def",["var","my"],"gu");
        let aErrors = myLexer.compile();
        assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("circular")>=0,"circular sequence not reported "+JSON.stringify(aErrors));
      }
    )
  }
);
describe("Bad regexp",
  function(){
    it("Bad regexp in regexp definition",
      function(){
        let myLexer= new Lexer();
        use(myLexer);
        atom("var",regexp("["));
        let aErrors = myLexer.compile();
        assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("nvalid regular")>=0,"bad regexp not reported "+JSON.stringify(aErrors));
      }
    )
  }

);

describe("Start",
  function(){
    it("Missing setStart",
      function(){
        let myLexer= new Lexer();
        use(myLexer);
        atom("my","my");
        atom("var","var");
        atom("def",["var","my"]);

        let aErrors = myLexer.compile();
        assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("no start")>=0,"missing start not reported "+JSON.stringify(aErrors));

      }
    )
  }
);

describe("Substitute",
  function(){
    it("Substituted component not found in sequence",
      function(){
        let myLexer= new Lexer();
        use(myLexer);
        atom("my","my");
        atom("var","var");
        atom("def",["var","my"]).substitute("${missing}");
        myLexer.setStart("var");
        let aErrors = myLexer.compile();
        assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("substitition variable not found")>=0,"missing variable not reported in substitute "+JSON.stringify(aErrors));

      }
    ),
    it("Composed component not found in sequence",
      function(){
        let myLexer= new Lexer();
        use(myLexer);
        atom("my","my");
        atom("var","var");
        atom("def",["var","my"]).compose("${missing}");
        myLexer.setStart("var");
        let aErrors = myLexer.compile();
        assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("composition variable not found")>=0,"missing variable not reported in compose "+JSON.stringify(aErrors));

      }
    ),
    it("Substitute must be the first",
      function(){
        let myLexer= new Lexer();
        use(myLexer);
        atom("my","my");
        atom("var","var");
        atom("def",["var","my"]).substitute((x)=>(x.toUpperCase())).substitute("${missing}");
        myLexer.setStart("var");
        let aErrors = myLexer.compile();
        assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("regexp substitute must be the first")>=0,"regexp substitute not the first is not reported "+JSON.stringify(aErrors));
      }
    ),
    /** no chance to check it in detail
    it("Invalid function in substitute",
      function(){
        let myLexer= new Lexer();
        use(myLexer);
        atom("my","my");
        atom("var","var");
        atom("def",["var","my"]).substitute((x)=>(x.noFunction()));
        myLexer.setStart("var");
        let aErrors = myLexer.compile();
        assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("invalid function in substitute")>=0,"function substitute invalid is not reported"+JSON.stringify(aErrors));
      }
    )
    **/
    /** function chain is banned since it is nothing else than multiple substitutes
    it("No function in function chain",
      function(){
        let myLexer= new Lexer();
        use(myLexer);
        atom("my","my");
        atom("var","var");
        atom("def",["var","my"]).substitute((x)=>(x.noFunction()));
        myLexer.setStart("var");
        let aErrors = myLexer.compile();
        assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("invalid function in substitute")>=0,"function substitute invalid is not reported"+JSON.stringify(aErrors));
      }
    )
    **/
    it("Invalid substitute",
      function(){
        let myLexer= new Lexer();
        use(myLexer);
        atom("my","my");
        atom("var","var");
        atom("def",["var","my"]).substitute([]);
        myLexer.setStart("var");
        let aErrors = myLexer.compile();
        assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("invalid substitut")>=0,"invalid array substitution is not reported "+JSON.stringify(aErrors));
      },
      function(){
        let myLexer= new Lexer();
        use(myLexer);
        atom("my","my");
        atom("var","var");
        atom("def",["var","my"]).substitute(1);
        myLexer.setStart("var");
        let aErrors = myLexer.compile();
        assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("invalid substitut")>=0,"invalid int substitution is not reported "+JSON.stringify(aErrors));
      }

    )
  }
);
  describe("Reuse of value variable",
    function(){
      it("Same value component used twice",
        function(){
          let myLexer= new Lexer();
          use(myLexer);
          atom("my","my").substitute("value");
          atom("var",["my","my"]);
          myLexer.setStart("var");
          let aErrors = myLexer.compile();
          assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("reuses value atom")>=0,"twice used in sequence not reported "+JSON.stringify(aErrors));
        },
        function(){
          let myLexer= new Lexer();
          use(myLexer);
          atom("my","my").substitute("value");
          atom("var",{"my":1,"my":1});
          myLexer.setStart("var");
          let aErrors = myLexer.compile();
          assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("reuses value atom")>=0,"twice used in choice not reported "+JSON.stringify(aErrors));
        },
        function(){
          let myLexer= new Lexer();
          use(myLexer);
          atom("my","my").substitute("value");
          atom("var",["my","my"]);
          atom("def",{"my":"","var":""});
          myLexer.setStart("var");
          let aErrors = myLexer.compile();
          assert.ok(aErrors && aErrors.length > 0 && aErrors[0].indexOf("reuses value atom")>=0,"twice used in depth not reported "+JSON.stringify(aErrors));
        }
      );
      it("Same non-value component is OK",
        function(){
          let myLexer= new Lexer();
          use(myLexer);
          atom("my","my");
          atom("var",["my","my"]);
          myLexer.setStart("var");
          let aErrors = myLexer.compile();
          assert.ok(aErrors==null,"false report in sequence");
        },
        function(){
          let myLexer= new Lexer();
          use(myLexer);
          atom("my","my");
          atom("var",{"my":1,"my":1});
          myLexer.setStart("var");
          let aErrors = myLexer.compile();
          assert.ok(aErrors==null,"false report in choice");
        },
        function(){
          let myLexer= new Lexer();
          use(myLexer);
          atom("my","my");
          atom("var",["my","my"]);
          atom("def",{"my":"","var":""});
          myLexer.setStart("var");
          let aErrors = myLexer.compile();
          assert.ok(aErrors==null,"false report in depth");
        }

      );
    }
  );
describe("Test Overlap",function(){
  it("Same standalone regexp without overlap",
    function(){
      let myLexer= new Lexer();
      use(myLexer);
      atom("my","my").substitute("value").standalone();
      atom("mine","my").substitute("value").standalone();
      myLexer.setStart("my");
      let aErrors = myLexer.compile();
      assert.ok(aErrors!=null && aErrors[0].indexOf("same recognition")>=0,"two standalone atoms with same regexp not reported"+JSON.stringify(aErrors));
    }
  );
}
);
describe("Test start",function(){
  it("No start",
    function(){
      let myLexer= new Lexer();
      use(myLexer);
      atom("my","my").substitute("value").standalone();
      let aErrors = myLexer.compile();
      assert.ok(aErrors!=null && aErrors[0].indexOf("no start")>=0,"missing start not reported "+JSON.stringify(aErrors));
    }
  );
  it("Undefined start",
    function(){
      let myLexer= new Lexer();
      use(myLexer);
      atom("my","my").substitute("value").standalone();
      myLexer.setStart("def");
      let aErrors = myLexer.compile();
      assert.ok(aErrors!=null && aErrors[0].indexOf("undefined start")>=0,"missing start not reported "+JSON.stringify(aErrors));
    }
  );
}
);
