var crypto = require('crypto');
var fs = require('fs');
var mongoose = require('mongoose');
var db = require('./db.js');

module.exports = {
	
	isHashValid: function(req,user) {
		pwd=String(user.passwordHash);
		ts=req.get("X-API-Time");
		hash=req.get("X-API-Hash");
		result = crypto.createHmac('sha1', pwd).update(ts).digest('hex');
		if (hash == result && Date.now() - ts <= 60000) {
			return true;
		} else {
			return false;
		}
	},
	
	checkUserExists: function(login) {
		db.find({login:login}, function(err,res) {
			console.log(res.length);
			if (res.length == 1) {
				return true;
			} else {
				return false;
			}
		});
	},
	
	checkAuth: function (login, rnd, hash) {
		// Key is the randomly generated
		// Hash is the result of the password (previously hashed) and the key
		if (fs.existsSync("data/"+login)) {
			user = require("../data/"+login+"/profile.json");
			var pwd=String(user.passwordHash);
			var rnd=String(rnd);
			result = crypto.createHmac('sha1', pwd).update(rnd).digest('hex');
			if (result == hash) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	
	getUser: function(login) {
		user = require("../data/"+login+"/profile.json");
		return user;
	}
}
