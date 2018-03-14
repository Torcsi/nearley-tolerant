//const fs =require("fs");
const MCache = require("./absolutemodulecache.js");
const LexicalUnits = require("./lexer-tolerant.js").Lexer;


class Lexers extends MCache
{
    constructor(sRootPath)
    {
        super();
        this.rootPath = sRootPath;
        if( this.rootPath.charAt(this.rootPath.length-1)!='/')
            this.rootPath+='/'
        this.dependencies = {}
        this.lexers = {};
    }

    /**
     * check if the depedencies provided last time are the same
     * @param {string} sFile 
     * @param {*} aDependencies 
     */
    _isSameDependency(sFile,aDependencies)
    {
        sFile = sFile.replace(/\x2f[^\x2f]+$/,"");
        if(!(sFile in this.dependencies))
            return false;
        let aOld = this.dependencies[sFile];
        let aNew = aDependencies;

        if( !aOld ){
            return !aDependencies;
        }else if( !aDependencies ){
            return false;
        }
        // both defined
        if( aOld.length != aDependencies.length)
            return false;
        for(let i=0;i<aOld.length;i++){
            let oOld = aOld[i];
            let oNew = aNew[i];
            for(let v in oOld){
                if( oOld[v] != oNew[v] )
                    return false;
            }
            for(let v in oNew){
                if( oOld[v] != oNew[v] )
                    return false;
            }
        }
        return true;
    }
    _setDependency(sFile,aDependencies)
    {
        sFile = sFile.replace(/\x2f[^\x2f]+$/,"");
        this.dependencies[sFile] = aDependencies;
    }
    /* eslint-disable no-console */
    addUnits(oLexer,sFile,bTolerate,aErrors)
    {
        try{
            let oLexer2 = this.require(sFile);
            oLexer.addUnits(oLexer2,bTolerate,sFile,aErrors)
        }
        catch(e){
            console.log("E: error importing:"+sFile);
            console.log(e.stack);
            process.exit();
        }
    }
    /* eslint-enable */
    
