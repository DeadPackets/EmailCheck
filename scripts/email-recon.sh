#!/bin/bash

EMAIL=$1
PSBDMP=$(curl http://psbdmp.com/api/search/email/$1)
HAVEIBEENPWNED-BREACH=$(curl --user-agent 'StalkerJS - A NodeJS WebApp for User Recon' "https://haveibeenpwned.com/api/v2/breachedaccount/$1")
sleep 5 #Avoid rate limiting
HAVEIBEENPWNED-PASTE=$(curl --user-agent 'StalkerJS - A NodeJS WebApp for User Recon' "https://haveibeenpwned.com/api/v2/pasteaccount/$1")
HACKED-DB=$(curl https://www.hacked-db.com/api/v1/email/$1)

##TODO: Add NodeJS callbacks here
