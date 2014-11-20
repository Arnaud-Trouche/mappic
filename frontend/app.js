var express = require('express');
var app = express();

app.set("view options", {layout: false});
app.use("/",express.static(__dirname + '/public'));


var server = app.listen(8000, null); 