@{%
const lexgen = require('./atomparser.js');
const lex = lexgen.require(['./docxml4net_KG.lex'],'./docxml4net_KG.lex.js');
%}
@lexer lex

# comment
# optional element: :?
# optionally repeated element: :* 
# mandatory repeated element: :+

test -> OJAndYear | OJIssueAndYear | OJSpecEd | SpecEdOJ | SuppPubOJ | SuppNoOJ | OJSuppPub | OJSupplTo | OJSuppl

OJAndYear -> OJ %anySpace %OJYear
OJAndYear -> OJ %anySpace %OJYearBacklog

OJIssueAndYear -> OJ %anySpace OJIssueNumber %per %OJYear
OJIssueAndYear -> OJ %anySpace ((%issue %anySpace):? OJNo %anySpace):? OJIssueNumber %per %OJYearBacklog

OJIssueNumber -> %number ( %dash %number):?


OJSpecEd -> OJ %anySpace %OJSE %anySpace (OJNo %anySpace):? %number %per OJYear
OJSpecEd -> OJ %anySpace OJYear %commaSpace SpecEd %anySpace (OJNo %anySpace):? %number
OJSpecEd -> OJ %anySpace OJYear %commaSpace SpecEd (OJNo %anySpace):? %number # warning: missing space
OJSpecEd -> OJ %anySpace OJYear %anySpace SpecEd (%anySpace):? (OJNo %anySpace):? %number # warning: missing comma



SpecEdOJ -> SpecEd %anySpace OJ %anySpace (OJNo %anySpace):? %number %per OJYear
SpecEd   -> (%SpecEdLong | %SpecEdShort)

SuppPubOJ ->  OJSuppPubText %anySpace OJ %anySpace (OJNo %anySpace):? %number %per %OJYear

SuppNoOJ ->  %OJSuppl %anySpace OJNo %anySpace %number %to OJ %anySpace (OJNo %anySpace):? %number %per %OJYearBacklog

OJSuppPubText -> %OJSuppPubLong | %OJSuppPubShort
OJSuppPubTextAny -> %OJSuppPubLong | %OJSuppPubShort | %OJSuppl

OJSuppPub -> OJ %anySpace %OJYear %commaSpace OJSuppPubTextAny %anySpace %number

OJSupplTo ->OJ %anySpace %OJYearBacklog %commaSpace %OJSupplTo %anySpace (OJNo %anySpace):? %number %per %number

OJSuppl -> OJ %anySpace OJIssueNumber %per %OJYearBacklog %commaSpace %OJSuppl

OJNo -> (%No | %UnusualNo)
OJYear -> %OJYear | %OJYearBacklog
OJ -> (%OJ | %OJEpo)

start -> OJRefSeq

#UNITS
UOJArtNo -> %OJArtNo
UOJArtPage -> %OJArtPage
UOJIssueNo -> %OJIssueNo
UOJYear -> (%OJYear | %OJYearBacklog)
UOJBacklogYear -> %OJYearBacklog
UOJArticle -> %OJArtNo
UOJSEArticle -> %OJArtPage


# OJ SEQUENCES
OJRefSeq -> OJRef ((%commaSpace|%anySpace) OJRef):*
OJRef -> (OJArtic|OJSEArtic|OJSpecEdArt|OJSupPubArt|OJSupplArt)

# Simple artice like OJ EPO 2016, A9
OJArtic -> (OJArticle|OJArticleOld|OJArtRange|OJArtOldRange)
OJArticle -> (%OJ | %OJEpo) %anySpace (%number %per):? %OJYear %commaSpace UOJArticle # error "asdasda" context: "margin"; warning "asasd" if:
OJArticleOld -> (%OJ | %OJEpo) %anySpace %OJYearBacklog %commaSpace UOJArtPage
OJArtRange -> OJArticle %to (%OJEpo %anySpace %OJYear %commaSpace):? %OJArtNo
OJArtOldRange -> OJArticleOld %to (%OJEpo %anySpace %OJYearBacklog %commaSpace):? UOJArtPage

OJSEArtic -> (OJSEArticle|OJSEArtRange)
OJSEArticle -> %OJSE %anySpace UOJIssueNo %per UOJYear %commaSpace %OJArtPage
OJSEArtRange -> OJSEArticle %to %OJArtPage

OJSpecEdArt -> (OJSpecEdArtic|OJSpecEdArtRange)
OJSpecEdArtic -> %OJSpecEd %anySpace %OJEpo %anySpace UOJYear %commaSpace UOJSEArticle
OJSpecEdArtRange -> OJSpecEdArtic %to %OJArtPage

OJSupPubArt -> (OJSupPubArtic|OJSupPubArtRange|OJSupplArtRange)
OJSupPubArtic -> OJSupplPub %anySpace UOJIssueNo %commaSpace %OJEpo %anySpace UOJYear %commaSpace %OJArtPage
OJSupplPub -> %OJSuppPubLong | %OJSuppPubShort
OJSupPubArtRange -> OJSupPubArtic %to (OJSupplPub %anySpace UOJIssueNo %commaSpace %OJEpo %anySpace UOJYear %commaSpace):? %OJArtPage

OJSupplArt -> (OJSupplArtic|OJSupplArtRange)
OJSupplArtic -> %OJSuppl %anySpace UOJIssueNo %per UOJYear %commaSpace UOJArtNo
OJSupplArtRange -> OJSupPubArtic %to (%OJSuppl %anySpace UOJIssueNo %per UOJYear %commaSpace):? UOJArtNo
