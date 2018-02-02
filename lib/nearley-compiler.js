let compiler = require('./compile.js');
let nearley = require("./nearley.js");
let fs = require('graceful-fs');
let parserGrammar = require('./nearley-language-bootstrapped.js');
let lint = require("./lint.js");
let generate = require("./generate.js");

class NearleyCompiler{
    /**
     * compile sFileName, according to the given options
     * @param {string} sFileName 
     * @param {{export:string},{out:|string},{json:boolean}}} hOpts 
     * @return {object} parser object if hOpts.json, null otherwise
     */
    compileFile(sFileName,hOpts){
        hOpts = this._setDefaults(hOpts);
        hOpts.file = sFileName;
        
        var oParser = new nearley.Parser(parserGrammar.ParserRules, parserGrammar.ParserStart);

        let sContent = fs.readFileSync(sFileName,{encoding:'utf-8'});
        
        let oStructure = oParser.feed(sContent).results[0]
        
        let c = compiler(oStructure,hOpts);
        lint(c, {'out': process.stderr});
        var output = hOpts.out ? fs.createWriteStream(hOpts.out) : null;
        
        let sCompiled = generate(c, hOpts.export);
        if(output){
            output.write(sCompiled);
        }
        return hOpts.json?JSON.parse(sCompiled):null;
        
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
        console.log(sCompiled);
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

}
module.exports = NearleyCompiler;