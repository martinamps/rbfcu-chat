#!/bin/bash
# cwd is root
source .env.local

cp public/index.html public/index.tmp.html
sed -i '' "s/{accountSid}/$ACCOUNT_SID/g" public/index.tmp.html
sed -i '' "s/{flowSid}/$FLOW_SID/g" public/index.tmp.html
open public/index.tmp.html

#        accountSid: "ACfd0eed7058d193ed1e4f68e977ac58ac", /* Account Sid */
#        flexFlowSid: "FOe9b78767ba60c87abea42ebeb2bb0aab", /* Webchat FlexFlow */
