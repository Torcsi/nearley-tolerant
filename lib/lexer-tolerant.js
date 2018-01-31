"use strict"
let XRegExp = require("xregexp");

class Constraint {

}

let varRef = XRegExp("((\\$\{(?<ref>[^\}]+)\})|(\\$(?<refi>[0-9])))", "g");

class XRegexpReplacer {
    constructor(sReplacementString) {
        let nAt = 0;
        let aText = [];
        let bVar = [];
        /*
        console.log("### XRegexpReplacer:Compile " + sReplacementString);
        console.log(varRef.source);
        if( sReplacementString=="${epcBis}")
            process.exit();
        */
        let index = 0;
        let m;
        while ((m = XRegExp.exec(sReplacementString, varRef, nAt)) != null) {
            index++;
            let pos = varRef.lastIndex - m[0].length;
            if (nAt != pos) {
                //console.log(" ### text:" + sReplacementString.substring(nAt, pos))
                aText.push(sReplacementString.substring(nAt, pos));
                bVar.push(false);
            }
            //console.log("  ### " + nAt + ":[" + index + "]" + pos + ":" + m[0].length + ":ref:" + JSON.stringify(m.ref)+":refi:"+JSON.stringify(m.refi));
            if (m.ref) {
                //console.log(" ### var:" + m.ref);
                aText.push(m.ref);
                bVar.push(true);
            } else if (m.refi) {
                //console.log(" ### index:" + m.refi);
                aText.push(m.refi);
                bVar.push(true);
            }
            nAt = pos + m[0].length;
        }
        if (nAt < sReplacementString.length) {
            //console.log("  ### end:" + nAt + ":" + sReplacementString.substring(nAt));
            aText.push(sReplacementString.substring(nAt));
            bVar.push(false);
        }

        this.aText = aText;
        this.bVar = bVar;

    }
    replace(m) {
        let l = this.aText.length;
        //console.log("### replacer length:" + l + JSON.stringify(this.aText)+":"+JSON.stringify(this.bVar));
        let aRes = [];
        let bVar = this.bVar;
        for (let i = 0; i < l; i++) {
            if (bVar[i]) {
                let v = m[this.aText[i]];
                //console.log("### replacer:" + this.aText[i] + "=" + v);
                if (v) {
                    aRes.push(v);
                }
            } else {
                aRes.push(this.aText[i]);
            }
        }
        return aRes.join("");
    }
}

let AtomTypeString = Symbol("string");
let AtomTypeRegexp = Symbol("regexp");
let AtomTypeChoice = Symbol("choice");
let AtomTypeSequence = Symbol("sequence");
let AtomTypeSynonym = Symbol("synonym");
let AtomTypeNone = Symbol("none");

class LexerRegExp {
    constructor(sRe, sOpt) {
        this.sRe = sRe;
        this.sOpt = sOpt;
    }
}

class Atom {
    /**
     *
     * @param {string} sName
     * @param {string|RegExp|Object<string,any>|Array<string>|Array<Object<string,number>>} vDefinition
            - when Object: choice
            - when Array: sequence, sequence order in code generation can be changed
     */
    constructor(sName, vDefinition) {
        /** @private **/
        this._name = sName;
        this._type = AtomTypeNone;
        if (vDefinition instanceof String || typeof(vDefinition)=="string") {
            /** @private **/
            this._string = vDefinition
            this._type = AtomTypeString;
        } else if (vDefinition instanceof LexerRegExp) {
            /** @private **/
            this._lexerRegexp = vDefinition;
            this._type = AtomTypeRegexp;
        } else if (vDefinition instanceof Array) {
            if (vDefinition.length == 1) {
                this._synonymDef = vDefinition[0];
                this._type = AtomTypeSynonym;
            } else {
                this._sequenceDef = vDefinition;
                this._type = AtomTypeSequence;
            }
        } else if (vDefinition instanceof Object) {
            /** @private **/
            this._choiceDef = vDefinition;
            this._type = AtomTypeChoice;
        } else {
            console.log("atom:"+sName+": no type defined"+(typeof (vDefinition)=="string")+":"+vDefinition)
            process.exit();
        }
        this._vDefinition = vDefinition;
        /** @private **/
        this._constraints = []
        /**
          * @type Array<number>
          * @private
        **/
        this._sequenceOrder = [];
        /** @private **/
        this._substitutes = [];
    }

    /**
      * @returns {string}
      */
    get name() {
        return this._name;
    }

