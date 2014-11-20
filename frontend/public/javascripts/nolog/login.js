$('#login').on( "submit", function( event ) {
	console.info(serverAddress);
	//HERE THE LOGIN IS DONE
	event.preventDefault();
});

$('#name').focusout(pseudoCheck);

$('#pwd').focusout(passwordCheck);