# Test scenario structure

Test scenarios are described in JSON files with the following structure:

```{
    "name": "...(free) name of the test scenario..."
    "options": {
        "grammar": "...relative path+file name of the .ne file",
        "lexer": "...relative path+file of the lexer .js file",
        "methods": // array of method testing
        [
            {
                "method": "...(free) name of the testing method...".
                "interpreter": "none" | "...relative path+file of rule interpreter .js, see below..."
                "field": "name of the 'expected' field value, see below..."
                "file": "...relative path+file to the output file...; .txt for text, .html for html output"
                "start": "...name of the start rule..."
            },
            // ... multiple methods
        ]
    },
    "cases": // array of individual test cases
    [
        { // a single test case
            "name": "...(free) name of a test case...",
            "input": "...input text to parse...",
            "...expexted field name 1...": [...expected result performing the associated  method..., see below...]
            ...
            "...expexted field name n...": "...expected result performing the associated  method..., see below..."
        }
    ]

}
```


# Interpreter files

3 default interpreters are provided

1. "none": default interpreter to collect entire, valid sequences that correspond to the grammar
2. "unit-interpreter.js": those rules, marked with "unit" preprocessing function are considered as parenthesized
3. "unitvalue-interpreter.js" rules marked with value computation are parenthesized and values are computed and checked

The content of the expected value varies when using the different interpreters. 

# "Field" of methods

The field name is linked to the "expected field" of "cases", i.e. for a particular method the expected value given under the same field will be compared againts the received value.

# Content of the expected value

## Default interpreter ("none")

The value is an array of strings, whereas each string is a valid sentence according to the grammar.
Non-matching parts are not presented.

Example:

considering the grammar collecting sequences of ingredients of a recipe separated by commas
```
"methods": [{
    "interpreter":"none",
    "field":"sequence",
    ...
}]
...
cases:[{
    "input":"Recipe: 1 kg flour, 2 l milk, mix well; add 1 g salt, 1 l vinegar, mix again",
    "sequence":["1 kg flour, 2 l milk","1 g salt, 1 l vinegar"],
...]}   
```

## Unit interpreter

The value is an array of strings about the same as in the "sequence", in which "units" marked in the grammar are parenthesized.

Example .ne:
```
ingredient -> %measure %space %name {%"unit"%}
```
Example test .json:
```
    "interpreter":"../lib/unit-interpreter.js",
    "field":"unit",
... 
cases:[{   
    "input":"Recipe: 1 kg flour, 2 l milk, mix well; add 1 g salt, 1 l vinegar, mix again",
    "unit":["{1 kg flour}, {2 l milk}","{1 g salt}, {1 l vinegar}"],
...
```

## Unit value interpreter

The computed, generated values of each unit are added within each unit.

The values are considered as name-value pairs, either given in the rule as constant or computed from the values of the matched atoms of the matching rule.

Example .ne:
```
ingredient -> %measure %space %name 
    {%{ "function": "unit","unitType":"ingredient", "fields":{"measure":0,"name":2} }%}

```

The called function here is the "unit" function, with some options.
The syntax of the function call is as follows:
```
    { "function": "...name of the function to call...", 
        // this is "unit" now, because we use both the 'unit' and 'unit value' interpreter
        // however, this can be replaced with other functions (in harmony to the interpreter)
        "...constant field 1...": "...constant field value 1..." // some constant fields
        // unit type is given in the above example        
        "fields":{
            "...fieldName 1 ...":"...integer 1, the index of matched element in the rule...",
            ...
        }
```

In the above example:
"measure":0 accesses the %measure, that is the 0th terminal in the rule
"name": 2 accesses the %name, that is the 2nd terminal in the rule

However, non-terminals can be also used there (to be tested)

Please note that for atoms, the substituted values of the input values are collected.
This substutition is described in the lexer file.

As a test case:

