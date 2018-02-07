class RecipeInterpreter
{
    constructor()
    {
        this.xxx = "hello"
    }
    id(data){
        console.log("###*** ID "+(data[0]?data[0].type:"NULL"));
        return data[0];
    }
    dumpArray(a){
        let r = [];
        for(let i=0;i<a.length;i++){
            r.push(i+" "+typeof(a[i]));
            if(typeof(a[i])=="object"){
                for(let v in a[i]){
                    console.log(" ["+v+"]\n"+this.dumpObject(a[i][v]));
                }
            }

        }
        return "\n"+r.join("\n");
    }
    dumpObject(a){
        let r = [];
        for(let v in a){
            r.push("  ."+v);
        }
        return r.join("\n");
    }
    repeat(data){
        //console.log("### REPEAT... " + data.length+this.dumpArray(data));
        
        if(!data)
            return [];
        if(!data[0] && !data[1])
            return [];
        if(!data[0])
            return data[1];
        if(!data[1])
            return data[0];
        //console.log("###*** REPEAT "+(data[0]?data[0].type:"NULL")+" + "+(data[1]?data[1].type:"NULL"));
        return data[0].concat([ data[1] ]);
    }
    
    null(data){
        return data[0];
    }
    
}

module.exports = new RecipeInterpreter();