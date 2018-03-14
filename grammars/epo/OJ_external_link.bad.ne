@{%
const lexgen = require('./atomparser.js');
const lex = lexgen.require(['./docxml4net_KG.lex'],'./docxml4net_KG.lex.js');
%}
@lexer lex

# comment
# optional element: :?
# optionally repeated element: :* 
# mandatory repeated element: :+

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
OJSupPubArtic -> %OJSupPub %anySpace UOJIssueNo %commaSpace %OJEpo %anySpace UOJYear %commaSpace %OJArtPage
OJSupPubArtRange -> OJSupPubArtic %to (%OJSupPub %anySpace UOJIssueNo %commaSpace %OJEpo %anySpace UOJYear %commaSpace):? %OJArtPage

OJSupplArt -> (OJSupplArtic|OJSupplArtRange)
OJSupplArtic -> %OJSuppl %anySpace UOJIssueNo %per UOJYear %commaSpace UOJArtNo
OJSupplArtRange -> OJSupPubArtic %to (%OJSuppl %anySpace UOJIssueNo %per UOJYear %commaSpace):? UOJArtNo
