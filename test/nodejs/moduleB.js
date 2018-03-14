
let A=require("./moduleA.js");
let B={};
B.A = A;
B.text = "Module B:"+new Date();
/* eslint-disable no-console */
console.log("Loading:"+B.text);

module.exports = B;