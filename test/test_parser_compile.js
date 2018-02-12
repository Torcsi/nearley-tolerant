const assert = require("assert");
const fs = require("graceful-fs");
const cCompiler = require("../lib/nearley-compiler.js");
const mLexer = require("../lib/lexer-tolerant.js");
const Parser = require("../lib/nearley-tolerant.js").Parser;

function getArray(b,nIndent,aRes)
{
    var sIndent = nIndent==-1?"":Array(nIndent).join(" ");
    if( nIndent==-1)
        aRes.push("[");
    for(let j=0;j<b.length;j++){
        if(b[j]==null)
            continue;
        if( Array.isArray(b[j])){
            getArray(b[j],nIndent==-1?nIndent:nIndent+1,aRes)
            if(nIndent==-1 && j!=b.length-1)
                aRes.push(",");
        }else{
            aRes.push(sIndent+b[j].type+" \""+b[j].text+"\""+(b[j].getValue?"="+b[j].getValue():""));
            if(nIndent==-1 && j!=b.length-1)
                aRes.push(",");
        }
    }
    if( nIndent==-1)
        aRes.push("]");

}
function getResults(r,c,e,nIndent)
{
    let a = [];
    if(nIndent==null)
        nIndent = -1;
    for(let i=0;i<r.length;i++){
        let b = r[i];
        a.push("{Production:"+i+", completed="+c[i]+(c[i]?"":(", expected:"+JSON.stringify(e[i])))+" ");
        getArray(b,nIndent,a);
        if(nIndent==-1){
            a.push("}")
        }
    }
    return a.join(nIndent==-1?"":"\n");
}
describe("nearley compiler interface",
function(){
    describe("Basic compile from file",
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
                    oCompiler.compileFile("grammars/flat.ne",{"out":"grammars/flat.js","export":"grammar","rr":""});
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
    describe("Basic compile from string",
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
    describe("Lexer compile bad files",
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
                //console.log(aErrors[0]);
                assert.ok(fs.existsSync("grammars/bad/recipe-with-warning.js"),"file exists");
                assert.ok(aErrors!=null && aErrors[0].indexOf("Undefined symbol")>=0,"maybe no or different error reported "+aErrors[0]);

            }
            );
            it("Compile missing terminal recipe file",
            function(){
                let oCompiler = new cCompiler();
                let aErrors = oCompiler.compileFile("grammars/bad/recipe-bad-missinglexelement.ne",{"out":"grammars/bad/recipe-bad-missinglexelement.js","export":"grammar","test":""});
                //console.log(aErrors[0]);
                assert.ok(fs.existsSync("grammars/bad/recipe-bad-missinglexelement.js"),"file exists");
                assert.ok(aErrors!=null && aErrors[0].indexOf("is not defined")>=0,"maybe no or different error reported "+aErrors[0]);

            }
            );
        
        }
    );
    describe("Lexer/interpreter combination with parser",
    
        function(){
            it("Undefined token in lexer",
            function(){
                let oCompiler = new cCompiler();
                let hParserTable = oCompiler.compileFile("grammars/recipe-base.ne",{"json":""});
                let oLexer = require("../grammars/bad/recipe-lexer-missingtype.js");
                let oInterpreter = require("../grammars/bad/recipe-interpreter-missingfunction.js");
                let aErrors = oCompiler.linkGrammar(hParserTable,oLexer,oInterpreter)
                let sErrors= aErrors == null ?"no error detected":"\n\t"+aErrors.join("\n\t");
                assert.ok(aErrors && aErrors.length>=0 && aErrors[0].indexOf("not defined in lexical analyzer")>0,"missing report of undefined token "+sErrors);
                assert.ok(aErrors && aErrors.length>=1 && aErrors[1].indexOf("function is not defined")>0,"missing report of undefined function "+sErrors);
                //aErrors = oCompiler.addInterpreter(hParserTable,oInterpreter);
                //console.log(JSON.stringify(aErrors));
            }
            )
        }
    );
    describe("Lexer compile with file",
    function(){
        it("Compile proper recipe file",
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
       
        it("Compile recipe file to memory only add external lexer and interpreter",
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
                let oLexer = require("../grammars/recipe-lexer.js");
                let oInterpreter = require("../grammars/recipe-interpreter.js");

                let hParserTable = oCompiler.compileFile("grammars/recipe-base.ne",{"json":""});
                let oParser = oCompiler.createParser(hParserTable,oLexer,oInterpreter); //new Parser(hParserTable.ParserRules,"start",{lexer:oLexicalParser});
                let oLexicalParser = oParser.lexer;

                let sText = "RECIPE dough INGREDIENTS 1 l water 1 kg flour 1 g sugar STEPS 1 MIX flour 2 WAIT little"

                oLexicalParser.reset(sText);
                oParser.init();

                sExpected = '{Production:0, completed=true [recipe "RECIPE",white " ",name "dough",white " ",[ingredients "INGREDIENTS",white " ",[[[number "1",white " ",volume "l",white " ",name "water",white " "],[[number "1",white " ",weight "kg",white " ",name "flour",white " "]],[[number "1",white " ",weight "g",white " ",name "sugar",white " "]]]]],[steps "STEPS",[white " ",[number "1",white " ",[verb "MIX",white " ",subject "flour"]],[white " ",[number "2",white " ",[verb "WAIT",white " ",subject "little"]]]]]]}';
                try{
                    for(;;){
                        oParser.feed(sText);
                        sReceived = getResults(oParser.results,oParser.completed,oParser.expected);
                        if( oParser.results==null)
                            break;
                        //console.log("Results:\n"+sReceived+":"+JSON.stringify(oParser.expected));
                        assert.equal(sReceived,sExpected,"not the expected output for Parse sample");
                        if(oParser.finished)
                            break;
                        oParser.carryOn();
                    }
                }catch(e){
                    console.log(e.message);
                    console.log(e.stack);
                    assert.fail(e.message+"\n"+e.stack);
                }
                            
                

            }
        );
        it("Parse with unparseable parts",
            function(){
                let oCompiler = new cCompiler();
                let oLexer = require("../grammars/measure-lexer.js");
                let oInterpreter = require("../grammars/recipe-interpreter.js");

                let hParserTable = oCompiler.compileFile("grammars/measure.ne",{"json":"","out":"grammars/measure.json"});
                let oParser = oCompiler.createParser(hParserTable,oLexer,oInterpreter,{"tolerant":true,"keepHistory":true}); //new Parser(hParserTable.ParserRules,"start",{lexer:oLexicalParser});
                let oLexicalParser = oParser.lexer;

                let sText = "Recipe: 1 kg flour, 2 l milk, mix well; add 3 eggs, mix again"

                oLexicalParser.reset(sText);
                oParser.init();

                aExpected = [
                    '{Production:0, completed=true [[measure "1 kg",space " ",name "flour"],[[[[],[comma ", ",[measure "2 l",space " ",name "milk"]]]]]]}',
                    '{Production:0, completed=false, expected:{"rule":"start$subexpression$1","symbols":{"action":true,"comma":true}} [[measure "3",space " ",name "eggs"]]}{Production:1, completed=true [[measure "3",space " ",name "eggs"],[[[]]]]}'
                ];
                try{
                    let oResult;
                    for(let i=0;(oResult = oParser.get())!=null;i++){
                        let sReceived = getResults(oResult.results,oParser.completed,oParser.expected)
                        assert.equal(aExpected[i],sReceived," example no."+i+' does not match')
                    }
                }catch(e){
                    console.log(e.message);
                    console.log(e.stack);
                    assert.fail(e.message+"\n"+e.stack);
                }
                            
            }
        )
        it("Parse overlapping",
            function(){
                let oCompiler = new cCompiler();
                let oLexer = require("../grammars/overlap-lexer.js");
                let oInterpreter = require("../grammars/recipe-interpreter.js");

                let hParserTable = oCompiler.compileFile("grammars/overlap.ne",{"json":"","out":"grammars/overlap.json"});
                let oParser = oCompiler.createParser(hParserTable,oLexer,oInterpreter,{"tolerant":true,"keepHistory":true}); //new Parser(hParserTable.ParserRules,"start",{lexer:oLexicalParser});
                let oLexicalParser = oParser.lexer;

                let sText = "Recipe: 1 kg flour, 2 g salt, that is 2 g/l"

                oLexicalParser.reset(sText);
                oParser.init();

                let aExpected = [
                   '{Production:0, completed=false, expected:null [[kgWeight "1"="1":1000,kg " kg"]]}{Production:1, completed=true [[kgWeight "1"="1":1000,kg " kg"],[]]}',
                   '{Production:0, completed=false, expected:null [[gramWeight "2"=2,g " g"]]}{Production:1, completed=true [[gramWeight "2"=2,g " g"],[]]}',
                   '{Production:0, completed=true [[number "2"=2,gpl " g/l"],[]]}'

                ];
                try{
                    for(let i=0;i<100;i++){
                        oParser.feed(sText);
                        if( oParser.results==null)
                            break;
                        let sReceived = getResults(oParser.results,oParser.completed,oParser.expected);
                        //console.log("Results "+i+"\n"+sReceived);
                        assert.equal(aExpected[i],sReceived," example no."+i+' does not match')
                        if(oParser.finished)
                            break;
                        oParser.carryOn();
                    }
                }catch(e){
                    console.log(e.message);
                    console.log(e.stack);
                    assert.fail(e.message+"\n"+e.stack);
                }
                
            }
        )
    }
    )
}
);