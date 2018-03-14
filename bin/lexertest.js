let fs = require("fs");


/* eslint-disable no-console */
let AParser = require('argparse').ArgumentParser;
let args = AParserCreate().parseArgs();

/*
let NTester = require('../lib/nearley-casetester.js');

let oTester = new NTester()

let sError = oTester.perform(args);

if( sError ){
    console.error(sError+" occured, test report files");
}
*/




function AParserCreate()
{
    let aParser = new AParser({
        addHelp:true,
        description:'lexer tester'
    });
    aParser.addArgument('organization',{help: 'WO or EP, _: traverse, default: all',choices:["WO","EP","all","_"],defaultValue:'all',nargs:"?"});
    aParser.addArgument('publication',{help: 'name of the publication, _: traverse, default: all',defaultValue:'all',nargs:"?"});
    aParser.addArgument('part',{help: 'name of the part within the publication, _: traverse, default: all',defaultValue:'all',nargs:"?"});
    aParser.addArgument('use',{help: 'id idguard internal internalguard colloquial colloquialguard external externalguard, default: all',choices:['id','idguard','internal','internalguard','colloquial','colloquialguard','external','externalguard','all','_'],defaultValue:'all',nargs:"?"});
    aParser.addArgument('context',{help: 'context to test, default: all',defaultValue:'all',nargs:"?"});
    aParser.addArgument('ln',{help: 'language: en de fr, default: all',choices:['en','de','fr','all'],defaultValue:'all',nargs:"?"});
    aParser.addArgument(['-f','--folder'],{help: 'folder in which files are searched, default: current folder/test',defaultValue:"test"});
    aParser.addArgument(['-o','--output'],{help: 'batch mode output file',nargs:'?'});
    aParser.addArgument(['-c','--case'],{help: 'test a single case, default: all',defaultValue:"all"});
    aParser.addArgument(['-s','--stub'],{help: 'test file stub (e.g. single,multiple)',defaultValue:"all"});
    aParser.addArgument(['-e','--errorcount'],{help: 'max. errors reported, default: 5',type:"int",defaultValue:5});
    aParser.addArgument(['-l','--log'],{help: 'show log of token match for all test cases',defaultValue:false,action:"storeTrue"});
    
    aParser.addArgument(['-i','--interactive'],{help: 'interactive; show prompt and repeat last task',defaultValue:false,action:"storeTrue"});
    aParser.addArgument(['-tl','--testlexer'],{help: 'test just the lexer',defaultValue:false,action:"storeTrue"});
    aParser.addArgument(['-D','--disabledependencies'],{help: 'disable loading of dependencies',defaultValue:false,action:"storeTrue"});
    /*
    aParser.addArgument(['-v','--validate'],{defaultValue:false,nargs:0,help:'validate only, default:perform test'});
    aParser.addArgument(['-H','--html'],{defaultValue:false,nargs:0,help:'HTML output, default:text output'});
    aParser.addArgument(['-r','--railroad'],{defaultValue:false,nargs:0,help:'create railroad, default:no railroad',action:"storeTrue"});
    aParser.addArgument(['-C','--compile'],{help: 'compile only, implies -j (if --js not set); default: false',defaultValue:"false",nargs:0});
    aParser.addArgument(['--js'],{defaultValue:false,nargs:0,help:'create javascript parser (compile), default:no compile',action:"storeTrue"});
    aParser.addArgument(['-j','--json'],{defaultValue:false,nargs:0,help:'create JSON loadable parser (compile), default:no compile',action:"storeTrue"});
    */
    return aParser;
}

const Lexers = require("../lib/lexers.js");

