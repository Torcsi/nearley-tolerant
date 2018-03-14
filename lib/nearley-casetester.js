const fs = require("fs");
const path = require("path");
const cCompiler = require("./nearley-compiler.js")

class CaseTester
{
    constructor(){}

    loadFile(sFileName)
    {
        let sContent = fs.readFileSync(sFileName,{encoding:"utf-8"});
        sContent = sContent.replace(/(\^s|◦)/g,"\xa0").replace(/∙/g," ");
        let o = JSON.parse(sContent);
        this._name2case = {}
        this._name = o.name;
        this._options = o.options;
        this._cases = o.cases;
        this._file = sFileName
        for(let v of this._cases){
            this._name2case[v.name] = v;
        }
    }
    load(sName,aCases){
        this._name = sName;
        this._cases = aCases;
    }

    perform(oOptions)
    {
        let bCompileOnly = oOptions.compile==true;
        let bJSONOutput = bCompileOnly || oOptions.json==true;
        let bJSOutput = oOptions.js==true;
        let bRROutput = oOptions.railroad!=false;
        
        /** 
         * @type {string}
        */
        let sTestFile = oOptions.testfile;
        

        let ct = new CaseTester();
        if( !sTestFile.match(/\.test\.json$/) ){
            return "nearley-casetester: input file extension is not '.test.json'";
        }
        let sErrorFile = sTestFile.replace(/\.test\.json$/,".test.err.txt");
        try{
            ct.loadFile(sTestFile);
        }
        catch(e){
            fs.writeFileSync(sErrorFile,e.message+"\n"+e.stack,{encoding:'utf-8'});
            return "nearley-casetester: test file loading error, see "+sErrorFile;
        }
        let oCTOptions = ct.options;
        let sGrammarFile;
        try{
            sGrammarFile = ct.relativeFile(oCTOptions.grammar);
            if(!fs.existsSync(sGrammarFile)){
                throw new Error("Missing grammar file: "+sGrammarFile);
            }
        }
        catch(e){
            fs.writeFileSync(sErrorFile,"grammar file does not exist: "+sGrammarFile+"\n"+e.message+"\n"+e.stack,{encoding:'utf-8'});
            return "nearley-casetester: grammar file does not exist: "+sGrammarFile+", see "+sErrorFile;
        }
        let sLexerFile;
        try{
            sLexerFile = ct.relativeFile(oCTOptions.lexer);
            if(!fs.existsSync(sLexerFile)){
                throw new Error("Missing lexer file: "+sLexerFile);
            }
        }
        catch(e){
            fs.writeFileSync(sErrorFile,"lexer file does not exist: "+sLexerFile+"\n"+e.message+"\n"+e.stack,{encoding:'utf-8'});
            return "nearley-casetester: lexer file does not exist: "+sLexerFile+", see "+sErrorFile;
        }
        let aLexerErr = this._testLexer(sLexerFile);
        if( aLexerErr != null){
            fs.writeFileSync(sErrorFile,"lexer file invalid javascript file: "+sLexerFile+"\n"+aLexerErr.join(),{encoding:'utf-8'});
            return "nearley-casetester: lexer file invalid javascript file: "+sLexerFile+", see "+sErrorFile;
        }

        let aGrammarErr = this._testGrammar(sGrammarFile,sLexerFile);
        if( aGrammarErr != null){
            fs.writeFileSync(sErrorFile,"invalid grammar file: "+sGrammarFile+"\n"+aGrammarErr.join(),{encoding:'utf-8'});
            return "nearley-casetester: invalid grammar file: "+sGrammarFile+", see "+sGrammarFile.replace(/\.ne$/,".err.txt");
        }

        let sError = null;

        if(bRROutput && !bJSONOutput && !bJSOutput )
            sError = this.compileToRR(sGrammarFile,sLexerFile);
        if(bJSONOutput){
            sError = this.compileToJSON(sGrammarFile,sLexerFile,bRROutput);
        }
        if( !sError && bJSOutput ){
            sError = this.compileToJS(sGrammarFile,sLexerFile,bRROutput);
        }
        if( Array.isArray(sError)){
            
            return sError;
        }
        if( bCompileOnly  ){
            return null;
        }
        let aFail = this.performTest(sTestFile,oOptions.method,oOptions.case);
        if( aFail ){
            return "nearley-casetester: there were failed tests:\n"+aFail.join("\n");
        }
        return null;
    }   
    _testLexer(sLexerFile)
    {
        try{
            require(sLexerFile);
        }
        catch(e){
            return [e.message,""+e.stack];
        }
    }
    _testGrammar(sGrammarFile,sLexerFile)
    {
        try{
            let oOpt = {json:true};
            let sResult = this.compile(sGrammarFile,sLexerFile,oOpt);
            if( sResult == null)
                return sResult;
            if( typeof(sResult)=="string")
                return [sResult];
            return null;
        }
        catch(e){
            return [e.message,""+e.stack];
        }
    }
    
