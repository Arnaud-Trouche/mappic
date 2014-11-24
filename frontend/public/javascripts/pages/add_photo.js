if(!user.logged)
	location="/";

$('#coordinates').css('display', 'none');

$('#upload_photo').on( "submit", function( event ) {
	event.preventDefault();
});

$('#file').change(function() {
	$(this).fileExif(function(exifObject) {
		if(exifObject.GPSLatitude == undefined){
			$('#coordinates').slideDown('fast');
		}else{
			// $('#la_D').val(exifObject.GPSLatitude[0]);
			// $('#la_M').val(exifObject.GPSLatitude[1]);
			// $('#la_S').val(exifObject.GPSLatitude[2]);
			// $('#N_S').val(exifObject.GPSLatitudeRef).change();
			// $('#lo_D').val(exifObject.GPSLongitude[0]);
			// $('#lo_M').val(exifObject.GPSLongitude[1]);
			// $('#lo_S').val(exifObject.GPSLongitude[2]);
			// $('#W_E').val(exifObject.GPSLongitudeRef).change();
		}
		console.log(exifObject);
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