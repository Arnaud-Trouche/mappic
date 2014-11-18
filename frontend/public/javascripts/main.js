var currentPage;

function init(page,isNew){
	isNew = typeof isNew !== 'undefined' ? isNew : true;
	var logged = localStorage.getItem("login");
	var path = logged ? '/log/' : '/nolog/';

	//Display header
	$.get('templates'+path+"header.mst", function(template){
		$('body').html(Mustache.render(template, {username: localStorage.getItem('username')}));
		//load the header.js
		$.get('javascripts'+path+'header.js', null);
	});    

	//Load the template for the current page
	$.get('templates'+path+page+'.mst', function(template) {
		var rendered = Mustache.render(template, {});
		$('body').append(rendered);
		//Load the .js for the current page
		$.get('javascripts'+path+page+'.js', null);

		$(".link").click(function(){
			var link = this.id;
			//History.pushState({state:link}, link, "#"+link);
			init(link);            
		});
	});

	if (isNew) {
		histObj={
			page:page
		}
		window.history.pushState(histObj, page, "#"+page);
	}
}

$(document).ready(function() {
	page=($(location).attr('hash') == "" ? 'home' : $(location).attr('hash').substring(1));
	init(page,false); 
	histObj={
		page:page
	} 
	window.history.replaceState(histObj, page, "#"+page);

	window.addEventListener('popstate', function(event) {
		console.log(event);
		init(event.state.page,false);
	});


});

