/*
TODO:
*/

var express = require('express');
const colors = require('colors');
var app = express();
var fs = require('fs');
var http = require('http')
var request = require('request')
var sleep = require('sleep');
var httpport = 80;

//TODO: Get SSL certs and place them
/*
var port = 443;
var options = {
    key: fs.readFileSync('privkey/goes/here/privkey.pem'), //Private key
    cert: fs.readFileSync('cert/goes/here/cert.pem') // SSL cert
    }
*/

//HTML entities
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

//MYSQL Connection
/*
const mysql = require('mysql');
var sql = mysql.createPool({
	host: '127.0.0.1',
	user: 'root',
	password: '',
	database: 'StalkerJS'
});
*/
//Date function
function CurrentDate() {
	var date = new Date();
	var datestring = (date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear())
	var time = date.toLocaleTimeString("en-US")
	var final = datestring + " " + time
	return final
}


var log = {
	error: function(data) {
		console.log('ERROR:'.red, "(" + CurrentDate() + ") " + data);
	},
	info: function(data) {
		console.log('INFO:'.green, "(" + CurrentDate() + ") " + data);
	},
	warn: function(data) {
		console.log('WARN:'.yellow, "(" + CurrentDate() + ") " + data);
	},
	debug: function(data) {
		console.log('DEBUG:'.blue, "(" + CurrentDate() + ") " + data);
	}
}

//Starting up HTTP and HTTPS
/*
var server = https.createServer(options, app).listen(port, function() {
  log.info("Express server listening on port " + port);
});
*/

var serverhttp = http.createServer(app).listen(httpport, function() {
	log.info("Express server listening on port " + httpport);
});
serverhttp.listen(80);

//SOCKET.IO INIT
var io = require('socket.io')(serverhttp) // TODO: Change this to ssl later

app.use(express.static(__dirname + '/web'));

app.get('/', function(req, res) {
	log.debug(req.connection.remoteAddress + " GET /")
	res.sendFile('index.html');
})

//404 Code
app.use(function(req, res) {
	res.send('404: Page not Found').status(404);
	log.warn(req.connection.remoteAddress + " [404] GET " + req.url)
});

//Socket.io initiating and logging connections
io.on('connection', function(socket, next) {
	log.info(socket.handshake.address + " has connected.")

	//Email Recon functions

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
			socket.emit('psbdmp-results', psbdmp)

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
			socket.emit('haveibeenpwned_breach-results', haveibeenpwned_breach)
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
			socket.emit('haveibeenpwned_paste-results', haveibeenpwned_paste)

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
			socket.emit('hacked-db-results', hacked_db)
		})

		request('https://www.hacked-emails.com/api?q=' + email, function(err, res, body) {
			if (err) {
				log.error(err);
			}
			if (res.statusCode == 404) {
				hacked_email = false
			} else {
				hacked_email = body
			}
			socket.emit('hacked-email-results', hacked_email)
		})
		socket.emit('done-results')
	}

	socket.on('start-email-recon', function(email) {
		if (email == '') {
			log.warn("Someone submitted an invalid email!")
			next()
		} else {
			log.info(socket.handshake.address + " has submitted the email " + email + " for recon scan.")
			EmailRecon(email)
		}
	})

	socket.on('disconnect', function() {
		log.info(socket.handshake.address + " has disconnected")
	})
})
