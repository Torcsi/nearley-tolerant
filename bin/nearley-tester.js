/* eslint-disable no-console */
let AParser = require('argparse').ArgumentParser;
let args = AParserCreate().parseArgs();

let NTester = require('../lib/nearley-casetester.js');

let oTester = new NTester()

let sError = oTester.perform(args);

if( sError ){
    console.error(sError+" occured, test report files");
}




function AParserCreate()
{
    let aParser = new AParser({
        addHelp:true,
        description:'nearley grammar validator and tester'
    });
    aParser.addArgument('testfile',{help: 'test json file'});
    aParser.addArgument(['-m','--method'],{help: 'test a single test method, default: all',defaultValue:"all"});
    aParser.addArgument(['-c','--case'],{help: 'test a single case, default: all',defaultValue:"all"});
    aParser.addArgument(['-v','--validate'],{defaultValue:false,nargs:0,help:'validate only, default:perform test'});
    aParser.addArgument(['-H','--html'],{defaultValue:false,nargs:0,help:'HTML output, default:text output'});
    aParser.addArgument(['-r','--railroad'],{defaultValue:false,nargs:0,help:'create railroad, default:no railroad',action:"storeTrue"});
    aParser.addArgument(['-C','--compile'],{help: 'compile only, implies -j (if --js not set); default: false',defaultValue:"false",nargs:0});
    aParser.addArgument(['--js'],{defaultValue:false,nargs:0,help:'create javascript parser (compile), default:no compile',action:"storeTrue"});
    aParser.addArgument(['-j','--json'],{defaultValue:false,nargs:0,help:'create JSON loadable parser (compile), default:no compile',action:"storeTrue"});
    return aParser;
}

