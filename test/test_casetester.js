var assert = require("assert");
var CT = require("./casetester");
var fs = require("graceful-fs");
const cCompiler = require("../lib/nearley-compiler.js");
const mLexer = require("../lib/lexer-tolerant.js");
const Parser = require("../lib/nearley-tolerant.js").Parser;


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
describe("mark found text",function(){
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
})