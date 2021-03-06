var mongoose = require('mongoose');

var pictureSchema = new mongoose.Schema({
	hash: String,
	date: String,
	gps: {
		latitude: Number,
		latitudeRef: String,
		longitude: Number,
		longitudeRef: String,
	}
});

var userSchema = new mongoose.Schema({
	login : String,
	passwordHash : String,
	mail : String,
	pictures : [ pictureSchema ],
	loginToken: String,
});

var User = mongoose.model('users', userSchema);
var Picture = mongoose.model('pictures', pictureSchema);
if (User == undefined) console.log("ERROR");
//console.log(User);
module.exports = {User:User,Picture:Picture};
