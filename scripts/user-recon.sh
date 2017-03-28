#!/bin/bash

USER=$1
HAVEIBEENPWNED-BREACH=$(curl --user-agent 'StalkerJS - A NodeJS WebApp for User Recon' "https://haveibeenpwned.com/api/v2/breachedaccount/$1")
sleep 5 #Avoid rate limiting
HAVEIBEENPWNED-PASTE=$(curl --user-agent 'StalkerJS - A NodeJS WebApp for User Recon' "https://haveibeenpwned.com/api/v2/pasteaccount/$1")
##A bunch of tools go here (datasploit and what not)

##TODO: Nodejs callback
