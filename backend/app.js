var fs = require('fs');
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var busboy = require('connect-busboy');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mappic', function(err) {
  if (err) { throw err; }
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-API-Login,X-API-Hash,X-API-Time");
  next();
});

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true,
  limit:'50mb'
})); 
app.use(bodyParser.json());
app.use(busboy()); // File uploads

var user = require('./routes/users');
var pic = require('./routes/pic');



app.use('/api/user', user);
app.use('/api/pic', pic);

app.use('/data',express.static(__dirname + '/data/'));

var server = app.listen(443, function () {


})
