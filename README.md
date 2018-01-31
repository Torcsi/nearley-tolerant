# nearley-tolerant
Tolerant nearley parser with .json generator tools

Nearley
- is not supposed to work from data tables, instead from precompiled javascript files causing several difficulties (e.g. on-the-fly loading).
- cannot be initialized and re-run, does not tolerate partially completed rules.
- also cannot cope with ambiguous terminal symbols, i.e. those which may fit to the same string but defined differently
- accepts a simple plain next() function from the lexer, while it already should know what to tokens are acceptable.
