# Lexer functions

## Lexer classes

### Atoms: matchers

Corresponds to terminals.

Atoms have a unique ``name`` that will correspond to ``type`` of the token returned by the lexer.

Atoms can be
- strings: ``atom("varKeyword","var");``
- regular expressions: ``atom("varName",regexp("[a-zA-Z_][a-zA-Z_0-9]+"))``
- a choice of atoms: ``atom("varDeclKeyword",{"varKeyword":"","letKeyword":""});``
- a sequence of atoms: ``atom("varDecl",["varDeclKeyword","space","varName"])``
- a synonym for another atom, that is a single-element sequence ``atom("otherVar",["var"])``

Repetitions of some atoms within atoms is not allowed, moreover, the same atom cannot be reused directly or indirectly. For this purpose, synonyms must be used.

Example:
```
atom("a","...");
atom("b",["a"]);
atom("c",{"b":"","a":""}) => invalid, c reuses a twice
```

### Atoms: conversion

All the above atoms are value-less; they can be used as token-only. In order to compute/combine values of atoms, ```substite```s must be declared.

An atom may describe substitutions to support conversions / normalizations of the found values.

Such substitutions are:
- just the same value matched ("id"), to consider the atom as a value-producer: ```atom("x","x").substitute()```

- a named regular expression, whereas regular expression named elements or names of referred subatoms can be used, e.g.

```
atom("x",["b"])
atom("a",["x","y"]).substitute("${b}-${y}"); ==> the value of 'b' within 'x' is used
``` 

- an object for converting enumerated values, (default: not changing the value) e.g. 
```atom("a",regexp("a|b|c")).substitute({a:1,b:2,c:3});``` converts a to 1,..., c to 3

- a conversion function converting the matched value to another single matched value, e.g.

```
atom("camel",regexp("[a-zA-Z]+")).substitute((x)=>(x.toUpperCase()));
```

- a sequence of the above substitutions (array)
```
atom("camel",regexp("[a-zA-Z]+")).substitute([(x)=>(x.toUpperCase()),(x)=>("${"+x+"}")]);

```

**Using subatoms in functions**
```
atom("r",regexp("[ivx]+"));
atom("n",regexp("[1-9][0-9]*"));
atom("nr",["n","r"]).substitute([(x,d)=>{ d.r = d.r.toUppserCase(); return x;},"${r}.${d}"]))
```
In the above example, once ``nr`` matches, the substitution function will access its parts through its second parameter, which is rewriteable and the substitute will use the rewritten value. However, regexp-like substitutions cannot use created new variables.