    compileToJSON(sGrammarFile,sLexerFile,bRROutput)
    {

        let sOutputJSON = sGrammarFile.replace(/\.ne$/,".json")
        let oOpt = {json:true,out:sOutputJSON};
        if( bRROutput){
            oOpt.rr = "";
        }
        return this.compile(sGrammarFile,sLexerFile,oOpt);
    }

    compileToRR(sGrammarFile,sLexerFile)
    {
        let oOpt = {rr:""};
        return this.compile(sGrammarFile,sLexerFile,oOpt);
    }

    compileToJS(sGrammarFile,sLexerFile,bRROutput)
    {
        let sOutputJS = sGrammarFile.replace(/\.ne$/,".js")
        let oOpt = {js:true,out:sOutputJS};
        if( bRROutput)
            oOpt.rr = "";
        return this.compile(sGrammarFile,sLexerFile,oOpt);
    }

    compile(sGrammar,sLexerFile,oOpt)
    {
        let oCompiler = new cCompiler();
        let sErrorFile = sGrammar.replace(/\.ne$/,".err.txt");
        if( fs.existsSync(sErrorFile))
            fs.unlinkSync(sErrorFile);
        let hParserTable = oCompiler.compileFile(sGrammar,oOpt);
        if( Array.isArray(hParserTable)){
            let sError = hParserTable.join("\n");
            fs.writeFileSync(sErrorFile,sError,{encoding:'utf-8'});
            return "nearley-casetester: compilation issues, see "+sErrorFile;
        }
        let oLexer = this.compileLexer(sLexerFile);
        if( Array.isArray(oLexer)){
            let sError = hParserTable.join("\n");
            fs.writeFileSync(sErrorFile,"lexer file:"+sLexerFile+" errors\n"+sError,{encoding:'utf-8'});
            return "nearley-casetester: compilation issues, see "+sErrorFile;
        }
        // check compiler against lexer
        let oParser=null;
        try{
            oParser = oCompiler.createParser(hParserTable,oLexer,null,{"tolerant":true,"keepHistory":true}); //new Parser(hParserTable.ParserRules,"start",{lexer:oLexicalParser});
        }
        catch(e){
            fs.writeFileSync(sErrorFile,e.message+"\n"+e.stack,{encoding:'utf-8'});
            return "nearley-casetester: lexer merge issues, see "+sErrorFile;
        }
        return oParser;
    }
    compileLexer(sLexerFile)
    {
        try{
            return require(sLexerFile)
        }
        catch(e){
            let aError = [];
            aError.push(e.message);
            aError.push(""+e.stack);
            return aError;
        }
    }
    get options(){
        return this._options;
    }
    relativeFile(sName)
    {
        return path.resolve(path.dirname(this._file),sName);
    }
    performCaseByName(sCaseName,fConverter, hOptions)
    {
        let oCase = this._name2case[sCaseName];
        if( !oCase)
            return null;
        return this.performCase(oCase,fConverter,sExpectedOutputField,sOutputFormat);
        
    }
    performCase(oCase,fConverter,hOptions)
    {
        return this.compareResult("",oCase[hOptions.field],fConverter(oCase.input),hOptions.format);
    }
    performCases(sCase,fConverter,hOptions)
    {
        let aFails = [];
        let aRes = [];
        let sOutputFormat = hOptions.outputFile.indexOf(".htm")>=0?"html":"text";
        if( sOutputFormat == "html"){
            aRes.push("<html><meta charset='utf-8'></meta><head><style type='text/css'>");
            aRes.push("body {font-family:'Arial'}")
            aRes.push("table {border-collapse:collapse}td {vertical-align:top;border:solid 1px black}")
            aRes.push("table.result td{width:33%}");
            aRes.push("div.common{color:blue}");
            aRes.push("div.exp{color:red}");

            aRes.push("div.rec{color:red;text-decoration:line-through}");
            aRes.push("div.difference div.difference div.difference{padding-left:1em}")
            aRes.push("div.caseok {color:gray}");
            aRes.push("</style></head>")
            aRes.push("<body><h1>"+hOptions.title+"</h1>");
            
        }
        hOptions.format = sOutputFormat;
        let sExpectedOutputField = hOptions.field;
        switch(sOutputFormat){
            case "html":
                aRes.push("<div class='test'><div class='caption'>"+this._name+": Field <b>"+sExpectedOutputField+"</b></div>");
                break;
            case "text":
                aRes.push(this._name+": "+sExpectedOutputField);
        }
        for(let i=0;i<this._cases.length;i++){
            //console.log("PERFORMTESTCASE:"+i)
            if(this._cases[i].active===false)
                continue;
    
            let oCase = this._cases[i];
            if( !(hOptions.field in oCase ))
                continue;
            if( sCase && sCase!="all" ){
                if( sCase != oCase.name)
                    continue;
            }
            let vResult = fConverter(oCase.input,oCase);
            

            let sDiff = this.compareResult("",oCase[hOptions.field],vResult,hOptions.format);
            
            //let sDiff = this.performCase(this._cases[i],fConverter,hOptions);
            if( sDiff == null){
                
                switch(sOutputFormat){
                    case "html":
                        aRes.push("<div class='caseok'><div class='caption'>"+this._cases[i].name+": completed</div></div>");
                        break;
                    case "text":
                        aRes.push(this._cases[i].name+": completed");
                        break;
                }
            }else{
                aFails.push("- "+oCase.name);
                switch(sOutputFormat){
                    case "html":
                        aRes.push("<div class='case'><div class='caption'>"+this._cases[i].name+"</div>");
                        aRes.push("<table class='result'>")
                        if( hOptions.input ){
                            aRes.push("<tr><td colspan='3' class='input'>")
                            aRes.push(myStringifyHTML(this._cases[i].input));
                            aRes.push("</td></tr>")
                        }
                        aRes.push("<tr><td>Expected</td><td>Received</td><td>Diff</td></tr>");
                        aRes.push("<tr>");
                        if( hOptions.expected ){
                            aRes.push("<td class='expected'>")
                            aRes.push(myStringifyHTML(this._cases[i][hOptions.field]));
                            aRes.push("</td>")
                        }
                        if( hOptions.received ){
                            aRes.push("<td class='received'>")
                            aRes.push(myStringifyHTML(vResult));
                            aRes.push("</td>")
                        }
                        aRes.push("<td class='diff'>"+sDiff+"</td>");
                        aRes.push("</tr>");
                        if( oCase.log===true){
                            aRes.push("<tr><td colspan='3'>"+this._cases[i].lexerText.replace(/\n/g,"<br/>")+"</td></tr>");
                            aRes.push("<tr><td colspan='3'>"+this._cases[i].parserText.replace(/\n/g,"<br/>")+"</td></tr>");
                        }
                        aRes.push("</table>")
                        aRes.push("</div>");
                        break;
                    case "text":
                        aRes.push(this._cases[i].name+": ");
                        if( hOptions.input ){
                            aRes.push("     Input: "+myStringify(this._cases[i].input));
                        }
                        if( hOptions.expected ){
                            aRes.push("  Expected: "+myStringify(this._cases[i][hOptions.field]));
                        }
                        if( hOptions.received ){
                            aRes.push("  Received: "+myStringify(vResult));
                        }
                        aRes.push("Difference: " +sDiff);
                }
            }
        }
        switch(sOutputFormat){
            case "html":
                aRes.push("</div>");
                break;
            case "text":
        }
        let sRes = aRes.join("\n");
        if( sOutputFormat == "html"){
            aRes.push("</body></html>");
        }
        if("outputFile" in hOptions){
            fs.writeFileSync(this.relativeFile(hOptions.outputFile),sRes,{encoding:"utf-8"});
        }
        return aFails.length==0?null:aFails;
    }
    compareResult(sPath,vExpected,vResult,sOutputFormat)
    {
        let sResult;
        //console.log("CASE:"+JSON.stringify(vExpected)+"/"+JSON.stringify(vResult));

        if( vExpected===null ){
            sResult = this.compareNull(sPath,vResult, sOutputFormat);
        }else if( vExpected===undefined ){
            sResult = this.compareUndefined(sPath,vResult, sOutputFormat);
        }else if(Array.isArray(vExpected,vResult)){
            sResult = this.compareResultArray(sPath,vExpected,vResult, sOutputFormat);
        }else if(typeof(vExpected)=="number" || is_numeric(vExpected)){
            sResult = this.compareResultNumber(sPath,parseFloat(vExpected),vExpected,vResult, sOutputFormat);
        }else if(typeof(vExpected)=="string"){
            sResult = this.compareResultString(sPath,vExpected,vResult, sOutputFormat);
        }else{
            sResult = this.compareResultObject(sPath,vExpected,vResult, sOutputFormat);
        }
        
        if(sResult == null)
            return null;
            //console.log("COMPARERESULT["+sResult+"]")       ;
        switch(sOutputFormat){
            case "html":
                return "<div class='report'><div class='at'>"+sPath+"</div><div class='difference'>"+sResult+"</div></div>"
            default:
                return sResult;
        }
    }
    compareNull(sPath,v,sFormat)
    {
        if(v===null){
            return null;
        }
        return to_shortText(v)+": not null";
    }
    compareUndefined(sPath,v,sFormat)
    {
        if(v===undefined){
            return null;
        }
        return to_shortText(v)+": not undefined";
    }
    compareResultNumber(sPath,nExpected,vReceived,sFormat)
    {
        if( !is_numeric(vReceived) ){
            return to_shortText(vReceived)+": not a number"
        }
        let nReceived = parseFloat(vReceived);
        if( nReceived == vReceived)
            return null;
        return nExpected+" expected,"+vReceived+" received";
    }
    compareResultString(sPath,s1,s2,sFormat)
    {
        
        let nSamePrefix = -1;
        if(s1==s2)
            return null;
        
        if( !(typeof(s2)=="string"))
            return to_shortText(s2)+" not a string";
        for(let i=0;i<s1.length && i < s2.length;i++){
            if( s1.charAt(i)!=s2.charAt(i))
                break;
            nSamePrefix = i;
        }

        let commonBegin = nSamePrefix==0?"":s1.substring(0,nSamePrefix+1);
        let sEnd1 = s1.substring(nSamePrefix+1);
        let sEnd2 = s2.substring(nSamePrefix+1);
        //console.log("COMPARE STRING "+s1+"~"+s2+"\nCommon begin:"+nSamePrefix+"\n"+sEnd1+"\n"+sEnd2+">"+sFormat);
        switch(sFormat){
            case "html":
                return "<div class='common'>"+commonBegin+"</div><div class='exp'>"+sEnd1+"</div><div class='rec'>"+sEnd2+"</div>";
            case "text":
                return (sPath!=""?sPath+" ":"")+ "common: "+JSON.stringify(commonBegin)+", expected:"+JSON.stringify(sEnd1)+", received:"+JSON.stringify(sEnd2);
        }

    }
    compareResultArray(sPath,a1,a2,sFormat)
    {
        let sResult=this.compareArray(sPath,a1,a2,sFormat)
        if(sResult==null){
            return null;
        }
        switch(sFormat){
            case "html":
                return "<div class='report'><div class='at'>"+sPath+"</div><div class='difference'>"+sResult+"</div></div>"
            default:
                return sResult;
        }
    }
    compareResultObject(sPath,a1,a2,sFormat)
    {
        let sResult=this.compareObject(sPath,a1,a2,sFormat);
        
        if(sResult==null){
            return null;
        }
        
        switch(sFormat){
            case "html":
                return "<div class='report'><div class='at'>"+sPath+"</div><div class='difference'>"+sResult+"</div></div>"
            default:
                return sResult;
        }
    }
    compareArray(sPath,a1,a2,sFormat)
    {
        let l1=a1.length,l2=a2.length;
        if(l1==0 && l2==0)
            return null;
        let l = Math.min(l1,l2);
        //console.log("EXTRA ELEMENTS?"+l+"/"+l1+"~"+l2+" format:"+sFormat);
        let sDiff = null;
        for(let i=0;i<l;i++){
            sDiff = this.compareResult(sPath+"["+i+"]",a1[i],a2[i],sFormat);
            if( sDiff != null )
                return sDiff;
        }
        if( l==l1 && l==l2)
            return null;
        if(l1 < l2){
            return (sPath!=""?sPath+" ":"")+"at: "+(l1-1)+" extra array elements: "+to_shortText(a2.slice(l1));
        }
        return (sPath!=""?sPath+" ":"")+"at: "+(l1-1)+": missing array elements: "+to_shortText(a1.slice(l2));
        
    }
    compareObject(sPath,a1,a2,sFormat)
    {
        for(let v in a1){
            if(!(v in a2)){
                return (sPath!=''?sPath+" ":'')+"missing selector: "+v+"="+to_shortText(a1[v]);
            }
        }
        for(let v in a2){
            if(!(v in a1)){
                return (sPath!=''?sPath+" ":'')+"extra selector: "+v+"="+to_shortText(a2[v]);
            }
        }
        for(let v in a1){
            let v1 = a1[v];
            let v2 = a2[v];
            //console.log(sFormat+" COMPARING SELECTOR "+v+":"+v1+":"+v2);
            let sDiff =this.compareResult(sPath+"."+v,v1,v2,sFormat);
            if( sDiff != null)
                return sDiff;
        }
        return null;
    }
    /**
     * perform a set of scenarios
     * @param {string} sTestFile 
     */
    performTest(sTestFile,sRequestedMethod,sCase)
    {
        let ct = new CaseTester();
        //console.log("TEST:"+sTestFile)
        ct.loadFile(sTestFile);
        let oOptions = ct.options;

        let sLexerFile = ct.relativeFile(oOptions.lexer);
        let sGrammarFile = ct.relativeFile(oOptions.grammar);
        
        let oCompiler = new cCompiler();
        let oLexer = require(sLexerFile);

        let aRes = [];
        
        let aMethods = oOptions.methods;
        for(let im=0;im<aMethods.length;im++){
            //console.log("REQUESTED METHOD:"+sRequestedMethod+"~"+ aMethods[im])
            if( sRequestedMethod && sRequestedMethod!="all" ){
                if( sRequestedMethod != aMethods[im].method)
                    continue;
            }
            let sInterpreter = aMethods[im].interpreter;
            if( sInterpreter == "default" ){
                sInterpreter = "../../lib/default-interpreter.js";
            }else if( sInterpreter == "none"){
                sInterpreter = null;
            }
            
            let sInterpreterFile = sInterpreter?ct.relativeFile(sInterpreter):null;
            let oInterpreter = sInterpreterFile?require(sInterpreterFile):null;
            //console.log("----------------------------------");
            let hParserTable = oCompiler.compileFile(sGrammarFile,{"json":""});
            let oParser = oCompiler.createParser(hParserTable,oLexer,oInterpreter,{"tolerant":true,"keepHistory":true}); //new Parser(hParserTable.ParserRules,"start",{lexer:oLexicalParser});
            let oLexicalParser = oParser.lexer;
            let sMethod = aMethods[im].method;
            let sTestField = aMethods[im].field;
            let sOutputFile = aMethods[im].file;
            let nTestCount = 0;
            //console.log("Method:"+sMethod);
            let aTestRes =
            ct.performCases(sCase,(x,oCase)=>{
    
                //console.log("TEST CASE "+x);
                oLexicalParser.reset(x);
                if( oCase.log===true){
                    oLexicalParser.logStart();
                    oParser.logStart();
                }
                let nMax = x.length;
                oParser.init();
                let aRes = [];
                for(let i=0;i<nMax;i++){
                    //console.log("Sequence:"+i)
                    oParser.feed(x);
                    if( oParser.results==null)
                        break;
                    let sReceived = getResultText(oParser.results,oParser.completed,oParser.expected);
                    
                    aRes.push(sReceived);
                    if(oParser.finished)
                        break;
                    oParser.carryOn();
                }
                if( oCase.log===true){
                    oCase.lexerText = oLexicalParser.logText();
                    oCase.parserText = oParser.logText();
                    oLexicalParser.logFinish();
                    oParser.logFinish(true);
                }
                nTestCount++;
                return aRes;
            },{
                title: sMethod,
                field:sTestField,
                input:true,
                expected:true,
                received:true,
                all: true,
                outputFile:sOutputFile
            });
            if( aTestRes && aTestRes.length!=0){
                aRes = aRes.concat(aTestRes);
                aRes.push((nTestCount-aTestRes.length)+" completed, "+aTestRes.length+" tests failed for method: '"+aMethods[im].method+"', results see in "+aMethods[im].file);
            }
        }
        return aRes.length == 0?null:aRes;
    }
}


