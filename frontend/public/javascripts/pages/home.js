$(document).ready(function($) {
	//If logged
	if(user.logged){
		var mapOptions = {
			backgroundColor: "#FFFFFF",
			center: new google.maps.LatLng(43.864377, 1.641484),
			mapTypeControl: false,
			overviewMapControl: false,
			panControl: false,
			rotateControl: false,
			scaleControl: false,
			streetViewControl: false,
			zoom: 10
		};
		var map = new google.maps.Map(document.getElementById('content'),
			mapOptions);	
	}	
});