    /**
     * monadic; add a single constraint or an array of constraints;
     * @param {Constraint|Constraint[]} vConstraint
     * @returns Atom
     */
    constraint(vConstraint) {
        if ( vConstraint instanceof Array ){
            this._constraints.push.apply(vConstraint);
        } else {
            this._constraints.push(vConstraint);
        }
        return this;
    }
    /**
     * add order of sequence element for code generation (without prefix or postfix)
     * @param {number} n the index number in the order of sequence
     * @param {any} m the order in result string
     */
    sequenceOrder(n, m) {
        this._sequenceOrder[m] = n;
        return this;
    }
    /**
     * substitute regexp with a string, replacer function, a string-to-string hashtable or array of string-to-string monads
     * @param {string|function(...string):string|Object<string,string>,Array<function(string):string>} vRegexpSubstitute
     */
    substitute(vRegexpSubstitute) {
        let h = {};

        //console.log("### " + this.name + " add subst " + vRegexpSubstitute);
        if (typeof(vRegexpSubstitute) == "string") {
            h._substituteString = vRegexpSubstitute;
            h._substituteReplacer = new XRegexpReplacer(h._substituteString);
        } else if (vRegexpSubstitute instanceof Function) {
            //console.log("### Function");
            h._substituteFunction = vRegexpSubstitute;
        } else if (vRegexpSubstitute instanceof Object) {
            //console.log("### Object");
            h._substituteObject = vRegexpSubstitute;
        } else if (vRegexpSubstitute instanceof Array) {
            //console.log("### Array");
            h._substituteFunctionChain = vRegexpSubstitute;
        }
        this._substitutes.push(h);
        //console.log("### " + this.name + " add subst " + JSON.stringify(this._substitutes));
        this._isValueAtom = true;
        return this;
    }

    /**
     * compose, from the parts computed, the result string
     * the default composition is simple merge of the values
     * @param {string} sCompose
     */
    compose(sCompose) {
        this._composeString = sCompose;
        this._isValueAtom = true;
        return this;
    }

    getValue(om) {
        // determine each part
        if (!this.isValueAtom)
            return "";
        //console.log("### getValue for " + this.name + ":" + this._reParse);
        //console.log("### input:" + om[0]);
        let m=XRegExp.exec(om[0], this._reParse);
        //console.log("### result:" + JSON.stringify(m));
        let sAssembled = om[0];
        let sOrig = om[0];
        switch (this._type) {
            case AtomTypeString:
                break;
            case AtomTypeRegexp:
                break;
            case AtomTypeSynonym:
                sAssembled = this._synonymDef.getValue(m);
                break;
            case AtomTypeChoice:
                for (let v in this._choiceDef[i]) {
                    let oAtom = this._choiceDef[v];
                    let sChoiceName = oAtom.name;
                    if (m[sChoiceName]) {
                        m[0] = m[sChoiceName];
                        sAssembled = oAtom.getValue(m);
                        m[0] = sOrig;
                        m[sChoiceName] = s;
                    }
                }
                break;
            case AtomTypeSequence:
                //console.log("### getValue " + this.name + " sequence:" + JSON.stringify(m));
                sAssembled = "";
                for (let i = 0; i < this._sequenceDef.length; i++) {
                    let oAtom = this._sequenceDef[i];
                    let sPartName = oAtom.name;
                    //console.log(" ### " + i + ":" + sPartName + "=" + m[sPartName]);
                    if (m[sPartName]) {
                        m[0] = m[sPartName];
                        m[sPartName] = oAtom.getValue(m);
                        sAssembled += m[sPartName];
                        m[0] = sOrig;
                    }
                }
                break;
        }

        for (let i = 0; i < this._substitutes.length; i++) {
            let h = this._substitutes[i];
            if (h._substituteString) {
                //console.log("### substitition with " + h._substituteString);
                sAssembled = h._substituteReplacer.replace(m);
            } else if (h._substituteObject) {
                if (sAssembled in h._substituteObject) {
                    sAssembled = h._substituteObject[sAssembled];
                }
            } else if (h._substituteFunction) {
                sAssembled = h._substituteFunction(sAssembled,m);
            } else if (h._substituteFunctionChain) {
                for (let j = 0; j < h._substituteFunctionChain.length; j++) {
                    sAssembled = h._substituteFunctionChain[j](sAssembled,m);
                }
            }
        }
        //console.log(" ### result for " + this.name + "=\"" + sAssembled + "\"");
        return sAssembled;
    }
    checkSubstituteOrCompose(aErrors, sSubstituteString,sCompositionType) {
        //console.log("### checkSubst " + this.name + ":" + i + ":" + sSubstituteString);
        let hReferred = {};
        let varRef = XRegExp("\\$\{(?<ref>[^\}]+)\}", "g");
        let nCount = 0;
        XRegExp.forEach(sSubstituteString, varRef, (match) => {
            hReferred[match.ref] = true;
            nCount++;
        });
        // check if hReferred is defined as group
        if (nCount == 0)
            return;
        let hDefined = {};
        let sRegexpString = this._sReParse;
        //console.log("### Re parse:" + sRegexpString);
        let varDef = XRegExp("\\(\\?<(?<def>[^\>]+)\>", "g");
        XRegExp.forEach(sRegexpString, varDef, (match) => {
            hDefined[match.def] = true;
        });

        for (let atomReferred in hReferred) {
            if (!(atomReferred in hDefined)) {
                aErrors.push("atom: " + this.name + " " +sCompositionType+" variable not found:" + atomReferred);
            }
        }

    }
    checkSubstitution(aErrors, hDefined) {
        if (this._substitutes.length != 0) {
            for (let i = 0; i < this._substitutes.length; i++) {
                if (this._substitutes[i]._substituteString) {
                    if (i != 0) {
                        aErrors.push("atom: " + this.name + " regexp substitute must be the first substitution");
                        return;
                    }
                    this.checkSubstituteOrCompose(aErrors, this._substitutes[i]._substituteString,"substitition");
                }
            }
        }
        if (this._composeString) {
            this.checkSubstituteOrCompose(aErrors,this._composeString,"composition");
        }
    }
    /**
      * does this lexical element produce a value?
      * @return {boolean}
    **/
    get isValueAtom() {
        return this._isValueAtom;
    }
    setValueAtom() {
        if (this._isValueAtom != undefined)
            return this._isValueAtom;
        let bFound = false;
        switch (this._type) {
            case AtomTypeSynonym:

                if (this._synonymDef.isValueAtom) {
                    this._isValueAtom = true;
                } else if (this._synonymDef.setValueAtom()) {
                    this._isValueAtom = true;
                }
                break;
            case AtomTypeSequence:
                bFound = false;
                for (let i = 0; i < this._sequenceDef.length; i++) {
                    let oAtom = this._sequenceDef[i];
                    if (oAtom.setValueAtom()) {
                        bFound = true;
                        break;
                    }
                }
                this._isValueAtom = (bFound);
                break;
            case AtomTypeChoice:
                bFound = false;
                for (let v in this._choiceDef) {
                    let oAtom = this._choiceDef[v];
                    if (oAtom.setValueAtom()) {
                        bFound = true;
                        break;
                    }
                }
                this._isValueAtom = (bFound);

            default:
                this._isValueAtom = false;
        }
        return this._isValueAtom;
    }
    standalone() {
        this._isStandalone = true;
        return this;
    }
    /**
     * can this lexical element stand alone as lexical unit?
     * @return {boolean}
    */
    get isStandalone() {
        return this._isStandalone;
    }
    /**
     * before the element the regexp must match, that is not part of the match
     * @param {String} sPrefix as regexp definition, will be compiled closing by $
     * @returns Atom
     */
    prefix(sPrefix) {
        /** @private */
        this._sPrefix = sPrefix;
        return this;
    }
    /**
     * after the atom the regexp must match, that is not part of the match
     * @param {String} sPostfix as regexp definition, will be compiled starting by ^
     * @returns Atom
     */
    postfix(rePostfix) {
        /** @private */
        this._sPostfix = sPostfix;
        return this;
    }
    /**
     * starts only after a separator (not an international letter, not a number); same as prefix(/\W/) but that one is SLOW
     * @returns Atom
     */
    afterSeparator() {
        this._afterSeparator = true;
        return this;
    }
    /**
     * finish only before a separator (not an international letter, not a number); same as prefix(/\W/) but that one is SLOW
     * @returns Atom
     */
    beforeSeparator() {
        this._beforeSeparator = true;
        return this;
    }
    /**
     * character sequences of this atom may also match to another atom
     * @param {string} sAtomName
     */
    overlaps(sAtomName) {
        if (this._overlaps === undefined) {
            this._overlaps = [];
        }
        this._overlaps.push(sAtomName);
        return this;
    }
    setStartAtom() {
        /**
          * @pricate
        **/
        this._isStartAtom = true;
        this.standalone();
    }
    get isStartAtom() {
        return this._isStartAtom;
    }
    isOverlappingAtom(oAtom) {
        if (!this._overlapping)
            return false;
        return oAtom.name in this._overlapping;
    }

