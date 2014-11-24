if(user.logged)
	location="/";

$('#register').on( "submit", function( event ) {
	event.preventDefault();

	//trigger the input to check and proceed if no errors
	$('#name').trigger('focusout');
	$('#mail').trigger('focusout');
	$('#pwd').trigger('focusout');
	$('#confirm_pwd').trigger('focusout');
	if($('.form_errorbox').length != 0){
		return;
	}

	var hash = CryptoJS.SHA1($('#pwd').val()).toString();
	$.ajax({
		url: serverAddress+"/api/user/",
		type: "POST",
		data: {
			login: $('#name').val(),
			mail: $('#mail').val(),
			passwordHash: hash
		}
	}).done(function(ret) {
		alert(ret.success);
	});
	
});

// Validations functions

$('#name').focusout(pseudoCheck);

$('#mail').focusout(emailCheck);

$('#pwd').focusout(passwordCheck);

$('#confirm_pwd').focusout(confPasswordCheck);
