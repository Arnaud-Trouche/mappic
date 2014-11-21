$(document).ready(function($) {
	console.info("done");
	var mapOptions = {
		zoom: 10,
		center: new google.maps.LatLng(43.864377, 1.641484)
	};
	var map = new google.maps.Map(document.getElementById('content'),
		mapOptions);	
});