const fs = require("fs");
const path = require("path");

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
        for(let i=0;i<v.length;v++){
            let sRes = myStringify(v[i],0);
            if( sRes.indexOf("\n")>0){
                bSplit=true;
                break;
            }
            aRes1.push(sRes);
        }
        if( !bSplit){
            return "<div class='ms'>["+aRes1.join(aRes1,",")+"]</div>";
        }else{
            aRes.push("<div class='ms'>[");
            for(let i=0;i<v.length;v++){
                aRes.push(myStringifyHTML(v[i],d+1));
                aRes.push((sRes+i!=v.length-1?",":""));
            }
            aRes.push("]</div>");
        }
        return aRes.join("\n");
    }
    if(Object.keys(v).length == 0 )
    return "<div class='ms'>{}</div>";
    aRes.push(sIndent+"{");
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
    
}
class CaseTester
{
    constructor(){}

    loadFile(sFileName)
    {
        let sContent = fs.readFileSync(sFileName,{encoding:"utf-8"});
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
        let sExpectedOutputField = hOptions.output;
        return this.compareResult("",oCase[hOptions.field],fConverter(oCase.input),hOptions.format);
    }
    performCases(fConverter,hOptions)
    {
        let aRes = [];
        let sOutputFormat = hOptions.format;
        let sExpectedOutputField = hOptions.field;
        switch(sOutputFormat){
            case "html":
                aRes.push("<div class='test'><div class='caption'>"+this._name+": "+sExpectedOutputField+"</div>");
                break;
            case "text":
                aRes.push(this._name+": "+sExpectedOutputField);
        }
        for(let i=0;i<this._cases.length;i++){
            console.log("PERFORMTESTCASE:"+i)
            if(this._cases[i].active===false)
                continue;
            let oCase = this._cases[i];
            let vResult = fConverter(oCase.input);
            let sDiff = this.compareResult("",oCase[hOptions.field],vResult,hOptions.format);

            //let sDiff = this.performCase(this._cases[i],fConverter,hOptions);
            if( sDiff == null){
                
                switch(sOutputFormat){
                    case "html":
                        aRes.push("<div class='case'><div class='caption'>"+this._cases[i].name+"</div><div class='completed'>completed</div></div>");
                    case "text":
                        aRes.push(this._cases[i].name+": completed");
                }
            }else{
                switch(sOutputFormat){
                    case "html":
                        aRes.push("<div class='case'><div class='caption'>"+this._cases[i].name+"</div>");
                        if( hOptions.input ){
                            aRes.push("<div class='input'>")
                            aRes.push(myStringifyHTML(this._cases[i].input));
                            aRes.push("</div>")
                        }
                        if( hOptions.expected ){
                            aRes.push("<div class='expected'>")
                            aRes.push(myStringifyHTML(this._cases[i][hOptions.output]));
                            aRes.push("</div>")
                        }
                        if( hOptions.received ){
                            aRes.push("<div class='received'>")
                            aRes.push(myStringifyHTML(vResult));
                            aRes.push("</div>")
                        }
                        aRes.push("<div class='failed'>"+sDiff+"</div></div>");
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
        if("outputFile" in hOptions){
            fs.writeFileSync(this.relativeFile(hOptions.outputFile),sRes,{encoding:"utf-8"});
        }
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
        switch(sFormat){
            case "html":
                return "<div class='common'>"+commonBegin+"</div><div class='exp'>"+sEnd1+"</div><div class='rec'>"+sEnd2+"</div>";
            case "text":
                return (sPath!=""?sPath+" ":"")+ "common: "+JSON.stringify(commonBegin)+"', expected:"+JSON.stringify(sEnd1)+", received:"+JSON.stringify(sEnd2);
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

}

module.exports = CaseTester;