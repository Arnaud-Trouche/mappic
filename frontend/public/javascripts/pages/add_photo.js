if(!user.logged)
	location="/";

var currentPicture = {
	picture:undefined,
	date:undefined,
	gps: {
		latitude:undefined,
		longitude:undefined,
	}	
};

$('#coordinates').css('display', 'none');

$('#upload_photo').on( "submit", function( event ) {
	event.preventDefault();
	if (currentPicture.picture != undefined) {
		formData = currentPicture;
		
		API("/pic",formData,function(ret) {
			if(ret.success)
				openDialog('Upload complete','The picture has been succesfully uploaded on mappic. You can now find it on the map !','OK', function() {
					link('home');
				})
			else
				openDialog('An error occured', 'We were unable to upload your picture. Please try again.', 'Try again', function(){})
		});
	}
	
});


$('#file').change(function() {
	if ($(this)[0].files && $(this)[0].files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
		var data = e.target.result;
		currentPicture.picture=data.replace("data:image/jpeg;base64,","");
		$('#preview_img')
			.attr('src', e.target.result)
			.height(200)
			.show('',function() { $('#preview_img').css('display','block'); });
    };
    reader.readAsDataURL($(this)[0].files[0]);
	}
	$(this).fileExif(function(exifObject) {
		currentPicture.date=exifObject.DateTimeOriginal;
		if(exifObject.GPSLatitude == undefined){
			$('#coordinates').slideDown('fast');
			$('#locPicker').locationpicker({
				location: {latitude: 48.028184, longitude:  1.884350},	
				radius: 300,
				zoom:3,
				onchanged: function(currentLocation, radius, isMarkerDropped) {
					currentPicture.gps.latitude=currentLocation.latitude;
					currentPicture.gps.longitude=currentLocation.longitude;
				}
			});				
		
		}else{
			$('#coordinates').slideUp('fast');
			var lat=Number(exifObject.GPSLatitude[0])+Number(exifObject.GPSLatitude[1])/60+Number(exifObject.GPSLatitude[2])/3600;
			var lon=Number(exifObject.GPSLongitude[0])+Number(exifObject.GPSLongitude[0])/60+Number(exifObject.GPSLongitude[2])/3600;
			
			currentPicture.gps.latitude=lat;
			currentPicture.gps.longitude=lon;
		}
	});
});

	var errors = [];
function addError(elem){
	if(elem.hasClass('wrong'))
		return;
	elem.addClass('wrong');
	if(errors.length == 0){
		$('#errorbox').slideToggle('fast');		
	}
	errors.push(1);
}

function removeError(elem){
	if(elem.hasClass('wrong')){
		errors.pop();
		elem.removeClass('wrong');
		if(errors.length == 0){
			$('#errorbox').slideToggle('fast');		
		}
	}
}

$("#la_D").focusout(function(event) {
	if(!isInRange($(this).val(), 0, 90))
		addError($(this));
	else
		removeError($(this));
});		


$("#lo_D").focusout(function(event) {
	if(!isInRange($(this).val(), 0, 180))
		addError($(this));
	else
		removeError($(this));
});	

$("#la_M, #la_S, #lo_M, #lo_S").focusout(function(event) {
	if($(this).val() != '' && !isInRange($(this).val(), 0, 60))
		addError($(this));
	else
		removeError($(this));
});	
