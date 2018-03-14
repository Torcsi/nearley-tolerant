let {atom,regexp,Lexer,use,equivalences} = require('../../../../../../lib/lexer-tolerant.js');
let tihyLexer = new Lexer("tihyLexer");
use(tihyLexer);


atom("EPCIndexIntroduction",regexp("^(INTRODUCTION|Introduction)"));
atom("EPCIndexConvTitle",regexp("^Convention sur la délivrance de brevets européens[\\s\\S]*$"));
atom("EPCIndexRegTitle",regexp("^Règlement d'exécution de la Convention[\\s\\S]*$"));
atom("EPCIndexProRecTitle",regexp("^(PROTOCOLE SUR LA RECONNAISSANCE|Protocole sur la compétence judiciaire)[\\s\\S]*$","i"));
atom("EPCIndexProCenTitle",regexp("^(PROTOCOLE SUR LA CENTRALISATION|Protocole sur la centralisation)[\\s\\S]*$","i"));
atom("EPCIndexProImmTitle",regexp("^(PROTOCOLE SUR LES PRIVILÈGES ET IMMUNITÉS|Protocole sur les privilèges et immunités)[\\s\\S]*$","i"));
atom("EPCIndexProStaffTitle",regexp("^(PROTOCOLE SUR LES EFFECTIFS|Protocole sur les effectifs)[\\s\\S]*$","i"));
atom("EPCIndexAnnex1Title",regexp("^A(nnexe|NNEXE)[ \xa0]I[ \xa0\t\r\n][\\s\\S]*$"));
atom("EPCIndexAnnex2Title",regexp("^A(nnexe|NNEXE)[ \xa0]II[ \xa0\t\r\n][\\s\\S]*$"));
atom("EPCIndexDecTitle",regexp("^Décision du Conseil d'administration du 28.*$"));
atom("EPCIndexRevTitle",regexp("^Acte portant révision de la Convention.*$"));
atom("EPCIndexRPEBATitle",regexp("^Règlement de procédure de la Grande Chambre.*$"));
atom("EPCIndexRPBATitle",regexp("^Règlement de procédure des chambres de recours.*$"));
atom("EPCIndexAbbreviations",regexp("^(Abréviations)$"));



equivalences("EPCIntroduction","Introduction")
module.exports = tihyLexer;
