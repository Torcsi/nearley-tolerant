let assert = require("assert");
let Cache = require("../../absolutemodulecache.js")
let touch = require("touch");
//const gsCurrentFolder = 

let gsCurrentFolder = __dirname.replace(/\\/g,"/")+"/";

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}


describe("CacheTest",function(){
    it.skip("Create",function(){
         new Cache();

    });
    it.skip("Load a file",function(){
        let oCache = new Cache();
        

        let A = oCache.require(gsCurrentFolder + "moduleA.js");
        sleep(1000);
        let A1 = oCache.require(gsCurrentFolder + "moduleA.js");
        assert.equal(A,A1,"not equals");
    });
    it.skip("Load two files",function(){
        let oCache = new Cache();
        

        let A = oCache.require(gsCurrentFolder + "moduleA.js");
        sleep(1000);
        let B = oCache.require(gsCurrentFolder + "moduleB.js");
        assert.equal(A,B.A,"not equals");
    });
    it.skip("Invalidate single file",function(){
        let oCache = new Cache();
        

        let A = oCache.require(gsCurrentFolder + "moduleA.js");
        sleep(1000);
        touch.sync(gsCurrentFolder + "moduleA.js");
        let A1 = oCache.require(gsCurrentFolder + "moduleA.js");
        assert(A!=A1,"should not be equal\n"+A+"\n"+A1);
    });
    it.skip("Invalidate dependent file",function(){
        let oCache = new Cache();
        

        let A = oCache.require(gsCurrentFolder + "moduleA.js");
        let B = oCache.require(gsCurrentFolder + "moduleB.js");
        let C = oCache.require(gsCurrentFolder + "moduleC.js");
        sleep(1000);
        touch.sync(gsCurrentFolder + "moduleA.js");
        let B1 = oCache.require(gsCurrentFolder + "moduleB.js");
        let C1 = oCache.require(gsCurrentFolder + "moduleC.js");
        assert(B.A!=B1.A,"should not be equal\n"+B.A+"\n"+B1.A);
        assert.equal(C,C1,"not equals");
    });
    it("Use timestamp file",function(){
        let oCache = new Cache();
        
        touch.sync(gsCurrentFolder + "timestamp.txt");
        oCache.setTimestampFile(gsCurrentFolder + "timestamp.txt");
        let A = oCache.require(gsCurrentFolder + "moduleA.js");
        let B = oCache.require(gsCurrentFolder + "moduleB.js");
        let C = oCache.require(gsCurrentFolder + "moduleC.js");
        sleep(300);
        touch.sync(gsCurrentFolder + "moduleA.js");
        let Au = oCache.require(gsCurrentFolder + "moduleA.js");
        let Bu = oCache.require(gsCurrentFolder + "moduleB.js");
        let Cu = oCache.require(gsCurrentFolder + "moduleC.js");

        assert(A==Au,"A should be equal:\n\t"+A+"\n\t"+Au);
        assert(B.A==Bu.A,"B should be equal:\n\t"+B.A+"\n\t"+Bu.A);
        assert(C==Cu,"C should be equal:\n\t"+C+"\n\t"+Cu);

        sleep(300);
        touch.sync(gsCurrentFolder + "timestamp.txt");
        sleep(300);
        let A1 = oCache.require(gsCurrentFolder + "moduleA.js");
        let B1 = oCache.require(gsCurrentFolder + "moduleB.js");
        let C1 = oCache.require(gsCurrentFolder + "moduleC.js");
        assert(B.A!=B1.A,"should not be equal\n\t"+B.A+"\n\t"+B1.A);
        assert(C==C1,"should be equal:\n\t"+C+"\n\t"+C1);
    });

});