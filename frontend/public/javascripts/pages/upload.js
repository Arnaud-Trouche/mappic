if(!user.logged)
	location="/";

var nbPhotos = 0;
var pictures = new Array;

//Interface
$(document).on('dragenter', '#drop', function() {
	$(this).addClass('dragover')
	return false;
});

$(document).on('dragover', '#drop', function(e){
	e.preventDefault();
	e.stopPropagation();
	$(this).addClass('dragover')
	return false;
});

$(document).on('dragleave', '#drop', function(e) {
	e.preventDefault();
	e.stopPropagation();
	$(this).removeClass('dragover')
	return false;
});

function photoAdded(){
	if($(".preview_drop").length !=0){
		$('#tip').css('display', 'none');
		$('input[type=submit]').show();
		$('#drop').css('align-items','stretch');
	}
}

function maximizeDropZone(){
	$("#content").removeClass('cropped').css('max-width', '800px');
	$("#content").animate({'max-width': '25000px'}, 400);
}

function deletePhoto(src, id){
	//Remove from JS
	if(id == nbPhotos-1)
		nbPhotos--;
	else{
		nbPhotos--;
		for(i = id; i<nbPhotos-1; i++){
			pictures[i] = pictures[i+1];
		}
	}

	//Remove from page
	$('#preview_drop_'+id).hide(400, function(){
		$('#preview_drop_'+id).remove();		
	});
}

//Add geolocalisation
function openMap(id){
	openDialog('Add GPS data', '<p>Your picture does not have geolocalisation data so you need to tell us where the picture have been taken</p><div id="locPicker" style="width:100%;height:250px;"></div>', 'Done', function(){});
	var lat = $('#lat_'+id).val() == 'undefined' ? 45.00 : $('#lat_'+id).val();
	var lon = $('#lon_'+id).val() == 'undefined' ? -5.00 : $('#lon_'+id).val();
	var zoom = $('#lon_'+id).val() == 'undefined' ? 3 : 7;

	$('#locPicker').locationpicker({
		location: {latitude: lat, longitude:  lon},	
		radius: 100,
		mapTypeControl: false,
		overviewMapControl: false,
		panControl: false,
		rotateControl: false,
		scaleControl: false,
		streetViewControl: false,
		zoom:zoom,
		onchanged: function(currentLocation, radius, isMarkerDropped) {
			pictures[id].gps.latitude=currentLocation.latitude;
			pictures[id].gps.longitude=currentLocation.longitude;
			$('#lat_'+id).val(currentLocation.latitude)			
			$('#lon_'+id).val(currentLocation.longitude)
			addCityToPreview(id, true);
		}
	});	
}

//DATA

//Drag&Drop
$(document).on('drop', '#drop', function(e) {
	console.log("Photo dropped !");
	if(e.originalEvent.dataTransfer){
		if(e.originalEvent.dataTransfer.files.length) {
           // Stop the propagation of the event
           e.preventDefault();
           e.stopPropagation();
           // Main function to upload
           upload(e.originalEvent.dataTransfer.files[0]);
       }  
   }
   $(this).removeClass('dragover');
   return false;
});

//Manual selection
$('#file').change(function() {
	if ($(this)[0].files && $(this)[0].files[0]) {
		console.log("File selected");
		upload($(this)[0].files[0]);
		$(this).val(''); // Reset the input field
	}
});

function upload(files) {
	var f = files ;

	if (!f.type.match('image/jpeg')) {
		openDialog('Wrong type file', 'You can only upload jpeg files.', 'Try again', function(){});
		return false ;
	}

	var reader = new FileReader();
	reader.onload = function (e) {
		nbPhotos++;	
		var data = e.target.result;
		var id = (nbPhotos-1);

		if(nbPhotos == 3){maximizeDropZone();}

		addPreview(data, id);
		photoAdded();

		pictures[id] = {
			picture: data.replace("data:image/jpeg;base64,",""),
			date:undefined,
			gps:{
				latitude:undefined,
				longitude:undefined,
			}
		}

		EXIF.getData(document.getElementById("prev_pic_"+id), function() {
			pictures[nbPhotos-1].date= EXIF.getTag(this, "DateTimeOriginal");
			var latArr = EXIF.getTag(this, "GPSLatitude")
			var lonArr = EXIF.getTag(this, "GPSLongitude")
			if(latArr != undefined){
				pictures[id].gps.latitude  = DMSToAbsolute(latArr[0], latArr[1], latArr[2], EXIF.getTag(this, "GPSLatitudeRef"));
				pictures[id].gps.longitude = DMSToAbsolute(lonArr[0], lonArr[1], lonArr[2], EXIF.getTag(this, "GPSLongitudeRef"));
				$('#lat_'+id).val(pictures[id].gps.latitude)			
				$('#lon_'+id).val(pictures[id].gps.longitude)
			}
		});
		addCityToPreview(id, false);
	};
	reader.readAsDataURL(f);            
}

$("#page").on("changePage", function () {
    nbPhotos = 0;
    pictures = [];
    $(document).off('drop', '#drop');
})

$('#upload_pictures').on( "submit", function( event ) {
	event.preventDefault();

	console.log($('.needgeolocalisation').length);
	if(0 == $('.needgeolocalisation').length){
		var formData;
		var result = true;
		for (i=0; i<nbPhotos; i++) {
			formData = pictures[i];
			console.log(formData);
			API("/pic","POST",formData,function(ret) {
				result = result && ret.success;
			});
		}	
		nbPhotos=0;

		if(result)
			openDialog('Upload complete','The pictures have been succesfully uploaded on mappic. You can now find them on the map !','OK', function() {link('home');})
		else
			openDialog('An error occured', 'We were unable to upload at least one picture. Please try again.', 'Try again', function(){});
	}else{
		//Still need some geolocalisation informations
		openDialog('Need GPS Data', 'There is still some pictures that don\'t have geolocalisation data. You must enter geolocalisation for those pictures before uploading', 'OK', function(){});
	}
});
