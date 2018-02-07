(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./nearley'));
    } else {
        root.Compile = factory(root.nearley);
    }
}(this, function(nearley) {

function Compile(structure, opts) {
    var unique = uniquer();
    if (!opts.alreadycompiled) {
        opts.alreadycompiled = [];
    }

    var result = {
        rules: [],
        body: [], // @directives list
        customTokens: [], // %tokens
        config: {}, // @config value
        macros: {},
        start: ''
    };

    for (var i = 0; i < structure.length; i++) {
        var productionRule = structure[i];
        if (productionRule.body) {
            // This isn't a rule, it's an @directive.
            if (!opts.nojs) {
                result.body.push(productionRule.body);
            }
        } else if (productionRule.include) {
            // Include file
            var path;
            if (!productionRule.builtin) {
                path = require('path').resolve(
                    opts.file ? require('path').dirname(opts.file) : process.cwd(),
                    productionRule.include
                );
            } else {
                path = require('path').resolve(
                    __dirname,
                    '../builtin/',
                    productionRule.include
                );
            }
            if (opts.alreadycompiled.indexOf(path) === -1) {
                opts.alreadycompiled.push(path);
                f = require('fs').readFileSync(path).toString();
                var parserGrammar = new require('./nearley-language-bootstrapped.js');
                var parser = new nearley.Parser(parserGrammar.ParserRules, parserGrammar.ParserStart);
                parser.feed(f);
                var c = Compile(parser.results[0], {path: path, __proto__:opts});
                require('./lint.js')(c, {out: process.stderr});
                result.rules = result.rules.concat(c.rules);
                result.body  = result.body.concat(c.body);
                result.customTokens = result.customTokens.concat(c.customTokens);
                Object.keys(c.config).forEach(function(k) {
                    result.config[k] = c.config[k];
                });
                Object.keys(c.macros).forEach(function(k) {
                    result.macros[k] = c.macros[k];
                });
            }
        } else if (productionRule.macro) {
            result.macros[productionRule.macro] = {
                'args': productionRule.args,
                'exprs': productionRule.exprs
            };
        } else if (productionRule.config) {
            // This isn't a rule, it's an @config.
            result.config[productionRule.config] = productionRule.value
        } else {
            produceRules(productionRule.name, productionRule.rules, {});
            if (!result.start) {
                result.start = productionRule.name;
            }
        }
        // TA 20180131 {+ added for allowing JSON output without bothering the grammar files
        if( "json" in opts){
          result.config.preprocessor = "json";
        }
        // TA 20180131 +}
    }

    return result;

    function produceRules(name, rules, env) {
        for (var i = 0; i < rules.length; i++) {
            var rule = buildRule(name, rules[i], env);
            if (opts.nojs) {
                rule.postprocess = null;
            }
            // TA 20180131 {+ add call to interpreter if exists
            if( rule.postprocess && !("json" in opts) && result.config.interpreter ){
              let postprocess = "function(data){ return ";
              let vPostprocess = JSON.parse(rule.postprocess);
              if( typeof(vPostprocess)=="string"){
                postprocess+=result.config.interpreter + "." + vPostprocess + "(data)}";
              }else if( vPostprocess instanceof Array ){
                let sFunctionName = vPostprocess[0];
                let nStart = 1;
                if( typeof(sFunctionName)!="string"){
                  nStart = 0;
                  sFunctionName = name;
                }
                postprocess+=result.config.interpreter + "." + sFunctionName + "(";
                let sArrayParams = ""
                for(let j=nStart;j<vPostprocess.length;j++){
                  let v = vPostprocess[j];
                  let index;
                  if( typeof(v) != "string" && !(v instanceof Object)){
                    index = parseInt(v);
                  }else{
                    index = NaN;
                  }
                  if(j!=nStart)
                    sArrayParams += ",";

                  if( !isNaN(index) && index>=0 )
                    sArrayParams+="data["+index+"]";
                  else
                    sArrayParams+=JSON.stringify(v);
                }
                postprocess+=sArrayParams+")";
              }else if( vPostprocess instanceof Object ){
                let sFunction = vPostprocess.function;
                if( !sFunction )
                  sFunction = name;
                let sParams = "";

                for(let k in vPostprocess){
                  let v= vPostprocess[k];
                  let index;
                  if( typeof(v) != "string" && !(v instanceof Object)){
                    index = parseInt(v);
                  }else{
                    index = NaN;
                  }
                  if(sParams!="")
                    sParams+=","
                  if( !isNaN(index) && index >= 0){
                    sParams += "\""+k+"\":data["+index+"]";
                  }else{
                    sParams += "\""+k+"\":"+JSON.stringify(v)
                  }
                }
                postprocess+=result.config.interpreter + "." + sFunction + "("+i+",{" + sParams + "})}";
              }else{
                postprocess += rule.postprocess;
              }
              rule.postprocess = postprocess;
            }
            // TA 20180131 }+
            result.rules.push(rule);
        }
    }

    function buildRule(ruleName, rule, env) {
        var tokens = [];
        for (var i = 0; i < rule.tokens.length; i++) {
            var token = buildToken(ruleName, rule.tokens[i], env);
            if (token !== null) {
                tokens.push(token);
            }
        }
        return new nearley.Rule(
            ruleName,
            tokens,
            rule.postprocess
        );
    }

    function buildToken(ruleName, token, env) {
        if (typeof token === 'string') {
            if (token === 'null') {
                return null;
            }
            return token;
        }

        if (token instanceof RegExp) {
            return token;
        }

        if (token.literal) {
            if (!token.literal.length) {
                return null;
            }
            if (token.literal.length === 1 || result.config.lexer) {
                return token;
            }
            return buildStringToken(ruleName, token, env);
        }
        if (token.token) {
            if (result.config.lexer) {
                var name = token.token;
                if (result.customTokens.indexOf(name) === -1) {
                    result.customTokens.push(name);
                }
                /* TA 20180131 {-
                var expr = result.config.lexer + ".has(" + JSON.stringify(name) + ") ? {type: " + JSON.stringify(name) + "} : " + name;
                -}
                return {token: "(" + expr + ")"};
                */
                // TA 20180131 {+ default behavior kep, but when JSON: instead of call to a function, add data for terminal
                var expr;
                if( !("json" in opts) ){
                  // default
                  expr = "(" + result.config.lexer + ".has(" + JSON.stringify(name) + ") ? {type: " + JSON.stringify(name) + "} : " + name + ")";
                }else{
                  // data only
                  expr = "{ \"terminal\":"+ JSON.stringify(name) + "}";
                }
                return {token: expr };
                // TA 20180131 +}
            }
            return token;
        }

        if (token.subexpression) {
            return buildSubExpressionToken(ruleName, token, env);
        }

        if (token.ebnf) {
            return buildEBNFToken(ruleName, token, env);
        }

        if (token.macrocall) {
            return buildMacroCallToken(ruleName, token, env);
        }

        if (token.mixin) {
            if (env[token.mixin]) {
                return buildToken(ruleName, env[token.mixin], env);
            } else {
                throw new Error("Unbound variable: " + token.mixin);
            }
        }

        throw new Error("unrecognized token: " + JSON.stringify(token));
    }

    function buildStringToken(ruleName, token, env) {
        var newname = unique(ruleName + "$string");
        produceRules(newname, [
            {
                tokens: token.literal.split("").map(function charLiteral(d) {
                    return {
                        literal: d
                    };
                }),
                postprocess: 
                    // TA 20180202 - {builtin: "joiner"}
                    // TA 20180202 +{ check if json option provided
                    "json" in opts ? (!result.config.interpreter? null :  "["+"\"literal\","+JSON.stringify(token.literal)+"]") : {builtin: "joiner"}
                    // TA 20180202 +}
                    
            }
        ], env);
        return newname;
    }

    function buildSubExpressionToken(ruleName, token, env) {
        var data = token.subexpression;
        var name = unique(ruleName + "$subexpression");
        //structure.push({"name": name, "rules": data});
        produceRules(name, data, env);
        return name;
    }

    function buildEBNFToken(ruleName, token, env) {
        switch (token.modifier) {
            case ":+":
                return buildEBNFPlus(ruleName, token, env);
            case ":*":
                return buildEBNFStar(ruleName, token, env);
            case ":?":
                return buildEBNFOpt(ruleName, token, env);
        }
    }

    function buildEBNFPlus(ruleName, token, env) {
        var name = unique(ruleName + "$ebnf");
        /*
        structure.push({
            name: name,
            rules: [{
                tokens: [token.ebnf],
            }, {
                tokens: [token.ebnf, name],
                postprocess: {builtin: "arrconcat"}
            }]
        });
        */
        // TA 20180205 {+ JSON compilation 
        if( !("json" in opts)){
        // TA 20180205 }+
            produceRules(name,
                [{
                    tokens: [token.ebnf],
                    postprocess: (!result.config.interpreter? null :"[\"null\"]")
                }, {
                    tokens: [name, token.ebnf],
                    postprocess: {builtin: "arrpush"}
                }],
                env
            );
        // TA 20180205 {+ JSON compilation 
        }else{
            produceRules(name,
                [{
                    tokens: [token.ebnf],
                    postprocess: (!result.config.interpreter? null :"[\"null\"]")
                }, {
                    tokens: [name, token.ebnf],
                    postprocess: (!result.config.interpreter? null :"[\"repeat\"]"),
                }],
                env
            );
        }
        // TA 20180205 }+
        return name;
    }

    function buildEBNFStar(ruleName, token, env) {
        var name = unique(ruleName + "$ebnf");
        /*
        structure.push({
            name: name,
            rules: [{
                tokens: [],
            }, {
                tokens: [token.ebnf, name],
                postprocess: {builtin: "arrconcat"}
            }]
        });
        */
        // TA 20180205 {+ JSON compilation 
        if( !("json" in opts)){
        // TA 20180205 }+
            produceRules(name,
                [{
                    tokens: [],
                }, {
                    tokens: [name, token.ebnf],
                    postprocess: {builtin: "arrpush"}
                }],
                env
            );
        // TA 20180205 {+ JSON compilation 
        }else{
            produceRules(name,
                [{
                    tokens: [],
                }, {
                    tokens: [name, token.ebnf],
                    postprocess: (!result.config.interpreter? null :"[\"repeat\"]"),
                }],
                env
            );
        }
        // TA 20180205 }+
    return name;
    }

    function buildEBNFOpt(ruleName, token, env) {
        var name = unique(ruleName + "$ebnf");
        /*
        structure.push({
            name: name,
            rules: [{
                tokens: [token.ebnf],
                postprocess: {builtin: "id"}
            }, {
                tokens: [],
                postprocess: {builtin: "nuller"}
            }]
        });
        */
        // TA 20180205 {+ JSON compilation 
        if( !("json" in opts)){
            // TA 20180205 }+
            produceRules(name,
            [{
                tokens: [token.ebnf],
                postprocess: {builtin: "id"}
            }, {
                tokens: [],
                postprocess: {builtin: "nuller"}
            }],
            env
            );
        // TA 20180205 {+ JSON compilation 
        }else{
            produceRules(name,
                [{
                    tokens: [token.ebnf],
                    postprocess: (!result.config.interpreter? null :"[\"id\"]")
                }, {
                    tokens: [],
                    postprocess: (!result.config.interpreter? null :"[\"null\"]")
                }],
                env
            );
        }
        // TA 20180205 }+   
        return name;
    }

    function buildMacroCallToken(ruleName, token, env) {
        var name = unique(ruleName + "$macrocall");
        var macro = result.macros[token.macrocall];
        if (!macro) {
            throw new Error("Unkown macro: "+token.macrocall);
        }
        if (macro.args.length !== token.args.length) {
            throw new Error("Argument count mismatch.");
        }
        var newenv = {__proto__: env};
        for (var i=0; i<macro.args.length; i++) {
            var argrulename = unique(ruleName + "$macrocall");
            newenv[macro.args[i]] = argrulename;
            produceRules(argrulename, [token.args[i]], env);
            //structure.push({"name": argrulename, "rules":[token.args[i]]});
            //buildRule(name, token.args[i], env);
        }
        produceRules(name, macro.exprs, newenv);
        return name;
    }
}

function uniquer() {
    var uns = {};
    return unique;
    function unique(name) {
        var un = uns[name] = (uns[name] || 0) + 1;
        return name + '$' + un;
    }
}

return Compile;

}));
