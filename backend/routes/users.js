var fs = require('fs');
var express = require('express');
var router = express.Router();
var fct = require("./functions.js");
var mongoose = require('mongoose');
var db = require('./db.js');
var crypto = require('crypto');

router.get('/login', function(req, res) {
	login=req.get("X-API-Login");
	db.findOne({login:login}, function(err,user) {
		if (!user) {
			return res.send({success:false});
		} else {
			
			if (fct.isHashValid(req,user)) {
				return res.send({success:true});
			} else {
				return res.send({success:false});
			}
			
		}
	});
});

router.get('/', function(req, res) {
	login=req.get("X-API-Login");
	db.findOne({login:login}, function(err,user) {
		if (!user) {
			return res.send({success:false});
		} else {
			if (fct.isHashValid(req,user)) {
				return res.send({success:true,login:user.login,mail:user.mail});
			} else {
				return res.send({success:false});
			}
		}
	});
});

/*
router.get('/login1', function(req, res) {
	login=req.get("X-API-Login");
	db.findOne({login:login}, function(err,user) {
		if (!user) {
			return res.send({success:false});
		} else {
			
			user.loginToken = crypto.randomBytes(20).toString('hex');
			user.save();
			
			return res.send({success:true,loginToken:user.loginToken});
		}
	});
});

router.get('/login2', function(req, res) {
	login=req.get("X-API-Login");
	db.findOne({login:login}, function(err,user) {
		if (!user) {
			return res.send({success:false});
		} else {
			
			pwd=String(user.passwordHash);
			rnd=String(user.loginToken);
			result = crypto.createHmac('sha1', pwd).update(rnd).digest('hex');
			console.log("Calculated : "+result);
			console.log("From client : "+req.get("X-API-Hash"));
			if (result == req.get("X-API-Hash")) {
				return res.send({success:true});
			} else {
				return res.send({success:false});
			}
		}
	});
});
*/

router.post('/', function(req, res) {
	login=req.body.login
	db.findOne({login:login}, function(err,ret) {
		if (ret) {
			return res.send({success:false});
		} else {
			
			user = new db({
				login: login,
				passwordHash: req.body.passwordHash,
				mail: req.body.mail,
			});

			user.save();
			
			return res.send({success:true});
		}
	});

});

module.exports = router;