    /**
     * resolve references where possible
     * @param {Object<string,Atom>} hAtoms
     * @param {Array<string>} aErrors
     */
    resolveReferences(hAtoms, aErrors) {
        //console.log("### resolveRef:" + this.name);
        switch (this._type) {
            case AtomTypeString:
            case AtomTypeRegexp:
                break;
            case AtomTypeSynonym:
                if (!(this._synonymDef in hAtoms)) {
                    aErrors.push("atom: " + this.name + ": no synonymous atom:" + this._synonymDef);
                    this._synonymDef = null;
                } else {
                    this._synonymDef = hAtoms[this._synonymDef];
                }
                break;
            case AtomTypeChoice:
                let hRes = {};
                for (let v in this._choiceDef) {
                    if (!(v in hAtoms)) {
                        aErrors.push("atom: " + this.name + ": no choice atom:" + v);
                    } else {
                        hRes[v] = hAtoms[v];
                    }
                }
                this._choiceDef = hRes;
                break;
            case AtomTypeSequence:
                for (let i = 0; i < this._sequenceDef.length;i++){
                    let v = this._sequenceDef[i];
                    if (!(v in hAtoms)) {
                        aErrors.push("atom: " + this.name + ": no sequence atom:" + v + " at " + i);
                    } else {
                        this._sequenceDef[i] = hAtoms[v];
                    }
                }
                break;
            default:
                aErrors.push("atom: " + this.name + ": undefined type");
        }
        if (this._overlaps) {
            for (let i = 0; i < this._overlaps.length; i++) {
                let v = this._overlaps[i];
                if (!(v in hAtoms)) {
                    aErrors.push("atom: " + this.name + ": no overlap atom:" + v);
                } else {
                    if (!this._overlapping)
                        this._overlapping = {};
                    this._overlaps[i] = hAtoms[v];
                    this._overlapping[v] = hAtoms[v];
                }
            }
        }
        return aErrors.length == 0;
    }
    /**
     * @private
     * @param {Atom} oRoot
     * @param {Array<Atom>} qToCheck
     * @param {{string:Atom}} hChecked
     * @param {Array<string>} aErrors
     */
    addForCircularCheck(oRoot, qToCheck, hChecked, aErrors) {
        /*
        let sChecked = ""
        for (let v in hChecked)
            sChecked += "," + v;
        console.log("Checking:" + oRoot.name + ", at:"+this.name+" when checked:" + sChecked);
        */
        switch (this._type) {
            case AtomTypeString:
            case AtomTypeRegexp:
                break;
            case AtomTypeSynonym:
                if (this._synonymDef === oRoot) {
                    aErrors.push("atom: " + oRoot.name + ": circular as synonym of " + this.name);
                    return false;
                }
                if (!(this._synonymDef.name in hChecked)) {
                    hChecked[this._synonymDef.name] = true;
                    qToCheck.push(this._synonymDef);
                }
                break;
            case AtomTypeChoice:
                let hRes = {};
                for (let v in this._choiceDef) {
                    let oAtom = this._choiceDef[v];
                    if (oAtom === oRoot) {
                        aErrors.push("atom: " + oRoot.name + ": circular as a choice of " + this.name);
                        return false;
                    }
                    if (!(oAtom.name in hChecked)) {
                        hChecked[oAtom.name] = true;
                        qToCheck.push(oAtom);
                    }
                }
                break;
            case AtomTypeSequence:
                for (let i = 0; i < this._sequenceDef.length;i++){
                    let oAtom = this._sequenceDef[i];
                    if (oAtom === oRoot) {
                        aErrors.push("atom: " + oRoot.name + ": circular as part of sequence of " + this.name);
                        return false;
                    }
                    if (!(oAtom.name in hChecked)) {
                        hChecked[oAtom.name] = true;
                        qToCheck.push(oAtom);
                    }
                }
                break;
            default:
                aErrors.push("atom: " + this.name + ": undefined type");
        }
        return true;
    }
    /**
     * check if atom is circular
     * @param {Array<string>} aErrors
     */
    checkCircular(aErrors) {
        let qToCheck = [];
        let hChecked = {};
        hChecked[this.name] = this;

        if (!this.addForCircularCheck(this, qToCheck, hChecked,aErrors)) {
            //aErrors.push("atom: " + this.name + ": self-reference");
            return;
        }

        hChecked[this.name] = this;
        while (qToCheck.length >= 1) {
            let oCheck = qToCheck.shift();

            if (!oCheck.addForCircularCheck(this, qToCheck, hChecked,aErrors))
                return false;
        }
        return true;
    }
    /**
     * check if atom reuses a value
     * @param {Array<string>} aErrors
     */
    checkReuse(aErrors,sOriginal,hUsed) {
        if (sOriginal == null) {
            sOriginal = this.name;
            hUsed = {};
        }
        if (this.isValueAtom) {
            if (this.name in hUsed) {
                aErrors.push("atom: " + sOriginal + ": reuses value atom:" + this.name);
            }
            hUsed[this.name] = true;
        }
        switch (this._type) {
            case AtomTypeSynonym:
                return this._synonymDef.checkReuse(aErrors, sOriginal, hUsed);
            case AtomTypeSequence:
                for (let i = 0; i < this._sequenceDef.length; i++) {
                    this._sequenceDef[i].checkReuse(aErrors, sOriginal, hUsed);
                }
                break;
            case AtomTypeChoice:
                for (let v in this._choiceDef) {
                    this._choiceDef[v].checkReuse(aErrors, sOriginal, hUsed);
                }
                break;
        }
        return true;
    }
    string2regexp(s) {
        return s.replace(/[|\\{}()[\]^$+*?\.]/g, '\\$&')
    }
    /**
     * compile regular expression
     * @param {Array<string>} aErrors
     */
    compileRegexp(aErrors) {
        /**
          * test exact string without groups
          * @type {string}  test exact string without groups
        **/
        this._sReTest = null;
        /**
          * @type { RegExp } test exact string without groups
        */
        this._reTest = null;

        /**
          * parse string with groups; must be at a matching point
          * @type {string}
        **/
        this._sReParse = null;
        /**
          * @type { RegExp } parse string with groups; must be at a matching point
        */
        this._reParse = null;

        /**
          * find in a string, without groups, whether at start or after a given position; include prefix and postfix or word boundaries
          * @type {string}
        **/
        this._sReFind = null;

        /**
          * @type { RegExp } find in a string, without groups, whether at start or after a given position; include prefix and postfix or word boundaries
        */
        this._reFind = null;


        if (this._reTest != null)
            return;
        switch (this._type) {
            case AtomTypeString:
                let sRecognize = XRegExp.escape(this._string);;
                this._sReTest = sRecognize;
                this._reTest = XRegExp("^(?:" + this._sReTest + ")$", "u");

                if (this.isValueAtom) {
                    this._sReParse = "(?<" + this.name + ">" + this._sReTest + ")";
                } else {
                    this._sReParse = sRecognize;
                }
                this._reParse = XRegExp(this._sReParse, "gu");

                this._sReFind = (this._afterSeparator ? "\\b" : this._sPrefix ? "(?<=" + this._sPrefix + ")" : "") + this._sReTest + (this._beforeSeparator ? "\\b" : this._sPostfix ? "(?=" + this._sPostfix + ")" : "");
                this._reFind = XRegExp(this._sReFind, "gu");

                break;
            case AtomTypeRegexp:
                try {
                    this._sReTest = this._lexerRegexp.sRe;
                    this._reTest = XRegExp("^(?:" + this._sReTest.replace(/^\^/,"").replace(/\$$/,"") + ")$", this._lexerRegexp.sOpt);

                    if (this.isValueAtom) {
                        this._sReParse = "(?<" + this.name + ">" + this._sReTest + ")";
                    } else {
                        this._sReParse = this._sReTest;
                    }
                    this._reParse = XRegExp(this._sReParse, "gu");

                    this._sReFind = (this._afterSeparator ? "\\b" : this._sPrefix ? "(?<=" + this._sPrefix + ")" : "") + this._sReTest + (this._beforeSeparator ? "\\b" : this._sPostfix ? "(?=" + this._sPostfix + ")" : "");
                    this._reFind = XRegExp(this._sReFind, this._lexerRegexp.sOpt);
                }
                catch (e) {
                    aErrors.push("atom: " + this.name + ": bad regexp:" + e.message);
                    this._reTest = /invalid/;
                    this._reParse = /invalid/;
                    this._reFind = /invalid/;
                }
                break;
            case AtomTypeSynonym:
                let oSynonym = this._synonymDef;
                oSynonym.compileRegexp(aErrors);
                this._sReTest = oSynonym._sReTest;
                this._reTest = oSynonym._reTest;

                if (this.isValueAtom) {
                    this._sReParse = "(?<" + this.name + ">" + this._sReTest + ")";
                } else {
                    this._sReParse = oSynonym._sReTest;
                }
                this._reParse = XRegExp(this._sReParse, "gu");
                this._sReFind = oSynonym._sReFind;
                this._sReFind = (this._afterSeparator ? "\\b" : this._sPrefix ? "(?<=" + this._sPrefix + ")" : "") + this._sReTest + (this._beforeSeparator ? "\\b" : this._sPostfix ? "(?=" + this._sPostfix + ")" : "");
                this._reFind = XRegExp(this._sReFind, "gu");
                break;
            case AtomTypeChoice:
                {
                    let sReTest = "";
                    let sReParse = "";
                    let sReFind = "";
                    let hReFind = {};
                    let hReTest = {};
                    for (let v in this._choiceDef) {
                        let oAtom = this._choiceDef[v];
                        oAtom.compileRegexp(aErrors);
                        if (!(oAtom._sReTest in hReTest)) {
                            sReTest += "|(?:" + oAtom._sReTest +")";
                            hReTest[oAtom._sReTest] = true;
                        }
                        if (!(oAtom._sReFind in hReFind)) {
                            sReFind += "|(?:" + oAtom._sReFind + ")";
                            hReFind[oAtom._sReFind] = true;
                        }
                        sReParse += "|"+ oAtom._sReParse ;
                    }

                    this._sReTest = "(?:" + sReTest.substring(1) + ")";
                    this._reTest = XRegExp("^(?:" + this._sReTest + ")$", "u");

                    this._sReParse = "(?<"+this.name+">"+sReTest.substring(1) + ")";
                    this._reParse = XRegExp("^" + this._sReParse + "$", "u");

                    sReFind = "(?:" + sReFind.substring(1) + ")";
                    this._sReFind = (this._afterSeparator ? "\\b" : this._sPrefix ? "(?<=" + this._sPrefix + ")" : "") + sReFind + (this._beforeSeparator ? "\\b" : this._sPostfix ? "(?=" + this._sPostfix + ")" : "");
                    //console.log("### CHOICE:" + this.name + " FIND:" + this._sReFind);
                    this._reFind = XRegExp("(?:" + this._sReFind + ")", "u");
                }
                break;
            case AtomTypeSequence:
                {
                    let sReTest = "";
                    let sReParse = "";
                    let sReFind = "";
                    for (let i = 0; i < this._sequenceDef.length; i++) {
                        let oAtom = this._sequenceDef[i];
                        oAtom.compileRegexp(aErrors);
                        sReTest += "(?:" + oAtom._sReTest + ")";
                        sReParse += oAtom._sReParse;
                        sReFind += oAtom._sReFind;

                    }

                    this._sReTest = "(?:" + sReTest + ")";
                    this._reTest = XRegExp("^" + this._sReTest + "$", "u");
                    //console.log("### re parse" + sReParse);
                    this._sReParse = "(?<" + this.name + ">" + sReParse + ")";
                    this._reParse = XRegExp("^" + this._sReParse + "$", "u");

                    sReFind = "(?:" + sReFind + ")";

                    this._sReFind = (this._afterSeparator ? "\\b" : this._sPrefix ? "(?<=" + this._sPrefix + ")" : "") + sReFind + (this._beforeSeparator ? "\\b" : this._sPostfix ? "(?=" + this._sPostfix + ")" : "");
                    this._reFind = XRegExp("(?:" + this._sReFind + ")", "u");

                }
                break;
            default:
                aErrors.push("atom: " + this.name + ": undefined type");
        }
    }
    checkPartUnicity(aErrors, sOriginal, hReferred) {
        if (hReferred == null)
            hReferred = {};
        if (sOriginal == null)
            sOriginal = this.name;

        if (this.name in hReferred && this.isValueAtom ) {
            aErrors.push("atom: " + sOriginal + " contains twice as value-producing part: "+this.name);
            return;
        }
        //console.log("### checkPart " + sOriginal + ": " + this.name);
        hReferred[this.name] = true;
        switch (this._type) {
            case AtomTypeString:
                break;
            case AtomTypeRegexp:
                break;
            case AtomTypeSynonym:
                let oSynonym = this._synonymDef;
                oSynonym.checkPartUnicity(aErrors,sOriginal,hReferred);
                break;
            case AtomTypeChoice:
                {
                    let sRes = "";
                    for (let v in this._choiceDef) {
                        let oAtom = this._choiceDef[v];
                        oAtom.checkPartUnicity(aErrors, sOriginal, hReferred);
                    }
                }
                break;
            case AtomTypeSequence:
                {
                    let sRes = ""

                    for (let i = 0; i < this._sequenceDef.length; i++) {
                        let oAtom = this._sequenceDef[i];
                        oAtom.checkPartUnicity(aErrors, sOriginal, hReferred);
                    }
                    this._reRecognize = XRegExp(sRes, "gu");
                }
                break;
            default:
                aErrors.push("atom: " + this.name + ": undefined type");
        }
        // check substitution
        this.checkSubstitution(aErrors, hReferred);
    }
    checkStandaloneAmbigouity(aErrors, hAtoms) {
        if (!this.isStandalone)
            return;
        let sRegexpSource = this._sReFind ;
        for (let v in hAtoms) {
            let oAtom = hAtoms[v];
            if (!oAtom.isStandalone)
                continue;
            if (oAtom == this)
                continue;
            if (oAtom._sReFind == this._sReFind) {
                if (!this.isOverlappingAtom(oAtom) )
                    aErrors.push("atom: " + this.name + " has the same recognition regexp, but not set to overlapping, with:" + oAtom.name);
            }
        }
    }
    get regexpSource() {
        return this._reRecognize.source;
    }
    test(s, at) {
        let atEnd = -1;
        switch (this._type) {
            case AtomTypeString:
                if (s.substr(at, this._string.length) != this._string)
                    return false;
                atEnd = at + this._string.length;
                break;
            default:
                /**
                 * @type RegExp
                 */
                let re = this._regexpStart;
                re.lastIndex = at;
                if(! re.exec(s.substring(at)) )
                    return false;
                atEnd = re.lastIndex;
                break;
        }
        // check conditions
        if (at > 0) {
            if (this._afterSeparator) {
                if (!this.isSeparator(s, at - 1))
                    return false;
            } else if (this._rePrefix) {
                let k = s.substring(0, at - 1);
                if (!this._rePrefix.test(k))
                    return false;
            }
        }
        if (atEnd < s.length) {
            if (this._beforeSeparator) {
                if (!this.isSeparator(s, atEnd))
                    return false;
            } else if(this._rePostfix){
                if (!this._rePostfix.test(s.substring(atEnd))) {
                    return false;
                }
            }
        }
        this._start = _at;
        this._end = _atEnd;
        return true;
    }
}

