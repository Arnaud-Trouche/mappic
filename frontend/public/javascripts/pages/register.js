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
		if(ret.success)
			openDialog('Registration complete','Everything went well and you are now registered. You will now be redirect to the login page where you can now proceed to login.','OK', function() {
				link('login');
			})
		else
			openDialog('An error occured', 'We were unable to register you, maybe because you have chosen a login that is already taken by somebody else. Please try again.', 'Try again', function(){})
	});
	
});


// Validations functions

$('#name').focusout(pseudoCheck);

$('#mail').focusout(emailCheck);

$('#pwd').focusout(passwordCheck);

$('#confirm_pwd').focusout(confPasswordCheck);
