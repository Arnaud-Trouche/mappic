$('#login').on( "submit", function( event ) {
	event.preventDefault();
	var login=$('#name').val();
	var password=$('#pwd').val();
	var ts=Date.now().toString();
	var passwordHash = CryptoJS.SHA1(password).toString();
	var hash = CryptoJS.HmacSHA1(ts, passwordHash);
	$.ajax({
		url: serverAddress+"/api/user/login",
		type: "GET",
		headers: {
			"X-API-Login":login,
			"X-API-Hash":hash,
			"X-API-Time":ts,
		}
	}).done(function(ret) {
		if (ret.success) {
			user.login=login;
			user.passwordHash=passwordHash;
			user.logged=true;

			localStorage.setItem("user",JSON.stringify(user));
			loadHeaderMenu();
			link('profile');
		} else {
			$('#auth_failed').slideDown().delay(1000).slideUp();
		}
	});
});

$('#name').focusout(pseudoCheck);

$('#pwd').focusout(passwordCheck);
