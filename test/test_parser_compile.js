const assert = require("assert");
const cCompiler = require("../lib/nearley-compiler.js");
const fs = require("graceful-fs");
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
    }
    )
}
);