

$(document).ready(function() {

    $("#open_menu").click(function(){
        $("#open_menu").fadeOut('50', null);
        $("#menu").animate({left: "-0px"}, 400, function(){
            $("#close_menu").fadeIn('50', null);
            $("#menu ul").slideDown( "fast", null); 
        });
    });

    $("#close_menu").click(function(){
        $("#menu ul").slideUp( "fast", null);
        $("#close_menu").fadeOut('50', null);  
        $("#menu").animate({left: "-205px"}, 400, function(){
            $("#open_menu").fadeIn('50', null);
        });
    });
});

    

