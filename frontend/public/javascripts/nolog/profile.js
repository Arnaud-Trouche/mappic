API("/user/",null,function(data) {
	$('#username').html(data.login);
	$('#mail').html(data.mail);
});