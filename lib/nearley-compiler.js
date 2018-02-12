let compiler = require('./compile.js');
let nearley = require("./nearley.js");
let fs = require('graceful-fs');
let parserGrammar = require('./nearley-language-bootstrapped.js');
let lint = require("./lint.js");
let generate = require("./generate.js");
let nearleyTolerant = require("./nearley-tolerant.js");
let railroad = require("./nearley-railroad.js");

class ErrorReporter
{
    constructor()
    {
        this._errors = [];
    }
    write(s){
        this._errors.push(s);
    }
    get anyErrors(){
        return this._errors.length != 0
    }
    get errors(){
        return this._errors;
    }

}
class NearleyCompiler{
    /**
     * compile sFileName, according to the given options
     * @param {string} sFileName 
     * @param {{export:string},{out:|string},{json:boolean}}} hOpts 
     * @return {object} parser object if hOpts.json, null otherwise
     */
    compileFile(sFileName,hOpts){
        let errorReporter = new ErrorReporter();
        try{
            hOpts = this._setDefaults(hOpts);
            hOpts.file = sFileName;
            
            var oParser = new nearley.Parser(parserGrammar.ParserRules, parserGrammar.ParserStart);

            let sContent = fs.readFileSync(sFileName,{encoding:'utf-8'});
            
            let oStructure = oParser.feed(sContent).results[0]
            if( oStructure == null){
                //console.log("### FAILED NE parse ");
                errorReporter.write("invalid syntax");
                return errorReporter.errors;
            }
            let c = compiler(oStructure,hOpts);
            //console.log("### COMPILES "+JSON.stringify(c));
            lint(c, {'out': errorReporter});
            let sCompiled = generate(c, hOpts.export);
            if(hOpts.out){
                fs.writeFileSync(hOpts.out,sCompiled,{encoding:"utf-8"});
            }
            
            if( "test" in hOpts){
                try{
                    if( hOpts.out) {
                        let k = require("../"+hOpts.out);
                        
                    }else if( hOpts.json ){
                        let o = JSON.parse(sCompiled);
                    }else{
                        let v = eval(sCompiled);
                    }
                }      
                catch(e){
                    //console.log(process.cwd());
                    errorReporter.write(e.message);
                }
            }
            if( "rr" in hOpts){
                let sHTMLFileName
                if( hOpts.rr == "")
                    sHTMLFileName = sFileName.replace(/\.ne$/,".html");
                else   
                    sHTMLFileName = hOpts.rr;
                let sRailRoad = railroad(oStructure);
                fs.writeFileSync(sHTMLFileName,sRailRoad,{encoding:"utf-8"});
            }
            if( errorReporter.anyErrors )
                return errorReporter.errors;
            //console.log("### COMPILED"+sCompiled)
            return "json" in hOpts?JSON.parse(sCompiled):null;
        }catch(e){
            //console.log("### FAILED"+e.message+(""+e.stack));
            errorReporter.write(e.message);
            return errorReporter.errors;
        }

        
    }
    /**
     * compile grammar from string, with JSON default opts
     * @param {*} sParser 
     */
    compileString(sParser){
        let hOpts = {"json":true};
        var oParser = new nearley.Parser(parserGrammar.ParserRules, parserGrammar.ParserStart);
        let oStructure = oParser.feed(sParser).results[0]
        
        let c = compiler(oStructure,hOpts);
        lint(c, {'out': process.stderr});
        let sCompiled = generate(c, hOpts);
        //console.log("### Compiled grammar:"+sCompiled);
        return JSON.parse(sCompiled);
        
    }
    /**
     * @private
     * @param {object} hOpts 
     */
    _setDefaults(hOpts){
        if( hOpts == null )
            hOpts = {};
        if( !hOpts.export){
            hOpts.export = "grammar"
        }
        return hOpts;
    }
    