    _addLexers(oLexer,sFile,hFile,bTolerate,aErrors)
    {
        if( !((this.rootPath + sFile) in hFile) ){
            hFile[this.rootPath + sFile] = true;
            if( this.exists(this.rootPath + sFile) ){
                this.addUnits(oLexer,this.rootPath+sFile,bTolerate,aErrors);
            }
        }
        sFile = sFile.replace(/\x2f[^\x2f]+\.js/,"/xx.js");
        if( !((this.rootPath + sFile) in hFile) ){
            hFile[this.rootPath + sFile] = true;
            if( this.exists(this.rootPath + sFile) ){
                this.addUnits(oLexer,this.rootPath+sFile,bTolerate,aErrors);
            }
        }
        
    }
    _collectParentLexers(oLexer,sFile,hFile,bTolerate,aErrors)
    {

        /*
        oLexer.addUnits(this.require(this.rootPath+"/"+sFile),bTolerate)

        let sFileName = sFile.replace(/^.*[\x2f]([^\x2f]+)$/,"$1");
        let sPath = sFile.replace(/^(.*)[\x2f]([^\x2f]+)$/,"$1");
        while(sPath.indexOf('/') > 0){
            sPath = sPath.replace(/^(.*)[\x2f]([^\x2f]+)$/,"$1");
            let sParentFile = sPath + "/" + sFileName;
            if( (this.rootPath + sParentFile) in hFile )
                continue;
            hFile[this.rootPath + sParentFile] = true;
            oLexer.addUnits(this.require(this.rootPath + sParentFile),bTolerate,this.rootPath + sParentFile,aErrors);
        }
        */

        let sFileName = sFile.replace(/^.*[\x2f]([^\x2f]+)$/,"$1");
        let sPath = sFile.replace(/^(.*)[\x2f]([^\x2f]+)$/,"$1");
        while(sPath.indexOf('/') > 0){
            sPath = sPath.replace(/^(.*)[\x2f]([^\x2f]+)$/,"$1");
            let sParentFile = sPath + "/" + sFileName;
            if( !((this.rootPath + sParentFile) in hFile) ){
                hFile[this.rootPath + sParentFile] = true;
                if( this.exists(this.rootPath + sParentFile) ){
                    this.addUnits(oLexer,this.rootPath+sParentFile,bTolerate,aErrors);
                }
            }
            sParentFile = sPath + "/xx.js";
            if( !((this.rootPath + sParentFile) in hFile) ){
                hFile[this.rootPath + sParentFile] = true;
                if( this.exists(this.rootPath + sParentFile) ){
                    this.addUnits(oLexer,this.rootPath+sParentFile,bTolerate,aErrors);
                }
            }
        }
        if( !((this.rootPath+"/"+sFileName) in hFile) ){
            if(this.exists(this.rootPath+"/"+sFileName)){
                this.addUnits(oLexer,this.rootPath+"/"+ sFileName,bTolerate,aErrors);
                
            }
            hFile[this.rootPath+"/"+sFileName] = true;
        }
        if( !((this.rootPath+"/xx.js") in hFile) ){
            if(this.exists(this.rootPath+"/xx.js")){
                this.addUnits(oLexer,this.rootPath+"/xx.js",bTolerate,aErrors);
            }
            hFile[this.rootPath+"/xx.js"] = true;
        }



    }
    _requiredColloquiality(bColloquial,sUse)
    {   
        switch(sUse){
            case "id","idguard","internalguard","internal":
                return false;
            case "colloquialguard","colloquial":
                return bColloquial==true;
            case "externalguard","external":
                return bColloquial==false;
        }
        return false;
    }
    _collectLexers(sOrganization,sPublication,sPart,sUse,sContext,sLn, aDependencies,aErrors)
    {
        let hAdded = {}
        let sExternalLexerFile = null;
        let sExternalLexerFile1 = null;
        
        if( sUse == "colloquial"){
            sExternalLexerFile = sOrganization + "/" + sPublication + "/" + sPart + "/" + "external" + "/" + sContext + "/" + sLn + ".js";
        }else if( sUse == "internal"){
            sExternalLexerFile = sOrganization + "/" + sPublication + "/internal/" + sContext + "/" + sLn + ".js";
            sExternalLexerFile1 = sOrganization + "/" + sPublication + "/internal/" + sLn + ".js";
        }

        let sLexerFile = sOrganization + "/" + sPublication + "/" + sPart + "/" + sUse + "/" + sContext + "/" + sLn + ".js";
        

        let oLexer = new LexicalUnits();

        if( sExternalLexerFile != null ){
            this._addLexers(oLexer,sExternalLexerFile,hAdded,true,aErrors);    
        }
        if( sExternalLexerFile1 != null ){
            this._addLexers(oLexer,sExternalLexerFile1,hAdded,true,aErrors);    
        }
        
        this._addLexers(oLexer,sLexerFile,hAdded,true,aErrors);    
        
        this._collectParentLexers(oLexer,sLexerFile,hAdded,true,aErrors);
        //console.log(JSON.stringify(aDependencies));

        if( aDependencies ){
            for(let oDependency of aDependencies ){
                if( !this._requiredColloquiality(oDependency.colloquial,sUse ))
                    continue;
                let sDependencyLexer = oDependency.organization + "/" + oDependency.publication + "/" + oDependency.part + "/" + sUse + "/" + sContext + "/" + sLn + ".js";
                this._collectParentLexers(oLexer,sDependencyLexer,hAdded,false,aErrors);
            }
        }        
        return !oLexer.empty()?oLexer:null;
    }
    _checkAndAddFile(sFolder,sFile,hFile,aFile)
    {
        //console.log("CHECKFILE:"+sFile);
        if( !((this.rootPath+"/"+sFile) in hFile)  ){
            if(this.exists(this.rootPath+"/"+sFile)){
                aFile.push(this.rootPath+"/"+sFile);
            }
            hFile[this.rootPath+"/"+sFile] = true;
        }
        let xxFile = this.rootPath+"/"+sFile.replace(/[\x2f][^\x2f]+\.js$/,"/xx.js");
        if( !(xxFile in hFile)  ){
            if(this.exists(xxFile)){
                aFile.push(xxFile);
            }
            hFile[xxFile] = true;
        }
        
    }
    _collectParentLexerFiles(sFile,hFile,aFile)
    {
        

        let sFileName = sFile.replace(/^.*[\x2f]([^\x2f]+)$/,"$1");
        
        let sPath = sFile.replace(/^(.*)[\x2f]([^\x2f]+)$/,"$1");
        while(sPath.indexOf('/') > 0){
            sPath = sPath.replace(/^(.*)[\x2f]([^\x2f]+)$/,"$1");
            let sParentFile = sPath + "/" + sFileName;
            if( !((this.rootPath + sParentFile) in hFile) ){
                //console.log("CHECK:"+sParentFile);
                hFile[this.rootPath + sParentFile] = true;
                if( this.exists(this.rootPath + sParentFile) ){
                    //console.log("LOAD:"+sParentFile +" in "+this.rootPath);
                    aFile.push(this.rootPath+sParentFile);
                }
            }
            sParentFile = sPath + "/xx.js";
            if( !((this.rootPath + sParentFile) in hFile) ){
                //console.log("CHECK:"+sParentFile);
                hFile[this.rootPath + sParentFile] = true;
                if( this.exists(this.rootPath + sParentFile) ){
                    aFile.push(this.rootPath+"/"+sParentFile);
                }
            }
        }
        this._checkAndAddFile(this.rootPath,sFileName,hFile,aFile);
    }