```
methods:[{
    "interpreter":"../lib/unitvalue-interpreter.js",
    "field":"unitvalue",
    ...
}]

...

"cases": [{
    "input":"Recipe: 1 kg flour, 2 l milk, mix well; add 1 g salt, 1 l vinegar, mix again",
    "unitvalue":["{1 kg flour}={measure=1'kg,name=flour,unitType=ingredient}, {2 l milk}={measure=2'l,name=milk},unitType=ingredient","{1 g salt}={measure=1'g,name=salt,unitType=ingredient}, {1 l vinegar}={measure=1'l,name=vinegar,unitType=ingredient}"]
}]
```

The test case contains for each matched unit in {}, the collected values in format

```
{...found unit 1...}={...unit values...}<fillers in the rule>{...found unit 2...}={...unit values...}
```

where as unit values is a comma-separated list of values computed from the rule or from the static parameters as described above.


# Complete example

## Lexer
```
let {atom,regexp,Lexer,use} = require('../lib/lexer-tolerant.js');
let myRecipeLexer = new Lexer("myRecipeLexer");
use(myRecipeLexer);

atom("measure",{"volume":"","weight":"","number":""}).substitute().beforeSeparator().afterSeparator();

atom("number",regexp("[1-9][0-9]*")).substitute();
atom("weightnumber",["number"]);

atom("weight",["weightnumber","space","weightunit"]).substitute((x)=>(x.weightnumber+"'"+x.weightunit)).beforeSeparator().afterSeparator()

atom("weightunit",regexp("(g|kg|oz)")).substitute().standalone().beforeSeparator()

atom("volumenumber",["number"]);

atom("volume",["volumenumber","space","volumeunit"]).substitute((x)=>(x.volumenumber+"'"+x.volumeunit)).beforeSeparator().afterSeparator()

atom("volumeunit",regexp("(l|ml)")).substitute().standalone().beforeSeparator()

atom("name",regexp("[a-z_]+")).substitute().beforeSeparator().afterSeparator();

atom("white",regexp("[ \\t\\n]+"));
atom("space",regexp("[ ]"));
atom("comma",regexp(",[ \\t\\n]+"));
atom("action",regexp("[A-Z]+"))
myRecipeLexer.setStart("measure");
module.exports = myRecipeLexer;
```

## Parser

```
@lexer measureLexer

start -> ingredient moreIngredients actions {%"repeat"%}

actions -> action:*

moreIngredients -> (%comma ingredient):* 

ingredient -> %measure %space %name {%{ "function": "unit",

"unitType":"ingredient", "fields":{"measure":0,"name":2} }%}
action -> %action

```

## Test file (to be revised!)

```
{
    "name":"Measure test cases",
    "options": {
        "grammar":"measure.ne",
        "lexer":"measure-lexer.js",
        "methods":
        [
            {
                "method":"findText",
                "interpreter":"none",
                "field":"sequence",
                "file": "measure.sequence.found.txt"
            },
            {
                "method":"findUnit",
                "interpreter":"../lib/unit-interpreter.js",
                "field":"unit",
                "file": "measure.unit.found.txt"
            },
            {
                "method":"findUnitValue",
                "interpreter":"../lib/unitvalue-interpreter.js",
                "field":"unitvalue",
                "file": "measure.value.found.txt"
            }
        ]
    },
    "cases":[
        {   "name":"1/1",
            "input":"Recipe: 1 kg flour, 2 l milk, mix well; add 1 g salt, 1 l vinegar, mix again",
            "sequence":["1 kg flour, 2 l milk","1 g salt, 1 l vinegar"],
            "unit":["{1 kg flour}, {2 l milk}","{1 g salt}, {1 l vinegar}"],
            "unitvalue":["{1 kg flour}={measure=1'kg,name=flour}, {2 l milk}={measure=2'l,name=milk}","{1 g salt}={measure=1'g,name=salt}, {1 l vinegar}={measure=1'l,name=vinegar}"]
        },
        {   "name":"1/2",
            "input":"Recipe: 1 g salt, 1 l vinegar and something else",
            "sequence":["1 g salt, 1 l vinegar"],
            "unit":["{1 g salt}, {1 l vinegar}"],
            "unitvalue":["{1 g salt}={measure=1'g,name=salt}, {1 l vinegar}={measure=1'l,name=vinegar}"]
        }
     ]
}
```

