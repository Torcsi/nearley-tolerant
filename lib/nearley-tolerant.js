(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.nearley = factory();
    }
}(this, function() {

function Rule(name, symbols, postprocess) {
    this.id = ++Rule.highestId;
    this.name = name;
    this.symbols = symbols;        // a list of literal | regex class | nonterminal
    this.postprocess = postprocess;
    return this;
}
Rule.highestId = 0;

Rule.prototype.toString = function(withCursorAt) {
    function stringifySymbolSequence (e) {
        return e.literal ? JSON.stringify(e.literal) :
               e.type ? '%' + e.type : e.toString();
    }
    var symbolSequence = (typeof withCursorAt === "undefined")
                         ? this.symbols.map(stringifySymbolSequence).join(' ')
                         : (   this.symbols.slice(0, withCursorAt).map(stringifySymbolSequence).join(' ')
                             + " ● "
                             + this.symbols.slice(withCursorAt).map(stringifySymbolSequence).join(' ')     );
    return this.name + " → " + symbolSequence;
}


// a State is a rule at a position from a given starting point in the input stream (reference)
function State(rule, dot, reference, wantedBy) {
    this.rule = rule;
    this.dot = dot;
    this.reference = reference;
    this.data = [];
    this.wantedBy = wantedBy;
    this.isComplete = this.dot === rule.symbols.length;
}

State.prototype.toString = function() {
    return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
};

State.prototype.nextState = function(child) {
    var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
    state.left = this;
    state.right = child;
    if (state.isComplete) {
        state.data = state.build();
    }
    return state;
};

State.prototype.build = function() {
    var children = [];
    var node = this;
    do {
        // 20180209 added {+
        if(node.right)
        // 20180209 added }+
        children.push(node.right.data);
        node = node.left;
    /* 20180209 added {-
    } while (node && node.left);
       20180209 removed }-
    */
    // 20180209 added {+
    } while (node && node.left);
    // 20180209 added }-
    children.reverse();
    return children;
};

State.prototype.finish = function() {
    if (this.rule.postprocess) {
        //console.log("### State "+this.rule.name+" POSTPROCESS");
        this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
    }else{
        //console.log("### State "+this.rule.name+" NO POSTPROCESS");
    }
};


function Column(grammar, index) {
    this.grammar = grammar;
    this.index = index;
    this.states = [];
    this.wants = {}; // states indexed by the non-terminal they expect
    this.scannable = []; // list of states that expect a token
    this.completed = {}; // states that are nullable
	this.expected = {}; // expectable tokens
}


Column.prototype.process = function(nextColumn) {
    var states = this.states;
    var wants = this.wants;
    var completed = this.completed;

    for (var w = 0; w < states.length; w++) { // nb. we push() during iteration
        var state = states[w];

        if (state.isComplete) {
            //console.log("### COMPLETE "+state.rule.name);
            state.finish();
            if (state.data !== Parser.fail) {
                // complete
                var wantedBy = state.wantedBy;
                for (var i = wantedBy.length; i--; ) { // this line is hot
                    var left = wantedBy[i];
                    this.complete(left, state);
                }

                // special-case nullables
                if (state.reference === this.index) {
                    // make sure future predictors of this rule get completed.
                    var exp = state.rule.name;
                    (this.completed[exp] = this.completed[exp] || []).push(state);
                }
            }

        } else {
            // queue scannable states
            //console.log("### State overflow"+state.rule);
            var exp = state.rule.symbols[state.dot];
            if (typeof exp !== 'string') {
                this.scannable.push(state);
                //var expect = state.rule.symbols[state.dot];
                this.expected[exp.type] = true;
                continue;
            }

            // predict
            if (wants[exp]) {
                wants[exp].push(state);

                if (completed.hasOwnProperty(exp)) {
                    var nulls = completed[exp];
                    for (var i = 0; i < nulls.length; i++) {
                        var right = nulls[i];
                        this.complete(state, right);
                    }
                }
            } else {
                wants[exp] = [state];
                this.predict(exp);
            }
        }
    }
}

Column.prototype.predict = function(exp) {
    var rules = this.grammar.byName[exp] || [];

    for (var i = 0; i < rules.length; i++) {
        var r = rules[i];
        var wantedBy = this.wants[exp];
        var s = new State(r, 0, this.index, wantedBy);
        this.states.push(s);
    }
}

Column.prototype.complete = function(left, right) {
    var inp = right.rule.name;
    if (left.rule.symbols[left.dot] === inp) {
        var copy = left.nextState(right);
        this.states.push(copy);
    }
}


function Grammar(rules, start) {
    this.rules = rules;
    this.start = start || this.rules[0].name;
    var byName = this.byName = {};
    this.rules.forEach(function(rule) {
        if (!byName.hasOwnProperty(rule.name)) {
            byName[rule.name] = [];
        }
        byName[rule.name].push(rule);
    });
}

// So we can allow passing (rules, start) directly to Parser for backwards compatibility
Grammar.fromCompiled = function(rules, start) {
    var lexer = rules.Lexer;
    if (rules.ParserStart) {
      start = rules.ParserStart;
      rules = rules.ParserRules;
    }
    var rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
    var g = new Grammar(rules, start);
    g.lexer = lexer; // nb. storing lexer on Grammar is iffy, but unavoidable
    return g;
}


function StreamLexer() {
  this.reset("");
}

StreamLexer.prototype.reset = function(data, state) {
    this.buffer = data;
    this.index = 0;
    this.line = state ? state.line : 1;
    this.lastLineBreak = state ? -state.col : 0;
}

StreamLexer.prototype.next = function() {
    if (this.index < this.buffer.length) {
        var ch = this.buffer[this.index++];
        if (ch === '\n') {
          this.line += 1;
          this.lastLineBreak = this.index;
        }
        return {value: ch};
    }
}

StreamLexer.prototype.save = function() {
  return {
    line: this.line,
    col: this.index - this.lastLineBreak,
  }
}

StreamLexer.prototype.formatError = function(token, message) {
    // nb. this gets called after consuming the offending token,
    // so the culprit is index-1
    var buffer = this.buffer;
    if (typeof buffer === 'string') {
        var nextLineBreak = buffer.indexOf('\n', this.index);
        if (nextLineBreak === -1) nextLineBreak = buffer.length;
        var line = buffer.substring(this.lastLineBreak, nextLineBreak)
        var col = this.index - this.lastLineBreak;
        message += " at line " + this.line + " col " + col + ":\n\n";
        message += "  " + line + "\n"
        message += "  " + Array(col).join(" ") + "^"
        return message;
    } else {
        return message + " at index " + (this.index - 1);
    }
}


function Parser(rules, start, options) {
    var grammar;
    if (rules instanceof Grammar) {
        grammar = rules;
        var options = start;
    } else {
        grammar = Grammar.fromCompiled(rules, start);
    }
    this.grammar = grammar;

    // Read options
    this.options = {
        //keepHistory: false,
        // TA 20180205 - lexer: grammar.lexer || new StreamLexer,
        // TA 20180205 +{
        lexer: options.lexer || grammar.lexer || new StreamLexer,
        // TA 20180205 +}
    };
    
    for (var key in (options || {})) {
        this.options[key] = options[key];
    }
    // Setup lexer
    this.lexer = this.options.lexer;
    this.lexerState = undefined;

    // Setup a table
    var column = new Column(grammar, 0);
    var table = this.table = [column];

    // I could be expecting anything.
    column.wants[grammar.start] = [];
    column.predict(grammar.start);
    // TODO what if start rule is nullable?
    column.process();
    this.current = 0; // token index
}

// create a reserved token for indicating a parse fail
Parser.fail = {};

//{ TA 20180130
Parser.prototype.init = function()
{
	var grammar = this.grammar;
    //console.log("### INIT:"+grammar.start);
	this.lexerState = undefined;
	var column = new Column(grammar, 0);
    var table = this.table = [column];

    // I could be expecting anything.
    column.wants[grammar.start] = [];
    column.predict(grammar.start);
    // TODO what if start rule is nullable?
    column.process();
	this.current = 0;
	this.finished = false;
}

Parser.prototype.carryOn = function()
{
	var grammar = this.grammar;
	//this.lexerState = undefined;
	 var column = new Column(grammar, 0);
    var table = this.table = [column];

    // I could be expecting anything.
    column.wants[grammar.start] = [];
    column.predict(grammar.start);
    // TODO what if start rule is nullable?
    column.process();
	this.current = 0;
    this.finished = false;
    
}
//}

Parser.prototype.expected = function()
{
    var column = this.table[this.current];
	return column.expected;
}

Parser.prototype.get = function()
{
    this.carryOn();
    this.feed(null);
    return !this.results || this.results.length==0?null:this;
}
Parser.prototype.logStart = function()
{
    this.logOn = true;
    this._log = [];
}
Parser.prototype.addLog = function(sMessage)
{
    this._log.push(sMessage);
}
Parser.prototype.logText = function()
{
    return this._log.join("\n");
}
Parser.prototype.logFinish = function(bClear)
{
    this.logOn = false;
    if(bClear===true || bClear===undefined)
    this._log = [];
    // preserve log
}
Parser.prototype.feed = function(chunk) {
    var lexer = this.lexer;
    lexer.reset(chunk, this.lexerState);
    
    var token;
    let bFirst = true;
    for (;;) {


		// collect possible nexts
		var column = this.table[this.current];
		var scannable = column.scannable;
		var expected = column.expected;


        // We add new states to table[current+1]
        token = lexer.next(expected)
        //console.log("###------------------------ expected:"+JSON.stringify(expected)+", token: "+(token==null?"FINISH":(token.type+":"+token.text)));
        if(!token)
        	break;
        if( this.options.tolerant && token.type=="NONE" ){
        	if( bFirst ){
                //console.log("Expected:"+JSON.stringify(expected));
        		while(token && !(token.type in expected)){
                    token = lexer.next();
                    //console.log("### skip token: "+(token==null?"FINISH":(token.type+":["+token.text+"]")));
        		}
        	}else{
                //console.log("SUDDENLY FINISHED")
        		break;
        	}
        }
        if(!token)
            break;
        bFirst = false;

        // GC unused states
        if (!this.options.keepHistory) {
            delete this.table[this.current - 1];
        }

        var n = this.current + 1;
        var nextColumn = new Column(this.grammar, n);
        this.table.push(nextColumn);

        // Advance all tokens that expect the symbol
        var literal = token.value;
        var value = lexer.constructor === StreamLexer ? token.value : token;

        //console.log("### find next state at "+this.current+":"+column.states.length);
        for (var w = scannable.length; w--; ) {
            var state = scannable[w];
            var expect = state.rule.symbols[state.dot];
            //console.log("### state: "+w+"/"+scannable.length+": "+state.rule.name + ":" + state.dot + ":"+expect.type);
            // Try to consume the token
            // either regex or literal
            if (expect.test ? expect.test(value) :
                expect.type ? (expect.type === token.type)
                            : expect.literal === literal)

            {
                // Add it
                //console.log("###...to next state "+expect.type+":"+token.text);
                if( this.logOn ){
                    this.addLog("rule:"+state.rule+"/"+state.dot+", token:"+expect.type+": success");
                }
                   
                var next = state.nextState({data: value, token: token, isToken: true, reference: n - 1});
                nextColumn.states.push(next);
                //console.log("###...next state: "+next.rule.name+":"+next.dot+"/"+next.rule.symbols.length);
            /** 20190209 TA {+ */
            }else if (expect.type && lexer.isA ){
                // check if the read token is compatible to another, expected token
                // since there cannot be more lexer states, shorter or longer matched value is not allowed!
                // however, the type may be changed and internal structure (computed values) may be different
                let newToken = lexer.isA(expect.type,token.type,token.text,token);
                if( this.logOn ){
                    this.addLog("rule:"+state.rule+"/"+state.dot+", expect:"+expect.type+" but token:"+token.type+", "+(newToken?"success":"failure"));
                }
                        
                
                if(newToken){
                    nextColumn.states.push(state.nextState({data: newToken, token: newToken, isToken: true, reference: n - 1}));
                }
            }
            /** 20190209 TA }+ */
            }

        // Next, for each of the rules, we either
        // (a) complete it, and try to see if the reference row expected that
        //     rule
        // (b) predict the next nonterminal it expects by adding that
        //     nonterminal's start state
        // To prevent duplication, we also keep track of rules we have already
        // added

        nextColumn.process();

        // If needed, throw an error:
        if (nextColumn.states.length === 0) {
            /* 20180208 TA {-
            // No states at all! This is not good.
            
            var message = this.lexer.formatError(token, "invalid syntax") + "\n";
            message += "Unexpected " + (token.type ? token.type + " token " : "") + JSON.stringify(expected)+" expexted";
            
            //message += JSON.stringify(token.value !== undefined ? token.value : token) + "\n";
            var err = new Error(message);
            err.offset = this.current;
            err.token = token;
            throw err;
            20180208 TA }- */
            // 20180208 TA {+
            /* an unexpected value arrived; this should not be read, not to consume something useful
               how come, it happened, let us tolerate fir the price of dropping a token
             */
            //console.log("SHIT HAPPENS")
            token.type = "NONE";
            this.table.pop();
            break;
            // 20180208 TA +}
        }

        // maybe save lexer state
        if (this.options.keepHistory) {
          column.lexerState = lexer.save()
        }

        this.current++;
    }
    //console.log("### FINISHED?!")
    if (column) {
      this.lexerState = lexer.save()
    }

    // Incrementally keep track of results
    if(!token){
    	this.finished = true;
    }else{
        this.finished = false;
    }
    this.completed = [];
    this.expected = [];
    this.results = this.finishTolerant(this.completed,this.expected);
/*
    if(token && token.type=="NONE" && this.options.tolerant){
        this.completed = [];
        this.expected = [];
    	this.results = this.finishTolerant(this.completed,this.expected);
    }else{
        this.completed = [];
        this.expected = [];
    	this.results = this.finish(this.completed,this.expected);
    }
    */
    // Allow chaining, for whatever it's worth
    return this;
};

Parser.prototype.save = function() {
    var column = this.table[this.current];
    column.lexerState = this.lexerState;
    return column;
};

Parser.prototype.restore = function(column) {
    var index = column.index;
    this.current = index;
    this.table[index] = column;
    this.table.splice(index + 1);
    this.lexerState = column.lexerState;

    // Incrementally keep track of results
    this.completed = [];
    this.expected = [];
    this.results = this.finish(this.completed,this.expected);
};

// nb. deprecated: use save/restore instead!
Parser.prototype.rewind = function(index) {
    if (!this.options.keepHistory) {
        throw new Error('set option `keepHistory` to enable rewinding')
    }
    // nb. recall column (table) indicies fall between token indicies.
    //        col 0   --   token 0   --   col 1
    this.restore(this.table[index]);
};

Parser.prototype.finish = function(aCompleted,aExpected) {
    // Return the possible parsings
    var considerations = [];
    var start = this.grammar.start;
    var column = this.table[this.table.length - 1]
    column.states.forEach(function (t) {
        //console.log("### FINISH: "+t.rule.name+","+t.dot+":"+t.reference)
        if (t.rule.name === start
                && t.dot === t.rule.symbols.length
                && t.reference === 0
                && t.data !== Parser.fail) {
                    //console.log("###...push.")
            considerations.push(t);
            aCompleted.push(true);
            aExpected.push(null);
        }
    });
    return considerations.map(function(c) {return c.data; });
};

// TA 20180130 +{ finishing when NONE received; produced data array will contain a NONE-type closing token
Parser.prototype.finishTolerant = function(aCompleted,aExpected) {
    // Return the possible parsings
    var considerations = [];
    var start = this.grammar.start;
    if(this.logOn){
        this.addLog("Finishing: depth:"+this.table.length);
    }

    var column = this.table[this.table.length - 1]
    let bFound = false;
    let me = this;
    column.states.forEach(function (t) {
        /*
        console.log("ANYFINISH");
        if( t.rule.name===start){
            console.log("### FINISHTOLERANT START ",t.reference,t.data==Parser.fail);
        }
        */
        if (t.rule.name === start
                /* && t.dot === t.rule.symbols.length */
                && t.reference === 0
                && t.data !== Parser.fail
          ) {
            t.data = t.build();
            considerations.push(t);
            if( t.dot != t.rule.symbols.length ){
                aCompleted.push(false);
                if(me.logOn){
                    me.addLog("rule:"+t.rule.name+": properly finished");
                }
                    /**
                console.log("### UNFINISHED expected:"+JSON.stringify(t.rule.symbols[t.dot]));
                for(let v in t.rule){
                    console.log("### UNFINISHED expected attribute "+v);
                }
                */
                aExpected.push(null);
            }else{
                if(me.logOn){
                    me.addLog("rule:"+t.rule.name+": middle finished");
                }
                aCompleted.push(true);
                aExpected.push(null);
            }
            bFound = true;
        }
    });
    
    for(let i=this.table.length-1;i>=0 && !bFound;i--){
        column = this.table[i]
        if(this.logOn){
            this.addLog("... depth:"+i+" "+column.states.length);
        }
        //let atState = 0;
        column.states.forEach(function (t) {
            /**
            if( t.rule.name===start){
                console.log("### FINISHANYTOLERANT START ",i+"/"+atState,t.reference,t.data==Parser.fail);
                atState++;
            }else{
                console.log("### FINISHANYTOLERANT NOT START at "+i+":"+t.rule.name);
            }
            */
            if(me.logOn){
                me.addLog("finalize: rule:"+t.rule.name+":"+i+t.reference+": failed:"+(t.data==Parser.fail)+" ref:"+t.reference);
            }
            if (t.rule.name === start
                    /* && t.dot === t.rule.symbols.length */
                    && t.reference === 0
                    && t.data !== Parser.fail
              ) {
                if(me.logOn){
                    me.addLog("finalize: success: dot:"+t.dot+", length:"+t.rule.symbols.length);
                }
                t.data = t.build();
                if( t.dot != t.rule.symbols.length ){
                    aCompleted.push(false);
                    aExpected.push({rule: t.rule.symbols[t.dot], symbols:column.expected});
                }else{
                    aCompleted.push(true);
                    aExpected.push(null);
                }
                considerations.push(t);
                bFound = true;
            }
        });
    }
    //console.log("### FINISHTOLERANT RESULT");
    
    if(this.logOn){
        this.addLog("finalize:considerations:"+considerations.length+"\n");
        for(let i=0;i<considerations.length;i++){
            this.addLog("["+i+"] "+considerations[i].data.length+":"+":"+aCompleted[i]);
            for(let j=0;j<considerations[i].data.length;j++){
                this.addLog(" ["+i+","+j+"] "+considerations[i].data[j]);
                for(let v in considerations[i].data[j]){
                    this.addLog(v);
                }
            }
        }
    }
    
    return considerations.map(function(c) {return c.data; });
};
// TA 20180130 +} finishing when NONE received

return {
    Parser: Parser,
    Grammar: Grammar,
    Rule: Rule,
};

}));
