var fs = require('fs');
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var busboy = require('connect-busboy');

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
})); 
app.use(bodyParser.json());
app.use(busboy()); // File uploads

var users = require('./routes/users');
var pic = require('./routes/pic');

app.use('/api/users', users);
app.use('/api/pic', pic);

var server = app.listen(3000, function () {


})