function is_numeric(val){
    return val && !isNaN(parseFloat(val)) && isFinite(val);
}

function to_shortText(v)
{
    if( v ===null)
        return "null";
    if( v ===undefined)
        return "undefined";
    if( typeof(v)=="function"){
        let s = ""+v;
        return s.length < 20 ? s : s.substring(0,20)+"...";
    }
    if( Array.isArray(v)){
        let aRes = [];
        let at = 0 ;
        aRes.push("[");
        let l = 1;
        while(l<20 && at < v.length){
            //aRes.push("["+at+"]");
            l += ("["+at+"]").length;
            let sRes = to_shortText(v[at]);
            aRes.push(sRes);
            l += sRes.length;
            if( at!=v.length-1)
                aRes.push(",");
            at++;
        }
        if( l < 20)
            aRes.push("]");
        return aRes.join("");
    }
    if( is_numeric(v) ){
        return ""+v;
    }
    if( typeof(v)=="string"){
        return v.length < 20 ? v : v.substring(0,20)+"...";
    }
    // object
    let aRes = [];
    let l = 2;
    aRes.push("{");
    let bFirst = true;
    for(var k in v){
        let sVal = v[k];
        if( typeof(v[k])=="function")
            continue;
        if( !bFirst ){
            aRes.push(",");
            l++;
        }
        aRes.push('"'+k+'":');
        l += k.length + 3;
        let sText = to_shortText(v[k]);
        aRes.push(sText);
        l += sText.length;
    }
    if( l.length < 20)
    aRes.push("}");
    return aRes.join("");
}