    _collectLexerFiles(sOrganization,sPublication,sPart,sUse,sContext,sLn, aDependencies,aFile)
    {
        let hAdded = {}
        let sExternalLexerFile = null;
        if( sUse == "colloquial"){
            sExternalLexerFile = sOrganization + "/" + sPublication + "/" + sPart + "/" + sUse + "/" + sContext + "/" + sLn + ".js";
            this._checkAndAddFile(this.rootPath,sExternalLexerFile,hAdded,aFile);
        }else if( sUse == "internal"){
            sExternalLexerFile = sOrganization + "/" + sPublication + "/internal/" + sContext + "/" + sLn + ".js";
            this._checkAndAddFile(this.rootPath,sExternalLexerFile,hAdded,aFile);
            sExternalLexerFile = sOrganization + "/" + sPublication + "/internal/" + sLn + ".js";
            this._checkAndAddFile(this.rootPath,sExternalLexerFile,hAdded,aFile);
        }
        let sLexerFile = sOrganization + "/" + sPublication + "/" + sPart + "/" + sUse + "/" + sContext + "/" + sLn + ".js";
        this._checkAndAddFile(this.rootPath,sLexerFile,hAdded,aFile);

        //console.log("Lexer file:"+sOrganization);
        if( sExternalLexerFile != null ){
            this._collectParentLexerFiles(sExternalLexerFile,hAdded,aFile);    
        }
        this._collectParentLexerFiles(sLexerFile,hAdded,aFile);
        if( aDependencies != null){
            for(let oDependency of aDependencies ){
                if( !this._requiredColloquiality(oDependency.colloquial,sUse ))
                    continue;
                let sDependencyLexer = oDependency.organization + "/" + oDependency.publication + "/" + oDependency.name + "/" + sUse + "/" + sContext + "/" + sLn + ".js";
                this._collectParentLexerFiles(sDependencyLexer,hAdded,aFile);
            }
        }
        return aFile.length!=0;
    }

    
    _anyDirty(aFile)
    {
        for(let sFile of aFile){
            if( this.isDirty(sFile) )
                return true;
        }
        return false;
    }
    /**
     * load and merge entire lexer
     * @param {string} sOrganization
     * @param {string} sPublication 
     * @param {string} sPart
     * @param {string} sUse {idguard,id,internalguard,colloquialguard,externalguard,internallink,colloquiallink,externallink}
     * @param {string} sContext 'general' or name of context
     * @param {string} sLn language
     * @param {[{organization:string,publication:string,part:string,colloquial:boolean}]} aDependencies
     * @return {LexicalUnits?} loaded lexical units;
     */
    
    /* eslint-disable no-console */
    requireLexer(sOrganization,sPublication,sPart,sUse,sContext,sLn, aDependencies, aErrors)
    {
        let sLexerFile = sOrganization + "/" + sPublication + "/" + sPart + "/" + sUse + "/" + sContext + "/" + sLn + ".js";
        if(aDependencies==null){
            console.log("lexers: no dependencies: "+sLexerFile);
            //return null;
        }
        let sLexerFolder = sOrganization + "/" + sPublication + "/" + sPart + "/" + sUse + "/" + sContext;
        let bSameDependency = aDependencies==null?true:this._isSameDependency(sLexerFolder,aDependencies);
        let aFiles = [];
        console.log("Collecting lexer files for "+[sOrganization,sPublication,sPart,sUse,sContext,sLn].join(":"));
        if( !this._collectLexerFiles(sOrganization,sPublication,sPart,sUse,sContext,sLn, aDependencies,aFiles) )
            return null;
        console.log("Lexer files "+JSON.stringify(aFiles));
        if( bSameDependency && (sLexerFile in this.lexers) && !this._anyDirty(aFiles) ){
            return this.lexers[sLexerFile];
        }
        if( !bSameDependency)
            this._setDependency(sLexerFolder,aDependencies)

        let oLexer = this._collectLexers(sOrganization,sPublication,sPart,sUse,sContext,sLn, aDependencies, aErrors);
        this.lexers[sLexerFile] = oLexer;
        return oLexer;
    }
    /* eslint-enable */
}
module.exports = Lexers;