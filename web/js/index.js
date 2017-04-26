function EmailRecon(email) {
	var psbdmp;
	var haveibeenpwned_breach;
	var haveibeenpwned_paste;
	var hacked_db;
	var hacked_email;

	request('http://psbdmp.com/api/search/email/' + email, function(err, res, body) {
		if (err) {
			log.error(err);
		}
		if (res.statusCode == 404) {
			psbdmp = false
		} else {
			psbdmp = body
		}
		PSBDMPResults(psbdmp)

	})

	var options = {
		url: 'https://haveibeenpwned.com/api/v2/breachedaccount/' + email,
		headers: {
			'User-Agent': 'StalkerJS - A NodeJS WebApp for User Recon'
		}
	}

	request(options, function(err, res, body) {
		if (err) {
			log.error(err);
		}
		if (res.statusCode == 404) {
			haveibeenpwned_breach = false
		} else {
			haveibeenpwned_breach = body
		}
		HaveIBeenPwnedBreachResults(haveibeenpwned_breach)
	})

	sleep.sleep(1)

	var options = {
		url: 'https://haveibeenpwned.com/api/v2/pasteaccount/' + email,
		headers: {
			'User-Agent': 'StalkerJS - A NodeJS WebApp for User Recon'
		}
	}

	request(options, function(err, res, body) {
		if (err) {
			log.error(err);
		}
		if (res.statusCode == 404) {
			haveibeenpwned_paste = false
		} else {
			haveibeenpwned_paste = body
		}
		HaveIBeenPwnedPasteResults(haveibeenpwned_paste)

	})

	request('https://www.hacked-db.com/api/v1/email/' + email, function(err, res, body) {
		if (err) {
			log.error(err);
		}
		if (res.statusCode == 404) {
			hacked_db = false
		} else {
			hacked_db = body
		}
		HackedDBResults(hacked_db)
	})

	request('https://www.hacked-emails.com/api?q=' + email, function(err, res, body) {
		if (err) {
			log.error(err);
		}
		if (res.statusCode == 404) {
			hacked_emails = false
		} else {
			hacked_emails = body
		}
		HackedEmailResults(hacked_emails)
	})
	DoneResults()
}