function myStringify(v,d)
{
    if(!d)
        d=0;
    let sIndent = Array(d).join(" ");
    if( v === null)
        return sIndent+"null";
    if( v === undefined )
        return sIndent+"undefined";
    let aRes = [];
    if( Array.isArray(v)){
        if(v.length == 0)
            return sIndent+"[]";
        else{
            let aRes1 = []
            let bSplit = false;
            for(let i=0;i<v.length;i++){
                let sRes = myStringify(v[i],0);
                if( sRes.indexOf("\n")>0){
                    bSplit=true;
                    break;
                }
                aRes1.push(sRes);
            }
            if( !bSplit){
                return (sIndent+"["+aRes1.join(",")+"]");
            }
            aRes.push(sIndent+"[");
            for(let i=0;i<v.length;v++){
                let sRes = myStringify(v[i],d+1);
                aRes.push(sIndent+(sRes+(i!=v.length-1)?",":""));
            }
            aRes.push(sIndent+"]");
        }
        return aRes.join("\n");
    }
    if( typeof(v) === "boolean" )
        return sIndent+v;
    if( typeof(v)=="string")
        return sIndent + JSON.stringify(v);
    if( is_numeric(v)){
        return sIndent + v;
    }
    if(Object.keys(v).length == 0 )
        return sIndent+"{}";
    aRes.push(sIndent+"{");
    let bFirst = false;
    for(var k in v){
        let sRes = myStringify(v[k],d+1);
        if( sRes.indexOf("\n")>=0) {
            aRes.push(sIndent+'"'+k+'":');
            aRes.push(sRes+(bFirst?"":","));
        }else{
            aRes.push(sIndent+'"'+k+'":' +sRes.replace(/^[ ]+/g,"")+(bFirst?"":","));
        }
        bFirst = false;
    }
    aRes.push(sIndent+"}");
    return aRes.join("");
}

