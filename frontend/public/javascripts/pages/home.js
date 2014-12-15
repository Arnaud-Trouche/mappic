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

		
		API('/pic',"GET",null,function(data) {
			
			for (i=0; i<data.pictures.length; i++) {
				var imageMin = serverAddress+"/data/"+data.pictures[i].hash+"_min.jpg";
				
				
				markers[i] = new google.maps.Marker({
					position: new google.maps.LatLng(data.pictures[i].gps.latitude, data.pictures[i].gps.longitude),
					map: map,
					title: '',
					icon: imageMin,
				});

				google.maps.event.addListener(markers[i], 'click', function() {
					var link = this.icon.replace('_min','');
					openDialogImg(link);
				});	
				
			}
			
			if (markers.length > 0) {
				var markerCluster = new MarkerClusterer(map, markers);

				
				// Center and extend the map to see all the markers
				var bounds = new google.maps.LatLngBounds();
				$.each(markers, function (index, marker) {
					bounds.extend(marker.position);
				});
				map.fitBounds(bounds);
				var zoom = map.getZoom();
				if (zoom > 6) map.setZoom(6);
			}
			
		});
		
		
	}
});


function deletePhoto(link){
	var tab = link.split('/');
	var src = tab[tab.length-1].replace(".jpg","")
	
	API("/pic/"+src,"DELETE", null, function(ret) {
		if (!ret.success) {
			openDialog('Error while deleting image', '<p>:(</p>', 'OK', function(){});
		}
		$("#dialog_container").animate({opacity: 0}, 'fast', function(){
			$("#dialog_container").css('display', 'none');    
			location.reload();    
		});
	});
}
