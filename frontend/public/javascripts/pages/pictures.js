if(!user.logged)
	location="/";

//var latitude, longitude, index, i;
if(user.logged){

	API('/pic',"GET",null,function(data) {		
		for (i=0; i<data.pictures.length; i++) {
			addPreview(serverAddress+'/data/'+data.pictures[i].hash+'_min.jpg', data.pictures[i].hash, data.pictures[i].gps.latitude, data.pictures[i].gps.longitude);
			addCityToPreview(data.pictures[i].hash);
		}			
	});		
}


function deletePhoto(src, id){
	$('#preview_drop_'+id).hide(400, function(){
		$('#preview_drop_'+id).remove();		
	});
	API("/pic/"+id,"DELETE", null, function(ret) {
		if (!ret.success) {
			openDialog('Error while deleting image', ':(', 'OK', function(){});
		}
	});
    
    
}
