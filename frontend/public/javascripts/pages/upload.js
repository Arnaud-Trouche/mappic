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

function addPreview(src, id){
	$('#drop').append('<div class="preview_drop"><img src="'+src+'" height="200" id="prev_pic_'+id+'"/><p></p></div>')
	photoAdded();
}

function addCityToPreview(id, lat, lon){
	$.ajax({
		url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon,
		type: "GET"
	}).done(function(ret) {	
		var width = $("#prev_pic_"+id).width();
		if (ret.status == "OK") {
			var indice = ret.results.length - 4;
			var city = ret.results[indice].formatted_address;
			$('#prev_pic_'+id).parent().children("p").html(city).css('width',width+'px');
		}else{
			$("#prev_pic_"+id).parent().children("p").html('<div class="button_raised link needgeolocalisation" onclick="openMap('+id+')">ADD GPS DATA</div>').css('width',width+'px');
		}
	});
}

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


//Add geolocalisation
function openMap(id){
	openDialog('Add GPS data', '<p>Your picture does not have geolocalisation data so you need to tell us where the picture have been taken</p><div id="locPicker" style="width:100%;height:250px;"></div>', 'Done', function(){});
	$('#locPicker').locationpicker({
		location: {latitude: 48.028184, longitude:  1.884350},	
		radius: 300,
		mapTypeControl: false,
		overviewMapControl: false,
		panControl: false,
		rotateControl: false,
		scaleControl: false,
		streetViewControl: false,
		zoom:3,
		onchanged: function(currentLocation, radius, isMarkerDropped) {
			pictures[id].gps.latitude=currentLocation.latitude;
			pictures[id].gps.longitude=currentLocation.longitude;
			addCityToPreview(id, currentLocation.latitude, currentLocation.longitude);
		}
	});	
}

//Data
$(document).on('drop', '#drop', function(e) {
	if(e.originalEvent.dataTransfer){
		if(e.originalEvent.dataTransfer.files.length) {
           // Stop the propagation of the event
           e.preventDefault();
           e.stopPropagation();
           // Main function to upload
           upload(e.originalEvent.dataTransfer.files);
       }  
   }
   $(this).removeClass('dragover');
   return false;
});


function upload(files) {
	var f = files[0] ;

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

		addPreview(data, nbPhotos-1);

		pictures[nbPhotos-1] = {
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
			if(latArr == undefined){
				//DO SOMETHING ABOUT THAT
			}else{
				pictures[nbPhotos-1].gps.latitude=Number(latArr[0])+Number(latArr[1])/60+Number(latArr[2])/3600;
				pictures[nbPhotos-1].gps.longitude=Number(lonArr[0])+Number(lonArr[1])/60+Number(lonArr[2])/3600;
			}
		});

		addCityToPreview(id, pictures[nbPhotos-1].gps.latitude, pictures[nbPhotos-1].gps.longitude);
	};
	reader.readAsDataURL(f);            
}

$('#upload_pictures').on( "submit", function( event ) {
	event.preventDefault();
	if($('.needgeolocalisation').length != 0){
		//Still need some geolocalisation informations
		openDialog('Need GPS Data', 'There is still some pictures that don\'t have geolocalisation data. You must enter geolocalisation for those pictures before uploading', 'OK', function(){});
	}
	var formData;
	var result = true;
	while(nbPhotos > 0){
		formData = pictures[nbPhotos];
		API("/pic",formData,function(ret) {
			result = result && ret.success;
		});
		nbPhotos--;
	}	

	console.info(result)
	if(result)
		openDialog('Upload complete','The pictures have been succesfully uploaded on mappic. You can now find them on the map !','OK', function() {link('home');})
	else
		openDialog('An error occured', 'We were unable to upload at least one picture. Please try again.', 'Try again', function(){});
});