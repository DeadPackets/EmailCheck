#!/bin/bash

EMAIL=$1

if [ -z "$EMAIL" ]; then
  echo "Please specify an email!"
  exit
else
  echo
  echo "----------------------------"
  echo "TARGET: $EMAIL"
  echo "----------------------------"
  echo
fi

PSBDMP=$(curl --silent http://psbdmp.com/api/search/email/$1)
HAVEIBEENPWNED_BREACH=$(curl --silent --user-agent 'StalkerJS - A NodeJS WebApp for User Recon' "https://haveibeenpwned.com/api/v2/breachedaccount/$1")
sleep 5 #Avoid rate limiting
HAVEIBEENPWNED_PASTE=$(curl --silent --user-agent 'StalkerJS - A NodeJS WebApp for User Recon' "https://haveibeenpwned.com/api/v2/pasteaccount/$1")
HACKED_DB=$(curl --silent "https://www.hacked-db.com/api/v1/email/$1")

if [ -z "$PSBDMP" ]; then
  echo "PastebinDump returned nothing."
  echo
else
  echo $PSBDMP | jq .
  echo
fi

if [ -z "$HAVEIBEENPWNED_BREACH" ]; then
  echo "HaveIBeenPwned-Breach returned nothing."
  echo
else
  echo $HAVEIBEENPWNED_BREACH | jq .
  echo
fi

if [ -z "$HAVEIBEENPWNED_PASTE" ]; then
  echo "HaveIBeenPwned-Paste returned nothing."
  echo
else
  echo $HAVEIBEENPWNED_PASTE | jq .
  echo
fi

if [ -z "$HACKED_DB" ]; then
  echo "Hacked_DB returned nothing."
  echo
else
  echo $HACKED_DB | jq .
  echo
fi

##TODO: Add NodeJS callbacks here
