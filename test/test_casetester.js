/* eslint-env mocha */
var assert = require("assert");
var CT = require("./casetester");
let NCT = require("../lib/nearley-casetester.js");
var fs = require("graceful-fs");
const cCompiler = require("../lib/nearley-compiler.js");
const mLexer = require("../lib/lexer-tolerant.js");
const Parser = require("../lib/nearley-tolerant.js").Parser;


function fileContains(sFile,sText)
{
    let sContent = fs.readFileSync(sFile,{encoding:'utf-8'});
    return sContent.indexOf(sText)>=0;
}
function getFoundText(b,nIndent,aRes)
{
    for(let j=0;j<b.length;j++){
        if(b[j]==null)
            continue;
        if( Array.isArray(b[j])){
            getFoundText(b[j],nIndent==-1?nIndent:nIndent+1,aRes)
        }else if( b[j].type=="%unit"){
            /*
            aRes.push("{unitType:'"+b[j].unitType+"',");
            aRes.push("data:'");
            getFoundText(b[j].data,nIndent,aRes);
            aRes.push("'");
            for(let v in b[j]){
                if( v!='type' && v!="data" && v!="unitType" && v!="unit"  && v!="first" && v!="last"){
                    aRes.push(",'"+v+"':"+aRes.push(b[j][v]));
                }
            }
            aRes.push("}");
            */
            aRes.push("{");
            getFoundText(b[j].data,nIndent,aRes);
            aRes.push("}");
            
            if(b[j].value){
                aRes.push("={");
                let bRes = [];
                for(var v in b[j].value){
                    bRes.push(v+"="+b[j].value[v]);
                }
                aRes.push(bRes.join(","));
                aRes.push("}");
            }
            
        }else{
            //aRes.push("["+b[j].type+"="+b[j].text+"]");
            aRes.push(b[j].text);
        }
    }
}
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
function getResultText(r,c,e,nIndent)

{
    let a = [];
    if(nIndent==null)
        nIndent = -1;
    for(let i=0;i<r.length;i++){
        let b = r[i];
        let d=[];
        getArray(b,0,d);
        //console.log(i+":"+c[i]+":"+JSON.stringify(d));
        if(!c[i])
            continue;
        getFoundText(b,nIndent,a);
        
    }
    //console.log(JSON.stringify(a));
    
    return a.join(nIndent==-1?"":"\n");
}

