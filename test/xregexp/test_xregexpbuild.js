/* eslint-env mocha */
const XRegExp = require("xregexp");

describe("XRegexpBuild",function(){
    it("Simple",function(){
        let h = {
            number : /[1-9][0-9]*/
        };
        let re = XRegExp.build("^({{number}})$",h);
        let res = XRegExp.exec("12",re);
        console.log(res.number);
    })
    it("DoubleValued",function(){
        let h = {
            number : /[1-9][0-9]*/
        };
        let re = XRegExp.build("^({{number}})-({{number}})$",h);
        let res = XRegExp.exec("12-15",re);
        console.log(res.number);
    })
    it("Double",function(){
        let h = {
            number : /[1-9][0-9]*/
        };
        let re = XRegExp.build("^({{number}}-{{number}})$",h);
        let res = XRegExp.exec("12-15",re);
        console.log(JSON.stringify(res));
        res = XRegExp.exec("12!15",re);
        console.log(JSON.stringify(res));
    })

});