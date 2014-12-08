if(!user.logged)
	location="/";

API("/user/","GET",null,function(data) {
	$('#username').html(data.login);
	$('#mail').html(data.mail);
});
