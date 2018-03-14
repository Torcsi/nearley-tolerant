const fs =require("fs");
const invalidate = require("invalidate-module");

function getTimestamp(sFile)
{
    try{
        let oStat = fs.lstatSync(sFile);
        return oStat.mtimeMs;
    }
    catch(e){
        // no file, no force
        return -1;
    }
}

class CachedObject
{
    constructor(sAbsoluteFile)
    {
        this.file = sAbsoluteFile;
        this.require();
    }
    invalid(vTimestamp){
        if( !vTimestamp ){
            return getTimestamp(this.file) > this.timestamp;
        }
        return getTimestamp(this.file) > vTimestamp;
    }
    invalidate(vTimestamp)
    {
        if( !this.invalid(vTimestamp)){
            return;
        }
        invalidate(require.resolve(this.file));
    }
    require(){
        this.timestamp = getTimestamp(this.file);
        this.object = require(this.file);
        return this.object;
    }
}

class AbsoluteModuleCache
{
    constructor()
    {
        this.timestampFile = null;
        this.timestampGlobal = null;
        this.timestampLocal = null;
        this.cache = {};
        this._exists = {};
    }
    setTimestampFile(sFileName)
    {
        this.timestampFile = sFileName;
        this.checkCache();
    }
    /** 
     * @private
    */
    checkCache()
    {
        if( this.timestampFile != null){
            return this._checkCacheGlobal();
        }else{
            return this._checkCacheLocal();
        }

    }
    /**
     * check if anything changed since the global timestamp file was changed
     * @private
     */
    _checkCacheGlobal()
    {
        let currentTimestamp = getTimestamp(this.timestampFile);
        if( this.timestampGlobal == null || this.timestampGlobal < currentTimestamp ){
            this._reloadAll(this.timestampGlobal);
            this.timestampGlobal = currentTimestamp;
            return false;
        }
        return true;
    }
    /**
     * check if anything changed since the last check
     * @private
     */
    _checkCacheLocal()
    {
        let bReload = false;
        for(let sFile in this.cache){
            if(this.cache[sFile].invalid()){
                bReload = true;
                break;
            }
        }
        if( bReload ){
            this._reloadAll();
            return false;
        }
        return true;
    }
    /** 
     * force reload all
     * @private
    */
    _reloadAll(afterTimestamp)
    {
        this._exists = {};         // be ready for a next, new file
        for(let sFile in this.cache){
            this.exists[sFile] = true;
            this.cache[sFile].invalidate(afterTimestamp);
        }
        for(let sFile in this.cache){
            this.cache[sFile].require();
        }
    }
    /**
     * load a single module
     * @param {string} sFile with absolute path name
     */
    require(sFile)
    {
        if(!this.exists(sFile))
            return null;
        this.checkCache();
        if( sFile in this.cache ){
            return this.cache[sFile].object;
        }
        let oCachedObject = new CachedObject(sFile);
        this.cache[sFile] = oCachedObject;
        return oCachedObject.object;
    }
    /**
     * cache checking of existence
     * @param {string} sFile 
     */
    exists(sFile)
    {
        //console.log("Check existence ["+sFile+"]");
        if( !(sFile in this._exists) ){
            this._exists[sFile] = fs.existsSync(sFile);
            //console.log("Not in cache ["+sFile+"]" + this._exists[sFile]);
        }
        return this._exists[sFile]
    }
    /**
     * check if file is considered dirty, i.e. potentially changed
     * @param {string} sFile 
     */
    isDirty(sFile)
    {
        if(!this.exists(sFile))
            return false;
        if(!this.checkCache())
            return true;
        if(!this.isCached(sFile))
            return true;
        return false;
    }
    /**
     * check if module is cached
     * @param {string} sFile 
     */
    isCached(sFile)
    {
        return sFile in this.cache;
    }
}
module.exports = AbsoluteModuleCache;