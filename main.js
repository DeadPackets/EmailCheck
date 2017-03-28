/*
TODO:
*/

var express = require('express');
const colors = require('colors');
var app = express();
var fs = require('fs');
var http = require('http')
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
const mysql = require('mysql');
var sql = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'StalkerJS'
});

//Date function
function CurrentDate() {
  var date = new Date();
  var datestring = (date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear())
  var time = date.toLocaleTimeString("en-US")
  var final = datestring + " " + time
  return final
}

//Logging functions (USAGE: log.error("Error!") or log.info() and so on)
var log = {
  error: function(data) {
    console.log('ERROR:'.red, "(" + CurrentDate() + ") " + data); //example output "ERROR: (3-5-2017 6:00 AM) Something went wrong!"
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


  socket.on('disconnect', function(socket) {
    log.info(socket.handshake.address + " has disconnected")
  })
})