function myStringifyHTML(v,d)
{
    if(!d)
        d=0;
    if( v === null)
        return "<div class='ms'>null</div>";
    if( v === undefined )
    return "<div class='ms'>undefined</div>";
    if( typeof(v) === "boolean" || is_numeric(v))
        return "<div class='ms'>"+v+"</div>"
    if( typeof(v)=="string")
        return "<div class='ms'>"+JSON.stringify(v)+"</div>";
    let aRes = [];
    if( Array.isArray(v)){
        if(v.length == 0)
            return "<div class='ms'>[]</div>";
        let aRes1 = []
        let bSplit = false;
        for(let i=0;i<v.length;i++){
            let sRes = myStringify(v[i],0);
            if( sRes.indexOf("\n")>0){
                bSplit=true;
                break;
            }
            aRes1.push(sRes);
        }
        if( !bSplit){
            return "<div class='ms'>["+aRes1.join(",<br/>")+"]</div>";
        }else{
            aRes.push("<div class='ms'>[");
            for(let i=0;i<v.length;i++){
                aRes.push(myStringifyHTML(v[i],d+1));
                aRes.push((i!=v.length-1?",<br/>":""));
            }
            aRes.push("]</div>");
        }
        return aRes.join("\n");
    }
    if(Object.keys(v).length == 0 )
    return "<div class='ms'>{}</div>";
    /*aRes.push(sIndent+"{");
    let bFirst = false;
    for(var k in v){
        let sRes = myStringify(v[k],0);
        if( sRes.indexOf("\n")>=0) {
            aRes.push('"'+k+'":'+myStringifyHTML(v[k]));
            aRes.push(sRes+(bFirst?"":","));
        }else{
            aRes.push(sIndent+'"'+k+'":' +sRes.replace(/^[ ]+/g,"")+(bFirst?"":","));
        }
        bFirst = false;
    }
    aRes.push(sIndent+"}");
    */
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
module.exports = CaseTester;