var fs = require('fs');
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongoose = require('mongoose');
var db = require('./db.js');
var fct = require("./functions.js");
var atob = require('atob')

router.get('/', function(req, res) {
	login=req.get("X-API-Login");
	db.User.findOne({login:login}, function(err,user) {
		if (!user) {
			return res.send({success:false});
		} else {
			
			if (fct.isHashValid(req,user)) {
				return res.send({success:true,pictures:user.pictures});
			} else {
				return res.send({success:false});
			}
			
		}
	});
});

router.post('/', function(req, res) {
	
	login=req.get("X-API-Login");
	db.User.findOne({login:login}, function(err,user) {
		if (!user) {
			return res.send({success:false});
		} else {
			if (fct.isHashValid(req,user)) {
				
				var id = crypto.randomBytes(20).toString('hex');
				
				fs.writeFileSync("data/"+id+".jpg", new Buffer(req.body.picture, "base64"));
				
				var lat=Number(req.body.gps.la_D)+Number(req.body.gps.la_M)/60+Number(req.body.gps.la_S)/3600;
				var lon=Number(req.body.gps.lo_D)+Number(req.body.gps.lo_M)/60+Number(req.body.gps.lo_S)/3600;

				pic = new db.Picture({
					hash:id,
					date:req.body.date,
					gps: {
						latitude:lat,
						longitude:lon,
						latitudeRef:req.body.gps.N_S,
						//longitudeRef:req.body.gps.W_E,
						longitudeRef:'E',
					}
				});
				
				user.pictures.push(pic);
				user.save();
				
				return res.send({success:true,id:id});
				
			} else {
				return res.send({success:false});
			}
		}
	});

	

});

module.exports = router;

