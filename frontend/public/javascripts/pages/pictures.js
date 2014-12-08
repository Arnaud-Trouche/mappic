if(!user.logged)
	location="/";

//var latitude, longitude, index, i;
if(user.logged){
	API('/pic',null,function(data) {			
		for (i=0; i<data.pictures.length; i++) {
			addPreview(serverAddress+'/data/'+data.pictures[i].hash+'.jpg', i, data.pictures[i].gps.latitude, data.pictures[i].gps.longitude);

			$("#prev_pic_"+i).load(function() { 
				addCityToPreview($(this).attr('id').split('_')[2]);			
			});
		}			
	});		
}


function deletePhoto(src, id){
	$('#preview_drop_'+id).hide(400, function(){
		$('#preview_drop_'+id).remove();		
	});
    openDialog('Image deleted', '', 'OK', function(){});
    //CALL the API
}