class LexicalUnits {
    constructor() {
        this._units = {};
        this._atoms = {};
        this._start = [];
        this._compiled = false;
    }
    /**
     * add a lexical unit; redefinition allowed
     * @param {Atom} oAtom
     */
    add(oAtom) {
        this._atoms[oAtom.name] = oAtom;

    }
    regexp(sRe, sOpt) {
        return new LexerRegExp(sRe, sOpt);
    }
    setStart(sName) {
        this._start.push(sName);
    }
    compile() {
        let aErrors = [];
        this.resolveReferences(aErrors)
            && this.checkCircular(aErrors)
            && this.setValueAtom()
            && this.checkReuse(aErrors)
            && this.compileRegexp(aErrors)
            && this.checkPartUnicity(aErrors)
            && this.checkStandaloneAmbigouity(aErrors);
        if (aErrors.length != 0)
            return aErrors;
        this.compileStart(aErrors);
        if (aErrors.length != 0)
            return aErrors;
        this.compileAny(aErrors);
        if (aErrors.length != 0)
            return aErrors;
        return null;
    }
    compileStart(aErrors) {
        if (this._start.length == 0) {
            aErrors.push("atom: no start lexers");
            return;
        }
        let sReg = "";
        let hReg = {};
        for (let i = 0; i < this._start.length; i++) {
            let oAtom = this._start[i];
            let sLocalReg = ""+oAtom._sReFind;
            //console.log(oAtom.name + ":>>" + sLocalReg+"<<");
            if (!(sLocalReg in hReg)) {
                hReg[sLocalReg] = true;
                sReg = sReg + "|\(" + sLocalReg + "\)";
                //console.log(i + ":after>>" + sReg + "<<>>" + sLocalReg + "<<");
            }
        }
        //console.log("### start regexp:" + sReg.substring(1));
        //process.exit();
        this._reStart = XRegExp("(" + sReg.substring(1) + ")", "gu");
    }
    compileAny(aErrors) {
        let sReg = "";
        let hReg = {};
        this._aAny = [];
        for (let v in this._atoms) {
            let oAtom = this._atoms[v];
            if (!oAtom.isStandalone)
                continue;
            this._aAny.push(oAtom);
            let sLocalReg = oAtom._sReFind;
            //console.log(i + ":" + sReg + ":" + sLocalReg);
            if (!(sLocalReg in hReg)) {
                hReg[sLocalReg] = true;
                sReg += "|(" + sLocalReg + ")";
            }
        }
        //console.log("### any regexp:" + sReg.substring(1));
        this._reAny = XRegExp("(" + sReg.substring(1) + ")", "gu");
    }
    resolveReferences(aErrors) {
        //console.log("### RESOLVEREFS")
        for (let i = 0; i < this._start.length; i++) {
            let sName = this._start[i];
            if (!(sName in this._atoms)) {
                aErrors.push("atom: undefined start atom: " + sName);
            } else {
                this._start[i] = this._atoms[sName];
                this._start[i].setStartAtom();
            }
        }

        for (let sAtom in this._atoms) {
            let oAtom = this._atoms[sAtom];
            //console.log("### Resolving atom:" + oAtom.name);
            oAtom.resolveReferences(this._atoms, aErrors);
        }
        return aErrors.length == 0;
    }
    checkCircular(aErrors) {
        for (let sAtom in this._atoms) {
            let oAtom = this._atoms[sAtom];
            oAtom.checkCircular(aErrors);
        }
        return aErrors.length == 0;
    }
    setValueAtom(aErrors) {
        for (let sAtom in this._atoms) {
            let oAtom = this._atoms[sAtom];
            oAtom.setValueAtom(aErrors);
        }
        return true;
    }
    checkReuse(aErrors) {
        for (let sAtom in this._atoms) {
            let oAtom = this._atoms[sAtom];
            oAtom.checkReuse(aErrors);
        }
        return aErrors.length == 0;
    }
    compileRegexp(aErrors) {

        for (let sAtom in this._atoms) {
            let oAtom = this._atoms[sAtom];
            oAtom.compileRegexp(aErrors);
        }
        return aErrors.length == 0;
    }
    checkPartUnicity(aErrors) {
        for (let sAtom in this._atoms) {
            let oAtom = this._atoms[sAtom];
            oAtom.checkPartUnicity(aErrors);
        }
        return aErrors.length == 0;
    }
    checkStandaloneAmbigouity(aErrors) {
        for (let sAtom in this._atoms) {
            let oAtom = this._atoms[sAtom];
            oAtom.checkStandaloneAmbigouity(aErrors, this._atoms);
        }
        return aErrors.length == 0;
    }
    findFirst(s, at, match)
    {
        this._reStart.lastIndex = at;
        let m;

        //console.log("### LexerFINDFIRST "+s.substring(at,at+10)+"...:"+at+":"+this._reStart.source);
        while ((m = XRegExp.exec(s, this._reStart, at)) != null) {
            //console.log(" ### Lexer.FOUNDFIRST " + s.substr(this._reStart.lastIndex - m[0].length, m[0].length) + ":" + at + "->[" + (this._reStart.lastIndex - m[0].length) + "," + + this._reStart.lastIndex + "]");
            //cnt++;
            let foundAt = this._reStart.lastIndex - m[0].length;
            let m1;
            for (let i = 0; i < this._start.length; i++) {
                //console.log(m[0] + ":" + i + ":" + this._aReWord[i].test(m[0],-1));
                //console.log(m[0] + ":" + i + ":" + this._aReWord[i].test(m[0],-1));
                //console.log(" ### Lexer.FINDWHICH ["+m[0]+" TEST for " + this._start[i]._sReTest)
                if ((m1=XRegExp.exec(m[0], this._start[i]._reTest, -1))!=null) {
                    if (m[0].length == m1[0].length) {
                        //console.log(" ### Lexer.FOUNDWHICH " + this._start[i].name);
                        match.at = foundAt;
                        match.length = m[0].length;
                        match.end = foundAt + match.length;
                        match.text = m[0];
                        match.atom = this._start[i];
                        match.type = match.atom.name;
                        match.getValue = function () { return match.atom.getValue(m); }

                        return match;
                    }
                }
            }
            return null;
        }
        return null;
    }
    findNext(s, at, match) {
        let m;
        this._reAny.lastIndex = at;
        //console.log("### Lexer.FINDNEXT " + s.substring(at,at+10) + "...:" + at );
        while ((m = XRegExp.exec(s, this._reAny, at)) != null) {
            //console.log(" ### Lexer.FOUND [" + s.substr(this._reAny.lastIndex - m[0].length, m[0].length) + "]:" + at + "->[" + (this._reStart.lastIndex - m[0].length) + "," + + this._reStart.lastIndex + "]");
            let bMatch = false;
            let foundAt = this._reAny.lastIndex - m[0].length;
            let m1;
            for (let i = 0; i < this._aAny.length; i++) {
                //console.log(m[0] + ":" + i + ":" + this._aReWord[i].test(m[0],-1));
                //console.log(m[0] + ":" + i + ":" + this._aReWord[i].test(m[0],-1));
                if ((m1 = XRegExp.exec(m[0], this._aAny[i]._reTest, -1)) != null) {
                    if (m[0].length == m1[0].length) {
                        match.at = foundAt;
                        //console.log(" ### Lexer.FOUNDWHICH " + this._aAny[i].name);
                        match.length = m[0].length;
                        match.end = match.at + match.length;
                        match.text = m[0];
                        match.atom = this._aAny[i];
                        match.type = match.atom.name;
                        match.getValue = function () { return match.atom.getValue(m);}
                        return match;
                    }
                }
            }

            return null;
        }
        return null;
    }
}