    addLexer(hTable,oLexer,aErrors)
    {   

        if( aErrors == null )
            aErrors = [];
        let t = hTable.ParserRules;
        let sStart = null;
        if(oLexer.resetStart){
            oLexer.resetStart();
            sStart = hTable.ParserStart;
        }
        for(let i = 0;i<t.length;i++){
            let r = t[i];
            let aS = r.symbols;
            let sRuleName = r.name.replace(/\$.*$/,"");
            for(let j=0;j<aS.length;j++){
                let v = aS[j];
                if( typeof(v)!=="object")
                    continue;
                if( !("terminal" in v) )
                    continue;
                let sTerminal = v.terminal;
                if( !oLexer.has(sTerminal)){
                    aErrors.push("rule: "+sRuleName+", terminal: "+sTerminal+" is not defined in lexical analyzer");
                }else{
                    v.type = v.terminal;
                }
            }
        }
        return aErrors.length == 0 ? null : aErrors;
    }
    addInterpreter(hTable,oInterpreter,aErrors)
    {
        if( aErrors == null )
            aErrors = [];
        let t = hTable.ParserRules;
        //console.log("Interpreter functions:")
        //for(var v in oInterpreter){
        //    console.log("Interpreter function:"+v);
        //}
        for(let i = 0;i<t.length;i++){
            let r = t[i];
            let aS = r.symbols;
            let sRuleName = r.name.replace(/\$.*$/,"");
            if(!("postprocess" in r ))
                continue;
            if( oInterpreter == null){
                delete r.postprocess;
                continue;
            }
            let vPostprocess = r.postprocess;
            if( typeof(vPostprocess) == "string"){
                if( !(vPostprocess in oInterpreter) ){
                    aErrors.push("rule: "+sRuleName+", postprocess: '"+vPostprocess+"': function is not defined in rule interpreter");
                }else{
                    let fMethod = oInterpreter[vPostprocess];
                    //r.postprocess = (data)=>fMethod.apply(oInterpreter,data);
                    r.postprocess = (data)=>{ return fMethod.call(oInterpreter,data) };
                }
            }else if( Array.isArray(vPostprocess)){
                if( vPostprocess.length == 0){
                    // id
                    r.postprocess = (data)=>(data[0]);
                }else{
                    let sFunctionName = vPostprocess[0];
                    if( !(sFunctionName in oInterpreter) ){
                        aErrors.push("rule: "+sRuleName+", postprocess: '"+sFunctionName+"': function is not defined in rule interpreter");
                    }else{
                        let fMethod = oInterpreter[sFunctionName];
                        //! parameter setup!                        
                        r.postprocess = (data)=>{ 
                            //console.log("### procarr:" +r.name+"->"+sFunctionName+" params "+data.length+this.dumpArray(data)); 
                            return fMethod.call(oInterpreter,data) 
                        };
                    }
                        
                }
            }else{
                // object interpreter
                let sFunctionName = "process";
                if( "function" in vPostprocess ){
                    sFunctionName = vPostprocess.function
                }
                if( !(sFunctionName in oInterpreter) ){
                    console.log("NO POSTPROCESS "+JSON.stringify(vPostprocess));
                    aErrors.push("rule: "+sRuleName+", postprocess: '"+sFunctionName+"': function is not defined in rule interpreter");
                }else{
                    let fMethod = oInterpreter[sFunctionName];
                    console.log("HAS POSTPROCESS "+JSON.stringify(vPostprocess));
                    let oParams = vPostprocess;                       
                    r.postprocess = (data)=>{ 
                        //console.log("### procarr:" +r.name+"->"+sFunctionName+" params "+data.length+this.dumpArray(data)); 
                        return fMethod.call(oInterpreter,data,vPostprocess);
                    };
                }
            }
        }
        return aErrors.length == 0 ? null : aErrors;
    }
    dumpArray(a){
        let r = [];
        for(let i=0;i<a.length;i++){
            r.push(i+" "+typeof(a[i]));
            if(typeof(a[i])=="object"){
                for(let v in a[i]){
                    console.log(" ["+v+"]\n"+this.dumpObject(a[i][v],v));
                }
            }

        }
        return "\n"+r.join("\n");
    }
    dumpObject(a,p){
        let r = [];
        for(let v in a){
            r.push("  "+p+"."+v+(v=="text"||v=="type"?"="+a[v]:""));
            if(v>="0" && v<="9"){
                r.push(this.dumpObject(a[v],p+"."+v));
            }
        }
        return r.join("\n");
    }

    linkGrammar(hTable,oLexer,oInterpreter){
        let aErrors = this.addLexer(hTable,oLexer);
        aErrors = this.addInterpreter(hTable,oInterpreter,aErrors);
        return aErrors;
    }
    createParser(hParserTable,oLexer,oInterpreter,hOptions)
    {
        let aErrors1 = this.linkGrammar(hParserTable,oLexer,oInterpreter);
        let oLexicalParser = oLexer.createParser();
        let oOptions = {lexer:oLexicalParser};
        if( hOptions ){
            for(let v in hOptions)
                oOptions[v]  = hOptions[v];
        }
        let oParser = new nearleyTolerant.Parser(hParserTable.ParserRules,hParserTable.ParserStart,oOptions);
        oParser.init();
        let hStart = oParser.expected();
        for(let sStart in hStart){
            oLexer.setStart(sStart);
        }
        let aErrors2 = oLexer.compile();
        oLexer.compileStart(aErrors2);
        oLexer.compileAny(aErrors2);
        if(aErrors1||aErrors2){
            let aErrors = [];
            if( aErrors1 )
                aErrors = aErrors1;
            if( aErrors2 )
                aErrors = aErrors.concat(aErrors2);
            throw aErrors.join("\n");
        }
        return oParser;
    }
}

module.exports = NearleyCompiler;