class TraverserFilter
{
    constructor(args){
        this.organization = args.organization;
        this.publication = args.publication;
        this.part = args.part;
        this.use = args.use;
        this.context = args.context;
        this.ln = args.ln;
        this.case = args.case;
        this.errorcount = args.errorcount;
        this.log = args.log
        this.testType = args.testlexer ? "testlexer" : "all";
        this.fileType = args.testlexer ? /^...js$/ : args.stub=="all"?/./ : new RegExp(args.stub);
        
        this.lexers = new Lexers(args.folder);
    }
    testFolder(aFolder,nPosition,sExpectedValue)
    {
        if( aFolder.length <= nPosition )
            return true;
        if( sExpectedValue=="_" || sExpectedValue=="all")
            return true;
        return aFolder[nPosition].toLowerCase()==sExpectedValue.toLowerCase();
    }
    folderFilter(sRoot,sRelativeFolder,sName,oConfig)
    {
        let aFolder = (sRelativeFolder==""?sName:sRelativeFolder+"/"+sName).split(/\x2f/);
        
        if( !this.testFolder(aFolder,0,this.organization)){
            return false;
        }
        if( !this.testFolder(aFolder,1,this.publication)){
            return false;
        }
        if( !this.testFolder(aFolder,2,this.part)){
            return false;
        }
        if( !this.testFolder(aFolder,3,this.use)){
            return false;
        }
        if( !this.testFolder(aFolder,4,this.context)){
            return false;
        }
        return true;
    }
    fileFilter(sRoot,sRelativeFolder,sName,oConfig)
    {
        if(sRelativeFolder=="")
            return false;
        if(this.fileType!=null){
            if(!sName.match(this.fileType))
                return false;
        }
        if( this.ln != "all" && this.ln != "_"){
            let fileLang = sName.replace(/^.*_(..)\.[^.]*$/,"$1");
            if(fileLang.toLowerCase()!=this.ln.toLowerCase())
                return false;
        }
        return true;
    }
    loadTests(sTestFile)
    {
        let sTests = fs.readFileSync(sTestFile,{encoding:"utf-8"});
        let oTests = null;
        try{
            oTests = JSON.parse(sTests);
            return oTests;
        }
        catch(e){
            console.log("E: "+sTestFile+": error reading test file");
        }
        //console.log(sTests);
        sTests = sTests.substring(1).replace(/][\r\n]*$/g,"");
        let aTests = sTests.split(/[\r\n][ \t]*{/);
        let sFilteredTest = "["
        for(let i=0;i<aTests.length;i++){
            let sThisTest = "{"+aTests[i].replace(/\}[,]?[\r\n]*$/,"") + "}";
            if( sThisTest == "{}")
                continue;
            try{
                oTests = JSON.parse(sFilteredTest+(sFilteredTest!="["?",":"")+sThisTest+"]");
                sFilteredTest += (sFilteredTest!="["?",":"")+sThisTest;
            }catch(e){
                console.log("E: bad test element skipped:"+sThisTest);
            }
        }
        return oTests;

    }
    waitInput()
    {
        function read_stdinSync() {
            var b = Buffer.alloc(1,0,"utf-8")
            var data = ''
            process.stdout.write("> ");
            while (true) {
                var n = fs.readSync(process.stdin.fd, b, 0, b.length);
                if(n==1 && b[0]==10)
                    continue;
                if (!n) break;
                if(b=='\n' || b=='\r')
                    break;
                data += b.toString("utf-8", 0, n);
            }
            return data;
        }
        console.log("Press enter to continue, ctrl-c to stop");
        read_stdinSync();
    }
    devisualize(sText)
{
    sText = sText.replace(/∙/g," ");
    sText = sText.replace(/◦/g,"\xa0");
    sText = sText.replace(/→/g,"\t");
    sText = sText.replace(/↲/g,"\n");
    sText = sText.replace(/○/g,"\u2003");
    return sText;
}
    performTests(sTestFile,sLexerFile,oLexer,oTests,oConfig)
    {
        let oParser = oLexer.createParser();
        let nCompleted = 0;
        let nError = 0;
        let nSkipped = 0;
        let nBad = 0;
        for(let i=0;i<oTests.length;i++){
            let sText = this.devisualize(oTests[i].text);
            if( oTests[i].active===false ){
                nSkipped++;
                continue;
            }
            //console.log("bad:"+oRefs[i].bad)
            if( oTests[i].bad===true ){
                nBad++;
                continue;
            }
            oParser.reset(sText);
            let bTokenError = false;
            let oToken={};
            //console.log(oRef.text);
            //let aTokenSequence = [];
            //let aEquivalenceSequence = [];
            let bAnyFound = false;
            let aRes = [];
            let sError = null;
            while((oToken=oParser.next())!=null){
                bAnyFound = true;
                if( oToken.type=="NONE"){
                    sError = ("Unrecognized token in:"+sText+" ["+oToken.text+"]");
                    bTokenError = true;
                    break;
                }
                aRes.push("[%"+oToken.type+"="+oToken.text+"]")
                /*
                aTokenSequence.push("%"+oToken.type);
                let sGroup=oToken.atom.group;
                if( sGroup ){
                    aEquivalenceSequence.push(sGroup);
                }else{
                    aEquivalenceSequence.push("%"+oToken.type);
                }
                */
            }

            if( !bTokenError ) {
                if(!bAnyFound){
                    sError= ("Unrecognized token at start:"+sText);
                    bTokenError = true;
                }else{
                    oToken = oParser.unparsed;
                    if( oToken != null){
                        sError = ("Unrecognized token in:"+sText+" ["+oToken.text+"]");
                        bTokenError = true;
                    }
                }
            }
            if( bTokenError || oConfig.log ){
                if( bTokenError ){
                    if( nError == 0 ){
                        console.log("=================\nTest file:"+sTestFile+"\nMain lexer file:"+sLexerFile);
                    }
                    console.log("-------------------")
                }
                console.log(i+"/"+oTests.length+":"+oTests[i].name+": "+sText+"==>"+aRes.join(""));
            }
            if( bTokenError ){
                console.log("E"+nError+": " + sError);
                nError++;
                if( nError >= oConfig.errorcount ){
                    break;
                }
            }else{
                nCompleted++;
            }
        }
        if( nError == 0){
            console.log("Finished "+nCompleted + "/" + oTests.length+", skipped:"+nSkipped+", bad:"+nBad);
        }else{
            console.log("Errors:" + nError+", completed "+nCompleted + "/" + oTests.length+", skipped:"+nSkipped+", bad:"+nBad);
            if( !oConfig.interactive)
                return false;
            this.waitInput();
            return true;
        }
    
    }
    onFile(sRoot,sRelativeFolder, sFile,oConfig){
        //console.log("Traversing:"+sRoot,sRelativeFolder,sFile);
        let a = sRelativeFolder.split(/\x2f/);
        //console.log(sRelativeFolder);
        let externalInfo = oConfig.ds.getExternalInfo(a[0],a[1],a[2]);
        if( externalInfo==null){
            console.log("lexertest: no external info for:"+sRelativeFolder)
            //return;
        }
        //let otherParts = oConfig.ds.getOtherParts(a[0],a[1],a[2]);
        

        let sLn = sFile.replace(/^.*_(..)\.json$/,"$1");
        //console.log(sFile+" "+sLn);
        if( sLn == sFile)
            return;
        let sLexerFile = [a[0],a[1],a[2],a[3],a[4]].join("/")+".js";

        let bContinue = true;
        while(bContinue){
            bContinue = false;

            let aErrors = [];
            let oLexer;
            
            do{
                aErrors = [];
                
                oLexer = this.lexers.requireLexer(a[0],a[1],a[2],a[3],a[4],sLn,oConfig.disabledependencies?null:externalInfo,aErrors);
                
                if(aErrors.length == 0){
                    oLexer.startAll();
                    oLexer.standaloneAll();
                    aErrors = oLexer.compile();
                }
                if( aErrors!=null && aErrors.length!=0){
                    console.log("E: lexer error:"+sLexerFile);
                    console.log(aErrors);
                    if( !oConfig.interactive ){
                        return;
                    }
                    this.waitInput();
                }
            }while(aErrors!=null && aErrors.length!=0);

            let sCompleteFile = sRoot+"/"+sRelativeFolder+"/"+sFile;
            
            let oTests = this.loadTests(sCompleteFile);

            bContinue = this.performTests(sCompleteFile,sLexerFile,oLexer,oTests,oConfig);
        }
        
    }
}
function TraverseTest(args)
{
    const Traverser = require('../../linkcollector/traverser.js');
    const DocumentStructure = require("../dx4n/documentstructure.js");
    let oTraverser = new Traverser();
    let oTraverserTodo = new TraverserFilter(args);
    let oConfig = {};
    oConfig.ds =  new DocumentStructure();
    for(let v in args){
        oConfig[v] = args[v];
    }
    oTraverser.traverseSync(args.folder,oTraverserTodo,oConfig);
}

TraverseTest(args)
