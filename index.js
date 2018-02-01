const nt = require("lib/nearley-tolerant.js");
const lt = require("lib/lexer-tolerant.js");

const h = {};
Object.assign(h, nt);
Object.assign(h, lt);
module.exports = h;
