var fs = require('fs');
var express = require('express');
var router = express.Router();

router.get('/:hash', function(req, res) {
	hash=req.params.hash

	if (fs.existsSync("data/"+hash)) {
		var user = require("../data/"+hash+"/profile.json");
                return res.send(user);
        } else {
		return res.send({success:false});
	}

});

router.post('/:hash', function(req, res) {
	hash=req.params.hash

	if (fs.existsSync("data/"+hash)) {
		return res.send({success:false});
	}

	fs.mkdirSync("data/"+hash)

	user = {
		name: req.body.name,
		mail: req.body.mail,
	}

	fs.writeFileSync("data/"+hash+"/profile.json", JSON.stringify(user), "utf8");
        fs.mkdirSync("data/"+hash+"/pictures/")

	return res.send({success:true});
});

module.exports = router;

