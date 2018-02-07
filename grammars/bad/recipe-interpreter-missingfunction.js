class RecipeInterpreter
{
    constructor()
    {

    }
    id(data){
        return data[0];
    }
    
    repeat(data){
        return [data[0],data[1]];
    }
    /*
    null(data){
        return null;
    }
    */
    
}

module.exports = new RecipeInterpreter();