class LexicalParser {
    constructor(sString, aBlocked) {
        this.aBlocked = aBlocked ? aBlocked : new Int8Array(sString.length);
        this.sString = sString;
        this.l = sString.length;
        this.noneMatch = {
            type: "ANY", getValue: (() => { return "" })
        };
    }
    /**
     * start parsing the string with the lexical units
     * @param {LexicalUnits} oUnits
     */
    start(oUnits,at) {
        if (at == null)
            at = 0;
        if (this.l <= at)
            return false;
        this.units = oUnits;
        this.match = this.match ? this.match : {};
        this.at = this.findFirst(at);
        /**
        if (this.match) {
            console.log("### START at " + this.at + ":" + this.match.type)
        }
        **/
        return this.at < this.l;
    }
    findFirst(at) {
        at = this.findNonblocked(at);
        let match = this.match;
        while (this.units.findFirst(this.sString, at, match)) {
            let nextFree = this.getNextFree(match.at, match.end);
            if (nextFree == match.end) {
                // not a blocked portion
                return match.at;
            }
            //console.log("### NEXTFREE is:"+nextFree)
            at = nextFree;
        }
        this.match = null;
        return this.l;
    }
    getNextFree(at, end) {
        //console.log("### GETNEXTFREE(" + at + "," + end + ")");
        let aBlocked = this.aBlocked;
        let l = this.l;
        for (; at < end; at++) {
            if (aBlocked[at]) {
                for (at++; at < end; at++) {
                    if (!aBlocked[at])
                        return at;
                }
            }
        }
        return end;
    }
    findNonblocked(at) {
        let aBlocked = this.aBlocked;
        let l = this.l;
        for (; at < l && aBlocked[l]; at++) {
            ;
        }
        return at;
    }
    /**
     * is this terminal defined?
     * @param {string} unit
     * @returns {boolean}
     */
    has(v) {
        if (v === "ANY" || v === "NONE")
            return true;
        return this.units.has(v);
    }
    next() {
        //console.log("### NEXT ");
        if (this.match != null) {
            // prepread
            /*
            console.log("### PREREAD ");
            for (var v in this.match) {
                console.log(" " + v + "=" + this.match[v]);
            }
            */
            let m = this.match;
            this.start = m.at;
            this.end = m.end;
            this.at = m.end;
            this.match = null;
            this.type = m.type;

            return m;
        }
        if (this.end >= this.l) {
            // no more
            return null;
        }
        /**
        console.log("### NEXTREAD "+this.end+"~"+this.l);
        for (var v in this) {
            console.log(" " + v + "=" + this[v]);
        }
        **/
        let match = {};
        let at = this.at;
        let bAny = false;
        if (!this.units.findNext(this.sString, at, match)) {
            //console.log("### NO NEXT");
            // no next found, at all...
            this.at = this.l;
            this.end = this.l;
            return this.noneMatch;
        }
        //console.log("### NEXT MATCH EXPECTED AT " + this.at + " FOUND AT:" + match.at);
        //console.log("### CHECKNEXTFREE at " + this.at+":"+match.at+"<="+match.type);
        let nextFree = this.getNextFree(match.at, match.end);
        if (nextFree != match.end) {
            // the block is not free, preread another unit and surely NONE to be returned
            this.match = {};
            this.at = this.findFirst(nextFree);
            return this.noneMatch;
        }
        // the entire block is free
        //console.log("### NEXT MATCH EXPECTED AT " + this.at + " FOUND AT:" + match.at);
        if (match.at == this.at) {
            // this 'next' is, indeed, consecutive
            // however, may not be proper by the syntax (but we do not deal with this now)
            this.at = match.end;
            return match;
        }
        // oops, the found unit is free, but distant
        if (match.atom.isStartAtom) {
            // the found distant atom is a start atom
            this.match = match;
        } else {
            // we must find another matching
            this.match = {};
            this.at = this.findFirst(nextFree);
        }
        return this.noneMatch;
    }


}

/**
  * Factory function for Atoms
  * @param
  **/
function atom(...params){
	return new Atom(...params);
}

module.exports = { LexicalUnits, Atom, LexicalParser, atom }