describe.skip("comparison",
    function(){
        it.skip("simple compare string",function(){
            let ct = new CT();
            ct.load("test case 1",[
                {name:"1/1",input:"input",expected:"INPUT"},
                {name:"1/2",input:"input",expected:"INPUT some more"},
                {name:"1/3",input:"input",expected:"INP"},
                {name:"1/4",input:"input",expected:"diff"}
            ]);
            console.log("Result:\n"+ct.performCases((x)=>(x.toUpperCase()),{
                field:"expected",
                format:"text",
                input:true,
                expected:true,
                received:true,
                all: true
            }));
        });
        it.skip("simple compare array",function(){
            let ct = new CT();
            ct.load("test case 2",[
                {name:"1/1",input:[1,2],expected:[1,2]},
                {name:"1/2",input:[1,2],expected:[1,2,3]},
                {name:"1/3",input:[1,2],expected:[1]},
                {name:"1/4",input:[1,2],expected:[4,5]},
            ]);
            console.log("Result:\n"+ct.performCases((x)=>(x),{
                field:"expected",
                format:"text",
                input:true,
                expected:true,
                received:true,
                all: true
            }));
        });
        it.skip("simple compare obj",function(){
            let ct = new CT();
            ct.load("test case 2",[
                {name:"1/1",input:{"a":"a","b":"b"},expected:{"a":"a","b":"b"}},
                {name:"1/2",input:{"a":"a","b":"b"},expected:{"a":"a","b":"b","c":"c"}},
                {name:"1/3",input:{"a":"a","b":"b"},expected:{"a":"a"}},
                {name:"1/4",input:{"a":"a","b":"b"},expected:{"a":"a","b":"c"}},
            ]);
            console.log("Result:\n"+ct.performCases((x)=>(x),{
                field:"expected",
                format:"text",
                input:true,
                expected:true,
                received:true,
                all: true
            }));
        });
        it("simple compare complex",function(){
            let ct = new CT();
            ct.load("test case 2",[
                {name:"1/1",input:[{"a":"a","b":"b"},{"c":"c"}],expected:[{"a":"a","b":"b"},{"c":"c"}]},
                {name:"1/2",input:[{"a":"a","b":"b"}],expected:[{"a":"a","b":"b"},{"c":"c"}]},
                {name:"1/3",input:[{"a":"a","b":"b"},{"c":"c"}],expected:[{"a":"a","b":"b"}]},
                {name:"1/4",input:[{"a":"a","b":"b"},{"c":"c"}],expected:[{"a":"a","b":"b","c":"c"}]},
                {name:"1/5",input:[{"a":"a","b":"c"},{"c":"c"}],expected:[{"a":"a","b":"b","c":"c"}]},
                {name:"1/6",input:[{"a":"a","b":"c"},{"c":"c"}],expected:[{"a":"a","b":"b"}]},
            ]);
            let sOutputFile = "result.txt";
            try{
            fs.unlinkSync(sOutputFile);
            }catch(e){}
            console.log("Result:\n"+ct.performCases((x)=>(x),{
                field:"expected",
                format:"text",
                input:true,
                expected:true,
                received:true,
                all: true,
                outputFile: 'result.txt'
            }));
            assert.ok(fs.existsSync(sOutputFile),"output file not created");
            
            try{
                fs.unlinkSync(sOutputFile);
                }catch(e){}
        });
    }
);
describe.skip("mark found text",function(){
    it("measure",function(){
        //let oInterpreter = require("../grammars/recipe-interpreter.js");

       

        let ct = new CT();
        ct.loadFile("grammars/measure.test.json");
        let oOptions = ct.options;

        let sLexerFile = ct.relativeFile(oOptions.lexer);
        let sGrammarFile = ct.relativeFile(oOptions.grammar);
        
        let oCompiler = new cCompiler();
        let oLexer = require(sLexerFile);

       

        let aMethods = oOptions.methods;
        for(let im=0;im<aMethods.length;im++){
            let sInterpreter = aMethods[im].interpreter;
            if( sInterpreter == "default" ){
                sInterpreter = "../lib/default-interpreter.js";
            }else if( sInterpreter == "none"){
                sInterpreter = null;
            }
            let sInterpreterFile = sInterpreter?ct.relativeFile(sInterpreter):null;
            let oInterpreter = sInterpreterFile?require(sInterpreterFile):null;
            console.log("----------------------------------");
            let hParserTable = oCompiler.compileFile(sGrammarFile,{"json":"","out":"grammars/measure.json"});
            let oParser = oCompiler.createParser(hParserTable,oLexer,oInterpreter,{"tolerant":true,"keepHistory":true}); //new Parser(hParserTable.ParserRules,"start",{lexer:oLexicalParser});
            let oLexicalParser = oParser.lexer;
            let sMethod = aMethods[im].method;
            let sTestField = aMethods[im].field;
            let sOutputFile = aMethods[im].file;
            console.log("Method:"+sMethod);
            ct.performCases((x)=>{
                console.log("TEST CASE "+x);
                oLexicalParser.reset(x);
                oParser.init();
                let aRes = [];
                for(let i=0;i<100;i++){
                    console.log("Sequence:"+i)
                    oParser.feed(x);
                    if( oParser.results==null)
                        break;
                    let sReceived = getResultText(oParser.results,oParser.completed,oParser.expected);
                    
                    aRes.push(sReceived);
                    if(oParser.finished)
                        break;
                    oParser.carryOn();
                }
                return aRes;
            },{
                field:sTestField,
                format:"text",
                input:true,
                expected:true,
                received:true,
                all: true,
                outputFile:sOutputFile
            })
        }

        /**
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
        **/
    });
    }
);
describe.skip("case tester compilation errors",function(){
    it("Compile non-test file",function(){
        let nct = new NCT();
        let sError = nct.perform({testfile:"grammars/nosuch.ne"});
        assert.ok(sError.indexOf("input file extension is not '.test.json'")>0,"loading error not detected");
        //assert.ok(fs.existsSync("grammars/nosuch.err.txt"),"loading error file not found");
        //assert.ok(fileContains("grammars/nosuch.err.txt","no such file or directory"),"error file does not contain 'no such file'");
    });
    it("Compile non-existing test file",function(){
        let nct = new NCT();
        let sError = nct.perform({testfile:"grammars/bad/nosuch.test.json"});
        assert.ok(sError.indexOf("loading error")>0,"loading error not detected");
        assert.ok(fs.existsSync("grammars/bad/nosuch.test.err.txt"),"loading error file not found");
        assert.ok(fileContains("grammars/bad/nosuch.test.err.txt","no such file or directory"),"error file does not contain 'no such file'");
    });
    it("Compile non-JSON test file",function(){
        let nct = new NCT();
        let sError = nct.perform({testfile:"grammars/bad/nojson.test.json"});
        assert.ok(sError.indexOf("loading error")>0,"loading error not detected");
        assert.ok(fs.existsSync("grammars/bad/nojson.test.err.txt"),"loading error file not found");
        assert.ok(fileContains("grammars/bad/nojson.test.err.txt","Unexpected token"),"error file does not contain 'Unexpected token'");
    });
    it("Compile non-existing grammar file",function(){
        let nct = new NCT();
        let sError = nct.perform({testfile:"grammars/bad/nosuchgrammar.test.json"});
        assert.ok(sError.indexOf("grammar file does not exist")>0,"not reported: grammar file does not exist");
        assert.ok(fs.existsSync("grammars/bad/nosuchgrammar.test.err.txt"),"loading error file not found");
        assert.ok(fileContains("grammars/bad/nosuchgrammar.test.err.txt","grammar file does not exist"),"error does not contain 'grammar file does not exist'");
    });
    it("Compile non-existing lexer file",function(){
        let nct = new NCT();
        let sError = nct.perform({testfile:"grammars/bad/nosuchlexer.test.json"});
        assert.ok(sError.indexOf("lexer file does not exist")>0,"not reported: lexer file does not exist");
        assert.ok(fs.existsSync("grammars/bad/nosuchlexer.test.err.txt"),"loading error file not found");
        assert.ok(fileContains("grammars/bad/nosuchlexer.test.err.txt","lexer file does not exist"),"error does not contain 'lexer file does not exist'");
    });
    it("Compile bad lexer file",function(){
        let nct = new NCT();
        let sError = nct.perform({testfile:"grammars/bad/badlexer.test.json"});
        assert.ok(sError.indexOf("lexer file invalid javascript")>0,"not reported: lexer file invalid");
        assert.ok(fs.existsSync("grammars/bad/badlexer.test.err.txt"),"loading error file not found");
        assert.ok(fileContains("grammars/bad/badlexer.test.err.txt","lexer file invalid javascript"),"error does not contain 'lexer file invalid javascript'");
    });
    it("Compile bad syntax grammar file",function(){
        let nct = new NCT();
        let sTestFile = "grammars/bad/badgrammar-syntax"
        let sError = nct.perform({testfile:sTestFile+".test.json"});
        assert.ok(sError.indexOf("invalid grammar file")>0,"not reported: invalid grammar file");
        assert.ok(fs.existsSync(sTestFile+".test.err.txt"),"loading error file not found");
        assert.ok(fileContains(sTestFile+".test.err.txt","invalid grammar file"),"error does not contain 'invalid grammar file'");
    });
    it("Compile bad grammar file",function(){
        let nct = new NCT();
        let sTestFile = "grammars/bad/badgrammar-missingnonterminal"
        let sError = nct.perform({testfile:sTestFile+".test.json"});
        assert.ok(sError.indexOf("invalid grammar file")>0,"not reported: invalid grammar file");
        assert.ok(fs.existsSync(sTestFile+".test.err.txt"),"loading error file not found");
        assert.ok(fileContains(sTestFile+".test.err.txt","invalid grammar file"),"error does not contain 'invalid grammar file'");
    });
    it("Compile incompatible lexer file",function(){
        let nct = new NCT();
        let sTestFile = "grammars/bad/incompatible-grammar-lexer"
        let sError = nct.perform({testfile:sTestFile+".test.json"});
        assert.ok(sError.indexOf("invalid grammar file")>0,"not reported: invalid grammar file");
        assert.ok(fs.existsSync(sTestFile+".test.err.txt"),"loading error file not found");
        assert.ok(fileContains(sTestFile+".test.err.txt","invalid grammar file"),"error does not contain 'invalid grammar file'");
    });
    
});

