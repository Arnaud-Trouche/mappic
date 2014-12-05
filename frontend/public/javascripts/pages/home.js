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
			zoom: 5
		};
		var map = new google.maps.Map(document.getElementById('content'),
			mapOptions);
			
			
		var markers=[];

		
		API('/pic',null,function(data) {
			
			for (i=0; i<data.pictures.length; i++) {
				
				contentString = "<img class='mapImg' src='"+serverAddress+"/data/"+data.pictures[i].hash+".jpg' />";


				markers[i] = new google.maps.Marker({
					position: new google.maps.LatLng(data.pictures[i].gps.latitude, data.pictures[i].gps.longitude),
					map: map,
					title: '',
					content:contentString,
				});
				
				google.maps.event.addListener(markers[i], 'click', function() {
					infowindow = new google.maps.InfoWindow({
						content: this.content,
					});
					infowindow.open(map, this);
				});	
				
			}
			
			
			var markerCluster = new MarkerClusterer(map, markers);

			
			// Center and extend the map to see all the markers
			var bounds = new google.maps.LatLngBounds();
			$.each(markers, function (index, marker) {
				bounds.extend(marker.position);
			});
			map.fitBounds(bounds);
			
		});
		
		
	}
});
