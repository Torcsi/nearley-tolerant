const assert = require("assert");
const cCompiler = require("../lib/nearley-compiler.js");
const fs = require("graceful-fs");
const mLexer = require("../lib/lexer-tolerant.js");
const Parser = require("../lib/nearley-tolerant.js").Parser;

function getArray(b,nIndent,aRes)
{
    var sIndent = Array(nIndent).join(" ");
    for(let j=0;j<b.length;j++){
        if(b[j]==null)
            continue;
        if( Array.isArray(b[j])){
            getArray(b[j],nIndent+1,aRes)
        }else{
            aRes.push(sIndent+b[j].type+" "+b[j].text);
        }
    }

}
function getResults(r,nIndent)
{
    let a = [];
    if(nIndent==null)
        nIndent = 0;
    for(let i=0;i<r.length;i++){
        let b = r[i];
        getArray(b,nIndent,a);
    }
    return a.join("\n");
}
describe("nearley compiler interface",
function(){
    describe.skip("Basic compile from file",
        function(){
            it("Report missing grammar file",
                function(){
                    let oCompiler = new cCompiler();
                    try{
                        oCompiler.compileFile("grammars/MISSING.ne",{"out":"data/flat.js"});
                        assert.fail("exception not caught");
                    }
                    catch(e){
                        assert.ok("exception caught");
                    }

                }
            );
            it("Report missing output file",
                function(){
                    let oCompiler = new cCompiler();
                    try{
                        oCompiler.compileFile("grammars/flat.ne");
                        assert.fail("exception not caught");
                    }
                    catch(e){
                        assert.ok("exception caught");
                    }

                }
            );
            it("Compile flat file",
                function(){
                    let oCompiler = new cCompiler();
                    oCompiler.compileFile("grammars/flat.ne",{"out":"grammars/flat.js","export":"grammar"});
                    assert.ok(fs.existsSync("grammars/flat.js"),"file exists")
                }
            )
            it("Compile flat file to JSON object",
                function(){
                    let oCompiler = new cCompiler();
                    let oResult = oCompiler.compileFile("grammars/flat.ne",{"out":"grammars/flat.json","export":"grammar","json":"yes"});
                    JSON.stringify(oResult);
                    assert.ok(oResult.ParserStart,"result is basically a parser table, must have a ParserStart");
                    assert.ok(fs.existsSync("grammars/flat.json"),"file exists")

                }
            )
            it("Compile flat file to JSON object with interpreter, without lexer",
                function(){
                    let oCompiler = new cCompiler();
                    let oResult = oCompiler.compileFile("grammars/flat-interpreter.ne",{"out":"grammars/flat-interpreter.json","json":"yes"});
                    
                    let sResult = JSON.stringify(oResult);
                    assert.ok(oResult.ParserStart,"result is basically a parser table, must have a ParserStart");
                    assert.ok(fs.existsSync("grammars/flat-interpreter.json"),"file exists")
                    assert.ok(sResult.indexOf("\"postprocess\":[\"literal\"")>0,"file must contain a literal postprocess")
                }
            )
        }
    );
    describe.skip("Basic compile from string",
    function(){
        it("Compile flat string to JSON object",
        function(){
            let oCompiler = new cCompiler();
            let oResult = oCompiler.compileString('start -> "foo" "bar"');
            assert.ok(oResult.ParserStart,"result is basically a parser table, must have a ParserStart");
        });
        it("Compile flat string to JSON object",
        function(){
            let oCompiler = new cCompiler();
            let oResult = oCompiler.compileString('@lexer myLexer\nstart -> %foo "bar"');
            assert.ok(oResult.ParserStart,"result is basically a parser table, must have a ParserStart");
            let sResult = JSON.stringify(oResult);
            assert.ok(sResult.indexOf("\"terminal\":\"foo\"")>0,"file must a terminal reference")
            assert.ok(sResult.indexOf("\"literal\":\"bar\"")>0,"file must a literal reference")
        });
        it("Compile flat string to JSON object with interpreter",
        function(){
            let oCompiler = new cCompiler();
            let oResult = oCompiler.compileString('@lexer myLexer\n@interpreter interpreter\nstart -> %foo "bar"{%"start"%}');
            assert.ok(oResult.ParserStart,"result is basically a parser table, must have a ParserStart");
            let sResult = JSON.stringify(oResult);
            assert.ok(sResult.indexOf("\"postprocess\":\"start\"")>0,"file contain a postprocess")
        });
    }
    );
    describe.skip("Lexer compile bad files",
        function(){
            it("Missing grammar",
                function(){
                    let oCompiler = new cCompiler();
                    let aErrors = oCompiler.compileFile("grammars/recipe-missing.ne",{"out":"grammars/bad/recipe-bad.js","export":"grammar"});
                    assert.ok(aErrors!=0 && aErrors[0].indexOf("no such file")>=0,"error reported "+aErrors[0]);
                }
            );
            it("Bad constant JS",
                function(){
                    let oCompiler = new cCompiler();
                    let aErrors = oCompiler.compileFile("grammars/bad/recipe-bad-badconstantjs.ne",{"out":"grammars/bad/recipe-badconstantjs.js","export":"grammar","test":""});
                    assert.ok(aErrors!=0,"error not reported");
                }
            );
            it("No lexer",
                function(){
                    let oCompiler = new cCompiler();
                    let aErrors = oCompiler.compileFile("grammars/bad/recipe-bad-nolexer.ne",{"out":"grammars/bad/recipe-bad-nolexer.js","export":"grammar","test":""});
                    assert.ok(aErrors!=0,"error not reported");
                }
            );
            it("Bad lexer",
            function(){
                let oCompiler = new cCompiler();
                let aErrors = oCompiler.compileFile("grammars/bad/recipe-bad-badlexer.ne",{"out":"grammars/bad/recipe-bad-badlexer.js","export":"grammar","test":""});
                assert.ok(aErrors!=null,"error not reported");
            }
            );
            it("Compile missing nonterminal in recipe file",
            function(){
                let oCompiler = new cCompiler();
                let aErrors = oCompiler.compileFile("grammars/bad/recipe-with-warning.ne",{"out":"grammars/bad/recipe-with-warning.js","export":"grammar","test":""});
                console.log(aErrors[0]);
                assert.ok(fs.existsSync("grammars/bad/recipe-with-warning.js"),"file exists");
                assert.ok(aErrors!=null && aErrors[0].indexOf("Undefined symbol")>=0,"maybe no or different error reported "+aErrors[0]);

            }
            );
            it("Compile missing terminal recipe file",
            function(){
                let oCompiler = new cCompiler();
                let aErrors = oCompiler.compileFile("grammars/bad/recipe-bad-missinglexelement.ne",{"out":"grammars/bad/recipe-bad-missinglexelement.js","export":"grammar","test":""});
                console.log(aErrors[0]);
                assert.ok(fs.existsSync("grammars/bad/recipe-bad-missinglexelement.js"),"file exists");
                assert.ok(aErrors!=null && aErrors[0].indexOf("is not defined")>=0,"maybe no or different error reported "+aErrors[0]);

            }
            );
        
        }
    );
    describe.skip("Lexer/interpreter combination with parser",
    
        function(){
            it("Unidefined token in lexer",
            function(){
                let oCompiler = new cCompiler();
                let hParserTable = oCompiler.compileFile("grammars/recipe-base.ne",{"json":""});
                let oLexer = require("../grammars/bad/recipe-lexer-missingtype.js");
                let oInterpreter = require("../grammars/bad/recipe-interpreter-missingfunction.js");
                let aErrors = oCompiler.linkGrammar(hParserTable,oLexer,oInterpreter)
                let sErrors= aErrors == null ?"no error detected":"\n\t"+aErrors.join("\n\t");
                assert.ok(aErrors.length>=0 && aErrors[0].indexOf("not defined in lexical analyzer")>0,"missing report of undefined token"+sErrors);
                assert.ok(aErrors.length>=1 && aErrors[1].indexOf("function is not defined")>0,"missing report of undefined function"+sErrors);
                //aErrors = oCompiler.addInterpreter(hParserTable,oInterpreter);
                //console.log(JSON.stringify(aErrors));
            }
            )
        }
    );
    describe("Lexer compile with file",
    function(){
        it.skip("Compile proper recipe file",
            function(){
                let oCompiler = new cCompiler();
                oCompiler.compileFile("grammars/recipe-base.ne",{"out":"grammars/recipe-base.js","export":"grammar1"});
                assert.ok(fs.existsSync("grammars/recipe-base.js"),"file exists");
                try{
                    let myParser = require('../grammars/recipe-base.js');
                }
                catch(e){
                    console.error(""+e.stack);
                    assert.fail("parser cannot be loaded:"+e.message);
                }

            }
        );
        it("Compile recipe file to JSON file, with external lexer and interpreter",
            function(){
                let oCompiler = new cCompiler();
                let hParser = oCompiler.compileFile("grammars/recipe-base.ne",{"out":"grammars/recipe-base.json","json":""});
                //console.log(JSON.stringify(hParser));
            }
        );
       
        it.skip("Compile recipe file to memory only add external lexer and interpreter",
            function(){
                let oCompiler = new cCompiler();
                let hParserTable = oCompiler.compileFile("grammars/recipe-base.ne",{"json":""});
                let oLexer = require("../grammars/recipe-lexer.js");
                let oInterpreter = require("../grammars/recipe-interpreter.js");
                /*
                let aErrors = oCompiler.addLexer(hParserTable,oLexer);
                console.log("Errors:"+JSON.stringify(aErrors));
                aErrors = oCompiler.addInterpreter(hParserTable,oInterpreter);
                console.log(JSON.stringify(aErrors));
                */
                let aErrors = oCompiler.linkGrammar(hParserTable,oLexer,oInterpreter)
                let sErrors= aErrors == null ?"no error detected":"\n\t"+aErrors.join("\n\t");
                assert.ok(aErrors==null,"some errors found:"+sErrors);
            }
        )
        it("Parse sample",
            function(){
                let oCompiler = new cCompiler();
                let hParserTable = oCompiler.compileFile("grammars/recipe-base.ne",{"json":""});
                let oLexer = require("../grammars/recipe-lexer.js");
                let aErrors = oLexer.compile();
                if( aErrors!=null){
                    console.log(aErrors);
                }
                let oInterpreter = require("../grammars/recipe-interpreter.js");
                aErrors = oCompiler.linkGrammar(hParserTable,oLexer,oInterpreter);

                let sText = 
//"RECIPE dough INGREDIENTS 1 l water 1 kg flour STEPS 1 MIX flour INTO water 2 WAIT"
"RECIPE dough INGREDIENTS 1 l water 1 kg flour 1 g sugar STEPS 1 MIX flour 2 WAIT little"
                let oLexicalParser = new mLexer.LexicalParser("");
                let oParser = new Parser(hParserTable.ParserRules,"start",{lexer:oLexicalParser});
                

                 oLexicalParser.reset(sText);
                 oLexicalParser.start(oLexer,0);
                oParser.init();
                //console.log("Test case:"+x);
                try{
                    for(;;){
                        oParser.feed(sText);
                        console.log("Results 1:\n"+getResults(oParser.results));
                        if(oParser.finished)
                            break;
                        oParser.carryOn();
                    }
                    /** 
                    sText = "RECIPE caramel INGREDIENTS 1 kg sugar STEPS 1 MIX flour 2 WAIT little";
                    oLexicalParser.reset(sText)
                    oParser.init();
                    for(;;){
                        oParser.feed(sText);
                        console.log("Results 2:\n"+getResults(oParser.results));
                        if(oParser.finished)
                            break;
                        oParser.carryOn();
                    }
                    */
                    
                }catch(e){
                    console.log(e.message);
                    console.log(e.stack);
                }
                            
                

            }
        )
    }
    )
}
);