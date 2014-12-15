var fs = require('fs');
var express = require('express');
var router = express.Router();
var fct = require("./functions.js");
var mongoose = require('mongoose');
var db = require('./db.js');
var crypto = require('crypto');

router.get('/', function(req, res) {
	login=req.get("X-API-Login");
	db.User.findOne({login:login}, function(err,user) {
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

router.post('/', function(req, res) {
	login=req.body.login
	db.User.findOne({login:login}, function(err,ret) {
		if (ret) {
			return res.send({success:false});
		} else {
			
			user = new db.User({
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

