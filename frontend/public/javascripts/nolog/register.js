$('#register').on( "submit", function( event ) {
	//HERE THE REGISTER IS DONE
	event.preventDefault();
});

// Validations functions

$('#name').focusout(pseudoCheck);

$('#mail').focusout(emailCheck);

$('#pwd').focusout(passwordCheck);

$('#confirm_pwd').focusout(confPasswordCheck);