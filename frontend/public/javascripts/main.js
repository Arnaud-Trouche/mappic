$( document ).ready(function() {
	//if logged
	if(localStorage.getItem("login") == true){
		$("#content").html("Loggé");
	}else{
    	$("#content").html("Pas loggé");
    	//load default template
    	
	}


});
