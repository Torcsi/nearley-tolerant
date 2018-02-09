var assert = require("assert");
let xregexp = require("xregexp");

function testRegexp(sRe,s,at,sExp)
{
    let re = xregexp(sRe);
    let m = xregexp.exec(s,re,at);
    let sRes = JSON.stringify(m);
    assert.equal(sExp,sRes,"example: /"+sRe+"/ vs ["+s+"]");
}
describe("Overlapping",function(){
    it("MatchLong",function(){
    testRegexp("\\bg\\b","12 g/l",0,'["g"]');
    testRegexp("\\bg/l\\b","12 g/l",0,'["g/l"]');
    testRegexp("\\bg\\b","12 g/l",3,'["g"]');
    testRegexp("\\bg/l\\b","12 g/l",3,'["g/l"]');
    }
)
})