describe.skip("case tester compiler output switches",function(){
    it("Compile without compilation output", function(){
        let nct = new NCT();
        let sTestFile = "grammars/good/measure"
        let sError = nct.perform({testfile:sTestFile+".test.json"});
        assert.ok(sError==null,"errors detected:"+sError);
    });
    it("Compile with JSON output", function(){
        let nct = new NCT();
        let sTestFile = "grammars/good/measure"
        try{fs.unlinkSync(sTestFile+".json");}
        catch(e){
            //
        }
        let sError = nct.perform({testfile:sTestFile+".test.json","json":true});
        assert.ok(sError==null,"errors detected:"+sError);
        assert.ok(fs.existsSync(sTestFile+".json"),"JSON created");
    });
    it("Compile with JS output", function(){
        let nct = new NCT();
        let sTestFile = "grammars/good/measure"
        try{fs.unlinkSync(sTestFile+".js");}
        catch(e){
            //
        }
        let sError = nct.perform({testfile:sTestFile+".test.json","js":true});
        assert.ok(sError==null,"errors detected:"+sError);
        assert.ok(fs.existsSync(sTestFile+".js"),"JS created");
    });
    it("Compile with RR output", function(){
        let nct = new NCT();
        let sTestFile = "grammars/good/measure"
        try{fs.unlinkSync(sTestFile+".html");}
        catch(e){
            //
        }
        try{fs.unlinkSync(sTestFile+".js");}
        catch(e){
            //
        }
        try{fs.unlinkSync(sTestFile+".json");}
        catch(e){
            //
        }
        let sError = nct.perform({testfile:sTestFile+".test.json","railroad":true});
        assert.ok(sError==null,"errors detected:"+sError);
        assert.ok(fs.existsSync(sTestFile+".html"),"HTML created");
        assert.ok(!fs.existsSync(sTestFile+".js"),"JS should not be created");
        assert.ok(!fs.existsSync(sTestFile+".json"),"JSON should not be created");
    });
});

