# nearley-tolerant

**under development** 

Tolerant nearley parser with .json generator tools
Tolerant lexer that can be accompanied to nearley.


Nearley https://www.npmjs.com/package/nearley and https://nearley.js.org/

Published by https://www.npmjs.com/~hardmath123 under MIT https://spdx.org/licenses/MIT.html licence.




Nearley
- is not supposed to work from data tables, instead from precompiled javascript files causing several difficulties (e.g. on-the-fly loading).
- cannot be initialized and re-run, does not tolerate partially completed rules.
- also cannot cope with ambiguous terminal symbols, i.e. those which may fit to the same string but defined differently
- accepts a simple plain next() function from the lexer, while it already should know what to tokens are acceptable.

In addition to the above
- @interpreter pragma added to call non-embedded interpreter (postprocessor) function for rules, so that definition can remain declarative

## Exporting json

A switch **-j** is added to nearleyc-tolerant, exporting data-only JSON.

The interpreter functions will be called as the generated code would do.

However, the loaded JSON file will be compiled so that a missing function, i.e. not provided by the interpreter, will be reported before parsing.

## Call of interpreter functions in JS files

If the **@interpreter** pragma added, the postprocessor functions are replaced by declarations of the function calls.

In order to allow proper postprocessing functions, the {% %} should contain JSON data, that will be interpreted as follows

1. when it is a string, the name corresponds to the name of the function to be called, first parameter is the rule name, second is data array

Example
```
{%"abc"%} => interpreter.abc(data)
```

2. when it is an array,

 - the first element is a string denoting the function of the interpreter to call (if not string, the name of the rule will be used)

 - if a parameter is an integer, it is considered as index of the data to be provided as parameter

 - otherwise it is a constant

Example
```
{%["abc",2,1,["some complex",{x:y}]]%} => interpreter.abc(data[2],data[1],["some complex",{x:y}])
X -> ... {%[2,1,["some complex",{x:y}]]%} => interpreter.X(data[2],data[1])
```

3. when it is an object, the parameter of the postprocessing function will be an object with the same keys,

 - the "function" key provides the name of method of the interpreter to call (if not provided, the name of the rule will be used)

 - if the value is an integer, it is considered the index of the data as the value

 - otherwise it is a constant

 Example
 ```
 {%{"function":"abc","foo":2,"bar":["some complex",{x:y}]]%} => interpreter.abc({"foo":data[2],bar:["some complex",{x:y}])
 ```

The parameter object must be, per se, a proper JSON string (keys to be put into ""s).

When function names are not defined, the developer must take care on calling the default functions with the proper names.

## Tolerance on incomplete input

The lexer may return a NONE token, that means the actual token is non-interpretable.

The lexer reads this entirely so that at the next() call it will return a valid start token (that could potentially, indeed, valid first terminal for the start rule).

However, the original nearley fails and drops an exception.

Instead, nearley-tolerant computes the partial results, and a NONE-type token is added after each non-finished rule (or calls that way the processing functions.)

## Tolerance on unexpected tokens

The lexer may return a token that is well-formed but the input string is invalid according to the grammar.

However, the original nearley fails and drops an exception.

Instead, nearley-tolerant computes the partial results, and a NONE-type token is added after each non-finished rule (or calls that way the processing functions.)

The parser can be reinitialized and lexer will continue by reading the actually non-expected token again.

## Initialization and continuation

parser.load(oGrammar,lexer,interpreter) loads a grammar and reports errors if the ```lexer``` does not provide some token types or the ```interpreter``` does not provide some processing functions

parser.init() (re)starts for processing a new feed.

parser.carryOn() continues processing after a non-valid token arrives

parser.finished will report if the input is exhausted (lexer returned no more values)

## Request for proper token potentially

The lexer.next function is called with an object parameter, whose keys are the expected token types.

When the lexer is regexp evaluation based, considerably less regexp must be checked.

Example:
```
start -> N %op N
N -> %var | %int
```
when reaching the %op, a single character check is sufficient, no need to check/collect vars or ints.

(The above scenario is rather artificial.)

# Tolerance on overlapping token categories

In case a token value (read with next() of lexer) may be interpreted either as token type A or token type B, the lexer will provide only one of them.

1. Let us suppose in a certain rule only B is accepted.
 In this case, the lexer, assuming properly interpreting the call next({"A":"","B":""}) will return the type as B immediately

2. Let us suppose that there are two rules that can be applied
 In this case, if the lexer provides and isA(sReceivedType,sExpectedType,sTokenValue), nearley-tolerant will continue with both rules

Please note that the isA function may evaluate the token value.

## Lexer

Described in detail in (./lexer.md){./lexer.md};
