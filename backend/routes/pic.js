var fs = require('fs');
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var ExifImage = require('exif').ExifImage;

router.get('/:userHash/:picId', function(req, res) {
	userHash=req.params.userHash
	picId=req.params.picId

	if (fs.existsSync("data/"+userHash+"/pictures/"+picId)) {
		var pic = 
		require("../data/"+userHash+"/pictures/"+picId+"/picture.json");
		return res.send(pic);
	} else {
		return res.send({success:false});
	}

});

router.post('/:hash', function(req, res) {
	userHash=req.params.hash

	if (!fs.existsSync("data/"+userHash)) {
		return res.send({success:false});
	}

	var id = crypto.randomBytes(20).toString('hex');


	var fstream;
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename) {
		fs.mkdirSync("data/"+userHash+"/pictures/"+id);

		fstream = fs.createWriteStream("data/"+userHash+"/pictures/"+id+"/picture.jpg");
		file.pipe(fstream);
		fstream.on('close', function () {    

			try {
				new ExifImage({ image : "data/"+userHash+"/pictures/"+id+"/picture.jpg" }, function (error, exifData) {
					if (error)
						console.log('Error: '+error.message);
					else
						var pictureInfo = {
							date:exifData.exif.DateTimeOriginal,
							gps: {
								longitude:exifData.gps.GPSLongitude,
								longitudeRef:exifData.gps.GPSLongitudeRef,
								latitude:exifData.gps.GPSLatitude,
								latitudeRef:exifData.gps.GPSLatitudeRef,	
							}
						}

						fs.writeFileSync("data/"+userHash+"/pictures/"+id+"/picture.json", JSON.stringify(pictureInfo), "utf8");

						return res.send({success:true,id:id});


					});
			} catch (error) {
				console.log('Error: ' + error.message);
			}


		});
	});

});

module.exports = router;

