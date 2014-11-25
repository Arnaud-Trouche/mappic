if(!user.logged)
	location="/";

var currentPicture = {};

$('#coordinates').css('display', 'none');

$('#upload_photo').on( "submit", function( event ) {
	event.preventDefault();
	if (currentPicture.base64File != undefined) {
		formData = {
			picture:currentPicture.base64File,
			date:currentPicture.date,
			gps: {
				la_D:$('#la_D').val(),
				la_M:$('#la_M').val(),
				la_S:$('#la_S').val(),
				lo_D:$('#lo_D').val(),
				lo_M:$('#lo_M').val(),
				lo_S:$('#lo_S').val(),
				N_S:$('#N_S').val(),
				W_E:$('#W_E').val(),
			}
		}
		
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
		currentPicture.base64File=data.replace("data:image/jpeg;base64,","");
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
		}else{
			$('#la_D').val(exifObject.GPSLatitude[0]);
			$('#la_M').val(exifObject.GPSLatitude[1]);
			$('#la_S').val(Math.round(exifObject.GPSLatitude[2]*100)/100);
			$('#N_S').val(exifObject.GPSLatitudeRef).change();
			$('#lo_D').val(exifObject.GPSLongitude[0]);
			$('#lo_M').val(exifObject.GPSLongitude[1]);
			$('#lo_S').val(Math.round(exifObject.GPSLongitude[2]*100)/100);
			$('#W_E').val(exifObject.GPSLongitudeRef).change();
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