describe("case tester output switches",function(){
    it.skip("Perform test without compilation output", function(){
        let sTestFile = "grammars/good/measure"
        try{fs.unlinkSync(sTestFile+".test.txt");}
        catch(e){
            //
        }
        try{fs.unlinkSync(sTestFile+".test.html");}
        catch(e){
            //
        }
        let nct = new NCT();
        let sError = nct.perform({testfile:sTestFile+".test.json"});
        assert.ok(sError==null,"errors detected:"+sError);
    });
    it.skip("Perform test with some errors", function(){
        let sTestFile = "grammars/good/measure-errors"
        try{fs.unlinkSync(sTestFile+".test.txt");}
        catch(e){
            //
        }
        try{fs.unlinkSync(sTestFile+".test.html");}
        catch(e){
            //
        }
        let nct = new NCT();
        let sError = nct.perform({testfile:sTestFile+".test.json"});
        assert.ok(sError!=null,"no errors detected?");
        console.log(sError);
    });
    it("Perform single method test", function(){
        let sTestFile = "grammars/good/measure-errors"
        try{fs.unlinkSync(sTestFile+".test.txt");}
        catch(e){
            //
        }
        try{fs.unlinkSync(sTestFile+".test.html");}
        catch(e){
            //
        }
        let nct = new NCT();
        let sError = nct.perform({testfile:sTestFile+".test.json",method:"Sequence"});
        assert.ok(sError!=null,"no errors detected?");
        console.log(sError);
    });
    it("Perform single case test", function(){
        let sTestFile = "grammars/good/measure-errors"
        try{fs.unlinkSync(sTestFile+".test.txt");}
        catch(e){
            //
        }
        try{fs.unlinkSync(sTestFile+".test.html");}
        catch(e){
            //
        }
        let nct = new NCT();
        let sError = nct.perform({testfile:sTestFile+".test.json",case:"1/1"});
        assert.ok(sError!=null,"no errors detected?");
        console.log(sError);
    });
});