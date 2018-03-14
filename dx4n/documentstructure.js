const fs = require("fs");

const gsFileName = "W:\\EPO\\TenderNo. 2037\\tihy4\\TIHYCompiler2\\nearley-tolerant\\nearley-tolerant\\test\\dx4n\\dx4n.structure.json";

class DocumentStructure
{
    constructor(sFileName)
    {
        if(!sFileName)
            sFileName = gsFileName;
        let s = fs.readFileSync(sFileName,{encoding:"utf-8"});
        this.ds = JSON.parse(s);
    }
    getExternalInfo(sOrg,sPub,sPart)
    {
        let aExt = [];

        // add all parts of this publication as colloquial
        let oThisPub = this.ds[sOrg].publications[sPub];
        if( oThisPub==null)
            return null;
        for(let sInternal in oThisPub.partTypes){
            let oExt = {organization:sOrg,publication:sPub,partType:sInternal,colloquial:false};
            aExt.push(oExt);
            oExt = {organization:sOrg,publication:sPub,partType:sInternal,colloquial:true};
            aExt.push(oExt);
        }
        let oInfo = this.ds[sOrg].publications[sPub].partTypes[sPart];
        if( oInfo != null){
            for(let sExtPub in oInfo.referredPublications){
                for(let sExtPart in oInfo.referredPublications[sExtPub].referredPartTypes){
                    let oExtPart = oInfo.referredPublications[sExtPub].referredPartTypes[sExtPart];
                    aExt.push(oExtPart);
                }
            }
        }
        return aExt;
    }
}

module.exports = DocumentStructure;