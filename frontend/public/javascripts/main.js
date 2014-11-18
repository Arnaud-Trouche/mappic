function init(page){
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
            History.pushState({state:link}, link, "#"+link);
            init(link);            
        });
    });    
}

$( document ).ready(function() {
    init($(location).attr('hash') == "" ? 'home' : $(location).attr('hash').substring(1));   

    //MARCHE PAS
    $(window).on("navigate", function (event, data) {
        var direction = data.state.direction;

            console.info("hello?");
        if (direction == 'back') {
            console.info("hello?");
        }
        if (direction == 'forward') {
        // do something else
        }
    });
});

